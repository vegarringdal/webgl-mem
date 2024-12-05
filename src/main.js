import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
const button1El = document.getElementById("button1");
button1El.addEventListener("click", async function () {
  for (let i = 0; i < 5; i++) {
    addMesh();
    await wait(1000);
  }
});

const button2El = document.getElementById("button2");
button2El.addEventListener("click", async function () {
  for (let i = 0; i < 10; i++) {
    addMesh();
    await wait(1000);
  }
});


const button3El = document.getElementById("button3");
button3El.addEventListener("click", async function () {
  for (let i = 0; i < 50; i++) {
    addMesh();
    await wait(1000);
  }
});


function wait(ms) {
  return new Promise(function (r) {
    setTimeout(function () {
      r();
    }, ms);
  });
}

let color = 0;
let meshes = 0;

// camera

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
camera.position.z = 300;
camera.position.y = 300;

// scene/simple mesh
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

renderer.onc;

// controls

const controls = new OrbitControls(camera, renderer.domElement);

// animation

function animate(time) {
  controls.update();
  renderer.render(scene, camera);
  statsEl.textContent = `Spheres: ${meshes} - ${
    (renderer.info.render.triangles / 1000000).toFixed(0)
  } million triangles - ${(
    (renderer.info.render.triangles * 3 * 12) /
    (1024 * 1024)
  ).toFixed(0)} MB mem`;
}
animate();

// helper
const geometryTemplate = new THREE.SphereGeometry(50, 2000, 1300);

function addMesh() {
  color += 1000;
  meshes += 1;

  const geometry = new THREE.BufferGeometry();
  const vertices = new THREE.BufferAttribute(
    new Float32Array(geometryTemplate.attributes.position.array),
    3
  );
  vertices.onUploadCallback = function () {
    this.array = null;
  };

  const normal = new THREE.BufferAttribute(
    new Float32Array(geometryTemplate.attributes.normal.array),
    3
  );
  normal.onUploadCallback = function () {
    this.array = null;
  };

  const indices = new THREE.BufferAttribute(
    new Uint32Array(geometryTemplate.index.array),
    1
  );
  indices.onUploadCallback = function () {
    this.array = null;
  };

  geometry.setIndex(indices);
  geometry.setAttribute("position", vertices);
  geometry.setAttribute("normal", normal);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHex(color),
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  animate();
}
