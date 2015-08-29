<p align="center">
  <img alt="neutron" src="https://cloud.githubusercontent.com/assets/1678441/9429889/ccd2253a-49df-11e5-894e-81d52a36eb4b.png">
</p>

<p align="center">
  <a href="https://travis-ci.org/yan-foto/neutron"><img alt="Build Status" src="https://travis-ci.org/yan-foto/neutron.svg?branch=master"></a>
</p>
---
Neutron enables rapid cross-platform [Electron](http://electron.atom.io/) app development. It uses [Babel](https://babeljs.io/) for ES6 support, [Jade](http://jade-lang.com/) as templating engine, [Sass](http://sass-lang.com/)
 for CSS preprocessing, and enables painless and clean [Bower](http://bower.io/) integration. Moreover, auto reloading is also included for a *refresh-free* development experience!

 The idea is to keep your sources and ready-to-deliver files separate and only to package files that are necessary. *Remember kids*, neutron is way more than an electron boilerplate!

## Quick start
Clone the library, install the dependencies:

```
git clone https://github.com/yan-foto/neutron.git
npm run bootstrap
```

The bootstrap script will download all dependencies specified in `package.json` (equivalent to `npm install`) and will also include the dependency packages specified in `.neutrnrc`. For more information see [**Customization**](#customization).

If you want to generate a simple `package.json` file for your Electron app from the existing `package.json` run the following command:

```
gulp electron-manifest
```

This simply copies the name and version from your package file and sets the main file to `main.js`. The generated file is available under `dist/package.json`. After you have some actual pages and your `main.js` file is ready you can run the following to start electron and Browsersync:

```
npm start
```

## Customization
You can choose which gulp packages you may need for your build and javascript lint procedures. These packages are defined in `.neutronrc` under the key `dependencies`. The default values are:

```json
"dependencies": {
  "babel": ["js", "jsx"],
  "jade": ["jade"],
  "sass": ["scss", "css"]
},
```

If you, for example, prefer to have your views written in vanilla HTML instead of jade, you can simply remove it from the dependencies.

*Note that currently only the aforementioned gulp packages are supported.*

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
To ease the development [`electron-reload`](https://github.com/yan-foto/electron-reload) has been integrated, the easiest way to integrate it would be require it on top of your main file:

```js
require('electron-reload')(__dirname);
```

This would reload all `BrowserWindow`s if any of the files in `__dirname` is updated.

## Packaging the app
Packaging is done using the [`electron-packager`](https://github.com/maxogden/electron-packager) module and it can be triggered using `npm run packager` or `gulp package`. The options defined in `packager` property of `.neutronrc` are passed to the `electron-packager` and the default values are:

```js
"packager": {
  "dir": "dist",
  "out": "packages",
  "name": "neutron",
  "platform": "all",
  "arch": "all",
  "version": "0.30.4",
  "overwrite": true
}
```

You might be interested in changing `platform`, `arch`, and `version`.

## Contribution
*All help and inspiration is welcomed. Please don't hesitate to open issues and to sent pull requests.*
