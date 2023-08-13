"use strict";
/**
 * @file
 * PanZoom.UI.Drag.js
 *
 * Add drag and drop panning functionality (and double click zoom) to a PanZoom
 * object instance.
 *
 * Click-and-drag to pan.
 *
 * Works for both mouse and touch inputs.
 */

class PanZoomDragUI {

  /**
   * @param object els with keys:
   *   drag: element we add mouse events to for dragging
   *   transition: element we block transitions on when dragging
   *   scroll: element we block scroll on when dragging
   * @param object pzInstance PanZoom object instance
   */
  constructor(els = {}, pzInstance) {
    this.els = els;
    this.pz = pzInstance;

    this.state = {
      isDragging: false,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      tapCount: 0,
      tapTimer: null,
    };
    this.config = {
      doubleTapThreshold: 300,
    };

    this._addBindings();
  }

  /**
   * Add event listeners for both mouse and touch events.
   */
  _addBindings() {
    this.els.drag.addEventListener("mousedown", this._handleMouseDown.bind(this));
    this.els.drag.addEventListener("touchstart", this._handleTouchDown.bind(this));

    this.els.drag.addEventListener("mousemove", this._handleMouseMove.bind(this));
    this.els.drag.addEventListener("touchmove", this._handleMouseMove.bind(this));

    this.els.drag.addEventListener("mouseup", this._handleMouseUp.bind(this));
    this.els.drag.addEventListener("touchend", this._handleMouseUp.bind(this));
  }

  _handleTouchDown(/*event*/) {
    this.state.tapCount++;

    if (this.state.tapCount === 1) {
      this.state.tapTimer = setTimeout(function() {
        this.state.tapCount = 0;
      }, this.config.doubleTapThreshold);
    } else if (this.state.tapCount === 2) {
      // This is a double-tap event.
      clearTimeout(this.state.tapTimer);
      this.state.tapCount = 0;

      /*updateSlider(*/this.pz.zoomIn()/*.zoom)*/; // @todo
    }

    this._initDrag();
  }

  _handleMouseDown(/*event*/) {
    this._initDrag();
  }

  _handleMouseMove(event) {
    if (!this.state.isDragging) return;

    const currentX = event.clientX || event.touches[0].clientX;
    const currentY = event.clientY || event.touches[0].clientY;

    this.state.deltaX = currentX - this.state.startX;
    this.state.deltaY = currentY - this.state.startY;

    const dragOffset = {
      x: this.state.deltaX,
      y: this.state.deltaY,
    };
    this.state.dragTarget = this.pz.panOffsetLive(dragOffset);
  }

  _handleMouseUp() {
    if (this.state.isDragging) {
      this._resetDrag();
    }
  }

  _initDrag() {
    this._disableWindowScroll();
    this._disableTransitions();

    this.state.isDragging = true;
    this.state.startX = event.clientX || event.touches[0].clientX;
    this.state.startY = event.clientY || event.touches[0].clientY;
  }

  _resetDrag() {
    this._enableWindowScroll();
    this._enableTransitions();

    this.state.isDragging = false;
    if (this.state.dragTarget) {
      this.pz.panTo(this.state.dragTarget);
      this.state.dragTarget = null;
    }
  }

  _disableWindowScroll() {
    if (this.els.scroll) {
      this.els.scroll.style.overscrollBehavior = "contain";
      this.els.scroll.style.overscrollBehaviorY = "contain";
      this.els.scroll.style.overflowX = "hidden";
      this.els.scroll.style.overflowY = "hidden";
    }
  }

  _enableWindowScroll() {
    if (this.els.scroll) {
      this.els.scroll.style.overscrollBehavior = "";
      this.els.scroll.style.overscrollBehaviorY = "";
      this.els.scroll.style.overflowX = "";
      this.els.scroll.style.overflowY = "";
    }
  }

  _disableTransitions() {
    if (this.els.transition) {
      this.els.transition.style.transition = "none";
    }
  }

  _enableTransitions() {
    if (this.els.transition) {
      this.els.transition.style.transition = "";
    }
  }
  
}
