from collections import defaultdict
from operator import itemgetter
import json, urllib2, sys

"""Credentialed usage requires: npm run build-content {{username}} {{password}}"""

def get_json(url):
  """Read in a url and return json from that url"""
  username = sys.argv[1]
  password = sys.argv[2]

  # prepare a request with the username and password credentials
  password_manager = urllib2.HTTPPasswordMgrWithDefaultRealm()
  password_manager.add_password(None, url, username, password)
  urllib2.install_opener(urllib2.build_opener(urllib2.HTTPBasicAuthHandler(password_manager)))

  # catch and parse the response
  response = urllib2.urlopen(url)
  return json.load(response)


def get_posts(j):
  """Read in a json response and return an array of all posts"""
  posts = []

  for i in j:
    if i["type"] == "post":
      posts.append(i)
  return posts


def get_title(post):
  """Read in the json from one post and return its title"""
  return post["title"]["rendered"]


def get_paragraphs(post):
  """Read in the json from one post and return an array of its paragraphs"""
  paragraphs = []

  paragraph_block = post["content"]["rendered"]
  split_paragraphs = paragraph_block.split("<p>")
  for c, p in enumerate(split_paragraphs[1:]):
    clean_paragraph = p.split("</p>")[0]
    
    # the paragraph json structure for sectionType == table-of-contents and 
    # text are different
    if post["sectionType"] == "text":
      paragraphs.append(clean_paragraph)
    
    # -2 in the conditional because of length in Python is 1-based, and because
    # the content leading up to the first paragraph hasn't been removed yet when
    # split paragraphs is generated
    elif post["sectionType"] == "table-of-contents":
      if c == len(split_paragraphs) - 2:
        paragraphs.append({
            "text": clean_paragraph,
            "type": "section-introduction-text"
          })
      else:
        paragraphs.append({
            "text": clean_paragraph,
            "type": "link"
          })

    elif post["controller"] == "home":
      paragraphs.append(clean_paragraph)

    else:
      post_title = get_title(post)
      raise Exception(post_title + " had an unrecognized sectionType, which is unallowed") 

  return paragraphs


def get_flat_metadata_fields():
  """Return a list of objects, each of which represents one metadata field"""
  return [
    # routed controller fields
    "template",
    "sectionType",

    # four-div-container template fields
    "introImage",

    # three-div-container template fields
    "topImage",
    "bottomImage",
    "topCaption",
    "bottomCaption",

    # optional post fields
    "linksHome",
    "iframe",

    # home controller fields
    "destinationController",
    "destinationId",
    "xOffset",
    "yOffset"
  ]


def get_background_metadata(post):
  """Read in a post and return its background metadata"""
  image_metadata = {}

  # if the post doesn't have a featured image, set the background
  # field to NA
  try:
    media_links = post["_links"]["wp:featuredmedia"]
    if len(media_links) > 1:
      post_title = get_title(post)
      raise Exception(post_title + "had more than the maximum number of featured images (1)")

    media_link = media_links[0]["href"]
    media_json = get_json(media_link)
    
    # get image metadata fields
    url = media_json["guid"]["rendered"]
    alt = media_json["alt_text"]
    annotation = media_json["caption"]

    image_metadata["url"] = url
    image_metadata["alt"] = url
    image_metadata["annotation"] = annotation
    return image_metadata

  except KeyError:
    return "NA"


def get_background_style_metadata(post):
  """Read in a post and return that post's backgroundStyle metadata"""
  background_style = {}
  background_style["navigationButton"] = post["navigationButton"]
  background_style["brandIcon"] = post["brandIcon"]
  return background_style


def get_metadata(post):
  """Read in a post and return an object with its metadata"""
  metadata = {}

  # process flat metadata fields
  for field in get_flat_metadata_fields():
    metadata[field] = post[field]
 
  metadata["title"]           = get_title(post)
  metadata["paragraphs"]      = get_paragraphs(post)
  metadata["background"]      = get_background_metadata(post)
  metadata["backgroundStyle"] = get_background_style_metadata(post)
  metadata["order"]           = get_order(post)

  return metadata


def get_order(post):
  """Helper function for the get_metadata function that converts the order field
  of all posts that have an order field into a float value for proper post sorting
  later in the pipeline"""

  # icon overlays on the home route don't require order fields
  if post["controller"] == "home":
    return post["order"]

  else:
    try:
      order = float(post["order"])
      return order

    except Exception as exc:
      post_title = get_title(post)
      raise Exception("couldn't convert order field of post with title:" + post_title)


def get_controller(post):
  """Read in a post and return that post's controller"""
  controller = post["controller"]
  if controller == "":
    post_title = get_title(post)
    raise Exception(post_title + " doesn't have a controller field, which is required")
  return controller


def sort_posts(controller_json):
  """Read in json with keys = controllers and values = array of post metadata,
  and return that json with the posts for each controller sorted by their order keys"""
  controller_sections_json = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict())))

  for controller in controller_json:
    controller_posts = controller_json[controller]

    # sort the controller's posts into an array of dicts according to
    # the value of their order keys
    sorted_controller_posts = sorted(controller_posts, key=itemgetter('order'))

    # now loop over the sorted posts for this controller, and if you see two
    # with the same order value, raise an error
    last_post_order = ""

    for sorted_post_index, post in enumerate(sorted_controller_posts):
      post_order = post["order"]

      # if this is a post with controller == home, don't store the last controller order
      if controller != "home":
        if post_order == "":
          post_title = post["title"]
          raise Exception(post_title + " didn't have an order field, which is required")

        if controller + str(post_order) == last_post_order:
          raise Exception("two posts for the" + controller + "controller had the same order value (" + post_order + ") which isn't allowed")

      # store the controller + post order combination to check for duplicates
      last_post_order = controller + str(post_order)

      # used integer based index positions for the ids
      sorted_post_index_string = str(sorted_post_index)
      post["id"] = sorted_post_index_string

      # having found the index position of the current post within the current controller,
      # convert the post's internal order field
      post["order"] = sorted_post_index_string
      controller_sections_json[controller]["sections"][ sorted_post_index_string ] = post

  return controller_sections_json


def add_controller_fields(sorted_json):
  """Read in json with structure: d[controller]["sections"] {sections_object} 
  add controller-specific metadata fields, and return the updated json"""
  for controller in sorted_json:
    sorted_json[controller]["title"] = controller
    sorted_json[controller]["controller"] = controller
    sorted_json[controller]["display"] = "1"
    sorted_json[controller]["hr"] = "1"
  return sorted_json


def get_application_json(posts):
  """Calls subsidiary functions and writes application json to disk"""
  post_json  = defaultdict(list)

  # add each post to the array of posts for its parent controller
  for post in posts:
    metadata   = get_metadata(post)
    controller = get_controller(post)
    post_json[controller].append(metadata)

  write_home_json(post_json)
  sorted_json = sort_posts(post_json)
  application_json = add_controller_fields(sorted_json)

  # write the json to disk
  for controller_key in application_json:
    if controller_key != "home":
      if logging == 1:
        print "writting json for controller:", controller_key
      with open(output_dir + controller_key + ".json", "w") as json_out:
        json.dump(application_json[controller_key], json_out)


def write_home_json(post_json):
  """Read in json with controller keys, parse the home json into
  the desired format, and write it to disk"""
  outgoing_home_json = []
  incoming_home_json = post_json["home"]

  # each item in the incoming_home_json array describes one landing
  # page overlay
  for c, o in enumerate(incoming_home_json):
    outgoing_home_json.append({
      "id": int(c),
      "xOffset": float(o["xOffset"]),
      "yOffset": float(o["yOffset"]),
      "url": "/#/routes/" + o["destinationController"] + "#" + o["destinationId"],
      "path": "routes/" + o["destinationController"],
      "hash": o["destinationId"],
      "title": o["title"],
      "text": o["paragraphs"][0],
      "image": o["background"]["url"]
    })

  with open(output_dir + "home.json", "w") as home_json_out:
    if logging == 1:
      print "writting json for controller: home"
    json.dump(outgoing_home_json, home_json_out)


if __name__ == "__main__":
  logging    = 1
  output_dir = "./build/json/"
  instance   = 'http://gatheringabuilding.yale.edu/'
  params     = '?filter[posts_per_page]=10000'
  url        = instance + '/wp-json/wp/v2/posts' + params
  j          = get_json(url)
  posts      = get_posts(j)
  get_application_json(posts)
