#!/bin/bash
yarn build

rm -rf ./dist

yarn dist:mac:x64
yarn dist:mac:arm64
yarn dist:win
yarn dist:linux:x64
yarn dist:linux:arm64

# fix AppImage filename
x64_appimage=`ls dist/*.x86_64.AppImage`
x64_appimage_fixed=`echo $x86_appimage |sed -e 's/x86_64/x64/g'`
mv "$x64_appimage" "$x64_appimage_fixed"
