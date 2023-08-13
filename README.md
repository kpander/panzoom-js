# panzoom-js

Vanilla JS library to pan and zoom CSS background images.

  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Examples](#examples)
  - [API](#api)
  - [Developers](#developers)


# Features

  - Allows panning and zooming of CSS background images
    - Arbitrary zoom levels
    - Zoom can be focused around an arbitrary point in the viewport
    - Automatically limits panning to the image edges
  - Small (1.2kb gzipped, 1.8kb gzipped if you include the Drag & Drop UI library)
  - Fast: all the "work" is done by native CSS
  - Transition effects: zooms and pans can be animated via CSS 


# Installation

## With `npm`

If you're installing via `npm`... Ensure your project has an `.npmrc` file in the project root to tell `npm` where to find the package. Ensure the following line exists:

```
@kpander:registry=https://npm.pkg.github.com/
```

Then:

```
$ npm install @kpander/panzoom-js
```

Then, annoyingly, you'll need to copy the files you need into your project's source folder, depending on where that is. E.g., assuming your source files are in `./src/js`:

```
$ cp "node_modules/@kpander/panzoom-js/dist/PanZoom.js" ./src/js
$ cp "node_modules/@kpander/panzoom-js/dist/PanZoom.UI.Drag.js" ./src/js
```


# Usage

A few requirements:

  - Include the `PanZoom.js` file in your HTML
  - Use a wrapper element (`.container` in the example below)
  - Place an element with a background image inside the wrapper (`#myimage` in the example below)
  - Initialize the PanZoom library
  - Initialize any other UI controls that will talk to PanZoom


## Examples

### Example 1: The basics

This is a very simple example. It downloads an image for the background, and uses the draggable UI class (`PanZoom.UI.Drag.js`) to let you click and drag on the image to move it around.

In this demo, you can click and drag the image.

```html
<!doctype html>
<html>
<head>
  <script src="PanZoom.js"></script>
  <script src="PanZoom.UI.Drag.js"></script>

  <style>
    .container {
      border: 1px solid black;
      height: 75vh;
      width: 100%;
    }
    #myimage {
      background-image: url(https://placekitten.com/2400/1600);
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
  </style>

</head>
<body>
  <div class="container">
    <div id="myimage"></div>
  </div>

  <script>
    const pz = new PanZoom(document.getElementById("myimage"));
    const pzDrag = new PanZoomDragUI({
      drag: document.querySelector(".container"),
      scroll: document.querySelector("body"),
    }, pz);

  </script>

</body>
</html>
```

### Example 2: Add buttons to zoom in and out

This is the same example as above, except we've added two `<button>` elements for zooming. The we connect them to the PanZoom API with an `eventListener`.

In this demo, you can click and drag the image. You can also click the buttons to zoom in and out.

```html
<!doctype html>
<html>
<head>
  <script src="PanZoom.js"></script>
  <script src="PanZoom.UI.Drag.js"></script>

  <style>
    .container {
      border: 1px solid black;
      height: 75vh;
      width: 100%;
    }
    #myimage {
      background-image: url(https://placekitten.com/2400/1600);
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
  </style>

</head>
<body>
  <!-- Add our two new buttons for zooming -->
  <button id="zoomin">Zoom IN</button>
  <button id="zoomout">Zoom OUT</button>

  <div class="container">
    <div id="myimage"></div>
  </div>

  <script>
    const pz = new PanZoom(document.getElementById("myimage"));
    const pzDrag = new PanZoomDragUI({
      drag: document.querySelector(".container"),
      scroll: document.querySelector("body"),
    }, pz);
 
    /* Add event listeners to connect the zoom buttons to PanZoom */
    document.getElementById("zoomin").addEventListener("click", function() {
      pz.zoomIn();
    });
    document.getElementById("zoomout").addEventListener("click", function() {
      pz.zoomOut();
    });
  </script>

</body>
</html>
```

### Example 3: Add an interactive zoom slider

Continuing from Example 2, we're going to add an `<input type="range">` slider. When we drag it back and forth, the image will automatically zoom in and out.

We're going to set the slider limits to the same defaults that PanZoom uses: `0.5` and `5.0`.

In this demo, you can click and drag the image. You can click the buttons to zoom in and out. You can drag the slider to zoom in and out.

```html
<!doctype html>
<html>
<head>
  <script src="PanZoom.js"></script>
  <script src="PanZoom.UI.Drag.js"></script>

  <style>
    .container {
      border: 1px solid black;
      height: 75vh;
      width: 100%;
    }
    #myimage {
      background-image: url(https://placekitten.com/2400/1600);
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
  </style>

</head>
<body>
  <button id="zoomin">Zoom IN</button>
  <button id="zoomout">Zoom OUT</button>

  <!-- Add our slider button for zooming -->
  <input id="zoomslider" type="range" step="0.1" min="0.5" max="5.0">

  <div class="container">
    <div id="myimage"></div>
  </div>

  <script>
    const pz = new PanZoom(document.getElementById("myimage"));
    const pzDrag = new PanZoomDragUI({
      drag: document.querySelector(".container"),
      scroll: document.querySelector("body"),
    }, pz);
 
    document.getElementById("zoomin").addEventListener("click", function() {
      pz.zoomIn();
    });
    document.getElementById("zoomout").addEventListener("click", function() {
      pz.zoomOut();
    });

    /* Add event listener to connect the slider to PanZoom */
    document.getElementById("zoomslider").addEventListener("input", function(event) {
      const newZoom = event.target.valueAsNumber;
      const newState = pz.zoomTo(newZoom);
      updateSlider(newState.zoom);
    });

    /* Add a function to update the slider value after a zoom */
    const updateSlider = function(newValue) {
      document.getElementById("zoomslider").value = newValue;
    }
  </script>

</body>
</html>
```

The range slider should allow you to zoom in and out now.

---

_However, you may have noticed a new problem._

When you click the "Zoom IN" or "Zoom OUT" buttons, the range slider doesn't update to reflect the new zoom level.

We can fix this by calling the `updateSlider()` method after clicking those buttons. The `pz.zoomIn()` and `pz.zoomOut()` methods return an object with the new state (zoom, x, and y positions).

Change this code:

```js
    document.getElementById("zoomin").addEventListener("click", function() {
      pz.zoomIn();
    });
    document.getElementById("zoomout").addEventListener("click", function() {
      pz.zoomOut();
    });
```

to this:

```js
    document.getElementById("zoomin").addEventListener("click", function() {
      updateSlider(pz.zoomIn().zoom);
    });
    document.getElementById("zoomout").addEventListener("click", function() {
      updateSlider(pz.zoomOut().zoom);
    });
```

Now, when you click the "Zoom IN" or "Zoom OUT" buttons, the range slider should update as well.

The entire example now looks like this:

```html
<!doctype html>
<html>
<head>
  <script src="PanZoom.js"></script>
  <script src="PanZoom.UI.Drag.js"></script>

  <style>
    .container {
      border: 1px solid black;
      height: 75vh;
      width: 100%;
    }
    #myimage {
      background-image: url(https://placekitten.com/2400/1600);
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
  </style>

</head>
<body>
  <button id="zoomin">Zoom IN</button>
  <button id="zoomout">Zoom OUT</button>

  <!-- Add our slider button for zooming -->
  <input id="zoomslider" type="range" step="0.1" min="0.5" max="5.0">

  <div class="container">
    <div id="myimage"></div>
  </div>

  <script>
    const pz = new PanZoom(document.getElementById("myimage"));
    const pzDrag = new PanZoomDragUI({
      drag: document.querySelector(".container"),
      scroll: document.querySelector("body"),
    }, pz);
 
    document.getElementById("zoomin").addEventListener("click", function() {
      /* After zooming, tell the slider what the new zoom level is. */
      updateSlider(pz.zoomIn().zoom);
    });
    document.getElementById("zoomout").addEventListener("click", function() {
      /* After zooming, tell the slider what the new zoom level is. */
      updateSlider(pz.zoomOut().zoom);
    });

    /* Add event listener to connect the slider to PanZoom */
    document.getElementById("zoomslider").addEventListener("input", function(event) {
      const newZoom = event.target.valueAsNumber;
      const newState = pz.zoomTo(newZoom);
      updateSlider(newState.zoom);
    });

    /* Add a function to update the slider value after a zoom */
    const updateSlider = function(newValue) {
      document.getElementById("zoomslider").value = newValue;
    }
  </script>

</body>
</html>
```



# API

The PanZoom class is designed as an API for manipulating an element's background image. It does not include its own UI itself.

## Constructor

### `new PanZoom(<element> el, <optional obj> options)`

The `el` element is the DOM element with the CSS background image.

### Constructor options

| key | type | default | description |
| :- | :- | :- | :- |
| `minZoom` | float | 0.5 | Minimum zoom value |
| `maxZoom` | float | 5.0 | Maximum zoom value |
| `initialZoom` | float | 1.0 | Initial zoom value |


### Example

Create a new PanZoom instance. Manage the element `#elementWithBackgroundImage`. Start with an initial zoom of 1.0. Prevent zooming out further than 0.5 or in more than 5.0.

```js
const el = document.getElementById("elementWithBackgroundImage");
const options = {
  minZoom: 0.5,
  maxZoom: 5.0,
  initialZoom: 1.0,
};
const pz = new PanZoom(el, options);
```



## Methods

Most methods will return the new state object. The state object contains the zoom level as well as x and y position. A state object looks like this:

```
{
  zoom: 1,
  x: -400,
  y: -200,
}
```

All methods that change the zoom or pan, or allow zoomLevel or position arguments, will be bounded by the limits given to the constructor.


### `<obj> zoomIn(<optional obj> focus = { x: int, y: int })`

Zoom in to the image by ~50%.

If `focus` is not provided, we assume we're zooming in to the center of the element.

If `focus` is provided:
  - the x value should be between 0 and the element width
  - the y value should be between 0 and the element height

These provide the origin point related to the background image where the zoom should begin.

Returns the new state.


### `<obj> zoomOut(<optional obj> focus = { x: int, y: int })`

Zoom out from the image by ~25%.

Otherwise, this works the same as `zoomIn`.


### `<obj> zoomTo(float zoomLevel, <optional obj> focus = { x: int, y: int })`

Zoom the image to a specific zoom level.

Otherwise, this works the same as `zoomIn`.


### `<obj> panLeft()`

Pan the image to the left. The image will move ~40% of the viewport width.

Returns the new state.

### `<obj> panRight()`

Pan the image to the right. The image will move ~40% of the viewport width.

Otherwise, this works the same as `panLeft`.

### `<obj> panUp()`

Pan the image up. The image will move ~40% of the viewport height.

Otherwise, this works the same as `panLeft`.

### `<obj> panDown()`

Pan the image down. The image will move ~40% of the viewport height.

Otherwise, this works the same as `panLeft`.


### `<obj> panTo(<obj> position = { x: float, y: float })`

Pan the image to a specific background position. The `position` values are in pixels.

@todo explain the coordinate system, because it's a combination of the current image size and the viewport dimensions

Returns the new state.


### `<obj> panOffset(<obj> offset = { x: float, y: float })`

Pan the image by the x/y offset provided. The `offset` values are in pixels.

Returns the new state.


### `<obj> panOffsetLive(<obj> offset = { x: float, y: float })`

This has the same effect as `panOffset()` above, with one key difference: the internal state is not changed. This method exists to support drag-and-drop panning functionality.

Returns the **current visible** state.


### `<obj> update()`

Force the background image to update to the current zoomLevel and position.

Returns the current state.


### `<obj> reset()`

Reset the map position and scale to the same state it initially started at.

Returns the new state.



# Developers

## Build distribution files

```bash
$ npm run build
```

This will build the distribution files in the `/dist/` folder. Run this before publishing a new release.


## Publishing a new version

This assumes you have an `.npmrc` file in the folder with a valid Github token for creating packages.

```bash
$ npm run build
$ npm publish
```


# Unsupported

  - Multiple CSS backgrounds on the same element
    - @todo what happens in this case?


# Maintainer

  - Kendall Anderson (kpander@invisiblethreads.com)

