#!/bin/bash
echo "Fetching latest updates from upstream..."
git fetch upstream

echo "Merging upstream/main into your custom branch..."
git checkout admin/upstream
git merge upstream/main

echo "Pushing updates to your GitHub repo..."
git push origin admin/upstream
