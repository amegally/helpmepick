#!/bin/bash

# Clean up previous builds
rm -rf .next
rm -rf .vercel/output

# Run Vercel build locally
vercel build

# If the build was successful, you can also test the output locally
if [ $? -eq 0 ]; then
  echo "Build successful! Testing the output..."
  vercel dev --listen 3000
else
  echo "Build failed! Check the errors above."
fi 