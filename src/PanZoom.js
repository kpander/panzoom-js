"use strict";
/**
 * @file
 * PanZoom.js
 */

class PanZoom {
  constructor(el, options = {}) {
    this.limits = {
      zoom: { min: options.minZoom || .5, max: options.maxZoom || 5 },
      x: { min: options.minX || 0, max: options.maxX || 100 },
      y: { min: options.minY || 0, max: options.maxY || 100 },
    };

    this.state = {
      initial: {
        zoom: options.initialZoom || 1,
        x: options.initialX,
        y: options.initialY,
      },
      zoom: options.initialZoom || 1,
      x: null,
      y: null,
    };

    this.el = el;

    // Initialize once we've loaded the first background image.
    const me = this;
    const img = new Image();
    img.src = this._getBgUrl(this.el);
    img.onload = function() {
      me._init(img.width, img.height);
    };
  }

  _init(imgWidth, imgHeight) {
    // Image 1:1 size.
    this.state.img = {
      w: imgWidth,
      h: imgHeight,
    };

    this._findPanLimits();

    // If we didn't provide an initial position, set it to center/center.
    if (isNaN(this.state.initial.x) || isNaN(this.state.initial.y)) {
      this.state.initial.x = (this.limits.x.min - this.limits.x.max) / 2;
      this.state.initial.y = (this.limits.y.min - this.limits.y.max) / 2;
    }

    this.reset();

    // Add event listener for window resizing, because this will change our
    // display limits. If we need to throttle, see:
    // https://bencentra.com/code/2015/02/27/optimizing-window-resize.html
    window.addEventListener("resize", this._findPanLimits.bind(this));
  }

  /**
   * Reset our zoom and position to the initial state.
   */
  reset() {
    this.state.zoom = this.state.initial.zoom;
    this.state.x = this.state.initial.x;
    this.state.y = this.state.initial.y;
    return this.update();
  }

  /**
   * Any time we initialize, or resize the window, recalculate our offset
   * limits based on the new viewport display size.
   */
  _findPanLimits() {
    this.state.viewport = {
      w: this.el.offsetWidth,
      h: this.el.offsetHeight,
    };

    this.limits.x.max = 0;
    this.limits.x.min = this.state.viewport.w - (this.state.img.w * this.state.zoom);
    this.limits.y.max = 0;
    this.limits.y.min = this.state.viewport.h - (this.state.img.h * this.state.zoom);
  }

  zoomIn(focus = null) { return this.zoomTo(this.state.zoom * 1.5, focus); }
  zoomOut(focus = null) { return this.zoomTo(this.state.zoom * .75, focus); }

  zoomTo(zoomLevel, focus = null) {
    if (this.state.zoom === this.limits.zoom.max && zoomLevel > this.state.zoom) {
      // We're already at maximum zoom, and we're trying to zoom in further.
      // Do nothing.
      return this.state;
    }

    const state = this.state;

    if (focus === null) {
      focus = {
        x: state.viewport.w / 2,
        y: state.viewport.h / 2,
      };
    }

    // Determine the location we're going to zoom into/out from, based on the
    // given focus point within the viewport.
    let percX = (Math.abs(state.x) + focus.x) / (state.img.w * state.zoom);
    let percY = (Math.abs(state.y) + focus.y) / (state.img.h * state.zoom);

    // Calculate the new left/top position for the background image.
    this.state.x = focus.x - (percX * state.img.w * zoomLevel);
    this.state.y = focus.y - (percY * state.img.h * zoomLevel); 
    this.state.zoom = zoomLevel;

    this._findPanLimits();
    return this.update();
  }

  panLeft() { return this._pan("left"); }
  panRight() { return this._pan("right"); }
  panUp() { return this._pan("up"); }
  panDown() { return this._pan("down"); }

  panTo(position = {}) {
    this.state.x = position.x;
    this.state.y = position.y;
    return this.update();
  }
  panOffset(offset = {}) {
    this.state.x += offset.x;
    this.state.y += offset.y;
    return this.update();
  }

  /**
   * Pan an offset amount, but don't record this as our new position. This is
   * what we use to implement a mouse drag behaviour to interactively pan the
   * background image.
   */
  panOffsetLive(offset = {}) {
    const limits = this.limits;

    const newX = this._clamp(this.state.x + offset.x, limits.x.min, limits.x.max);
    const newY = this._clamp(this.state.y + offset.y, limits.y.min, limits.y.max);

    this.el.style.backgroundPosition = `${newX}px ${newY}px`;
    return { zoom: this.state.zoom, x: newX, y: newY };
  }

  /**
   * Partially pan the viewport in a given direction.
   */
  _pan(direction) {
    const delta = .4; // Distance = 40% of the viewport direction.

    switch (direction) {
      case "left": this.state.x += this.state.viewport.w * delta; break;
      case "right": this.state.x -= this.state.viewport.h * delta; break;
      case "up": this.state.y += this.state.viewport.w * delta; break;
      case "down": this.state.y -= this.state.viewport.h * delta; break;
    }

    return this.update();
  }

  /**
   * Update the background image to the new scale and position.
   *
   * Values are checked and corrected against maximum/minimum values.
   */
  update() {
    const limits = this.limits;

    [ "zoom", "x", "y" ].forEach(key => {
      this.state[key] = this._clamp(this.state[key], limits[key].min, limits[key].max);
    });

    this.el.style.backgroundSize = `${this.state.img.w * this.state.zoom}px`;
    this.el.style.backgroundPosition = `${this.state.x}px ${this.state.y}px`;

    return this.state;
  }

  _clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  /**
   * Get the URL from a CSS background-image rule on an element.
   */
  _getBgUrl(el) {
    return window
      .getComputedStyle(el)
      .backgroundImage
      .replace(/"/g, "")
      .replace(/url\(|\)$/ig, "");
  }

}
