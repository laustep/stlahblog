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

var u = new THREE.Vector3(1,0,0);
var v = new THREE.Vector3(1,2,3).normalize();
var R = getRotation(u,v).transpose().elements;
console.log(R[0] * u.x + R[1] * u.y + R[2] * u.z);
console.log(R.w * u.x + R[5] * u.y + R[6] * u.z);
console.log(R[8] * u.x + R[9] * u.y + R[10] * u.z);

new THREE.Matrix4().set(
      1 - 2*q.z**2 - 2*q.w**2, 2*q.y*q.z - 2*q.w*q.x, 2*q.y*q.w + 2*q.z*q.x,
      2*q.y*q.z + 2*q.w*q.x, 1 - 2*q.y**2 - 2*q.w**2, 2*q.z*q.w - 2*q.y*q.x,
      2*q.y*q.w - 2*q.z*q.x, 2*q.z*q.w + 2*q.y*q.x, 1 - 2*q.y**2 - 2*q.z**2
)





var A = 0.44;
var n = 3;
var uSteps = 149, vSteps = 149;
var pi = Math.PI;
var scale = 0.03;
var phi = (1 + Math.sqrt(5)) / 2;
var a = 1 / Math.sqrt(3);
var b = a / phi;
var c = a * phi;
var points =
    [[a, a, a],
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
    [-a, -a, -a]];


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
var dgcontrols = new function () {
    this.rotationSpeed = 0.001;
    this.cameraz = 2.2;
}
var gui = new dat.GUI({ autoplace: false, width: 300 });
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
var material = new THREE.MeshNormalMaterial({ wireframe: false });
var h = Math.sqrt(3 * a * a);
var coneGeom = new THREE.ConeBufferGeometry(0.04, h, 32).translate(0, -h / 2, 0);
var coneMaterial = new THREE.MeshBasicMaterial({ color: 0x556b2f });
for (var i = 0; i < 20; i++) {
    var axis2 = new THREE.Vector3().fromArray(points[i]);
    addReorientedMesh(bufGeom, material, object, axis1, axis2);
}
scene.add(object);

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
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
var previousMousePosition = { x: 0, y: 0 };

$(renderer.domElement).on('mousedown', function (e) {
    isDragging = true;
}).on('mousemove', function (e) {
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

$(document).on('mouseup', function (e) {
    isDragging = false;
});

 // render -----------------------------------------------------------
render();
requestAnimFrame(render);


<script src="http://mrdoob.github.com/three.js/build/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.3/dat.gui.min.js"></script>