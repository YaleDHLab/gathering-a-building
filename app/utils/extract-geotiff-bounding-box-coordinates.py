import sys
from osgeo import osr, gdal

print "processing the following geotiff", sys.argv[1]

# get the existing coordinate system
ds = gdal.Open(sys.argv[1])
old_cs= osr.SpatialReference()
old_cs.ImportFromWkt(ds.GetProjectionRef())

# create the new coordinate system
wgs84_wkt = """
GEOGCS["WGS 84",
    DATUM["WGS_1984",
        SPHEROID["WGS 84",6378137,298.257223563,
            AUTHORITY["EPSG","7030"]],
        AUTHORITY["EPSG","6326"]],
    PRIMEM["Greenwich",0,
        AUTHORITY["EPSG","8901"]],
    UNIT["degree",0.01745329251994328,
        AUTHORITY["EPSG","9122"]],
    AUTHORITY["EPSG","4326"]]"""
new_cs = osr.SpatialReference()
new_cs .ImportFromWkt(wgs84_wkt)

# create a transform object to convert between coordinate systems
transform = osr.CoordinateTransformation(old_cs,new_cs) 

#get the point to transform, pixel (0,0) in this case
width = ds.RasterXSize
height = ds.RasterYSize
gt = ds.GetGeoTransform()
minx = gt[0]
miny = gt[3] + width*gt[4] + height*gt[5] 
maxx = gt[0] + width*gt[1] + height*gt[2]
maxy = gt[3] 

# identify the four corners, in which the origin
# is located in the bottom left hand corner (rather than
# the top left as in SVG)
corners = [
  {
    "label": "top-left",
    "x": minx,
    "y": maxy
  },
  {
    "label": "bottom-left",
    "x": minx,
    "y": miny
  },
  {
    "label": "top-right",
    "x": maxx,
    "y": maxy
  },
  {
    "label": "bottom-right",
    "x": maxx,
    "y": miny
  }
]

# iterate over the corners and print the label and 
# x, y position of each

for corner in corners:

  # get the coordinates in lat long
  latlong = transform.TransformPoint(corner["x"],corner["y"])

  print corner["label"] + ":", latlong

