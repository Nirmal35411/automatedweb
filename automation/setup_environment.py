import os, json

folders = [
    "config", "core", "memory", "logs", "output", "tests"
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)

# create memory & log stubs
open("logs/activity.log", "a").close()
open("logs/errors.log", "a").close()
with open("memory/short_term.json", "w") as f:
    json.dump({}, f)
with open("memory/long_term.json", "w") as f:
    json.dump({}, f)

print("✅ Folder structure initialized successfully.")
