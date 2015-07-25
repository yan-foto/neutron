# Neutron
Neutron enables rapid cross-platform [Electron](http://electron.atom.io/) app development. It uses [Babel](https://babeljs.io/) for ES6 support, [Jade](http://jade-lang.com/) as templating engine, [Sass](http://sass-lang.com/)
 for CSS preprocessing, and enables painless and clean [Bower](http://bower.io/) integration. Moreover, [Browsersync](http://www.browsersync.io/) is also included for a *refresh-free* development experience!

 The idea is to keep your sources and ready-to-deliver files separate and only to package files that are necessary.

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

This simply copies the name and version from your package file and sets the main file to `main.js`. The generated file is available under `dist/package.json`.

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

## Browsersync integration
To ease the devlopment Browsersync has been integrated to refresh your app in the Electron container as soon as any of the following is updated:

* any file (stylesheet or script) in `src`
* `bower.json` file

Bear in mind that in development mode your [`browser-window`s](https://github.com/atom/electron/blob/master/docs/api/browser-window.md) must fetch files from Browsersync's local sever ([`htt://localhost:3000`](htt://localhost:3000)):

```js
mainWindow.loadUrl('http://localhost:3000/index.html');
```
whereas in production they should load local files as follows:

 ```js
 mainWindow.loadUrl('file://' + __dirname + '/index.html');
 ```

 this would be a piece of cake for y'all professionals out there!

## TODO
* Add scripts to create [`asar`](https://github.com/atom/asar) packages for various platforms
* Add automatic switch for Browsersync in dev mode
* ?

*All help and inspiration is welcomed. Please don't hesitate to open issues and to sent pull requests.*
