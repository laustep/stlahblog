function getRotation(U, V) {
  var ma = U.length();
  var mb = V.length(); // should be = ma
  var d = U.x * V.x + U.y * V.y + U.z * V.z;
  var c = Math.sqrt(ma * mb + d);
  var ma2 = Math.sqrt(2) * ma;
  var r = 1 / ma2 / c;
  var W = U.clone().cross(V).multiplyScalar(r);
  var quat = new THREE.Quaternion().set(c / ma2, W.x, W.y, W.z);
  return new THREE.Matrix4().makeRotationFromQuaternion(quat);
}

var u = new THREE.Vector3(1, 0, 0);
var v = new THREE.Vector3(1, 2, 3).normalize();
var R = getRotation(u, v).transpose().elements;
console.log(R[0] * u.x + R[1] * u.y + R[2] * u.z);
console.log(R.w * u.x + R[5] * u.y + R[6] * u.z);
console.log(R[8] * u.x + R[9] * u.y + R[10] * u.z);

new THREE.Matrix4().set(
  1 - 2 * q.z ** 2 - 2 * q.w ** 2, 2 * q.y * q.z - 2 * q.w * q.x, 2 * q.y * q.w + 2 * q.z * q.x,
  2 * q.y * q.z + 2 * q.w * q.x, 1 - 2 * q.y ** 2 - 2 * q.w ** 2, 2 * q.z * q.w - 2 * q.y * q.x,
  2 * q.y * q.w - 2 * q.z * q.x, 2 * q.z * q.w + 2 * q.y * q.x, 1 - 2 * q.y ** 2 - 2 * q.z ** 2
)





var A = 0.44;
var n = 3;
var uSteps = 149,
  vSteps = 149;
var pi = Math.PI;
var scale = 0.03;
var phi = (1 + Math.sqrt(5)) / 2;
var a = 1 / Math.sqrt(3);
var b = a / phi;
var c = a * phi;
var points = [
  [a, a, a],
  [a, a, -a],
  [a, -a, a],
  [-a, -a, a],
  [-a, a, -a],
  [-a, a, a],
  [0, b, -c],
  [0, -b, -c],
  [0, -b, c],
  [c, 0, -b],
  [-c, 0, -b],
  [-c, 0, b],
  [b, c, 0],
  [b, -c, 0],
  [-b, -c, 0],
  [-b, c, 0],
  [0, b, c],
  [a, -a, -a],
  [c, 0, b],
  [-a, -a, -a]
];


function reorient(axis1, axis2) {
  var vX1 = axis1.normalize();
  var vX2 = axis2.normalize();
  var vY = vX1.clone().cross(vX2).normalize();
  var vZ1 = vX1.clone().cross(vY).normalize();
  var vZ2 = vX2.clone().cross(vY).normalize();
  var M1array = [vX1.x, vX1.y, vX1.z, vY.x, vY.y, vY.z, vZ1.x, vZ1.y, vZ1.z];
  var M1 = new THREE.Matrix3();
  M1.fromArray(M1array);
  var M2array = [vX2.x, vY.x, vZ2.x, vX2.y, vY.y, vZ2.y, vX2.z, vY.z, vZ2.z];
  var M2 = new THREE.Matrix3();
  M2.fromArray(M2array);
  var M = M1.clone().multiply(M2);
  var elems = M.elements;
  var A = new THREE.Matrix4();
  A.set(elems[0], elems[1], elems[2], axis2.x,
    elems[3], elems[4], elems[5], axis2.y,
    elems[6], elems[7], elems[8], axis2.z,
    0, 0, 0, 1);
  return A;
}

function getRotation(U, V) {
  var ma = U.length();
  var mb = V.length(); // should be = ma
  var d = U.x * V.x + U.y * V.y + U.z * V.z;
  var c = Math.sqrt(ma * mb + d);
  var ma2 = Math.sqrt(2) * ma;
  var r = 1 / ma2 / c;
  var W = U.clone().cross(V).multiplyScalar(r);
  var quat = new THREE.Quaternion().set(W.x, W.y, W.z, c / ma2);
  return new THREE.Matrix4().makeRotationFromQuaternion(quat);
}

function addReorientedMesh(geom, material, object, axis1, axis2) {
  var mesh = new THREE.Mesh(geom, material);
  var transfoMatrix = reorient(axis1, axis2);
  mesh.matrix = transfoMatrix;
  mesh.matrixAutoUpdate = false;
  object.add(mesh);
  var cone = new THREE.Mesh(coneGeom, coneMaterial);
  var B = getRotation(new THREE.Vector3(0, -h, 0), axis2);
  cone.matrix = B;
  cone.matrixAutoUpdate = false;
  object.add(cone);
}

// parameterization -------------------------------------------------
function f0(u, v, A, n) {
  // both u and v run from zero to one in Three.js
  var t = n * 2 * pi * u;
  var phi = 2 * pi * v;
  var h = pi / 2 - (pi / 2 - A) * Math.cos(t);
  var sinh = Math.sin(h);
  var p2 = sinh * Math.cos(t / n + A * Math.sin(2 * t));
  var p3 = sinh * Math.sin(t / n + A * Math.sin(2 * t));
  var p1 = Math.cos(h);
  var yden = Math.sqrt(2 * (1 + p1));
  var y1 = (1 + p1) / yden;
  var y2 = p2 / yden;
  var y3 = p3 / yden;
  var cosphi = Math.cos(phi);
  var sinphi = Math.sin(phi);
  var x3 = cosphi * y1;
  var x4 = sinphi * y1;
  var x2 = cosphi * y2 - sinphi * y3;
  var x1 = cosphi * y3 + sinphi * y2;
  return new THREE.Vector3(x1 / (1 - x4), x2 / (1 - x4), x3 / (1 - x4)).multiplyScalar(scale);
}

function g(A, n) {
  return function f(u, v, vector) {
    var out = f0(u, v, A, n);
    vector.set(out.x, out.y, out.z);
  }
}

// dat.gui controls -------------------------------------------------
var dgcontrols = new function() {
  this.rotationSpeed = 0.001;
  this.cameraz = 2.2;
}
var gui = new dat.GUI({
  autoplace: false,
  width: 300
});
gui.add(dgcontrols, 'cameraz').min(2.2).max(10).step(0.1).name("Camera position");
gui.add(dgcontrols, 'rotationSpeed').min(0).max(0.005).name("Rotation speed");

// three.js scene ---------------------------------------------------
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect, 1, 10000);
camera.position.z = 2.2;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();
var object = new THREE.Object3D();

var axis1 = new THREE.Vector3(0, 0, 1);
var geometry = new THREE.ParametricGeometry(g(A, n), uSteps, vSteps);
var bufGeom = new THREE.BufferGeometry().fromGeometry(geometry);
var material = new THREE.MeshNormalMaterial({
  wireframe: false
});
var h = Math.sqrt(3 * a * a);
var coneGeom = new THREE.ConeBufferGeometry(0.04, h, 32).translate(0, -h / 2, 0);
var coneMaterial = new THREE.MeshBasicMaterial({
  color: 0x556b2f
});
for (var i = 0; i < 20; i++) {
  var axis2 = new THREE.Vector3().fromArray(points[i]);
  addReorientedMesh(bufGeom, material, object, axis1, axis2);
}
scene.add(object);

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function render() {
  renderer.render(scene, camera);
  object.rotation.x += dgcontrols.rotationSpeed;
  object.rotation.y += dgcontrols.rotationSpeed;
  camera.position.z = dgcontrols.cameraz;
  requestAnimFrame(render);
}

// dragging & animation -------------------------------------------------------
var isDragging = false;
var previousMousePosition = {
  x: 0,
  y: 0
};

$(renderer.domElement).on('mousedown', function(e) {
  isDragging = true;
}).on('mousemove', function(e) {
  var deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  };
  if (isDragging) {
    var deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        Math.PI / 180 * (deltaMove.y * 1),
        Math.PI / 180 * (deltaMove.x * 1),
        0,
        'XYZ'
      ));
    object.quaternion.multiplyQuaternions(deltaRotationQuaternion,
      object.quaternion);
  }
  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});

$(document).on('mouseup', function(e) {
  isDragging = false;
});

// render -----------------------------------------------------------
render();
requestAnimFrame(render);


<script src = "http://mrdoob.github.com/three.js/build/three.min.js"> </script>
<script src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"> </script>
<script src = "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.3/dat.gui.min.js"> </script>

var objects = new Array(10);
for (var k = 0; k < 10; k++) {
  objects[k] = new THREE.Object3D();
  for (var i = 0; i < 20; i++) {
    var axis2 = new THREE.Vector3().fromArray(points[i]);
    var mesh = new THREE.Mesh(bufGeom, material);
    var transfoMatrix = reorient(axis1, axis2);
    mesh.matrix = transfoMatrix.multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), k * 36));
    mesh.matrixAutoUpdate = false;
    objects[k].add(mesh);
    var cone = new THREE.Mesh(coneGeom, coneMaterial);
    var B = getRotation(new THREE.Vector3(0, -h, 0), axis2);
    cone.matrix = B;
    cone.matrixAutoUpdate = false;
    objects[k].add(cone);
    objects[k].name = k.toString();
  }
}

var kk = 0;

function render() {
  var object = scene.getObjectByName(objects[kk].name);
  scene.add(objects[kk]);
  renderer.render(scene, camera);
  //object.rotation.x += dgcontrols.rotationSpeed;
  //object.rotation.y += dgcontrols.rotationSpeed;
  camera.position.z = dgcontrols.cameraz;
  kk += 1;
  if (kk == 10) {
    kk = 0;
  }
  scene.remove(object);
  requestAnimFrame(render);
}




//------------------------------------------------------------------------------
var A = 0.44;
var n = 3;
var uSteps = 149,
  vSteps = 149;
var pi = Math.PI;
var scale = 0.03;

var phi = (1 + Math.sqrt(5)) / 2;
var a = 1 / Math.sqrt(3);
var b = a / phi;
var c = a * phi;
var points = [
  [a, a, a],
  [a, a, -a],
  [a, -a, a],
  [-a, -a, a],
  [-a, a, -a],
  [-a, a, a],
  [0, b, -c],
  [0, -b, -c],
  [0, -b, c],
  [c, 0, -b],
  [-c, 0, -b],
  [-c, 0, b],
  [b, c, 0],
  [b, -c, 0],
  [-b, -c, 0],
  [-b, c, 0],
  [0, b, c],
  [a, -a, -a],
  [c, 0, b],
  [-a, -a, -a]
];

function reorient(axis1, axis2) {
  var vX1 = axis1.normalize();
  var vX2 = axis2.normalize();
  var vY = vX1.clone().cross(vX2).normalize();
  var vZ1 = vX1.clone().cross(vY).normalize();
  var vZ2 = vX2.clone().cross(vY).normalize();
  //var M1array = new Array(9);
  var M1array = [vX1.x, vX1.y, vX1.z, vY.x, vY.y, vY.z, vZ1.x, vZ1.y, vZ1.z];
  var M1 = new THREE.Matrix3();
  M1.fromArray(M1array);
  var M2array = [vX2.x, vY.x, vZ2.x, vX2.y, vY.y, vZ2.y, vX2.z, vY.z, vZ2.z];
  var M2 = new THREE.Matrix3();
  M2.fromArray(M2array);
  // console.log(M1); console.log(M2);
  var M = M1.clone().multiply(M2);
  var elems = M.elements;
  var A = new THREE.Matrix4();
  A.set(elems[0], elems[1], elems[2], axis2.x,
    elems[3], elems[4], elems[5], axis2.y,
    elems[6], elems[7], elems[8], axis2.z,
    0, 0, 0, 1);
  return A;
}

function getRotation(U, V) {
  var ma = U.length();
  var mb = V.length(); // should be = ma
  var d = U.x * V.x + U.y * V.y + U.z * V.z;
  var c = Math.sqrt(ma * mb + d);
  var ma2 = Math.sqrt(2) * ma;
  var r = 1 / ma2 / c;
  var W = U.clone().cross(V).multiplyScalar(r);
  var quat = new THREE.Quaternion().set(W.x, W.y, W.z, c / ma2);
  return new THREE.Matrix4().makeRotationFromQuaternion(quat);
}

// parameterization -------------------------------------------------
function f0(u, v, A, n) {
  // both u and v run from zero to one in Three.js
  var t = n * 2 * pi * u;
  var phi = 2 * pi * v;
  var h = pi / 2 - (pi / 2 - A) * Math.cos(t);
  var sinh = Math.sin(h);
  var p2 = sinh * Math.cos(t / n + A * Math.sin(2 * t));
  var p3 = sinh * Math.sin(t / n + A * Math.sin(2 * t));
  var p1 = Math.cos(h);
  var yden = Math.sqrt(2 * (1 + p1));
  var y1 = (1 + p1) / yden;
  var y2 = p2 / yden;
  var y3 = p3 / yden;
  var cosphi = Math.cos(phi);
  var sinphi = Math.sin(phi);
  var x3 = cosphi * y1;
  var x4 = sinphi * y1;
  var x2 = cosphi * y2 - sinphi * y3;
  var x1 = cosphi * y3 + sinphi * y2;
  return new THREE.Vector3(x1 / (1 - x4), x2 / (1 - x4), x3 / (1 - x4)).multiplyScalar(scale);
}

function g(A, n) {
  return function f(u, v, vector) {
    var out = f0(u, v, A, n);
    vector.set(out.x, out.y, out.z);
  }
}

// dat.gui controls -------------------------------------------------
var dgcontrols = new function() {
  this.rotationSpeed = 0.001;
  this.cameraz = 2.2;
}
var gui = new dat.GUI({
  autoplace: false,
  width: 300
});
gui.add(dgcontrols, 'cameraz').min(2.2).max(10).step(0.1).name("Camera position");
gui.add(dgcontrols, 'rotationSpeed').min(0).max(0.005).name("Rotation speed");

// three.js scene ---------------------------------------------------
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect, 1, 10000);
camera.position.z = 2.2;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var object = new THREE.Object3D();
var axis1 = new THREE.Vector3(0, 0, 1);
var bufGeom = new THREE.ParametricBufferGeometry(g(A, n), uSteps, vSteps);
var material = new THREE.MeshNormalMaterial({
  wireframe: false
});
var h = Math.sqrt(3 * a * a);
var coneGeom = new THREE.ConeBufferGeometry(0.04, h, 32).translate(0, -h / 2, 0);
var coneMaterial = new THREE.MeshNormalMaterial({
  wireframe: false
});
var objects = new Array(10);
for (var k = 0; k < 10; k++) {
  objects[k] = new THREE.Object3D();
  for (var i = 0; i < 20; i++) {
    var axis2 = new THREE.Vector3().fromArray(points[i]);
    var mesh = new THREE.Mesh(bufGeom, material);
    var transfoMatrix = reorient(axis1, axis2);
    mesh.matrix = transfoMatrix.multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), k * 36));
    mesh.matrixAutoUpdate = false;
    objects[k].add(mesh);
    var cone = new THREE.Mesh(coneGeom, coneMaterial);
    var B = getRotation(new THREE.Vector3(0, -h, 0), axis2);
    cone.matrix = B;
    cone.matrixAutoUpdate = false;
    objects[k].add(cone);
    objects[k].name = k.toString();
  }
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var kk = 0;

function render() {
  var object = scene.getObjectByName(objects[kk].name);
  scene.add(objects[kk]);
  renderer.render(scene, camera);
  //object.rotation.x += dgcontrols.rotationSpeed;
  //object.rotation.y += dgcontrols.rotationSpeed;
  camera.position.z = dgcontrols.cameraz;
  scene.remove(object);
  kk += 1;
  if (kk == 10) {
    kk = 0;
  }
  requestAnimFrame(render);
}

// dragging & animation  ------------------------------------------
var isDragging = false;
var previousMousePosition = {
  x: 0,
  y: 0
};

$(renderer.domElement).on('mousedown', function(e) {
  isDragging = true;
}).on('mousemove', function(e) {
  var deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  };
  if (isDragging) {
    var deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        Math.PI / 180 * (deltaMove.y * .5),
        Math.PI / 180 * (deltaMove.x * .5),
        0,
        'XYZ'
      ));
    object.quaternion.multiplyQuaternions(deltaRotationQuaternion,
      object.quaternion);
  }
  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});

$(document).on('mouseup', function(e) {
  isDragging = false;
});

// render -----------------------------------------------------------
render();
requestAnimFrame(render);


-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

var transfoMatrices = new Array(20);
var rotationMatrices = new Array(20);
for (var i = 0; i < 20; i++) {
  var axis2 = new THREE.Vector3().fromArray(points[i]);
  transfoMatrices[i] = reorient(axis1, axis2);
  rotationMatrices[i] = getRotation(new THREE.Vector3(0, -h, 0), axis2);
}
var tori = new Array(20);
var cones = new Array(20);
for (var i = 0; i < 20; i++) {
  tori[i] = new THREE.Mesh(bufGeom, material);
  object.add(tori[i]);
  var cone = new THREE.Mesh(coneGeom, coneMaterial);
  cone.matrix = rotationMatrices[i];
  cone.matrixAutoUpdate = false;
  object.add(cone);
}
scene.add(object);

// rendering function ------------------------------------------------------
var kk = 0;

function render() {
  object.rotation.x += dgcontrols.rotationSpeed;
  object.rotation.y += dgcontrols.rotationSpeed;
  for (var i = 0; i < 20; i++) {
    var transfoMatrix = new THREE.Matrix4()
      .makeRotationAxis(new THREE.Vector3(0, 0, 1), kk * 2 * pi / 180)
      .premultiply(transfoMatrices[i]);
    tori[i].matrix = transfoMatrix;
    tori[i].matrixAutoUpdate = false;
  }
  renderer.render(scene, camera);
  camera.position.z = dgcontrols.cameraz;
  kk += 1;
  if (kk == 180) {
    kk = 0;
  }
  requestAnimFrame(render);
}

////////////////////////////////////////////////////////////////////////////////
// vertices  -----------------------------------------------------------
var x = 1 + Math.sqrt(2);
var r = Math.sqrt(1 + 3 * x * x);
var vertices = [
  [-1.0, -x, -x, -x],
  [-1.0, -x, -x, x],
  [-1.0, -x, x, -x],
  [-1.0, -x, x, x],
  [-1.0, x, -x, -x],
  [-1.0, x, -x, x],
  [-1.0, x, x, -x],
  [-1.0, x, x, x],
  [1.0, -x, -x, -x],
  [1.0, -x, -x, x],
  [1.0, -x, x, -x],
  [1.0, -x, x, x],
  [1.0, x, -x, -x],
  [1.0, x, -x, x],
  [1.0, x, x, -x],
  [1.0, x, x, x],
  [-x, -1.0, -x, -x],
  [-x, -1.0, -x, x],
  [-x, -1.0, x, -x],
  [-x, -1.0, x, x],
  [-x, 1.0, -x, -x],
  [-x, 1.0, -x, x],
  [-x, 1.0, x, -x],
  [-x, 1.0, x, x],
  [x, -1.0, -x, -x],
  [x, -1.0, -x, x],
  [x, -1.0, x, -x],
  [x, -1.0, x, x],
  [x, 1.0, -x, -x],
  [x, 1.0, -x, x],
  [x, 1.0, x, -x],
  [x, 1.0, x, x],
  [-x, -x, -1.0, -x],
  [-x, -x, -1.0, x],
  [-x, -x, 1.0, -x],
  [-x, -x, 1.0, x],
  [-x, x, -1.0, -x],
  [-x, x, -1.0, x],
  [-x, x, 1.0, -x],
  [-x, x, 1.0, x],
  [x, -x, -1.0, -x],
  [x, -x, -1.0, x],
  [x, -x, 1.0, -x],
  [x, -x, 1.0, x],
  [x, x, -1.0, -x],
  [x, x, -1.0, x],
  [x, x, 1.0, -x],
  [x, x, 1.0, x],
  [-x, -x, -x, -1.0],
  [-x, -x, -x, 1.0],
  [-x, -x, x, -1.0],
  [-x, -x, x, 1.0],
  [-x, x, -x, -1.0],
  [-x, x, -x, 1.0],
  [-x, x, x, -1.0],
  [-x, x, x, 1.0],
  [x, -x, -x, -1.0],
  [x, -x, -x, 1.0],
  [x, -x, x, -1.0],
  [x, -x, x, 1.0],
  [x, x, -x, -1.0],
  [x, x, -x, 1.0],
  [x, x, x, -1.0],
  [x, x, x, 1.0]
];
// edges -------------------------------------------------------------------
var edges = [
  [0, 8],
  [0, 16],
  [0, 32],
  [0, 48],
  [1, 9],
  [1, 17],
  [1, 33],
  [1, 49],
  [2, 10],
  [2, 18],
  [2, 34],
  [2, 50],
  [3, 11],
  [3, 19],
  [3, 35],
  [3, 51],
  [4, 12],
  [4, 20],
  [4, 36],
  [4, 52],
  [5, 13],
  [5, 21],
  [5, 37],
  [5, 53],
  [6, 14],
  [6, 22],
  [6, 38],
  [6, 54],
  [7, 15],
  [7, 23],
  [7, 39],
  [7, 55],
  [8, 24],
  [8, 40],
  [8, 56],
  [9, 25],
  [9, 41],
  [9, 57],
  [10, 26],
  [10, 42],
  [10, 58],
  [11, 27],
  [11, 43],
  [11, 59],
  [12, 28],
  [12, 44],
  [12, 60],
  [13, 29],
  [13, 45],
  [13, 61],
  [14, 30],
  [14,
    46
  ],
  [14, 62],
  [15, 31],
  [15, 47],
  [15, 63],
  [16, 20],
  [16, 32],
  [16, 48],
  [17, 21],
  [17, 33],
  [17, 49],
  [18, 22],
  [18, 34],
  [18, 50],
  [19, 23],
  [19, 35],
  [19, 51],
  [20, 36],
  [20, 52],
  [21, 37],
  [21, 53],
  [22, 38],
  [22, 54],
  [23, 39],
  [23,
    55
  ],
  [24, 28],
  [24, 40],
  [24, 56],
  [25, 29],
  [25, 41],
  [25, 57],
  [26, 30],
  [26, 42],
  [26, 58],
  [27, 31],
  [27, 43],
  [27, 59],
  [28, 44],
  [28, 60],
  [29, 45],
  [29, 61],
  [30, 46],
  [30, 62],
  [31, 47],
  [31, 63],
  [32, 34],
  [32, 48],
  [33, 35],
  [33,
    49
  ],
  [34, 50],
  [35, 51],
  [36, 38],
  [36, 52],
  [37, 39],
  [37, 53],
  [38, 54],
  [39, 55],
  [40, 42],
  [40, 56],
  [41, 43],
  [41, 57],
  [42, 58],
  [43, 59],
  [44, 46],
  [44, 60],
  [45, 47],
  [45, 61],
  [46, 62],
  [47, 63],
  [48, 49],
  [50, 51],
  [52, 53],
  [54,
    55
  ],
  [56, 57],
  [58, 59],
  [60, 61],
  [62, 63]
];
// tetrahedra --------------------------------------------------------------
var tetrahedra = [
  [0, 16, 32, 48],
  [11, 27, 43, 59],
  [12, 28, 44, 60],
  [8, 24, 40, 56],
  [9, 25, 41, 57],
  [15, 31, 47, 63],
  [13, 29, 45, 61],
  [14, 30, 46, 62],
  [10, 26, 42, 58],
  [3, 19, 35, 51],
  [2, 18, 34, 50],
  [1, 17, 33, 49],
  [4, 20, 36, 52],
  [5, 21, 37, 53],
  [6, 22, 38, 54],
  [7, 23, 39, 55]
];


// basic cone mesh -------------------------------------------------------------
function Cmesh0(h, R, r, nstacks, nslices) {
  h = r <= R ? h : -h;
  var ratio = r <= R ? r / R : R / r;
  var k = (ratio - 1) / h;
  // grid ------------------------------------------------------------------
  nstacks = nstacks + 1;
  var u_ = new Array(nstacks);
  for (var i = 0; i < nstacks; i++) {
    u_[i] = h * i / (nstacks - 1);
  }
  var v_ = new Array(nslices);
  for (var i = 0; i < nslices; i++) {
    v_[i] = 2 * Math.PI * i / nslices;
  }
  // vertices & normals ----------------------------------------------------
  Rbig = Math.max(r, R);
  var vertices = new Array(nstacks * nslices);
  var normals = new Array(nstacks * nslices);
  for (var i = 0; i < nstacks; i++) {
    var g = 1 + k * u_[i];
    for (var j = 0; j < nslices; j++) {
      var cosv = Rbig * Math.cos(v_[j]);
      var sinv = Rbig * Math.sin(v_[j]);
      var v = new THREE.Vector3(
        g * cosv,
        g * sinv,
        r <= R ? u_[i] : u_[i] - h // if R<r, cone is upside down...!
      );
      vertices[i * nslices + j] = v;
      var t1 = new THREE.Vector3(
        k * cosv,
        k * sinv,
        1
      );
      var t2 = new THREE.Vector3(
        -v.y, v.x, 0
      )
      normals[i * nslices + j] = t1.cross(t2).normalize().negate();
    }
  }
  // mesh --------------------------------------------------------------------
  var geom = new THREE.Geometry();
  for (var i = 0; i < (nstacks - 1); i++) {
    for (var j = 0; j < nslices; j++) {
      var jp1 = j == nslices - 1 ? 0 : j + 1;
      geom.vertices.push(vertices[i * nslices + j]);
      geom.vertices.push(vertices[i * nslices + jp1]);
      geom.vertices.push(vertices[(i + 1) * nslices + j]);
      geom.faces.push(new THREE.Face3(
        6 * (i * nslices + j),
        6 * (i * nslices + j) + 1,
        6 * (i * nslices + j) + 2,
        [
          normals[i * nslices + j],
          normals[i * nslices + jp1],
          normals[(i + 1) * nslices + j]
        ]
      ));
      geom.vertices.push(vertices[(i + 1) * nslices + j]);
      geom.vertices.push(vertices[i * nslices + jp1]);
      geom.vertices.push(vertices[(i + 1) * nslices + jp1]);
      geom.faces.push(new THREE.Face3(
        6 * (i * nslices + j) + 3,
        6 * (i * nslices + j) + 4,
        6 * (i * nslices + j) + 5,
        [
          normals[(i + 1) * nslices + j],
          normals[i * nslices + jp1],
          normals[(i + 1) * nslices + jp1]
        ]
      ));
    }
  }
  var bufGeom = new THREE.BufferGeometry().fromGeometry(geom);
  var conemesh = new THREE.Mesh(bufGeom,
    new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide
    }));
  return conemesh;
}
// general cone mesh -----------------------------------------------------------------
function ConeMesh(cr1, r1, cr2, r2, nstacks, nslices) {
  if (r2 > r1) {
    return ConeMesh(cr2, r2, cr1, r1, nstacks, nslices);
  }
  var w0 = cr2.sub(cr1);
  var conemesh0 = Cmesh0(w0.length(), r1, r2, nstacks, nslices);
  var w = w0.normalize();
  var wx = w.x;
  var wy = w.y;
  var s = Math.sqrt(w.x * w.x + w.y * w.y);
  if (s == 0) {
    return conemesh0;
  }
  var u = new THREE.Vector3(wy / s, -wx / s, 0);
  var v = w.clone().cross(u);
  var m = new THREE.Matrix4().set(
    u.x, v.x, w.x, cr1.x,
    u.y, v.y, w.y, cr1.y,
    u.z, v.z, w.z, cr1.z,
    0, 0, 0, 1
  )
  conemesh0.matrix = m;
  conemesh0.matrixAutoUpdate = false;
  return conemesh0;
}

// rotation in 4D space
function rightIsoclinic(theta, phi, alpha, x) {
  var x0 = x[0],
    x1 = x[1],
    x2 = x[2],
    x3 = x[3];
  var q0 = Math.cos(alpha);
  var q1 = Math.sin(theta) * Math.cos(phi) * Math.sin(alpha);
  var q2 = Math.sin(theta) * Math.sin(phi) * Math.sin(alpha);
  var q3 = Math.cos(theta) * Math.sin(alpha);
  return [
    q0 * x0 - q1 * x1 - q2 * x2 - q3 * x3, q1 * x0 + q0 * x1 + q3 * x2 - q2 * x3, q2 * x0 - q3 * x1 + q0 * x2 + q1 * x3, q3 * x0 + q2 * x1 - q1 * x2 + q0 * x3
  ];
}
// stereographic projection
function stereo(x, r) {
  return [x[0] / (r - x[3]), x[1] / (r - x[3]), x[2] / (r - x[3])];
}

// 180 objects
var Objects = new Array(180);
for (var i = 0; i < 180; i++) {
  var points = vertices.map(function(vertex) {
    return stereo(rightIsoclinic(0, 0, 2 * i * Math.PI / 180, vertex), r)
  });
  if (i == 0) {
    console.log(points)
  };
  //
  var object = new THREE.Object3D();
  // vertices
  for (var j = 0; j < 64; j++) {
    var geoSphere = new THREE.SphereBufferGeometry(0.1, 16, 16);
    var sphere = new THREE.Mesh(geoSphere, new THREE.MeshNormalMaterial());
    sphere.position.set(points[j][0], points[j][1], points[j][2]);
    object.add(sphere);
  }
  // edges
  for (var j = 0; j < 128; j++) {
    var pt1 = points[edges[j][0]];
    var pt2 = points[edges[j][1]];
    var cr1 = new THREE.Vector3().fromArray(pt1);
    var cr2 = new THREE.Vector3().fromArray(pt2);
    var conemesh = ConeMesh(cr1, 0.07, cr2, 0.07, 3, 30);
    object.add(conemesh);
  }
  // tetrahedra
  for (var j = 0; j < 16; j++) {
    var geoTetrahedron = new THREE.Geometry();
    var indices = tetrahedra[j];
    geoTetrahedron.vertices.push(
      new THREE.Vector3().fromArray(points[indices[0]]),
      new THREE.Vector3().fromArray(points[indices[1]]),
      new THREE.Vector3().fromArray(points[indices[2]])
    );
    geoTetrahedron.faces.push(new THREE.Face3(0, 1, 2));
    geoTetrahedron.vertices.push(
      new THREE.Vector3().fromArray(points[indices[0]]),
      new THREE.Vector3().fromArray(points[indices[1]]),
      new THREE.Vector3().fromArray(points[indices[3]])
    );
    geoTetrahedron.faces.push(new THREE.Face3(3, 4, 5));
    geoTetrahedron.vertices.push(
      new THREE.Vector3().fromArray(points[indices[0]]),
      new THREE.Vector3().fromArray(points[indices[2]]),
      new THREE.Vector3().fromArray(points[indices[3]])
    );
    geoTetrahedron.faces.push(new THREE.Face3(6, 7, 8));
    geoTetrahedron.vertices.push(
      new THREE.Vector3().fromArray(points[indices[1]]),
      new THREE.Vector3().fromArray(points[indices[2]]),
      new THREE.Vector3().fromArray(points[indices[3]])
    );
    geoTetrahedron.faces.push(new THREE.Face3(9, 10, 11));
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    var tetrahedron = new THREE.Mesh(geoTetrahedron, material);
    object.add(tetrahedron)
  }
  //
  Objects[i] = object;
}

// three.js scene ---------------------------------------------------
var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect, 1, 10000);
camera.position.z = 5.5;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();
scene.add(camera);
// render function
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();
var k = 0;
function render() {
  var object = Objects[k];
  scene.add(object);
  renderer.render(scene, camera);
  scene.remove(object);
  k += 1;
  if (k == 180) {
    k = 0;
  }
  setTimeout(function() {
    requestAnimationFrame(render);
  }, 1000 / 25);
}

// dragging ----------------------------------------------------------------
var isDragging = false;
var previousMousePosition = {
  x: 0,
  y: 0
};
$(renderer.domElement).on('mousedown', function(e) {
  isDragging = true;
}).on('mousemove', function(e) {
  var deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  };
  if (isDragging) {
    var deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        Math.PI / 180 * (deltaMove.y * .5),
        Math.PI / 180 * (deltaMove.x * .5),
        0,
        'XYZ'
      ));
    for(var i=0; i<180; i++){
      Objects[i].quaternion.multiplyQuaternions(deltaRotationQuaternion,
        Objects[i].quaternion);
    }
  }
  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});
$(document).on('mouseup', function(e) {
  isDragging = false;
});

render();
