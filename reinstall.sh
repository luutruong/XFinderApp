#!/usr/bin/env bash

set -e

rm -rf package-lock.json
echo "rm -rf package-lock.json -> done"
rm -rf node_modules/
echo "rm -rf node_modules/ -> done"
rm -rf ios/build/
echo "rm -rf ios/build/ -> done"
rm -rf ios/Pods/
echo "rm -rf ios/Pods/ -> done"
rm -rf ios/Podfile.lock
echo "rm -rf ios/Podfile.lock -> done"
rm -rf android/build/
echo "rm -rf android/build/ -> done"

npm install
echo "npm install -> done"

cd node_modules/react-native && ./scripts/ios-install-third-party.sh"
echo "Install third party for ios -> done"

cd ios/ && pod install
echo "cd ios/ && pod install -> done"
