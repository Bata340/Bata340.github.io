import './gl-matrix/gl-matrix-min.js';
import Esfera from './Primitivas/Esfera.js';
import Estacion from './PartesEstacion/Estacion.js';
import * as dat from '../node_modules/dat.gui/build/dat.gui.module.js';
import Capsula from './PartesEstacion/Capsula.js';
import Camara from './Camara.js';
import Plano from './Primitivas/Plano.js';

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;

var params = {
    cantidadPaneles:1, 
    anguloPaneles:0, 
    cantidadModulosEnAro: 4, 
    velocidadRotacionAro:0.02, 
    ReiniciarEstacion: reinitWebGL, 
    setAnguloPaneles: setAnguloPaneles, 
    setVelocidadRotacionAro: setVelocidadRotacionAro
};

var gui = new dat.GUI();
gui.add(params, "cantidadPaneles",1,10).step(1);
gui.add(params, "anguloPaneles",0,Math.PI*2).step(0.05);
gui.add(params, "cantidadModulosEnAro",2,8,).step(1);
gui.add(params,'setAnguloPaneles');
gui.add(params, "velocidadRotacionAro",0, 0.2).step(0.01);  
gui.add(params, 'setVelocidadRotacionAro');
gui.add(params,'ReiniciarEstacion');

function setAnguloPaneles(){
    objects[1].setRotacionPaneles(params.anguloPaneles);
}

function setVelocidadRotacionAro(){
    objects[1].setVelocidadRotacionAro(params.velocidadRotacionAro);
}


var objects = [];
let camara = null;
let matrizCamara = null;
let requiredAnimFrame = null;
let textureReflect = null;
let imageReflect = null;

var gl = null,
    canvas = null,
    glProgram = null,
    fragmentShader = null,
    vertexShader = null;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();

let glContainerObj = null;

class glContainer{
    constructor(gl){
        this.gl = gl;
        this.glProgram = null;
    }

    getGL(){
        return this.gl;
    }

    getGLProgram(){
        return this.glProgram;
    }

    setGL(gl){
        this.gl = gl;
    }

    setGLProgram(glProgram){
        this.glProgram = glProgram;
    }
}          

function reinitWebGL(){
    if (requiredAnimFrame != null){
        window.cancelAnimationFrame(requiredAnimFrame);
    }
    pushObjects(glContainerObj);
    setupBuffers();
    setupVertexShaderMatrix();
    tick();   
}

function pushObjects(glContainer){
    objects = [];

    let capsula = new Capsula(glContainer);
    capsula.setPosicion(-10,0,0);
    capsula.setEscala(0.5, 0.5, 0.5);
    capsula.setShininess(0.5);
    objects.push(capsula);

    let estacionEspacial = new Estacion(params.cantidadPaneles,params.anguloPaneles,params.velocidadRotacionAro, params.cantidadModulosEnAro, glContainer);
    estacionEspacial.setPosicion(0,0,0);
    estacionEspacial.setRotacion(0,0,0,0);
    estacionEspacial.setRotacionFinal(0,0,0,0);
    estacionEspacial.setShininess(0.5);
    objects.push(estacionEspacial);


    let mundoSimulado = new Esfera(25, 1, glContainer);
    mundoSimulado.setPosicion(0,0,-40);
    mundoSimulado.setRotacionFinal(1,0,-1,Math.PI/4);
    mundoSimulado.initTextures('/models/tierra_redim.jpg');
    mundoSimulado.setShininess(0);
    objects.push(mundoSimulado);

    let luna = new Esfera(5, 1, glContainer);
    luna.setPosicion(30, 0, 0);
    luna.setRotacionFinal(0,0,1,Math.PI/4);
    luna.initTextures('/models/luna.jpg');
    luna.setShininess(0);
    objects.push(luna);


    let sol = new Plano(25, 25, glContainer);
    sol.setPosicion(-25, 0, 0);
    sol.initTextures('/models/sun.jpg');
    sol.setRotacionFinal(0,0,1,Math.PI/2);
    sol.setShininess(1000);
    objects.push(sol);

    camara = new Camara(capsula, estacionEspacial.getPosActual(), estacionEspacial.getPosPaneles());
}

    
function initWebGL(){

    canvas = document.getElementById("my-canvas");  
    let gl_temp;
    glContainerObj = new glContainer();
    

    try{
        gl_temp = canvas.getContext("webgl");   
    }catch(e){
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

    glContainerObj.setGL(gl_temp);
    gl = glContainerObj.getGL();   

    if(gl) {

        setupWebGL();
        initShaders();
        pushObjects(glContainerObj);
        setupBuffers();
        setupVertexShaderMatrix();
        tick();   

    }else{    
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

}

function setupWebGL(){
    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);     
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, 100.0);
                
    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix,modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -5.0]);
}

function initShaders() {
    //get shader source
    var fs_source = document.getElementById('shader-fs').innerHTML,
        vs_source = document.getElementById('shader-vs').innerHTML;

    //compile shaders    
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
    
    //create program
    glProgram = gl.createProgram();
    glContainerObj.setGLProgram(glProgram);
    
    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }
    
    //use program
    gl.useProgram(glProgram);
}

function makeShader(src, type){
    //compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    initReflectionTexture('/models/earth_refmap_cut.jpg');

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function setupVertexShaderMatrix(){
    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

function setupBuffers(){
    //Aplicar transformaciones de cámara basado en la matriz actual de cámara y sus parámetros de traslación y rotación
    
    objects.forEach(function(object){
        object.dibujar();
        object.generateBuffers(glContainerObj);
    });
}

function loadTexture(){
    let gl = glContainerObj.getGL();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initReflectionTexture(src){
    let gl = glContainerObj.getGL();
    textureReflect = gl.createTexture();
    if (!textureReflect){
        console.log("ERROR: Not able to create texture.");
    }
    imageReflect = new Image();
    if (!imageReflect){
        console.log("ERROR: Not able to create image.");
    }
    imageReflect.src = src;
    imageReflect.glContainer = glContainerObj;
    imageReflect.texture = textureReflect;
    imageReflect.onload = loadTexture;
}

function calculateLightsElements(){
    gl = glContainerObj.getGL();
    glProgram = glContainerObj.getGLProgram();
    
    //SunLight
    let posicionSol = objects[4].getPosActual();
    gl.uniformMatrix4fv(gl.getUniformLocation(glProgram, "viewMatrix"), false, matrizCamara);

    gl.uniform1f (gl.getUniformLocation(glProgram, "SunIntensityA"), 0.2);
    gl.uniform1f (gl.getUniformLocation(glProgram, "SunIntensityD"), 1);
    gl.uniform1f (gl.getUniformLocation(glProgram, "SunIntensityS"), 0.25);
    gl.uniform4fv(gl.getUniformLocation(glProgram, "SunLightPositionWorld"), posicionSol);

    let posicionTierra = objects[2].getPosActual();
    gl.uniform1i(gl.getUniformLocation(glProgram, "reflectionSampler"), 1);
    gl.activeTexture(gl.TEXTURE0 + 1); // Texture unit 1
    gl.bindTexture(gl.TEXTURE_2D, textureReflect);
    gl.uniform1f (gl.getUniformLocation(glProgram, "EarthIntensityS"), 0.55);
    gl.uniform3fv(gl.getUniformLocation(glProgram, "earthLightDir"), vec3.fromValues(0,0,-1));
    gl.uniform4fv(gl.getUniformLocation(glProgram, "EarthLightPositionWorld"), posicionTierra);

    let posicionRojo = objects[0].getPosLuzRoja();
    gl.uniform1f (gl.getUniformLocation(glProgram, "RedIntensityA"), 0);
    gl.uniform1f (gl.getUniformLocation(glProgram, "RedIntensityD"), 0.75);
    gl.uniform1f (gl.getUniformLocation(glProgram, "RedIntensityS"), 0.5);
    gl.uniform4fv(gl.getUniformLocation(glProgram, "RedLightPositionWorld"), posicionRojo);

    let posicionVerde = objects[0].getPosLuzVerde();
    
    gl.uniform1f (gl.getUniformLocation(glProgram, "GreenIntensityA"), 0);
    gl.uniform1f (gl.getUniformLocation(glProgram, "GreenIntensityD"), 0.75);
    gl.uniform1f (gl.getUniformLocation(glProgram, "GreenIntensityS"), 0.5);
    gl.uniform4fv(gl.getUniformLocation(glProgram, "GreenLightPositionWorld"), posicionVerde);


    let posicionSpot = objects[0].getPosActualSpot();
    let direccionSpot = objects[0].getDireccionSpot();
    //gl.uniform4fv (gl.getUniformLocation(glProgram, "Spot.position"), posicionCapsula);
    gl.uniform4fv (gl.getUniformLocation(glProgram, "Spot.position"), vec4.fromValues(posicionSpot[0], posicionSpot[1], posicionSpot[2],1));
    gl.uniform1f (gl.getUniformLocation(glProgram, "Spot.intensityA"), 0.0);
    gl.uniform1f (gl.getUniformLocation(glProgram, "Spot.intensityD"), 1.0);
    gl.uniform1f (gl.getUniformLocation(glProgram, "Spot.intensityS"), 0.25);
    gl.uniform3fv (gl.getUniformLocation(glProgram, "Spot.direction"), vec3.fromValues(direccionSpot[0], direccionSpot[1], direccionSpot[2]));
    gl.uniform1f (gl.getUniformLocation(glProgram, "Spot.exponent"), 0.25);
    gl.uniform1f (gl.getUniformLocation(glProgram, "Spot.cutoff"), 30);
}

function sunLuminosity(){
    gl = glContainerObj.getGL();
    glProgram = glContainerObj.getGLProgram();

    gl.uniform1f (gl.getUniformLocation(glProgram, "SunIntensityA"), 1);
    gl.uniform1f (gl.getUniformLocation(glProgram, "SunIntensityD"), 0);
    gl.uniform1f (gl.getUniformLocation(glProgram, "SunIntensityS"), 0);
}

function tick(){
    //Request Browser Frame
    requiredAnimFrame = requestAnimationFrame(tick);

    //Set background color to black
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.clearColor(0, 0, 0, 1);

    //
    matrizCamara = camara.getCameraMatrix();
    
    

    //Draw elements
    drawScene();
}

function drawScene(){
    setupVertexShaderMatrix();
    objects.forEach(function(object, index){

        gl.uniformMatrix4fv(gl.getUniformLocation(glProgram, "viewMatrix"), false, matrizCamara);
        let cameraPos = vec4.fromValues(0,0,0,1);
        vec4.transformMat4(cameraPos, cameraPos, matrizCamara);
        gl.uniform3fv(gl.getUniformLocation(glProgram, "cameraPos"), vec3.fromValues(cameraPos[0]/cameraPos[3], cameraPos[1]/cameraPos[3], cameraPos[2]/cameraPos[3]));
        
        if (index === 4){
            sunLuminosity();
        }else{
            calculateLightsElements();
        }
        let normalSpotMatrix = mat4.create();
        mat4.invert(normalSpotMatrix, matrizCamara);
        mat4.transpose(normalSpotMatrix, normalSpotMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(glProgram, "normalSpotMatrix"), false, normalSpotMatrix);
        object.animate(glContainerObj, mat4.create());
        
    })
    
}


window.onload=initWebGL;

//HANDLE DE PRESION DE TECLAS

//ASDW para desplazarlaen el plano XZ
//QE para desplazarla en el eje Y
//JL para controlar el angulo de “guiñada”
//IK para controlar el angulo de “cabezeo”
//UO para controlar el angulo de "alabeo"
let DELTA_TRASLACION=0.05;        // velocidad de traslacion 
let DELTA_ROTACION=0.02;         // velocidad de rotacion

document.addEventListener('keydown', (event) => {
    var capsula = objects[0];
    if (event.code == 'Digit1'){
        camara.setCamera(1);
    }
    if (event.code == 'Digit2'){
        camara.setCamera(2);
    }
    if (event.code == 'Digit3'){
        camara.setCamera(3);
    }
    if (event.code=='KeyZ'){
        camara.alejar();
    }
    if (event.code=='KeyX'){
        camara.acercar();
    }
    if (event.code == 'KeyA'){
        capsula.sumVelZ(DELTA_TRASLACION);
    }
    if (event.code == 'KeyS'){
        capsula.sumVelX(-DELTA_TRASLACION);
    }
    if (event.code == 'KeyD'){
        capsula.sumVelZ(-DELTA_TRASLACION);
    }
    if (event.code == 'KeyW'){
        capsula.sumVelX(DELTA_TRASLACION);
    }
    if (event.code == 'KeyQ'){
        capsula.sumVelY(-DELTA_TRASLACION);
    }
    if (event.code == 'KeyE'){
        capsula.sumVelY(DELTA_TRASLACION);
    }
    if (event.code == 'KeyJ'){
        capsula.sumGuin(DELTA_ROTACION);
    }
    if (event.code == 'KeyL'){
        capsula.sumGuin(-DELTA_ROTACION);
    }
    if (event.code == 'KeyI'){
        capsula.sumCabeceo(DELTA_ROTACION);
    }
    if (event.code == 'KeyK'){
        capsula.sumCabeceo(-DELTA_ROTACION);
    }
    if (event.code == 'KeyO'){
        capsula.sumAlabeo(DELTA_ROTACION);
    }
    if (event.code == 'KeyU'){
        capsula.sumAlabeo(-DELTA_ROTACION);
    }
}, false);

document.addEventListener('keyup', (event) => {
    var capsula = objects[0];
    if (event.code == 'KeyA'){
        capsula.sumVelZ(0);
    }
    if (event.code == 'KeyS'){
        capsula.sumVelX(0);
    }
    if (event.code == 'KeyD'){
        capsula.sumVelZ(0);
    }
    if (event.code == 'KeyW'){
        capsula.sumVelX(0);
    }
    if (event.code == 'KeyQ'){
        capsula.sumVelY(0);
    }
    if (event.code == 'KeyE'){
        capsula.sumVelY(0);
    }
    if (event.code == 'KeyJ'){
        capsula.sumGuin(0);
    }
    if (event.code == 'KeyL'){
        capsula.sumGuin(0);
    }
    if (event.code == 'KeyI'){
        capsula.sumCabeceo(0);
    }
    if (event.code == 'KeyK'){
        capsula.sumCabeceo(0);
    }
    if (event.code == 'KeyU'){
        capsula.sumAlabeo(0);
    }
    if (event.code == 'KeyO'){
        capsula.sumAlabeo(0);
    }
});


//HANDLE DE MOUSE
let mouseClick = false;
let oldX = 0;
let oldY = 0;
let velRot = 0.05;

let downListener = () => {
    mouseClick = true;
  }
document.addEventListener('mousedown', downListener)

let moveListener = (e) => {
    
    if (mouseClick) {
      if (e.pageX > oldX){
        camara.sumGiroGuin(velRot);
      }
      else if(e.pageX < oldX){
        camara.sumGiroGuin(-velRot);
      }
      if(e.pageY > oldY){
        camara.sumGiroCab(velRot);
      }
      else if(e.pageY < oldY){
        camara.sumGiroCab(-velRot);
      }
    }
    oldX = e.pageX;
    oldY = e.pageY;
  }
document.addEventListener('mousemove', moveListener)

let upListener = () => {
    mouseClick = false;
  }
document.addEventListener('mouseup', upListener)
