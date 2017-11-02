#bash command to rename files by replacing all spaces with underscores:


for f in *.jpg; do mv "$f" "${f// /_}"; done