#!/usr/bin/env bash -e

PROJECT_DIR="ios/Finder"
INFOPLIST_FILE="Info.plist"
INFOPLIST_DIR="${PROJECT_DIR}/${INFOPLIST_FILE}"


PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

BUILD_NUMBER="$(echo ${PACKAGE_VERSION//\./})"

# Update plist with new values
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${PACKAGE_VERSION#*v}" "${INFOPLIST_DIR}"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "${INFOPLIST_DIR}"

echo "Set :CFBundleShortVersionString ${PACKAGE_VERSION#*v} > ${INFOPLIST_DIR}"
echo "Set :CFBundleVersion $BUILD_NUMBER > ${INFOPLIST_DIR}"

git add "${INFOPLIST_DIR}"