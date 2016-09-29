from collections import defaultdict
import json, urllib2

def get_json(url):
  """Read in a url and return json from that url"""
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
  for p in split_paragraphs[1:]:
    clean_paragraph = p.split("</p>")[0]
    paragraphs.append(clean_paragraph)
  return paragraphs


def get_flat_metadata_fields():
  """Return a list of objects, each of which represents one metadata field"""
  return [
    "order",
    "template",
    "sectionType"
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
    
    # get required metadata fields
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

  return metadata


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
    for i in xrange(len(controller_posts)):

      # store a boolean to indicate whether we've found an item for this id
      found_post_with_id = 0

      # find the next post for the current controller
      for post in controller_posts:
        post_order = post["order"]

        # raise an exception if this post doesn't have an order field
        if post_order == "":
          post_title = post["title"]
          raise Exception(post_title + " didn't have an order field, which is required")

        # use the order key as the post id
        if post_order == str(i):
          
          # if we've already found a post with this order, raise an exception
          if found_post_with_id == 1:
            post_title = post["title"]
            raise Exception(post_title + " has the same order as another post in controller" + 
              controller + "which isn't allowed")

          # if this is the first post with this order, store the fact that we found one
          found_post_with_id = 1
          post["id"] = post_order
          controller_sections_json[controller]["sections"][ post_order ] = post

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


if __name__ == "__main__":

  output_dir = "../../build/json/"
  instance = 'http://ec2-54-71-20-87.us-west-2.compute.amazonaws.com'
  url      = instance + '/wp-json/wp/v2/posts'
  j        = get_json(url)
  posts    = get_posts(j)
  post_json = defaultdict(list)

  # add each post to the array of posts for its parent controller
  for post in posts:
    metadata   = get_metadata(post)
    controller = get_controller(post)
    post_json[controller].append(metadata)

  sorted_json = sort_posts(post_json)
  application_json = add_controller_fields(sorted_json)

  # write the json to disk
  for controller_key in application_json:
    with open(output_dir + controller_key + ".json", "w") as json_out:
      json.dump(application_json[controller_key], json_out)