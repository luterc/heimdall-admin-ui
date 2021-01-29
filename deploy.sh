#!/usr/bin/env bash

set -e
echo 'start build now ...'
npm run build
echo ' build successfully!'
echo ' deploy now ....'
rm -r /opt/luter/develop/temp/server/dist
cp -r ./dist /opt/luter/develop/temp/server/
echo ' deploy successfully !'
rm -r ./dist




