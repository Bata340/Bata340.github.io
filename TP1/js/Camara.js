import './gl-matrix/gl-matrix-min.js';

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;

const ESTACION = 1;
const PANELES = 2;
const CAPSULA = 3;

export default class Camara{

    constructor(objetoCapsula, posicionEstacion, posicionPaneles){
        this.camaraActual = CAPSULA;
        this.posicionPaneles = posicionPaneles;
        this.posicionEstacion = posicionEstacion;
        this.objetoCapsula = objetoCapsula;
        this.alejamiento = 1;
        this.rotacionActual = 0;
        this.velocidadRotacion = 0.002;

        this.rotacionGuin = 0;
        this.rotacionCabeceo = 0;
    }

    setCamera(idCamara){
        this.camaraActual = idCamara;
        this.rotacionGuin = 0;
        this.rotacionCabeceo = 0;
    }

    sumGiroGuin(guin){
        this.rotacionGuin += guin;
    }

    sumGiroCab(cabe){
        this.rotacionCabeceo += cabe;
    }

    acercar(){
        this.alejamiento -= 0.5;
    }

    alejar(){
        this.alejamiento += 0.5;
    }

    getCameraMatrix(){

        /*Adaptar para utilizar guiñada y cabeceo y no una única rotación.*/
        if (this.camaraActual == ESTACION){
            let matrix = mat4.create();
            mat4.identity(matrix);
            let posicionCamara = vec3.fromValues(
                -this.posicionEstacion[0] + this.alejamiento*Math.sin(this.rotacionGuin)*Math.cos(this.rotacionCabeceo),
                -this.posicionEstacion[1] + this.alejamiento*Math.sin(this.rotacionGuin)*Math.sin(this.rotacionCabeceo),
                -this.posicionEstacion[2] + this.alejamiento*Math.cos(this.rotacionGuin)
            );
            
            mat4.lookAt(matrix, posicionCamara, vec3.fromValues(-this.posicionEstacion[0],-this.posicionEstacion[1], -this.posicionEstacion[2]), vec3.fromValues(0,1,0));
            return matrix;
        }

        else if (this.camaraActual == PANELES){
            let matrix = mat4.create();
            mat4.identity(matrix);
            let posicionCamara = vec3.fromValues(
                -this.posicionPaneles[0] + this.alejamiento*Math.sin(this.rotacionGuin)*Math.cos(this.rotacionCabeceo),
                -this.posicionPaneles[1] + this.alejamiento*Math.sin(this.rotacionGuin)*Math.sin(this.rotacionCabeceo),
                -this.posicionPaneles[2] + this.alejamiento*Math.cos(this.rotacionGuin)
            );
            
            mat4.lookAt(matrix, posicionCamara, vec3.fromValues(-this.posicionPaneles[0],-this.posicionPaneles[1], -this.posicionPaneles[2]), vec3.fromValues(0,1,0));
            /*//Aplico alejamiento o acercamiento
            mat4.translate(matrix, matrix, [0,0,-this.alejamiento]);

            //Utilizo el Y original del módulo de paneles para rotar, y roto respecto de todos los ejes
            mat4.rotate(matrix, matrix, this.rotacionActual, [1,-this.posicionPaneles[2],1]);
            mat4.multiply(matrix, matrixRotX, matrix);
            mat4.multiply(matrix, matrixRotY, matrix);
            //Utilizo el nuevo eje coordenado (El de post-rotación que es el que me traje como parametro) para trasladar.
            mat4.translate(matrix, matrix, [this.posicionPaneles[0], this.posicionPaneles[1], this.posicionPaneles[2]]);*/

            return matrix;

        }
        
        else if (this.camaraActual == CAPSULA){
            let matrizCamara = this.objetoCapsula.getMatrizModelado();
            let matrizRetorno = mat4.create();

            //Armo el alejamiento de la camara
            mat4.translate(matrizRetorno, matrizRetorno, [0,0,-this.alejamiento]);

            //Roto para que quede atras y con un angulo de inclinación como viendo a la cápsula desde arriba
            mat4.rotate(matrizRetorno, matrizRetorno, Math.PI/2, [0,1,0]);
            mat4.rotate(matrizRetorno, matrizRetorno, Math.PI/6, [0,0,1]);
            
            //Tomo la transormación inversa de la capsula para utilizarla como matriz de cámara
            mat4.invert(matrizCamara, matrizCamara);
            mat4.multiply(matrizRetorno, matrizRetorno, matrizCamara);

            //Me paro atrás de la cápsula
            //mat4.translate(matrizRetorno, matrizRetorno, [0,-1,0]);
            
            return matrizRetorno;
        }

        

    }
}