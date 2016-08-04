import json

# retrieve the buildings json
with open("../../json/buildings.json") as buildings:
  buildings_json = json.load(buildings)

with open("../../json/campus_maps_by_year_key.json") as maps_by_year:
  ids_by_year = json.load(maps_by_year)

  for year in ids_by_year.iterkeys():
    year_ids = ids_by_year[year]

    # create a placeholder for the geojson that 
    # belongs to the current year
    year_geojson = []

    for item in buildings_json["rows"]:
      if item["cartodb_id"] in year_ids:
        item_geom = item["the_building_geom"]
        item_geom_json = json.loads(item_geom)

        year_geojson.append(item_geom_json)

    # write the year's geojson to disk
    with open("../../json/campus_buildings_" + year + ".json", "w") as out:
      json.dump(year_geojson, out)