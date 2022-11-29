function IotBox() {
  this.inputs = {
    visible: true,
    size: { x: 1, y: 1, z: 1 },
    color: { r: 1, g: 1, b: 1 },
    updateInterval: 1000,
    currentTime: 0,
    nextUpdate: 0,
    updateApiUrl: "",
    myUpdatedHexColor: "",
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

  this.onInit = function () {
    var THREE = this.context.three;
    /* var geometry = new THREE.BoxGeometry(
      this.inputs.size.x,
      this.inputs.size.y,
      this.inputs.size.z
    ); */
    var geometry = new THREE.SphereGeometry(
      this.inputs.size.x,
      this.inputs.size.y,
      this.inputs.size.z
    );
    this.material = new THREE.MeshBasicMaterial();
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.material.color.setRGB(
      this.inputs.color.r,
      this.inputs.color.g,
      this.inputs.color.b
    );
    this.outputs.objectRoot = mesh;
    this.outputs.collider = mesh;
    console.log("inInit iot");
  };

  this.onEvent = function (type, data) {
    if (type === "INTERACTION.CLICK") {
      this.notify("INTERACTION.CLICK", {
        type: type,
        node: this.context.root,
        component: this,
      });
    }
    console.log(type, data);
  };

  this.onInputsUpdated = function (previous) {};

  this.onTick = function (tickDelta) {
    this.inputs.currentTime = this.inputs.currentTime + tickDelta;
    if (this.inputs.currentTime > this.inputs.nextUpdate) {
      console.log("onTick iot" + this.inputs.currentTime);

      fetch(this.inputs.updateApiUrl)
        .then((response) => {
          //console.log(response.json());
          return response.json();
        })
        .then((data) => {
          this.outputs.objectRoot.material.color.setHex(data.hexColor);
          this.inputs.myUpdatedHexColor = data.hexColor;
          this.outputs.objectRoot.scale.set(data.scaleSize,data.scaleSize,data.scaleSize);
          //scaleSize
          console.log(data);
        });

      this.inputs.currentTime = 0;
      this.inputs.nextUpdate = 0;
      this.inputs.nextUpdate =
        this.inputs.nextUpdate + this.inputs.updateInterval;
    }
  };

  this.onDestroy = function () {
    this.material.dispose();
  };
}

/*  export default function BoxFactory() {
    return new Box();
 } */

export const iotBoxType = "mp.iotBox";
export const makeIotBox = function () {
  return new IotBox();
};
