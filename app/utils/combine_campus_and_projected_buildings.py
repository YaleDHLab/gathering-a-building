import glob, json

# populate lists of campus buildings and projected buildings
campus_buildings = []
projected_buildings = []

for i in glob.glob("../json/*"):
  if "campus_buildings" in i:
    campus_buildings.append(i.split("_")[-1].split(".")[0])
  elif "projected_buildings" in i:
    projected_buildings.append(i.split("_")[-1].split(".")[0])

# identify the buildings for which we have both
campus_and_projected = list(set(campus_buildings).intersection(projected_buildings))

# identify the full set of building years
campus_or_projected = campus_buildings + projected_buildings

for i in campus_or_projected:
  try:
    with open("../json/campus_buildings_" + i + ".json") as f:
      campus_json = json.load(f)
  except:
    print "missing campus_buildings_" + i + ".json"

  try:
    with open("../json/projected_buildings_" + i + ".json") as f:
      projected_json = json.load(f)
  except:
    print "missing projected_buildings_" + i + ".json"

  combined_json = campus_json + projected_json

  with open("../json/combined_buildings_" + i + ".json", "w") as json_out:
    json.dump(combined_json, json_out)