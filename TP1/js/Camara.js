import './gl-matrix/gl-matrix-min.js';

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;

const ESTACION = 1;
const PANELES = 2;
const CAPSULA = 3;

export default class Camara{

    constructor(objetoCapsula, posicionEstacion, posicionPaneles){
        this.camaraActual = CAPSULA;
        this.posicionPaneles = posicionPaneles;
        this.posicionEstacion = posicionEstacion;
        this.objetoCapsula = objetoCapsula;
        this.alejamiento = 10;
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
        if(this.rotacionGuin >= Math.PI*2 && guin > 0){
            this.rotacionGuin = 0;
        }else if (this.rotacionGuin <= 0 && guin < 0){
            this.rotacionGuin = 2*Math.PI;
        }
    }

    sumGiroCab(cabe){
        if(this.rotacionCabeceo < 1.483 && cabe > 0 || this.rotacionCabeceo > -1.483 && cabe < 0)
            this.rotacionCabeceo += cabe;
    }

    acercar(){
        if ((this.alejamiento - 0.55) > 0)
            this.alejamiento -= 0.55;
    }

    alejar(){
        this.alejamiento += 0.55;
    }

    getCameraMatrix(){

        if (this.camaraActual == ESTACION){
            let matrix = mat4.create();
            let posicionCamara = vec3.fromValues(
                -this.posicionEstacion[0] + this.alejamiento,
                -this.posicionEstacion[1],
                -this.posicionEstacion[2]
            );
            
            mat4.lookAt(matrix, posicionCamara, vec3.fromValues(-this.posicionEstacion[0],-this.posicionEstacion[1], -this.posicionEstacion[2]), vec3.fromValues(0,1,0));
            mat4.rotate(matrix, matrix, this.rotacionGuin, vec3.fromValues(0,1,0));
            mat4.rotate(matrix, matrix, this.rotacionCabeceo, vec3.fromValues(1,0,0));
            return matrix;
        }

        else if (this.camaraActual == PANELES){
            let matrix = mat4.create();
            mat4.identity(matrix);
            let posicionCamara = vec3.fromValues(
                -this.posicionPaneles[0] + this.alejamiento,
                -this.posicionPaneles[1],
                -this.posicionPaneles[2]
            );
            
            mat4.lookAt(matrix, posicionCamara, vec3.fromValues(-this.posicionPaneles[0],-this.posicionPaneles[1], -this.posicionPaneles[2]), vec3.fromValues(0,1,0));
            mat4.translate(matrix, matrix,  vec3.fromValues(-this.posicionPaneles[0],-this.posicionPaneles[1], -this.posicionPaneles[2]));
            mat4.rotate(matrix, matrix, this.rotacionGuin, vec3.fromValues(0,1,0));
            mat4.rotate(matrix, matrix, this.rotacionCabeceo, vec3.fromValues(1,0,0));
            mat4.translate(matrix, matrix,  vec3.fromValues(this.posicionPaneles[0], this.posicionPaneles[1], this.posicionPaneles[2]));

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