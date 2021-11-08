import Objeto3D from '../Objeto3D.js';
import '../gl-matrix/gl-matrix-min.js';
import {getBezierPointCuadratic} from '../Primitivas/CurvasBezier.js';
import TuboCapsula from './TuboCapsula.js';

var vec3 = glMatrix.vec3;
var mat4 = glMatrix.mat4;
var vec4 = glMatrix.vec4;

let FACTOR_INERCIA=0.05;


export default class Capsula extends Objeto3D{
    constructor(){
        super();
        let camara = new TuboCapsula();
        camara.setRotacion(0,1,0, Math.PI);
        camara.setPosicion(1,0,0);
        camara.setColor(67/255,67/255,67/255);
        this.hijos.push(camara);
        this.xRotVel = 0;
        this.xRotVelTarget = 0;
        this.yRotVel = 0;
        this.yRotVelTarget = 0;
        this.zRotVel = 0;
        this.zRotVelTarget = 0;
        this.xVel = 0;
        this.xVelTarget = 0;
        this.yVel = 0;
        this.yVelTarget = 0;
        this.zVel = 0;
        this.zVelTarget = 0;
        this.rotationMatrix = mat4.create();
    }

    getPosicion(u, v){
        var x, y, z;
        var xForma, yForma, zForma;
        var xRecorrido, yRecorrido, zRecorrido;
        
        //Armo el recorrido que es un punto con rotación respecto de V
        xRecorrido = 0;
        yRecorrido = 0;
        zRecorrido = 0;

        //Armo la forma de la circunferencia de forma en polares
        u = u*5;
        let puntosDeControl=[
            [-0.5, 0.5, 0],
            [0, 0.5, 0],
            [0.25, 0.4, 0],
            [0.25, 0.35, 0],
            [0.25, 0.35, 0],
            [0.4, 0.35, 0],
            [0.5, 0.3, 0],
            [0.5, -0.3, 0],
            [0.5, -0.3, 0],
            [0.4, -0.35, 0],
            [0.25, -0.35, 0],
            [0.25, -0.4, 0],
            [0.25, -0.4, 0],
            [0, -0.5, 0],
            [-0.5, -0.5, 0],
            [-0.5, 0.5, 0],
            [-0.5, 0.5, 0],
        ];
       
        let bezierPoints = getBezierPointCuadratic(u, puntosDeControl);
        xForma = bezierPoints[0];
        yForma = bezierPoints[1];
        zForma = bezierPoints[2];

        x = (xForma + xRecorrido);
        y = (yForma + yRecorrido) * Math.cos(Math.PI*2*v) + (zForma + zRecorrido) * Math.sin(Math.PI*2*v);
        z = (yForma + yRecorrido) * (-Math.sin(Math.PI*2*v)) + (zForma + zRecorrido) * Math.cos(Math.PI*2*v);
        return [x,y,z];
    }
    
    getCoordenadasTextura(u,v){
        return[u,v];
    }

    setColor(r,g,b){
        vec3.set(this.color, r,g,b);
    }

    sumVelX(sum){
        this.xVelTarget = sum;
    }

    sumVelY(sum){
        this.yVelTarget = sum;
    }

    sumVelZ(sum){
        this.zVelTarget = sum;
    }

    sumGuin(sum){
        this.yRotVelTarget = sum;
    }

    sumAlabeo(sum){
        this.xRotVelTarget = sum;
    }

    sumCabeceo(sum){
        this.zRotVelTarget = sum;
    }
    
    actualizarMatrizModelado(){
        this.xVel+=(this.xVelTarget-this.xVel)*FACTOR_INERCIA;
        this.yVel+=(this.yVelTarget-this.yVel)*FACTOR_INERCIA;
        this.zVel+=(this.zVelTarget-this.zVel)*FACTOR_INERCIA;

        this.xRotVel+=(this.xRotVelTarget-this.xRotVel)*FACTOR_INERCIA;
        this.yRotVel+=(this.yRotVelTarget-this.yRotVel)*FACTOR_INERCIA;
        this.zRotVel+=(this.zRotVelTarget-this.zRotVel)*FACTOR_INERCIA;

        let translation=vec3.fromValues(this.xVel,this.yVel,-this.zVel);                        
        

        if (Math.abs(this.xRotVel)>0) {		
            // este metodo aplica una rotacion en el eje AXIS en el espacio del objeto o respecto del eje "local", NO el eje de mundo
            mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.xRotVel,vec3.fromValues(1,0,0));                
        }

        if (Math.abs(this.yRotVel)>0) {
            mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.yRotVel,vec3.fromValues(0,1,0));                
        }
        
        if (Math.abs(this.zRotVel)>0) {
            mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.zRotVel,vec3.fromValues(0,0,1));                
        }
        

        vec3.transformMat4(translation,translation,this.rotationMatrix);
        vec3.add(this.posicion,this.posicion,translation);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posicion);        
        mat4.multiply(this.matrizModelado,this.matrizModelado,this.rotationMatrix);
        mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }
}