function Box() {

    this.inputs = {
      visible: true,
      size: { x: 1, y: 1, z: 1 },
      color: 0xffff00,

    };
    /* inputs: Inputs = {
      size: { x: 1, y: 1, z: 1 },
      color: 0xffff00,
      visible: true,
      opacity: 0.1,
      lineOpacity: 1,
      lineColor: 0xffffff,
      transitionTime: 0.4,
    }; */

/*     CLICK = 'INTERACTION.CLICK', */
    /** HOVER events */
   /*  HOVER = 'INTERACTION.HOVER', */
    /** DRAG events (mousedown then move) */
    /* DRAG = 'INTERACTION.DRAG',
    DRAG_BEGIN = 'INTERACTION.DRAG_BEGIN',
    DRAG_END = 'INTERACTION.DRAG_END',
    POINTER_MOVE = 'INTERACTION.POINTER_MOVE',
    POINTER_BUTTON = 'INTERACTION.POINTER_BUTTON',
    SCROLL = 'INTERACTION.SCROLL',
    KEY = 'INTERACTION.KEY',
    LONG_PRESS_START = 'INTERACTION.LONG_PRESS_START',
    LONG_PRESS_END = 'INTERACTION.LONG_PRESS_END',
    MULTI_SWIPE = 'INTERACTION.MULTI_SWIPE',
    MULTI_SWIPE_END = 'INTERACTION.MULTI_SWIPE_END',
    PINCH = 'INTERACTION.PINCH',
    PINCH_END = 'INTERACTION.PINCH_END',
    ROTATE = 'INTERACTION.ROTATE',
    ROTATE_END = 'INTERACTION.ROTATE_END', */
  
    this.events = {
      "INTERACTION.CLICK": true,
      "INTERACTION.HOVER": true,
     /*  'INTERACTION.CLICK',
      ['INTERACTION.CLICK']: true,
      ['INTERACTION.HOVER']: false,
      ['INTERACTION.DRAG']: false, */
    };
 
    this.onInit = function() {
      var THREE = this.context.three;
      var geometry = new THREE.BoxGeometry(this.inputs.size.x, this.inputs.size.y, this.inputs.size.z);
      this.material = new THREE.MeshBasicMaterial();
      var mesh = new THREE.Mesh( geometry, this.material );
      mesh.material.color.setHex(this.inputs.color);
      this.outputs.objectRoot = mesh;
      this.outputs.collider = mesh;
    };
 
    this.onEvent = function(type, data) {
      if (type === "INTERACTION.CLICK") {
        this.notify("INTERACTION.CLICK", {
          type: type,
          node: this.context.root,
          component: this,
        });
      }
      console.log(type,data);
    }
 
    this.onInputsUpdated = function(previous) {
    };
 
    this.onTick = function(tickDelta) {
    }
 
    this.onDestroy = function() {
      this.material.dispose();
    };
 }
 
/*  export default function BoxFactory() {
    return new Box();
 } */

 export const boxFactoryType = 'mp.boxFactory';
export const makeBoxFactory = function() {
  return new Box();
}