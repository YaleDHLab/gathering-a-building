from __future__ import division
from collections import defaultdict
from skimage import io
import numpy as np
import os, glob, sys

"""This script requests all of the tiles required to build up a 
given jp2 image, and after fetching each of those tiles, rebuilds
the retrieved images into one large jp2 file"""

def request_image_tiles(query_root, image_id, offset=0, dry_run=0):
  """Read in an image id (e.g. 15691352) and request each of 
  the image tiles for the current image"""

  # the query root contains the base url for queries. One must add
  # x,y to the query for it to resolve, where x = zoom depth {1:5}
  # and y is the tile index
  query_root += str(image_id) + "/" + str(image_id) + ".jp2&CNT=1&SDS=0,90&JTL="

  if dry_run:
    print query_root
    sys.exit()

  if not os.path.exists(out_dir):
    os.mkdir(out_dir)

  for i in xrange(tiles_to_request):
    try:
      query = 'wget "' + query_root + str(zoom_depth) + ',' + str(i+offset)
      query += '" -O ' + out_dir + "/" + str(i+offset) + ".jp2"

      print "request image from:", query 
      os.popen(query)

    except Exception as exc:
      print exc


def combine_image_tiles():
  """Read in all of the image tiles just produced and create an
  output image that combines those image tiles"""

  # create a dictionary to map image index to image array
  d = defaultdict(lambda: defaultdict())

  # iterate over all images
  for f in glob.glob(out_dir + "/*.jp2"):
  
    # if a request did not fetch an image, it will be < 1000 bytes
    size = os.path.getsize(f)

    if size < 700:
      continue

    else:

      # fetch the image index position
      index_position = int( os.path.basename(f).split(".jp2")[0] )

      # use the index position to identify row and column values
      row_index = int(index_position / images_per_row) 

      # then use the row and index positions to get the column
      # -1 at the end because we're using 0-based indexing
      column_index = (index_position - (row_index * images_per_row)) 

      # read the jp2 data into memory as a numpy array
      jp2_array = io.imread(f, plugin='freeimage')

      d[row_index][column_index] = jp2_array 

  # with all the arrays in memory, build the master image
  master_image = []
  
  for row in d.iterkeys():
    combined_row = []

    for column in d[row].iterkeys():

      combined_row.append(d[row][column])

    # combine the arrays horizontally
    combined_array = np.hstack(combined_row)

    master_image.append(combined_array)

    #io.imsave(str(row) + ".png", combined_array)

  # combine all the rows into a single image
  master_array = np.vstack(master_image)

  # write the result
  io.imsave(str(image_id) + ".png", master_array)
    
 
if __name__ == "__main__":

  # specify the query root for the url to fetch
  query_root = "http://brbl-zoom.library.yale.edu/fcgi-bin/iipsrv.fcgi?FIF=SML_MAPS_TRANSFER/7/"

  # specify the zoom depth to fetch
  zoom_depth = 6

  # specify the number of tiles to request
  tiles_to_request = 2000

  # specify the output directory
  out_dir = "yale_map_image_tiles"

  # specify the image id to fetch
  image_id = "15691437"

  request_image_tiles(query_root, image_id, offset=0)

  # once the individual images are retrieved, manually examine
  # them to see how many images are placed on each row 
  # (i.e. the first image with black border on its left)
  images_per_row = 34

  #combine_image_tiles()