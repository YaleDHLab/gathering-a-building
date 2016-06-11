import sys, codecs, json

j = []

with codecs.open(sys.argv[1], "r", "utf-8") as f:
  f = f.read().split("\n")
  for r in f:
    if r:
      j.append(r)

with open("lorem.json", "w") as out:
  json.dump(j, out)


