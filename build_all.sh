#!/bin/bash
yarn build

rm -rf ./dist

yarn dist:mac:x64
yarn dist:mac:arm64
yarn dist:win
yarn dist:linux:x64
yarn dist:linux:arm64
