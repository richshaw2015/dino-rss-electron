<img align="right" width="110" src="https://raw.githubusercontent.com/richshaw2015/dino-rss-electron/master/public/icon/logo.svg">

# Dinosaur Rss 🦕

A simple, efficient, open source RSS reader service

![Podlove player](https://raw.githubusercontent.com/richshaw2015/dino-rss-electron/master/build/screenshot.jpg)

## Key Features

### 🚀 Simple and Efficient
Dinosaur Rss 🦕 is build as minimum viable product, new features will be added up to you.

By using Client-Server architecture, feeds are synchronized intelligently on the server, so it's energy efficient for your device.

### 💻 Cross Platform

| MacOS      | Windows | Linux |
| ----------- | ----------- | ----------- |
| ✅ tested on macOS 10.15+      | ✅ tested on Windows 7+       | ✅ tested on manjaro |

### 🎤 Podcast Optimized
Integrated with @Podlove Player for the specific needs of podcasters.

![Podlove player](https://raw.githubusercontent.com/richshaw2015/dino-rss-electron/master/public/icon/podlove.jpg)

### 💡 Code Highlight

```js
const code = `var data = 1;`;

// log
console.log(code)
```

### ⌨️ Keyboard Shortcuts

| | | |
| - | - | - |
| `n` - Next | `N` - Previous | `b` - Back |
| `p` - Next page | `P` - Previous page | `M` - Mark all as read |
| `j` - Move down | `k` - Move up | `x` - Exit |
| `d` - PgOn | `u` - PgUp | `r` - Refresh |
| `gg` - Go to first line | `G` - Go to last line | `yy` - Copy link |
| `F5`  - Reload window | `Esc` - Close modal window | `ctrl` + `f` - Search |

### 📝 Personal Memo

_Have a skin in the game !_

### 🍎 Apple Silicon Support

Enjoy the benefit of new technology in Apple Silicon.

### ️🆓 Free for 100 feeds
Just [Buy me a coffee](https://www.buymeacoffee.com/dinorss) to get more feeds.

![Podlove player](https://raw.githubusercontent.com/richshaw2015/dino-rss-electron/master/public/icon/buymeacoffee.png)

## Quick Start

Install dependencies:

```sh
yarn --ignore-platform
```

Start development on macOS:

```sh
yarn run dev:mac
```

Build package on macOS:
```sh
rollup -c; electron-builder --mac
```

Build package on Windows:
```sh
rollup -c; electron-builder --win
```

Build package(deb、rpm) on Linux:
```sh
rollup -c; electron-builder --linux deb
rollup -c; electron-builder --linux rpm
```

For better network speed in China:
```sh
npm config set registry https://registry.npm.taobao.org/
yarn config set registry https://registry.npm.taobao.org/
yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
```

## Follow us
Twitter: [@dino_rss](https://twitter.com/dino_rss)

## Thanks

-  Dinosaur Rss's logo is derived from <a href="https://icon-icons.com/pack/Safari/2565" target="_blank">Beibidog</a>'s awesome works.
- [Electron](https://www.electronjs.org/)
- [Svelte](https://svelte.dev/)
- [Materialize](https://materializecss.com)
- [Podlove Web Player](https://podlove.org/podlove-web-player/)
- [Mousetrap](https://craig.is/killing/mice)
- [highlight.js](https://highlightjs.org/)
- [Prism](https://prismjs.com/)
- [Autolinker.js](https://github.com/gregjacobs/Autolinker.js)
- [get-folder-size](https://github.com/alessioalex/get-folder-size#readme)
- [MD5](https://github.com/pvorb/node-md5#readme)
- [uuid](https://github.com/uuidjs/uuid#readme)
- [QRCode.js](https://github.com/davidshimjs/qrcodejs)
