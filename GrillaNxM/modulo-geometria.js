

/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/


var superficie3D;
var mallaDeTriangulos;

var filas=10;
var columnas=10;

var figura = 'Plano'; //Puede ser 'Plano', 'Esfera' o 'TuboSenoidal'


//CONTROLES PARA MANEJAR LAS FILAS, COLUMNAS, Y TIPO DE FORMA A DIBUJAR...
document.addEventListener("DOMContentLoaded", function(){
    //SELECTOR DE FIGURA
    var element = document.createElement('div');
    element.innerHTML = "<label>Forma: "+
                        "<select id='selectFigura' name='figura'>"+
                            "<option value = 'Plano'>Plano</option>"+
                            "<option value='Esfera'>Esfera</option>"+
                            "<option value = 'TuboSenoidal'>TuboSenoidal</option>"+
                        "</select></label>";
    element.style = 'float:left; margin-right:15px;';
    document.getElementById('myCanvas').before(
    element);

    document.getElementById('selectFigura').addEventListener("change", function(){
        figura = this.options[this.selectedIndex].value;
        crearGeometria();
    });

    //SELECTOR DE CANTIDAD DE FILAS
    element = document.createElement('div');
    element.style = 'float:left; margin-right:15px;';
    element.innerHTML = "<label>Filas: <input id='filas' type='number'></input></label>";
    document.getElementById('myCanvas').before(element);

    document.getElementById('filas').addEventListener("change", function(){
        filas = this.value;
        crearGeometria();
    });

    //SELECTOR DE CANTIDAD DE COLUMNAS
    element = document.createElement('div');
    element.style = 'float:left';
    element.innerHTML = "<label>Filas: <input id='cols' type='number'></input></label>";
    document.getElementById('myCanvas').before(element);

    document.getElementById('cols').addEventListener("change", function(){
        columnas = this.value;
        crearGeometria();
    });
});





function crearGeometria(){
        
    if(figura.toUpperCase() == 'PLANO'){
        superficie3D=new Plano(3,3);
    }else if (figura.toUpperCase() == 'ESFERA'){
        superficie3D = new Esfera(2);
    }else if (figura.toUpperCase() == 'TUBOSENOIDAL'){
        superficie3D = new TuboSenoidal();
    }
    mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
    
}

function dibujarGeometria(){

    dibujarMalla(mallaDeTriangulos);

}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Esfera(radio){
    
    this.getPosicion = function(u,v){
        var x, y, z;
        y = (u-0.5) * radio * 2;
        x = Math.cos(v*Math.PI*2)*Math.sqrt(radio**2-y**2);
        z = Math.sin(v*Math.PI*2)*Math.sqrt(radio**2-y**2);
        return [x,y,z];
    }

    this.getNormal = function(u,v){
        var x,y,z;
        y = (u-0.5)*2;
        x = Math.cos(v*Math.PI*2)*Math.sqrt(1-y**2);
        z = Math.sin(v*Math.PI*2)*Math.sqrt(1-y**2);
        return [x,y,z];
    }

    this.getCoordenadasTextura = function(u,v){
        return[u,v];
    }
}

function TuboSenoidal(){
    return 1;
}




function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i < filas; i++) {
        for (var j=0; j < columnas; j++) {

            var u=j/(columnas-1);
            var v=i/(filas-1);

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos
    
    var indexBuffer=[];

    for (i=0; i < filas-1; i++) {
        for (j=0; j < columnas; j++) {

            // completar la lógica necesaria para llenar el indexbuffer en funcion de filas y columnas
            // teniendo en cuenta que se va a dibujar todo el buffer con la primitiva "triangle_strip" 
            indexBuffer.push(i*columnas+j);
            if(filas>1 && columnas > 1){
                indexBuffer.push((i+1)*columnas+j);
                if ((i*columnas + j) % columnas == 0 && (j!=0) && (i*columnmas+j) != (filas*columnas-1)){
                    indexBuffer.push((i+1)*columnas+j);
                    indexBuffer.push((i+1)*columnas);
                }
            }
            
        }
    }

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

