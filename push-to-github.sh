#!/usr/bin/env bash
set -euo pipefail
REPO_URL="https://github.com/seangolding876/PartsFinder.git"
git init
git config user.name "Sean Golding"
git config user.email "seangolding@gmail.com"
git branch -M main
git add .
git commit -m "Initial commit: deploy-ready build" || echo "Nothing to commit"
git remote add origin "$REPO_URL" || git remote set-url origin "$REPO_URL"
git push -u origin main
