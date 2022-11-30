import { useEffect, useRef, useState } from "react";
import "./App.css";
import { boxFactoryType, makeBoxFactory } from "./scene-components/SimpleBox";
import { iotBoxType, makeIotBox } from "./scene-components/IotBox";
import Iframe from "./UI/Iframe";
import { isElement } from "react-dom/test-utils";

function App() {
  const [sdk, setSdk] = useState();
  const [horizontal, setHorizontal] = useState(45);
  const [vertical, setVertical] = useState(0);
  const container = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  const [matterTag1, setMatterTag1] = useState([]);
  const [matterTag2, setMatterTag2] = useState("");
  const [componentBoxFactory, setComponentBoxFactory] = useState();
  const [nodeBoxFactory, setNodeBoxFactory] = useState();
  const [positionBoxFactory, setPositionBoxFactory] = useState(
    "x=0" + ", y=0" + ",z=0"
  );

  const [componentIotBox, setComponentIotBox] = useState();

  const [iframe, setIframe] = useState();

  const showCaseLoaded = async () => {
    const showcase = document.getElementById("showcase");
    const key = "w78qr7ncg7npmnhwu1xi07yza";
    try {
      const rtvSDK = await showcase.contentWindow.MP_SDK.connect(
        showcase,
        key,
        "3.6"
      );
      setSdk(rtvSDK);
    } catch (e) {
      console.error(e);
      return;
    }
    sdk?.App.state.waitUntil((state) => {
      console.log(state);
      if (state.phase == "appphase.playing") {
        return true;
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    loaded().then(
      sdk?.App.state.waitUntil((state) =>
        state.phase == "appphase.playing"
          ? setIsLoaded(true)
          : console.log(state.phase)
      )
    );
  }, [sdk]);
  async function loaded() {
    await sdk?.App.state.waitUntil(
      (state) => state.phase === sdk.App.Phase.PLAYING
    );
  }
  const editMatterTag = () => {
    /* console.log(matterTag1);
    console.log(matterTag2); */

    fetch(
      "https://pom-iot-default-rtdb.asia-southeast1.firebasedatabase.app/aircon.json"
    )
      .then((response) => {
        //console.log(response.json());
        return response.json();
      })
      .then((data) => {
        console.log(matterTag1);

        //console.log(matterTag2);
        sdk.Mattertag.editBillboard(matterTag1, {
          description:
            "[Link to Mattertag SDK!](https://matterport.github.io/showcase-sdk/sdk_editing_mattertags.html) \r\n\r\n ! Air Con = " +
            data.temp + " !"+
            "\r\n\r\n" +"\r\n\r\n"+
            "click button to reset to 25c",
        });
      });
  };
  useEffect(() => {
    //After finished load

    if (isLoaded === true) {
      initialFunction();
      startSDKHere();
    }
  }, [isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoaded) {
        //timer do something
        editMatterTag();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [matterTag1, matterTag2]);

  const registerCustomComponent = async () => {
    sdk.Scene.register(boxFactoryType, makeBoxFactory);
    sdk.Scene.register(iotBoxType, makeIotBox);
  };

  const initialFunction = async () => {
    const [sceneObject] = await sdk.Scene.createObjects(1);
    const lightsNode = sceneObject.addNode();
    const directionalLightComponet = lightsNode.addComponent(
      "mp.directionalLight",
      {
        color: { r: 0.7, g: 0.7, b: 0.7 },
      }
    );
    lightsNode.addComponent("mp.ambientLight", {
      intensity: 0.5,
      color: { r: 1.0, g: 1.0, b: 1.0 },
    });
    const ambientIntensityPath = sceneObject.addInputPath(
      directionalLightComponet,
      "intensity",
      "ambientIntensity"
    );
    lightsNode.start();

    registerCustomComponent();

    addComponentNode1();
    addComponentNode3();
    addComponentNode4();
    addMattertagNode1();
  };

  //Start code inthis function
  const startSDKHere = () => {
    //sdk.Camera.rotate(100, 0);
    //console.log(sdk.Scene);
    //addDemoObject();
  };
  const iframeHandler = () => {
    setIframe(null);
  };
  const setPositionStateBoxFactory = (newx, newy, newz) => {
    nodeBoxFactory.position.set(newx, newy, newz);
    setPositionBoxFactory("x=" + newx + ", y=" + newy + " , z=" + newz);
  };

  const setColorBoxFactoryMat = (r, g, b) => {
    componentBoxFactory.material.color.setRGB(r, g, b);
  };

  const setColorIotMat = (r, g, b) => {
    componentIotBox.material.color.setRGB(r, g, b);
  };

  const customEvent = (msg) => {
    console.log("clicked");
    alert("สถานะปัจจุบัน" + msg);
  };

  const addMattertagNode1 = () => {
    var mattertagDesc = {
      label: "Hello custom Mattertag",
      description: "0 c",
      anchorPosition: { x: -1, y: -6.9, z: 3.05 },
      stemVector: { x: 0, y: -0.5, z: 0 },
    };
    //setMatterTag2("test");
    sdk.Mattertag.add(mattertagDesc).then(function (mattertagId) {
      //console.log(mattertagId);
      setMatterTag1(mattertagId[0]);

      var htmlToInject =
        ' \
<style> \
button { \
width: 260px; \
height: 50px; \
} \
</style> \
<button id="btn1">Reset temperature to 25c</button> \
<script> \
var btn1 = document.getElementById("btn1"); \
btn1.addEventListener("click", function () { \
window.send("buttonClick", 12345); \
}); \
</script>';
      sdk.Mattertag.injectHTML(mattertagId[0], htmlToInject, {
        size: {
          w: 300,
          h: 200,
        },
      }).then(function (messenger) {
        messenger.on("buttonClick", function (buttonId) {
          alert("Rest temperature to 25c");
          console.log("clicked button with id:", buttonId);
          fetch(
            "https://pom-iot-default-rtdb.asia-southeast1.firebasedatabase.app/aircon.json",
            {
              method: "PUT",
              body: JSON.stringify({
                temp: "25c",
              }),
            }
          );
        });
      });
      //console.log(mattertagId);
      // output: TODO
    });
  };

  const addComponentNode4 = async () => {
    var [sceneObject] = await sdk.Scene.createObjects(1);
    var node4 = sceneObject.addNode("node-obj-4");
    var initial = {
      //url: "https://static.matterport.com/showcase-sdk/examples/assets-1.0-2-g6b74572/assets/models/sofa/9/scene.gltf",
      visible: true,
      size: { x: 0.2, y: 32, z: 16 },
      localScale: {
        x: 1,
        y: 1,
        z: 1,
      },
      localPosition: {
        x: -1,
        y: -7.5,
        z: 2.25,
      },
      localRotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      color: { r: 1, g: 0.5, b: 0 },
      updateInterval: 3000,
      updateApiUrl:
        "https://pom-iot-default-rtdb.asia-southeast1.firebasedatabase.app/color.json",
      /*  position: { x: -1, y: -7.5, z: 2.25 }, */
    };

    const gltfrtv = node4.addComponent(iotBoxType, initial, "my-component-4");

    class ClickSpy {
      node = node4;
      component = gltfrtv;
      eventType = "INTERACTION.CLICK";
      onEvent(payload) {
        console.log("received node4", payload, this);
        console.log(this.component.outputs.objectRoot.scale);
        //this.component.outputs.objectRoot.scale.set(2,2,2);
        //this.component.material.color.setRGB(1,1,1);
        customEvent(this.component.inputs.myUpdatedHexColor);
        //alert( this.component.inputs.myUpdatedHexColor);
        //alert('clciked!');
        //setColorBoxFactoryMat(1,1,1)
        /* this.node.stop();
        addComponentNode2(); */
      }
    }
    node4.position.set(-0.8, -9, 2.25);
    //gltfrtv.material.color.setRGB(1, 0.5, 0);
    // Spy on the click event
    //inputComponent.spyOnEvent(new ClickSpy());
    //console.log(node3);
    //gltfrtv?.outputs.objectRoot.position.set(0,-7,0);
    gltfrtv?.spyOnEvent(new ClickSpy());

    setComponentIotBox(gltfrtv);
    node4.start();
    //setNodeBoxFactory(node3);
    //console.log(gltfrtv);
    // You can enable navigation after starting the node.
    //inputComponent.inputs.userNavigationEnabled = true;
    //console.log(node);
    // You can turn off all events and the spy wont receive any callbacks.
    //inputComponent.inputs.eventsEnabled = false;
  };

  const addComponentNode3 = async () => {
    var [sceneObject] = await sdk.Scene.createObjects(1);
    var node3 = sceneObject.addNode("node-obj-3");
    var initial = {
      //url: "https://static.matterport.com/showcase-sdk/examples/assets-1.0-2-g6b74572/assets/models/sofa/9/scene.gltf",
      visible: true,
      size: { x: 0.6, y: 0.6, z: 0.6 },
      localScale: {
        x: 1,
        y: 1,
        z: 1,
      },
      localPosition: {
        x: -1,
        y: -7.5,
        z: 2.25,
      },
      localRotation: {
        x: 0,
        y: 0,
        z: 0,
      },

      /*  position: { x: -1, y: -7.5, z: 2.25 }, */
    };

    const gltfrtv = node3.addComponent(
      boxFactoryType,
      initial,
      "my-component-3"
    );

    class ClickSpy {
      node = node3;
      component = gltfrtv;
      eventType = "INTERACTION.CLICK";
      onEvent(payload) {
        console.log("received node3", payload, this);
        console.log(this.component.material.color);
        if (
          this.component.material.color.r === 1 &&
          this.component.material.color.g === 1 &&
          this.component.material.color.b === 1
        ) {
          this.component.material.color.setRGB(1, 1, 0);
        } else {
          this.component.material.color.setRGB(1, 1, 1);
        }
        setIframe({
          title: "Watch Realtime IOT No. #44s572",
          message:
            "https://static.matterport.com/showcase-sdk/examples/vs-app-1.1.6-12-g0a66341/vs-app/index.html?applicationKey=08s53auxt9txz1w6hx2iww1qb&m=89SActNChJm&sr=-3.09,-1.18&ss=38",
        });
        //alert("clicked!");
        //setColorBoxFactoryMat(1,1,1)
        /* this.node.stop();
        addComponentNode2(); */
      }
    }
    node3.position.set(-1, -7.5, 2.25);
    // Spy on the click event
    //inputComponent.spyOnEvent(new ClickSpy());
    console.log(node3);
    //gltfrtv?.outputs.objectRoot.position.set(0,-7,0);
    gltfrtv?.spyOnEvent(new ClickSpy());

    setComponentBoxFactory(gltfrtv);
    node3.start();
    setNodeBoxFactory(node3);
    console.log(gltfrtv);
    // You can enable navigation after starting the node.
    //inputComponent.inputs.userNavigationEnabled = true;
    //console.log(node);
    // You can turn off all events and the spy wont receive any callbacks.
    //inputComponent.inputs.eventsEnabled = false;
  };

  const addComponentNode1 = async () => {
    var [sceneObject] = await sdk.Scene.createObjects(1);
    var node1 = sceneObject.addNode("node-obj-1");
    var initial = {
      url: "https://static.matterport.com/showcase-sdk/examples/assets-1.0-2-g6b74572/assets/models/sofa/9/scene.gltf",
      visible: true,
      localScale: {
        x: 1,
        y: 1,
        z: 1,
      },
      localPosition: {
        x: -1.1,
        y: -9,
        z: 2,
      },
      localRotation: {
        x: 0,
        y: 0,
        z: 10,
      },
    };

    const gltfrtv = node1.addComponent(
      "mp.gltfLoader",
      initial,
      "my-component-gltf-1"
    );

    class ClickSpy {
      node = node1;
      eventType = "INTERACTION.CLICK";
      onEvent(payload) {
        console.log("received node1", payload, this);
        this.node.stop();
        addComponentNode2();
      }
    }
    // Spy on the click event
    //inputComponent.spyOnEvent(new ClickSpy());

    gltfrtv?.spyOnEvent(new ClickSpy());
    node1.start();
    console.log(gltfrtv);
    // You can enable navigation after starting the node.
    //inputComponent.inputs.userNavigationEnabled = true;
    //console.log(node);
    // You can turn off all events and the spy wont receive any callbacks.
    //inputComponent.inputs.eventsEnabled = false;
  };

  const addComponentNode2 = async () => {
    var [sceneObject] = await sdk.Scene.createObjects(1);
    var node2 = sceneObject.addNode("node-obj-1");
    var initial = {
      url: "https://static.matterport.com/showcase-sdk/examples/assets-1.0-2-g6b74572/assets/models/iot/nest-1/model.dae",
      visible: true,
      localScale: {
        x: 0.5,
        y: 0.5,
        z: 0.5,
      },
      localPosition: {
        x: 0,
        y: -9,
        z: 1,
      },
      localRotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    };

    const gltfrtv = node2.addComponent(
      "mp.daeLoader",
      initial,
      "my-component-gltf-2"
    );

    class ClickSpy {
      node = node2;
      eventType = "INTERACTION.CLICK";
      onEvent(payload) {
        console.log("received node2", payload, this);
        this.node.stop();
        addComponentNode1();
      }
    }
    // Spy on the click event
    //inputComponent.spyOnEvent(new ClickSpy());

    gltfrtv?.spyOnEvent(new ClickSpy());

    // You can enable navigation after starting the node.
    //inputComponent.inputs.userNavigationEnabled = true;
    //console.log(node);
    // You can turn off all events and the spy wont receive any callbacks.
    //inputComponent.inputs.eventsEnabled = false;
    node2.start();
  };

  const rotate = () => {
    sdk?.Camera.rotate(horizontal, vertical);
  };

  return (
    <div className="app">
      {/* <div className="container" ref={container}></div> */}

      <div className="button-wrap">
        <label>
          <span>Horizontal rotation</span>
          <input
            type="number"
            onInput={(evt) => setHorizontal(parseFloat(evt.target.value))}
            value={horizontal}
          />
        </label>
        <label>
          <span>Vertical rotation</span>
          <input
            type="number"
            onInput={(evt) => setVertical(parseFloat(evt.target.value))}
            value={vertical}
          />
        </label>
        <button onClick={rotate /* startSDKHere */}>Rotate</button>
        <br></br>
        <button onClick={() => setColorBoxFactoryMat(1, 0.1, 0.1)}>
          Change color Red
        </button>
        <button onClick={() => setColorBoxFactoryMat(0.1, 1, 0.1)}>
          Change color Green
        </button>
        <br></br>
        <button
          onClick={() =>
            setPositionStateBoxFactory(
              nodeBoxFactory.position.x - 0.1,
              nodeBoxFactory.position.y,
              nodeBoxFactory.position.z
            )
          }
        >
          Move box x-0.1
        </button>
        <button
          onClick={() =>
            setPositionStateBoxFactory(
              nodeBoxFactory.position.x + 0.1,
              nodeBoxFactory.position.y,
              nodeBoxFactory.position.z
            )
          }
        >
          Move box x+0.1
        </button>
        <br></br>
        <button
          onClick={() =>
            setPositionStateBoxFactory(
              nodeBoxFactory.position.x,
              nodeBoxFactory.position.y - 0.1,
              nodeBoxFactory.position.z
            )
          }
        >
          Move box y-0.1
        </button>
        <button
          onClick={() =>
            setPositionStateBoxFactory(
              nodeBoxFactory.position.x,
              nodeBoxFactory.position.y + 0.1,
              nodeBoxFactory.position.z
            )
          }
        >
          Move box y+0.1
        </button>
        <br></br>
        <button
          onClick={() =>
            setPositionStateBoxFactory(
              nodeBoxFactory.position.x,
              nodeBoxFactory.position.y,
              nodeBoxFactory.position.z - 0.1
            )
          }
        >
          Move box z-0.1
        </button>
        <button
          onClick={() =>
            setPositionStateBoxFactory(
              nodeBoxFactory.position.x,
              nodeBoxFactory.position.y,
              nodeBoxFactory.position.z + 0.1
            )
          }
        >
          Move box z+0.1
        </button>
        <br></br>
        {positionBoxFactory}
        {/*  <button onClick={() => (alert(nodeBoxFactory.position.x +"," +nodeBoxFactory.position.y+"," +nodeBoxFactory.position.z  ))}>
          Get Location
        </button> */}

        {/* <button onClick={()=>(nodeBox.start())}>Start Node</button>
        <button onClick={()=>(nodeBox.stop())}>Stop Node</button> */}
      </div>
      {iframe && (
        <Iframe
          title={iframe.title}
          message={iframe.message}
          onConfirm={iframeHandler}
        />
      )}
      <iframe
        id="showcase"
        src="/bundle/showcase.html?m=V5hx2ktRhvH&play=1&qs=1&log=0&applicationKey=w78qr7ncg7npmnhwu1xi07yza"
        width="1200px"
        height="800px"
        frameBorder="0"
        allow="xr-spatial-tracking"
        allowFullScreen
        ref={container}
        onLoad={showCaseLoaded}
      >
        {" "}
      </iframe>
    </div>
  );
}

export default App;
