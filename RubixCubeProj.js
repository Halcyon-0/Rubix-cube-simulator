
const canvas = document.getElementById('id');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

gl.clearColor(0.1, 0.1, 0.3, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

let size = 0.1;
const frontFace = new Float32Array([
    size, size, size*1.3, size,-size, size*1.3, 
   -size, size, size*1.3,-size, size, size*1.3,
    size,-size, size*1.3,-size,-size, size*1.3,

]);
const fFBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, fFBuffer);
gl.bufferData(gl.ARRAY_BUFFER, frontFace, gl.STATIC_DRAW);

const backFace = new Float32Array([
    size, size,-size*1.3,-size, size,-size*1.3,
    size,-size,-size*1.3,-size,-size,-size*1.3,
   -size, size,-size*1.3, size,-size,-size*1.3,

]);
const bFBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bFBuffer);
gl.bufferData(gl.ARRAY_BUFFER, backFace, gl.STATIC_DRAW);

const rightFace = new Float32Array([
    size, size,-size,size,-size,-size,
    size, size, size,size, size, size,
    size,-size, size,size,-size,-size,

]);
const rFBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, rFBuffer);
gl.bufferData(gl.ARRAY_BUFFER, rightFace, gl.STATIC_DRAW);

const leftFace = new Float32Array([
    -size, size, size,-size,-size, size,
    -size, size,-size,-size, size,-size,
    -size,-size, size,-size,-size,-size,

]);
const lFBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, lFBuffer);
gl.bufferData(gl.ARRAY_BUFFER, leftFace, gl.STATIC_DRAW);

const topFace = new Float32Array([
    size, size, size, size, size,-size,
   -size, size, size,-size, size, size,
    size, size,-size,-size, size,-size,

]);
const tFBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, tFBuffer);
gl.bufferData(gl.ARRAY_BUFFER, topFace, gl.STATIC_DRAW);

const bottomFace = new Float32Array([
    size,-size, size, size,-size,-size,
   -size,-size, size,-size,-size, size,
    size,-size,-size,-size,-size,-size,

]);
const btFBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, btFBuffer);
gl.bufferData(gl.ARRAY_BUFFER, bottomFace, gl.STATIC_DRAW);


let r = 0.3;
var centerData = new Float32Array([
  
    r, r, r, r,-r, r,-r, r, r, 
   -r, r, r, r,-r, r,-r,-r, r,
    r, r,-r, r,-r,-r,-r, r,-r, 
   -r, r,-r, r,-r,-r,-r,-r,-r,
   -r, r, r,-r,-r, r,-r, r,-r,
   -r, r,-r,-r,-r, r,-r,-r,-r, 
    r, r, r, r,-r, r, r, r,-r,
    r, r,-r, r,-r, r, r,-r,-r,  
    r, r, r, r, r,-r,-r, r, r,
   -r, r, r, r, r,-r,-r, r,-r,
    r, r, r, r,-r,-r,-r,-r, r,
   -r,-r, r, r,-r,-r,-r,-r,-r,
        
]);
const centerBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
gl.bufferData(gl.ARRAY_BUFFER, centerData, gl.STATIC_DRAW);

const vsSource = `
   attribute vec3 pos;

    uniform vec3 tModel;
    uniform float angle1;
    uniform float angle2;

    uniform float theta;
    uniform float theta1;
    uniform float theta3;

    mat4 movingX(float angle1) {
        float c = cos(angle1);
        float s = sin(angle1); 
        return mat4(
            1, 0, 0, 0,
            0, c,-s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        );
    }

    mat4 movingY(float angle2) {
        float c = cos(angle2);
        float s = sin(angle2); 
        return mat4(
            c, 0,-s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        );
    }

    mat4 rotationY(float theta){
        float c = cos(theta);
        float s = sin(theta);
        return mat4(
            c, 0, -s, 0,
            0, 1,  0, 0,
            s, 0,  c, 0,
            0, 0,  0, 1
        );
    }

    mat4 rotationX(float theta1){
        float c = cos(theta1);
        float s = sin(theta1);
        return mat4(
            1, 0, 0, 0,
            0, c,-s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        );
    }

    mat4 rotationZ(float theta3){
        float c = cos(theta3);
        float s = sin(theta3);
        return mat4(
            c,-s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    void main(){
        mat4 moveX = movingX(angle1);
        mat4 moveY = movingY(angle2);

        mat4 rotateY = rotationY(theta);
        mat4 rotateX = rotationX(theta1); 
        mat4 rotateZ = rotationZ(theta3); 

        gl_Position = moveX * moveY * rotateX * rotateY * rotateZ *
                      vec4(pos.x + tModel.x, pos.y + tModel.y, pos.z + tModel.z, 1);
    }

`;
const vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vShader, vsSource);
gl.compileShader(vShader);

//Center
const cFsSource = `
    precision mediump float;

    void main(){

        gl_FragColor = vec4(0, 0, 0, 1.0); 
        
    }
`;
const cFShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(cFShader, cFsSource);
gl.compileShader(cFShader);

const program0 = gl.createProgram();
gl.attachShader(program0, vShader);
gl.attachShader(program0, cFShader);
gl.linkProgram(program0);

var angl1_P0 = gl.getUniformLocation(program0, 'angle1');
var angl2_P0 = gl.getUniformLocation(program0, 'angle2');

let degree1_P0 = 0;
let degree2_P0 = 0;

const posLocation0 = gl.getAttribLocation(program0, `pos`);

//-------------------------------------------------------------------------------------------------------------------------------------
//Front
const fFsSource = `
    precision mediump float;

    void main(){

        gl_FragColor = vec4(0.8, 0.1, 0.0, 1.0); 
        
    }
`;
const fFShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fFShader, fFsSource);
gl.compileShader(fFShader);

const program1 = gl.createProgram();
gl.attachShader(program1, vShader);
gl.attachShader(program1, fFShader);
gl.linkProgram(program1);

const transUni1 = gl.getUniformLocation(program1, `tModel`);
const frontBlocks = [
    {x:-0.23, y: 0.23, z:0.23, rotate: false, rotationAngle_C1_1: 0},{x:0.0, y: 0.23, z:0.23, rotate: false, rotationAngle_C2_1: 0},{x:0.23, y: 0.23, z:0.23, rotate: false, rotationAngle_C3_1: 0},
    {x:-0.23, y: 0.00, z:0.23, rotate: false, rotationAngle_C1_2: 0},{x:0.0, y: 0.00, z:0.23, rotate: false, rotationAngle_C2_2: 0},{x:0.23, y: 0.00, z:0.23, rotate: false, rotationAngle_C3_2: 0},
    {x:-0.23, y:-0.23, z:0.23, rotate: false, rotationAngle_C1_3: 0},{x:0.0, y:-0.23, z:0.23, rotate: false, rotationAngle_C2_3: 0},{x:0.23, y:-0.23, z:0.23, rotate: false, rotationAngle_C3_3: 0},
];

const moveHozF = gl.getUniformLocation(program1, `theta`);
const moveVerF = gl.getUniformLocation(program1, `theta1`);

const moveHVF = gl.getUniformLocation(program1, `theta3`);

let angleH1 = 0;
let angleV1 = 0;

let angleHVF = 0;

var angl1_P1 = gl.getUniformLocation(program1, 'angle1');
var angl2_P1 = gl.getUniformLocation(program1, 'angle2');

let degree1_P1 = 0;
let degree2_P1 = 0;


const posLocation1 = gl.getAttribLocation(program1, `pos`);

//----------------------------------------------------------------------------------------------------------------------------------------
//Back
const bFsSource = `
    precision mediump float;

    void main(){

        gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0); 
        
    }
`;
const bFShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(bFShader, bFsSource);
gl.compileShader(bFShader);

const program2 = gl.createProgram();
gl.attachShader(program2, vShader);
gl.attachShader(program2, bFShader);
gl.linkProgram(program2);

const transUni2 = gl.getUniformLocation(program2, `tModel`);
const backBlocks = [
   {x:-0.23, y: 0.23, z:-0.23, rotate: false },{x:0.0, y: 0.23, z:-0.23, rotate: false },{x:0.23, y: 0.23, z:-0.23, rotate: false },
   {x:-0.23, y: 0.00, z:-0.23, rotate: false },{x:0.0, y: 0.00, z:-0.23, rotate: false },{x:0.23, y: 0.00, z:-0.23, rotate: false },
   {x:-0.23, y:-0.23, z:-0.23, rotate: false },{x:0.0, y:-0.23, z:-0.23, rotate: false },{x:0.23, y:-0.23, z:-0.23, rotate: false },
];
const moveHozB = gl.getUniformLocation(program2, `theta`);
const moveVerB = gl.getUniformLocation(program2, `theta1`);

const moveHVB = gl.getUniformLocation(program2, `theta3`);

let angleH2 = 0;
let angleV2 = 0;

let angleHVB = 0;

var angl1_P2 = gl.getUniformLocation(program2, 'angle1');
var angl2_P2 = gl.getUniformLocation(program2, 'angle2');

let degree1_P2 = 0;
let degree2_P2 = 0;


const posLocation2 = gl.getAttribLocation(program2, `pos`);

//----------------------------------------------------------------------------------------------------------------------------------------
//Right
const rFsSource = `
    precision mediump float;

    void main(){

        gl_FragColor = vec4(0.9, 0.9, 0.1, 1.0); 
        
    }
`;
const rFShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(rFShader, rFsSource);
gl.compileShader(rFShader);

const program3 = gl.createProgram();
gl.attachShader(program3, vShader);
gl.attachShader(program3, rFShader);
gl.linkProgram(program3);

const transUni3 = gl.getUniformLocation(program3, `tModel`);
const rightBlocks = [
    {x:-0.46, y: 0.23, z:-0.23, rotate: false },{x:-0.46, y: 0.23, z:0.0, rotate: false },{x:-0.46, y: 0.23, z:0.23, rotate: false },
    {x:-0.46, y: 0.00, z:-0.23, rotate: false },{x:-0.46, y: 0.00, z:0.0, rotate: false },{x:-0.46, y: 0.00, z:0.23, rotate: false },
    {x:-0.46, y:-0.23, z:-0.23, rotate: false },{x:-0.46, y:-0.23, z:0.0, rotate: false },{x:-0.46, y:-0.23, z:0.23, rotate: false },
];
const moveHozR = gl.getUniformLocation(program3, `theta`);
const moveVerR = gl.getUniformLocation(program3, `theta1`);

let angleH3 = 0;
let angleV3 = 0;

const moveHVR = gl.getUniformLocation(program3, `theta3`);
let angleHVR = 0;

var angl1_P3 = gl.getUniformLocation(program3, 'angle1');
var angl2_P3 = gl.getUniformLocation(program3, 'angle2');

let degree1_P3 = 0;
let degree2_P3 = 0;


const posLocation3 = gl.getAttribLocation(program3, `pos`);

//----------------------------------------------------------------------------------------------------------------------------------------
//Left
const lFsSource = `
    precision mediump float;

    void main(){

        gl_FragColor = vec4(0.2, 0.6, 0.9, 1.0); 
        
    }
`;
const lFShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(lFShader, lFsSource);
gl.compileShader(lFShader);

const program4 = gl.createProgram();
gl.attachShader(program4, vShader);
gl.attachShader(program4, lFShader);
gl.linkProgram(program4);

const transUni4 = gl.getUniformLocation(program4, `tModel`);
const leftBlocks = [
    {x:0.46, y: 0.23, z:-0.23, rotate: false },{x:0.46, y: 0.23, z:0.0, rotate: false },{x:0.46, y: 0.23, z:0.23, rotate: false },
    {x:0.46, y: 0.00, z:-0.23, rotate: false },{x:0.46, y: 0.00, z:0.0, rotate: false },{x:0.46, y: 0.00, z:0.23, rotate: false },
    {x:0.46, y:-0.23, z:-0.23, rotate: false },{x:0.46, y:-0.23, z:0.0, rotate: false },{x:0.46, y:-0.23, z:0.23, rotate: false },
];
const moveHozL = gl.getUniformLocation(program4, `theta`);
const moveVerL = gl.getUniformLocation(program4, `theta1`);

let angleH4 = 0;
let angleV4 = 0;

const moveHVL = gl.getUniformLocation(program4, `theta3`);
let angleHVL = 0;

var angl1_P4 = gl.getUniformLocation(program4, 'angle1');
var angl2_P4 = gl.getUniformLocation(program4, 'angle2');

let degree1_P4 = 0;
let degree2_P4 = 0;


const posLocation4 = gl.getAttribLocation(program4, `pos`);

//----------------------------------------------------------------------------------------------------------------------------------------
//Top
const tFsSource = `
    precision mediump float;

    void main(){

    gl_FragColor = vec4(0.9, 0.4, 0., 1.0); 
        
    }
`;
const tFShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(tFShader, tFsSource);
gl.compileShader(tFShader);

const program5 = gl.createProgram();
gl.attachShader(program5, vShader);
gl.attachShader(program5, tFShader);
gl.linkProgram(program5);

const transUni5 = gl.getUniformLocation(program5, `tModel`);
const topBlocks = [
    {x: 0.23, y: 0.23, z:-0.23, rotate: false },{x: 0.23, y: 0.23, z:0.0, rotate: false },{x: 0.23, y: 0.23, z:0.23, rotate: false },
    {x: 0.00, y: 0.23, z:-0.23, rotate: false },{x: 0.00, y: 0.23, z:0.0, rotate: false },{x: 0.00, y: 0.23, z:0.23, rotate: false },
    {x:-0.23, y: 0.23, z:-0.23, rotate: false },{x:-0.23, y: 0.23, z:0.0, rotate: false },{x:-0.23, y: 0.23, z:0.23, rotate: false },
];
const moveHozT = gl.getUniformLocation(program5, `theta`);
const moveVerT = gl.getUniformLocation(program5, `theta1`);

let angleH5 = 0;
let angleV5 = 0;

const moveHVT = gl.getUniformLocation(program5, `theta3`);
let angleHVT = 0;

var angl1_P5 = gl.getUniformLocation(program5, 'angle1');
var angl2_P5 = gl.getUniformLocation(program5, 'angle2');

let degree1_P5 = 0;
let degree2_P5 = 0;


const posLocation5 = gl.getAttribLocation(program5, `pos`);

//----------------------------------------------------------------------------------------------------------------------------------------
//Bottom
const btFsSource = `
    precision mediump float;

    void main(){

    gl_FragColor = vec4(0.0, 0.9, 0.3, 1.0); 
        
    }
`;
const btFShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(btFShader, btFsSource);
gl.compileShader(btFShader);

const program6 = gl.createProgram();
gl.attachShader(program6, vShader);
gl.attachShader(program6, btFShader);
gl.linkProgram(program6);

const transUni6 = gl.getUniformLocation(program6, `tModel`);
const bottomBlocks = [
    {x: 0.23, y:-0.23, z:-0.23, rotate: false },{x: 0.23, y:-0.23, z:0.0, rotate: false },{x: 0.23, y:-0.23, z:0.23, rotate: false },
    {x: 0.00, y:-0.23, z:-0.23, rotate: false },{x: 0.00, y:-0.23, z:0.0, rotate: false },{x: 0.00, y:-0.23, z:0.23, rotate: false },
    {x:-0.23, y:-0.23, z:-0.23, rotate: false },{x:-0.23, y:-0.23, z:0.0, rotate: false },{x:-0.23, y:-0.23, z:0.23, rotate: false },
];
const moveHozBT = gl.getUniformLocation(program6, `theta`);
const moveVerBT = gl.getUniformLocation(program6, `theta1`);

let angleH6 = 0;
let angleV6 = 0;

const moveHVBT = gl.getUniformLocation(program6, `theta3`);
let angleHVBT = 0;

var angl1_P6 = gl.getUniformLocation(program6, 'angle1');
var angl2_P6 = gl.getUniformLocation(program6, 'angle2');

let degree1_P6 = 0;
let degree2_P6 = 0;


const posLocation6 = gl.getAttribLocation(program6, `pos`);


//----------------------------------------------------------------------------------------------------------------------------------------

let axisPlane = 0;
const shift = 0.01;
let enableRotate = true;


canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

function handleMouseDown() {
    enableRotate = true;
}

function handleMouseUp() {
    enableRotate = false;
}

function handleMouseMove(event) {
    if (enableRotate) {

        degree1_P0 += event.movementY * shift;
        degree2_P0 += event.movementX * shift;
        degree1_P1 += event.movementY * shift;
        degree2_P1 += event.movementX * shift;
        degree1_P2 += event.movementY * shift;
        degree2_P2 += event.movementX * shift;
        degree1_P3 += event.movementY * shift;
        degree2_P3 += event.movementX * shift;
        degree1_P4 += event.movementY * shift;
        degree2_P4 += event.movementX * shift;
        degree1_P5 += event.movementY * shift;
        degree2_P5 += event.movementX * shift;
        degree1_P6 += event.movementY * shift;
        degree2_P6 += event.movementX * shift;

        gl.useProgram(program0);
        gl.uniform1f(angl1_P0, degree1_P0);
        gl.uniform1f(angl2_P0, degree2_P0);

        gl.useProgram(program1);
        gl.uniform1f(angl1_P1, degree1_P1);
        gl.uniform1f(angl2_P1, degree2_P1);

        gl.useProgram(program2);
        gl.uniform1f(angl1_P2, degree1_P2);
        gl.uniform1f(angl2_P2, degree2_P2);

        gl.useProgram(program3);
        gl.uniform1f(angl1_P3, degree1_P3);
        gl.uniform1f(angl2_P3, degree2_P3);

        gl.useProgram(program4);
        gl.uniform1f(angl1_P4, degree1_P4);
        gl.uniform1f(angl2_P4, degree2_P4);

        gl.useProgram(program5);
        gl.uniform1f(angl1_P5, degree1_P5);
        gl.uniform1f(angl2_P5, degree2_P5);

        gl.useProgram(program6);
        gl.uniform1f(angl1_P6, degree1_P6);
        gl.uniform1f(angl2_P6, degree2_P6);

    }
}


let HozTop = false;
let HozBot = false;

let VerL = false;
let VerR = false;

let FlipFront = false;
let FlipBack = false;


draw();
function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    
    if (HozTop==true){
    angleH1 += 1.5800000000000012; 
    angleH2 += 1.5800000000000012; 
    angleH3 += 1.5800000000000012;
    angleH4 += 1.5800000000000012;
    HozTop = false;
    }
    if (HozBot==true){
    angleH1 += 1.5800000000000012;
    angleH2 += 1.5800000000000012;
    angleH3 += 1.5800000000000012;
    angleH4 += 1.5800000000000012;
    HozBot = false;
    }
    if (VerL==true){
    angleV1 += 1.5800000000000012; 
    angleV2 += 1.5800000000000012;
    angleV5 += 1.5800000000000012;
    angleV6 += 1.5800000000000012;
    VerL = false;
    }
    if (VerR==true){
    angleV1 += 1.5800000000000012;
    angleV2 += 1.5800000000000012;
    angleV5 += 1.5800000000000012;
    angleV6 += 1.5800000000000012; 
    VerR = false;
    }

    
    if (FlipFront==true){
    angleHVF += (1.5800000000000012*0);
    angleHVR += 1.5800000000000012;
    angleHVL += 1.5800000000000012;
    angleHVT += 1.5800000000000012;
    angleHVBT += 1.5800000000000012;
     FlipFront = false;
    }
    if (FlipBack==true){
    angleHVB += (1.5800000000000012*0);
    angleHVR += 1.5800000000000012;
    angleHVL += 1.5800000000000012;
    angleHVT += 1.5800000000000012;
    angleHVBT += 1.5800000000000012;
     FlipBack = false;
    }


    gl.useProgram(program0);
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.enableVertexAttribArray(posLocation0);
    gl.vertexAttribPointer(posLocation0, 3, gl.FLOAT, false, 0, 0);

   // gl.drawArrays(gl.TRIANGLES, 0, centerData.length / 3);

    gl.useProgram(program1);
    gl.bindBuffer(gl.ARRAY_BUFFER, fFBuffer);
    gl.enableVertexAttribArray(posLocation1);
    gl.vertexAttribPointer(posLocation1, 3, gl.FLOAT, false, 0, 0);
    frontBlocks.forEach(box => {
        if(axisPlane==1){
            if (box.rotate) {
                gl.uniform1f(moveHozF, angleH1);
            } else {
                gl.uniform1f(moveHozF, 0);
            }
        }
        if(axisPlane==2){
            if (box.rotate) {
                gl.uniform1f(moveVerF, angleV1);
            } else {
                gl.uniform1f(moveVerF, 0);
            }
       }
       if(axisPlane==3){
            if (box.rotate) {
                gl.uniform1f(moveHVF, angleHVF);
            } else {
                gl.uniform1f(moveHVF, 0);
            }
       }
        gl.uniform3f(transUni1, box.x, box.y, box.z);   
        gl.drawArrays(gl.TRIANGLES, 0, frontFace.length / 3);
    });

    gl.useProgram(program2);
    gl.bindBuffer(gl.ARRAY_BUFFER, bFBuffer);
    gl.enableVertexAttribArray(posLocation2);
    gl.vertexAttribPointer(posLocation2, 3, gl.FLOAT, false, 0, 0);
    backBlocks.forEach(box => {
        if(axisPlane==1){
            if (box.rotate) {
                gl.uniform1f(moveHozB, angleH2);
            } else {
                gl.uniform1f(moveHozB, 0);
            }
        }
        if(axisPlane==2){
            if (box.rotate) {
                gl.uniform1f(moveVerB, angleV2);
            } else {
                gl.uniform1f(moveVerB, 0);
            }
       }
       if(axisPlane==3){
            if (box.rotate) {
                gl.uniform1f(moveHVB, angleHVB);
            } else {
                gl.uniform1f(moveHVB, 0);
            }
       }
        gl.uniform3f(transUni2, box.x, box.y, box.z);   
        gl.drawArrays(gl.TRIANGLES, 0, backFace.length / 3);
    });   

    gl.useProgram(program3);
    gl.bindBuffer(gl.ARRAY_BUFFER, rFBuffer);
    gl.enableVertexAttribArray(posLocation3);
    gl.vertexAttribPointer(posLocation3, 3, gl.FLOAT, false, 0, 0);
    rightBlocks.forEach(box => {
        if(axisPlane==1){
            if (box.rotate) {
                gl.uniform1f(moveHozR, angleH3);
            } else {
                gl.uniform1f(moveHozR, 0);
            }
        }
        if(axisPlane==2){
            if (box.rotate) {
                gl.uniform1f(moveVerR, angleV3);
            } else {
                gl.uniform1f(moveVerR, 0);
            }
       }
       if(axisPlane==3){
            if (box.rotate) {
                gl.uniform1f(moveHVR, angleHVR);
            } else {
                gl.uniform1f(moveHVR, 0);
            }
       }
        gl.uniform3f(transUni3, box.x, box.y, box.z);   
        gl.drawArrays(gl.TRIANGLES, 0, rightFace.length / 3);
    });

    gl.useProgram(program4);
    gl.bindBuffer(gl.ARRAY_BUFFER, lFBuffer);
    gl.enableVertexAttribArray(posLocation4);
    gl.vertexAttribPointer(posLocation4, 3, gl.FLOAT, false, 0, 0);
    leftBlocks.forEach(box => {
        if(axisPlane==1){
            if (box.rotate) {
                gl.uniform1f(moveHozL, angleH4);
            } else {
                gl.uniform1f(moveHozL, 0);
            }
        }
        if(axisPlane==2){
            if (box.rotate) {
                gl.uniform1f(moveVerL, angleV4);
            } else {
                gl.uniform1f(moveVerL, 0);
            }
       }
       if(axisPlane==3){
            if (box.rotate) {
                gl.uniform1f(moveHVL, angleHVL);
            } else {
                gl.uniform1f(moveHVL, 0);
            }
       }
        gl.uniform3f(transUni4, box.x, box.y, box.z);   
        gl.drawArrays(gl.TRIANGLES, 0, leftFace.length / 3);
    });

    gl.useProgram(program5);
    gl.bindBuffer(gl.ARRAY_BUFFER, tFBuffer);
    gl.enableVertexAttribArray(posLocation5);
    gl.vertexAttribPointer(posLocation5, 3, gl.FLOAT, false, 0, 0);
    topBlocks.forEach(box => {
        if(axisPlane==2){
            if (box.rotate) {
                gl.uniform1f(moveVerT, angleV5);
            } else {
                gl.uniform1f(moveVerT, 0);
            }
       }
       if(axisPlane==3){
            if (box.rotate) {
                gl.uniform1f(moveHVT, angleHVT);
            } else {
                gl.uniform1f(moveHVT, 0);
            }
       }
        gl.uniform3f(transUni5, box.x, box.y, box.z);   
        gl.drawArrays(gl.TRIANGLES, 0, topFace.length / 3);
    });

    gl.useProgram(program6);
    gl.bindBuffer(gl.ARRAY_BUFFER, btFBuffer);
    gl.enableVertexAttribArray(posLocation6);
    gl.vertexAttribPointer(posLocation6, 3, gl.FLOAT, false, 0, 0);
    bottomBlocks.forEach(box => {
        if(axisPlane==3){
            if (box.rotate) {
                gl.uniform1f(moveHVBT, angleHVBT);
            } else {
                gl.uniform1f(moveHVBT, 0);
            }
       }
        if(axisPlane==2){
            if (box.rotate) {
                gl.uniform1f(moveVerBT, angleV6);
            } else {
                gl.uniform1f(moveVerBT, 0);
            }
       }
        gl.uniform3f(transUni6, box.x, box.y, box.z);   
        gl.drawArrays(gl.TRIANGLES, 0, bottomFace.length / 3);
    });




    requestAnimationFrame(draw);
}


var btn1 = document.querySelector(`#btn1`);
btn1.addEventListener('click', () => {
    axisPlane = 1;
    HozTop = true

    frontBlocks[2].rotate = true;
    frontBlocks[0].rotate = true;
    frontBlocks[1].rotate = true;
    frontBlocks[6].rotate = false;
    frontBlocks[7].rotate = false;
    frontBlocks[8].rotate = false;

    backBlocks[2].rotate = true;
    backBlocks[0].rotate = true;
    backBlocks[1].rotate = true;
    backBlocks[6].rotate = false;
    backBlocks[7].rotate = false;
    backBlocks[8].rotate = false;

    rightBlocks[2].rotate = true;
    rightBlocks[0].rotate = true;
    rightBlocks[1].rotate = true;
    rightBlocks[6].rotate = false;
    rightBlocks[7].rotate = false;
    rightBlocks[8].rotate = false;

    leftBlocks[2].rotate = true;
    leftBlocks[0].rotate = true;
    leftBlocks[1].rotate = true;
    leftBlocks[6].rotate = false;
    leftBlocks[7].rotate = false;
    leftBlocks[8].rotate = false;




});

var btn2 = document.querySelector(`#btn2`);
btn2.addEventListener('click', () => {
    axisPlane = 1;
    HozBot = true;

    frontBlocks[6].rotate = true;
    frontBlocks[7].rotate = true;
    frontBlocks[8].rotate = true;
    frontBlocks[2].rotate = false;
    frontBlocks[0].rotate = false;
    frontBlocks[1].rotate = false;

    backBlocks[6].rotate = true;
    backBlocks[7].rotate = true;
    backBlocks[8].rotate = true;
    backBlocks[2].rotate = false;
    backBlocks[0].rotate = false;
    backBlocks[1].rotate = false;

    rightBlocks[6].rotate = true;
    rightBlocks[7].rotate = true;
    rightBlocks[8].rotate = true;
    rightBlocks[2].rotate = false;
    rightBlocks[0].rotate = false;
    rightBlocks[1].rotate = false;

    leftBlocks[6].rotate = true;
    leftBlocks[7].rotate = true;
    leftBlocks[8].rotate = true;
    leftBlocks[2].rotate = false;
    leftBlocks[0].rotate = false;
    leftBlocks[1].rotate = false;

});

var btn3 = document.querySelector(`#btn3`);
btn3.addEventListener('click', () => {
    axisPlane = 2;
    VerL = true;

    frontBlocks[2].rotate = true;
    frontBlocks[5].rotate = true;
    frontBlocks[8].rotate = true;
    frontBlocks[0].rotate = false;
    frontBlocks[3].rotate = false;
    frontBlocks[6].rotate = false;

    backBlocks[2].rotate = true;
    backBlocks[5].rotate = true;
    backBlocks[8].rotate = true;
    backBlocks[0].rotate = false;
    backBlocks[3].rotate = false;
    backBlocks[6].rotate = false;

    topBlocks[0].rotate = true;
    topBlocks[1].rotate = true;
    topBlocks[2].rotate = true;
    topBlocks[6].rotate = false;
    topBlocks[7].rotate = false;
    topBlocks[8].rotate = false;

    bottomBlocks[0].rotate = true;
    bottomBlocks[1].rotate = true;
    bottomBlocks[2].rotate = true;
    bottomBlocks[6].rotate = false;
    bottomBlocks[7].rotate = false;
    bottomBlocks[8].rotate = false;    

});

var btn4 = document.querySelector(`#btn4`);
btn4.addEventListener('click', () => {
    axisPlane = 2;
    VerR = true;

    frontBlocks[0].rotate = true;
    frontBlocks[3].rotate = true;
    frontBlocks[6].rotate = true;
    frontBlocks[2].rotate = false;
    frontBlocks[5].rotate = false;
    frontBlocks[8].rotate = false;

    backBlocks[0].rotate = true;
    backBlocks[3].rotate = true;
    backBlocks[6].rotate = true;
    backBlocks[2].rotate = false;
    backBlocks[5].rotate = false;
    backBlocks[8].rotate = false;

    topBlocks[6].rotate = true;
    topBlocks[7].rotate = true;
    topBlocks[8].rotate = true;
    topBlocks[0].rotate = false;
    topBlocks[1].rotate = false;
    topBlocks[2].rotate = false;

    bottomBlocks[6].rotate = true;
    bottomBlocks[7].rotate = true;
    bottomBlocks[8].rotate = true;
    bottomBlocks[0].rotate = false;
    bottomBlocks[1].rotate = false;
    bottomBlocks[2].rotate = false;
   
});

var btn5 = document.querySelector(`#btn5`);
btn5.addEventListener('click', () => {
    axisPlane = 3;
    FlipFront = true;

    frontBlocks.forEach(box => {
        box.rotate = true;
    });
    rightBlocks[2].rotate = true;
    rightBlocks[5].rotate = true;
    rightBlocks[8].rotate = true;

    leftBlocks[2].rotate = true;
    leftBlocks[5].rotate = true;
    leftBlocks[8].rotate = true;

    topBlocks[2].rotate = true;
    topBlocks[5].rotate = true;
    topBlocks[8].rotate = true;

    bottomBlocks[2].rotate = true;
    bottomBlocks[5].rotate = true;
    bottomBlocks[8].rotate = true;

    rightBlocks[0].rotate = false;
    rightBlocks[3].rotate = false;
    rightBlocks[6].rotate = false;
    leftBlocks[0].rotate = false;
    leftBlocks[3].rotate = false;
    leftBlocks[6].rotate = false;
    topBlocks[0].rotate = false;
    topBlocks[3].rotate = false;
    topBlocks[6].rotate = false;
    bottomBlocks[0].rotate = false;
    bottomBlocks[3].rotate = false;
    bottomBlocks[6].rotate = false;

});

var btn6 = document.querySelector(`#btn6`);
btn6.addEventListener('click', () => {
    axisPlane = 3;
    FlipBack = true;

    backBlocks.forEach(box => {
        box.rotate = true;
    });

    rightBlocks[0].rotate = true;
    rightBlocks[3].rotate = true;
    rightBlocks[6].rotate = true;

    leftBlocks[0].rotate = true;
    leftBlocks[3].rotate = true;
    leftBlocks[6].rotate = true;

    topBlocks[0].rotate = true;
    topBlocks[3].rotate = true;
    topBlocks[6].rotate = true;

    bottomBlocks[0].rotate = true;
    bottomBlocks[3].rotate = true;
    bottomBlocks[6].rotate = true;

    rightBlocks[2].rotate = false;
    rightBlocks[5].rotate = false;
    rightBlocks[8].rotate = false;
    leftBlocks[2].rotate = false;
    leftBlocks[5].rotate = false;
    leftBlocks[8].rotate = false;
    topBlocks[2].rotate = false;
    topBlocks[5].rotate = false;
    topBlocks[8].rotate = false;
    bottomBlocks[2].rotate = false;
    bottomBlocks[5].rotate = false;
    bottomBlocks[8].rotate = false;

});
