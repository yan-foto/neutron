<p align="center">
  <img alt="babel" src="https://cloud.githubusercontent.com/assets/1678441/9117806/d65c9f20-3c6c-11e5-93a4-7d28f13b2beb.png">
</p>

<p align="center">
  <a href="https://travis-ci.org/yan-foto/neutronl"><img alt="Build Status" src="https://travis-ci.org/yan-foto/neutron.svg?branch=master"></a>
</p>
---
Neutron enables rapid cross-platform [Electron](http://electron.atom.io/) app development. It uses [Babel](https://babeljs.io/) for ES6 support, [Jade](http://jade-lang.com/) as templating engine, [Sass](http://sass-lang.com/)
 for CSS preprocessing, and enables painless and clean [Bower](http://bower.io/) integration. Moreover, auto reloading is also included for a *refresh-free* development experience!

 The idea is to keep your sources and ready-to-deliver files separate and only to package files that are necessary. *Remember kids*, neutron is way more than an electron boilerplate!

## Quick start
Clone the library, install the dependencies:

```
git clone https://github.com/yan-foto/neutron.git
npm install
```
If you want to generate a simple `package.json` file for your Electron app from the existing `package.json` run the following command:

```
gulp electron-manifest
```

This simply copies the name and version from your package file and sets the main file to `main.js`. The generated file is available under `dist/package.json`. After you have some actual pages and your `main.js` file is ready you can run the following to start electron and Browsersync:

```
npm start
```

## File structure
Source files should be located under the `src` folder and generated files are copied to `dist` folder. Also make sure that you have the main file in the `dist` folder.

An example folder structure would be:

```
src
|-- js
|   |-- util.js
|-- css
|   |-- main.scss
|   |-- nav.css
|-- views
|   |-- index.jade
|   |-- stat.jade
|-- main.js
```

After processing files, Neutrons copies the results (while keeping the original structure) into the `dist` folder. So the result of aforementioned example would be:

```
src
|-- js
|   |-- util.js
|-- css
|   |-- main.css
|   |-- nav.css
|-- views
|   |-- index.html
|   |-- stat.html
|-- main.js
```


## Bower integration
As we know, Bower packages are delivered with a number of files, which are of no relevant for the final package. Neutron uses [`main-bower-files`](https://github.com/ck86/main-bower-files) package to copy only the required scripts and stylesheets respectively into `dist/js` and `dist/css` folders.

If you want to override the main files of a bower package, lets say Bootstrap, you can use `overrides` keyword in your `bower.json`:

```json
{
  "name": "your-electron-app",
  "dependencies": {
    "bootstrap": "*"
  },
  "overrides": {
    "bootstrap": {
      "main": "js/alert.js"
    }
  }
}
```

This would only copy the `alert.js` from Bootstrap package to `dist/js`.

## Auto reload
To ease the devlopment a small auto reload module has been provided to refresh your app in the Electron container as soon as any of the following is updated:

* any file (stylesheet or script) in `src`
* `bower.json` file

The only thing to do is to pass the [`browser-window`](https://github.com/atom/electron/blob/master/docs/api/browser-window.md) you want to automatically refresh to the `dist-watcher` module:

```js
var BrowserWindow = require('browser-window');
var watch = require('./util/dist-watcher');

// Application preparation [...]

mainWindow = new BrowserWindow({width: 800, height: 600});
watch(mainWindow);
```
Just note that a successful depends on gulp's `watch` task and electron must be started in development mode (`ELECTRON_ENV=development ./electron dist/`), so the easiest way is to use `npm start` (same as `gulp start`).

## Contribution
*All help and inspiration is welcomed. Please don't hesitate to open issues and to sent pull requests.*
