import json
import sys

source, target, wanted = sys.argv[1], sys.argv[2], int(sys.argv[3])

text = open(source, encoding="utf-8").read()
stories = [s.strip() for s in text.split("<|endoftext|>")[1:-1]]
usable = [s for s in stories if 400 <= len(s) <= 1500]

print(len(stories), "stories in the file,", len(usable), "with a usable length")
with open(target, "w", encoding="utf-8") as f:
    json.dump(usable[:wanted], f, indent=0)