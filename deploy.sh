#!/bin/bash
set -e

# Load env
if [ -f .env.production ]; then
  source .env.production
fi

echo "🔨 Building..."
npx vite build

echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name eng4it-ielts --commit-message "${1:-auto deploy}" --commit-dirty=true

echo "📦 Pushing to GitHub..."
git add -A
git commit -m "${1:-auto commit}" 2>/dev/null || true
git push origin main 2>/dev/null || echo "⚠️ Git push failed"

echo "✅ Done! https://ielts.eng4it.com"
