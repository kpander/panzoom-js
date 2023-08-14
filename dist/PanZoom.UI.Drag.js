/* https://github.com/kpander/panzoom-js */
/* dist/PanZoom.UI.Drag.js v1.0.0 Sun Aug 13 2023 17:17:20 GMT-0400 (Eastern Daylight Saving Time) */

"use strict";class PanZoomDragUI{constructor(t={},s){this.els=t,this.pz=s,this.state={isDragging:!1,startX:0,startY:0,deltaX:0,deltaY:0,tapCount:0,tapTimer:null},this.config={doubleTapThreshold:300},this._addBindings()}_addBindings(){this.els.drag.addEventListener("mousedown",this._handleMouseDown.bind(this)),this.els.drag.addEventListener("touchstart",this._handleTouchDown.bind(this)),this.els.drag.addEventListener("mousemove",this._handleMouseMove.bind(this)),this.els.drag.addEventListener("touchmove",this._handleMouseMove.bind(this)),this.els.drag.addEventListener("mouseup",this._handleMouseUp.bind(this)),this.els.drag.addEventListener("touchend",this._handleMouseUp.bind(this))}_handleTouchDown(){this.state.tapCount++,1===this.state.tapCount?this.state.tapTimer=setTimeout(function(){this.state.tapCount=0},this.config.doubleTapThreshold):2===this.state.tapCount&&(clearTimeout(this.state.tapTimer),this.state.tapCount=0,this.pz.zoomIn()),this._initDrag()}_handleMouseDown(){this._initDrag()}_handleMouseMove(t){var s;this.state.isDragging&&(s=t.clientX||t.touches[0].clientX,t=t.clientY||t.touches[0].clientY,this.state.deltaX=s-this.state.startX,this.state.deltaY=t-this.state.startY,s={x:this.state.deltaX,y:this.state.deltaY},this.state.dragTarget=this.pz.panOffsetLive(s))}_handleMouseUp(){this.state.isDragging&&this._resetDrag()}_initDrag(){this._disableWindowScroll(),this._disableTransitions(),this.state.isDragging=!0,this.state.startX=event.clientX||event.touches[0].clientX,this.state.startY=event.clientY||event.touches[0].clientY}_resetDrag(){this._enableWindowScroll(),this._enableTransitions(),this.state.isDragging=!1,this.state.dragTarget&&(this.pz.panTo(this.state.dragTarget),this.state.dragTarget=null)}_disableWindowScroll(){this.els.scroll&&(this.els.scroll.style.overscrollBehavior="contain",this.els.scroll.style.overscrollBehaviorY="contain",this.els.scroll.style.overflowX="hidden",this.els.scroll.style.overflowY="hidden")}_enableWindowScroll(){this.els.scroll&&(this.els.scroll.style.overscrollBehavior="",this.els.scroll.style.overscrollBehaviorY="",this.els.scroll.style.overflowX="",this.els.scroll.style.overflowY="")}_disableTransitions(){this.els.transition&&(this.els.transition.style.transition="none")}_enableTransitions(){this.els.transition&&(this.els.transition.style.transition="")}}