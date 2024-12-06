import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const USE_WGPU = new URLSearchParams(location.search).get("wgpu") !== null;

if (USE_WGPU) {
  async function testwgpu() {
    const adapter =
      typeof navigator?.gpu !== "undefined"
        ? await navigator?.gpu.requestAdapter({
            powerPreference: "high-performance",
          })
        : null;

    if (adapter === null) {
      alert("WebGPUBackend: Unable to create WebGPU adapter.");
    }
  }
  testwgpu();
}

const width = window.innerWidth;
const height = window.innerHeight;
const canvas = document.getElementById("canvas");

canvas.addEventListener(
  "webglcontextlost",
  function (event) {
    event.preventDefault();
    alert("context lost");
  },
  false
);

const statsEl = document.getElementById("stats");

let color = 0;
let meshes = 0;

// camera

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 5000);
camera.position.z = 2000;
camera.position.y = 2000;

// scene/simple mesh
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light1 = new THREE.AmbientLight(0x404040, 2); // soft white light
scene.add(light1);

const light2 = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
scene.add(light2);

// renderer
let renderer;
if (USE_WGPU) {
  renderer = new WebGPURenderer({ antialias: true, canvas });
} else {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

// animation

function animate(time) {
  controls.update(time);
  renderer.render(scene, camera);
  statsEl.textContent = `${
    USE_WGPU ? "WEBGPU" : "WEBGL"
  } Spheres: ${meshes} - ${(renderer.info.render.triangles / 1000000).toFixed(
    0
  )} million triangles - ${(
    (renderer.info.render.triangles * 3 * 8) /
    (1024 * 1024)
  ).toFixed(0)} MB (uint32/floatarray32)`;
}

// helper / buttons

const button1El = document.getElementById("button1");
button1El.addEventListener("click", async function () {
  for (let i = 0; i < 5; i++) {
    addMesh();
    await wait(50);
  }
});

const button2El = document.getElementById("button2");
button2El.addEventListener("click", async function () {
  for (let i = 0; i < 10; i++) {
    addMesh();
    await wait(50);
  }
});

const button3El = document.getElementById("button3");
button3El.addEventListener("click", async function () {
  for (let i = 0; i < 50; i++) {
    addMesh();
    await wait(50);
  }
});

function wait(ms) {
  return new Promise(function (r) {
    setTimeout(function () {
      r();
    }, ms);
  });
}

const geometryTemplate = new THREE.SphereGeometry(5, 2000, 1300);

function addMesh() {
  color += 1000;
  meshes += 1;

  const geometry = new THREE.BufferGeometry();
  const vertices = new THREE.BufferAttribute(
    new Float32Array(geometryTemplate.attributes.position.array),
    3
  );
  vertices.onUploadCallback = function () {
    this.array = null; // just want to upload to gpu
  };

  const indices = new THREE.BufferAttribute(
    new Uint32Array(geometryTemplate.index.array),
    1
  );
  indices.onUploadCallback = function () {
    this.array = null; // just want to upload to gpu
  };

  geometry.setIndex(indices);
  geometry.setAttribute("position", vertices);

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHex(color),
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.set(
    randomPosition(-150, 150),
    randomPosition(-150, 150),
    randomPosition(-150, 150)
  );
}

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
