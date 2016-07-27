[![Stories in Ready](https://badge.waffle.io/YaleDHLab/gathering-a-building.png?label=ready&title=Ready)](https://waffle.io/YaleDHLab/gathering-a-building)
## Gathering a Building

This repository contains the source code for a research site on Yale University's architecture.

## Development Instance

A development instance of this repository is deployed at the following address: http://gathering-a-building-deploy.s3-website-us-east-1.amazonaws.com/#/

## Development Notes

#### Georectifying raster data

To convert raster images with a wide color space into map overlays, one can use the following workflow checklist:

* [ ] Georectify raster data with [Mapwarper](https://github.com/timwaters/mapwarper) or similar.
* [ ] Reduce the color complexity of the resulting geotiff in Photoshop, using a filter such as the `cutout` filter (Filter -> Filter Gallery -> Cutout)
* [ ] Transform the geotiff into a vectorized SVG with Illustrator (Object -> Image Trace -> Make)
* [ ] Convert the SVG into an SVG that has only `polygon` elements (rather than the more complex path elements) using a tool such as @betravis' path to polygon utility. [[gui](https://betravis.github.io/shape-tools/path-to-polygon/), [source](https://github.com/betravis/shape-tools/tree/master/path-to-polygon)]
* [ ] Open the SVG in a text editor and retrieve the bounding box coordinates. These are indicated within the viewBox element of the file. The SVG in `assets/svg/duhaime_processed_2000.xvg`, for instance has `viewBox="0 0 3032 2341"`. The third value of this sequence is the width of the SVG, and the fourth value is the SVG's height. Store these values.
* [ ] Retrieve the bounding box values of the geotiff by running `gdalinfo {{geotiff file name}}` (requires GDAL)
* [ ] Plug the bounding box coordinates from the SVG and geotiff into `assets/utils/matrix-transform.py` (this procedure is documented in the script itself).
* [ ] Run python `matrix-transform.py`, which will upload the resulting json file to a DHLab run S3 bucket. This file can then be visualized by the map component of `assets/js/app.js`.