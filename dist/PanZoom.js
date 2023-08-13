/* https://github.com/kpander/panzoom-js */
/* dist/PanZoom.js v1.0.0 Sun Aug 13 2023 17:17:20 GMT-0400 (Eastern Daylight Saving Time) */

"use strict";class PanZoom{constructor(t,i={}){this.limits={zoom:{min:i.minZoom||.5,max:i.maxZoom||5},x:{min:i.minX||0,max:i.maxX||100},y:{min:i.minY||0,max:i.maxY||100}},this.state={initial:{zoom:i.initialZoom||1,x:i.initialX,y:i.initialY},zoom:i.initialZoom||1,x:null,y:null},this.el=t;const s=this,a=new Image;a.src=this._getBgUrl(this.el),a.onload=function(){s._init(a.width,a.height)}}_init(t,i){this.state.img={w:t,h:i},this._findPanLimits(),(isNaN(this.state.initial.x)||isNaN(this.state.initial.y))&&(this.state.initial.x=(this.limits.x.min-this.limits.x.max)/2,this.state.initial.y=(this.limits.y.min-this.limits.y.max)/2),this.reset(),window.addEventListener("resize",this._findPanLimits.bind(this))}reset(){return this.state.zoom=this.state.initial.zoom,this.state.x=this.state.initial.x,this.state.y=this.state.initial.y,this.update()}_findPanLimits(){this.state.viewport={w:this.el.offsetWidth,h:this.el.offsetHeight},this.limits.x.max=0,this.limits.x.min=this.state.viewport.w-this.state.img.w*this.state.zoom,this.limits.y.max=0,this.limits.y.min=this.state.viewport.h-this.state.img.h*this.state.zoom}zoomIn(t=null){return this.zoomTo(1.5*this.state.zoom,t)}zoomOut(t=null){return this.zoomTo(.75*this.state.zoom,t)}zoomTo(t,i=null){var s,a,e;return this.state.zoom===this.limits.zoom.max&&t>this.state.zoom?this.state:(s=this.state,null===i&&(i={x:s.viewport.w/2,y:s.viewport.h/2}),a=(Math.abs(s.x)+i.x)/(s.img.w*s.zoom),e=(Math.abs(s.y)+i.y)/(s.img.h*s.zoom),this.state.x=i.x-a*s.img.w*t,this.state.y=i.y-e*s.img.h*t,this.state.zoom=t,this._findPanLimits(),this.update())}panLeft(){return this._pan("left")}panRight(){return this._pan("right")}panUp(){return this._pan("up")}panDown(){return this._pan("down")}panTo(t={}){return this.state.x=t.x,this.state.y=t.y,this.update()}panOffset(t={}){return this.state.x+=t.x,this.state.y+=t.y,this.update()}panOffsetLive(t={}){var i=this.limits,s=this._clamp(this.state.x+t.x,i.x.min,i.x.max),t=this._clamp(this.state.y+t.y,i.y.min,i.y.max);return this.el.style.backgroundPosition=s+`px ${t}px`,{zoom:this.state.zoom,x:s,y:t}}_pan(t){switch(t){case"left":this.state.x+=.4*this.state.viewport.w;break;case"right":this.state.x-=.4*this.state.viewport.h;break;case"up":this.state.y+=.4*this.state.viewport.w;break;case"down":this.state.y-=.4*this.state.viewport.h}return this.update()}update(){const i=this.limits;return["zoom","x","y"].forEach(t=>{this.state[t]=this._clamp(this.state[t],i[t].min,i[t].max)}),this.el.style.backgroundSize=this.state.img.w*this.state.zoom+"px",this.el.style.backgroundPosition=`${this.state.x}px ${this.state.y}px`,this.state}_clamp(t,i,s){return Math.min(Math.max(t,i),s)}_getBgUrl(t){return window.getComputedStyle(t).backgroundImage.replace(/"/g,"").replace(/url\(|\)$/gi,"")}}