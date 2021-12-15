import './gl-matrix/gl-matrix-min.js';

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;

function getNorma(v){
    return Math.sqrt(v[0]**2+v[1]**2+v[2]**2)
}

function productoVectorial(v1, v2){
    var x = (v1[1]*v2[2])-(v2[2]*v1[1]);
    var y = (v1[2]*v2[0]) - (v1[0]*v2[2]);
    var z = (v1[0]*v2[1]) - (v1[1]*v2[0]);
    return [x,y,z];
}

//Usada por this.image que tiene bindeados los parametros en initTexture
function loadTexture(){
    let gl = this.glContainer.getGL();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}



export default class Objeto3D{
    
    //Atributos Privados
    constructor(glContainerObj){
        this.glContainer = glContainerObj;
        this.texture = null;
        this.image = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.color = null;
        this.matrizModelado = mat4.create();
        this.posicion = vec3.create();
        this.rotacion = vec3.create();
        this.anguloRotacion = 0;
        this.escala = vec3.create();
        this.hijos = [];
        this.positionBuffer = [];
        this.normalBuffer = [];
        this.uvBuffer = [];
        this.indexBuffer = [];
        this.filas = 50;
        this.columnas = 50;
        this.trianglesIndexBuffer = null;
        this.trianglesNormalBuffer = null;
        this.trianglesVerticeBuffer = null;
        this.trianglesUVBuffer = null;
        this.ejeRotacionFinal = vec3.create();
        this.anguloRotacionFinal = 0;
        this.lastNormalCalculated = null;
        this.shininess = 1;
    }

    setShininess(shininess){
        this.shininess = shininess;
        this.hijos.forEach(function(hijo){
            hijo.setShininess(shininess);
        });
    }

    //Método privado
    actualizarMatrizModelado(){
        //Reset matriz de modelado.
        mat4.identity(this.matrizModelado);
        //Escalar, rotar, trasladar en ese orden.
        if (this.escala[0] != 0 || this.escala[1] != 0 || this.escala[2] != 0){
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
        }
        if ((this.rotacion[0] != 0 || this.rotacion[1] != 0 || this.rotacion[2] != 0) && this.anguloRotacion != 0){
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.anguloRotacion, this.rotacion);
        }
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);

        mat4.rotate(this.matrizModelado, this.matrizModelado, this.anguloRotacionFinal, this.ejeRotacionFinal);

    }

    setRotacionFinal(x, y, z, angulo){
        vec3.set(this.ejeRotacionFinal, x, y, z);
        this.anguloRotacionFinal = angulo;
    }

    arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }

    generateBuffers(glContainer){

        this.hijos.forEach(function(hijo){
            hijo.generateBuffers(glContainer);
        })

        let gl = glContainer.getGL();

        this.trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionBuffer), gl.STATIC_DRAW);    
        //Usa x,y,z
        this.trianglesVerticeBuffer.itemSize = 3;
        this.trianglesVerticeBuffer.numItems = this.positionBuffer.length / 3;

        this.trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        //Usa x,y,z
        this.trianglesNormalBuffer.itemSize = 3;
        this.trianglesNormalBuffer.numItems = this.normalBuffer.length / 3;


        this.trianglesUVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesUVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvBuffer), gl.STATIC_DRAW);
        //Usa u,v
        this.trianglesUVBuffer.itemSize = 2;
        this.trianglesUVBuffer.numItems = this.uvBuffer.length / 2;


        this.trianglesIndexBuffer = gl.createBuffer();
        this.trianglesIndexBuffer.number_vertex_point = this.indexBuffer.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        //Solo usa indice
        this.trianglesIndexBuffer.itemSize = 1;
        this.trianglesIndexBuffer.numItems = this.indexBuffer.length;
    }

    getBuffers(){
        return [this.trianglesVerticeBuffer, this.trianglesNormalBuffer, this.trianglesUVBuffer, this.trianglesIndexBuffer];
    }

    dibujarMallaDeTriangulos(matrix){

        //Genero los buffers de posicion, normal, y uv para la grilla

        for (var i=0; i < this.filas; i++) {
            for (var j=0; j < this.columnas; j++) {

                var u=j/(this.columnas-1);
                var v=i/(this.filas-1);

                var pos=this.getPosicion(u,v);

                this.positionBuffer.push(pos[0]);
                this.positionBuffer.push(pos[1]);
                this.positionBuffer.push(pos[2]);

                var nrm=this.getNormal(u,v);


                this.normalBuffer.push(nrm[0]);
                this.normalBuffer.push(nrm[1]);
                this.normalBuffer.push(nrm[2]);

                var uvs=this.getCoordenadasTextura(u,v);

                this.uvBuffer.push(uvs[0]);
                this.uvBuffer.push(uvs[1]);

            }
        }

        //Genero el indexBuffer para la grilla
        for (let i=0; i < this.filas-1; i++) {
            for (let j=0; j < this.columnas; j++) {
                this.indexBuffer.push(i*this.columnas+j);
                if(this.filas>1 && this.columnas > 1){
                    this.indexBuffer.push((i+1)*this.columnas+j);
                    if ((i*this.columnas + j) % this.columnas == 0 && (j!=0) && (i*this.columnmas+j) != (this.filas*this.columnas-1)){
                        this.indexBuffer.push((i+1)*this.columnas+j);
                        this.indexBuffer.push((i+1)*this.columnas);
                    }
                }
                
            }
        }
    }

    generarColor(glContainer){
        let gl = glContainer.getGL();
        let glProgram = glContainer.getGLProgram();

        //Codigo para color uniforme
        if (this.texture == null && this.color != null){
            let colorVecUniform = gl.getUniformLocation(glProgram, "colorVec");
            gl.uniform3fv(colorVecUniform, this.color);
        }else{
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(gl.getUniformLocation(glProgram, 'uSampler'), 0);
            gl.uniform1f(gl.getUniformLocation(glProgram, 'Shininess'), this.shininess);
        }

        
    }

    //Métodos públicos
    dibujar(){
        if(this.positionBuffer && this.indexBuffer){
            this.dibujarMallaDeTriangulos();
        }
        for(let i=0; i<this.hijos.length;i++){
            this.hijos[i].dibujar();
        }
    }

    setColor(r,g,b){
        this.color = vec3.create();
        vec3.set(this.color, r, g, b);
        this.hijos.forEach(function(hijo){
            hijo.setColor(r,g,b);
        })
    }

    setGeometria(vertexBuffer, index){
        this.vertexBuffer = vertexBuffer;
        this.index = index;
    }

    setFilas(filas){
        this.filas = filas;
    }

    setColumnas(columnas){
        this.columnas = columnas;
    }

    agregarHijo(hijo){
        this.hijos.push(hijo);
    }

    quitarHijo(hijo){
        this.hijos = arrayRemove(this.hijos, hijo);
    }

    setPosicion(x,y,z){
        vec3.set(this.posicion, x,y,z);
    }

    setRotacion(x,y,z, angulo){
        vec3.set(this.rotacion, x,y,z);
        this.anguloRotacion = angulo
    }

    setEscala(x,y,z){
        vec3.set (this.escala, x,y,z);
    }

    getPosicion(u, v){
        //Metodo para override de los que hereden de objeto 3D. Cada objeto debe saber ubicarse en una malla de triangulos.
        //Utilizado para dibujar la malla de triángulos.
    }

    getNormal(u,v){

        // Normal basada en rectas tangentes y prod vectorial. Puede ser overrideado si se tiene la normal exacta del objeto.
        // Normal aproximada

        var p0,p1,p2;
        p0 = this.getPosicion(u,v);
        p1 = this.getPosicion(u+0.001,v);
        p2 = this.getPosicion(u, v+0.001);

        
        // (p2-p0) x (p1-p0) = Vector Normal -> Normalizarlo y tenemos la normal
        var vec1 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
        var vec2 = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];

        var normal = productoVectorial(vec2,vec1);
        var normaNormal = getNorma(normal);
        if(normaNormal > 0){
            normal[0] = normal[0]/normaNormal;
            normal[1] = normal[1]/normaNormal;
            normal[2] = normal[2]/normaNormal;
        }
        if(this.lastNormalCalculated != null){
            if(normal[0] * this.lastNormalCalculated[0] + normal[1]*this.lastNormalCalculated[1] + normal[2]*this.lastNormalCalculated[2] < 0){
                normal = [-normal[0], -normal[1], -normal[2]];
            }
        }
        this.lastNormalCalculated = normal;
        return normal;
    }

    getCoordenadasTextura(u,v){
        return [u,v];
        //Metodo para override de los que hereden de objeto 3D. Cada objeto debe autoposicionarse su textura.
        //Utilizado para dibujar.
    }

    drawInScene(glContainer){

        /*this.hijos.forEach(function(hijo){
            hijo.drawInScene(glContainer);
        });*/

        let gl = glContainer.getGL();
        let glProgram = glContainer.getGLProgram();

        this.generarColor(glContainer);

        let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexUVAttribute = gl.getAttribLocation(glProgram, "aTextureCoord");
        gl.enableVertexAttribArray(vertexUVAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesUVBuffer);
        gl.vertexAttribPointer(vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
        gl.drawElements( gl.TRIANGLE_STRIP, this.trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);

    }

    animate(glContainer, matrizPadre){
        this.animationSet(glContainer, matrizPadre);
    }

    animationSet(glContainer, matrizPadre){
        /*
        MUST be called from child that has an animation
        */
        let matriz = mat4.create();
        let gl = glContainer.getGL();
        let glProgram = glContainer.getGLProgram();
        this.actualizarMatrizModelado();
        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        mat4.multiply(matriz, matrizPadre, this.matrizModelado);

        let rotationMatrix = mat4.create();
        mat4.copy(rotationMatrix, matriz);
        mat4.invert(rotationMatrix, rotationMatrix);
        mat4.transpose(rotationMatrix, rotationMatrix);
        var normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");
        gl.uniformMatrix4fv(normalMatrixUniform, false, rotationMatrix);
        gl.uniformMatrix4fv(modelMatrixUniform, false, matriz);

        this.drawInScene(glContainer);
        this.hijos.forEach(function(hijo){
            hijo.animate(glContainer, matriz);
        });
    }

    getMatrizModelado(){
        return this.matrizModelado;
    }

    

    initTextures(srcImage){
        //CARGA DE LA TEXTURA DEL OBJETO
        let gl = this.glContainer.getGL();
        this.texture = gl.createTexture();
        if (!this.texture){
            console.log("ERROR: Not able to create texture.");
        }
        this.image = new Image();
        if (!this.image){
            console.log("ERROR: Not able to create image.");
        }
        this.image.src = srcImage;
        this.image.glContainer = this.glContainer;
        this.image.texture = this.texture;
        this.image.onload = loadTexture;
    }

    getPosActual(){
        let retorno = vec4.create();
        vec4.transformMat4(retorno, vec4.fromValues(0,0,0,1), this.matrizModelado);
        return retorno;
    }

    
}