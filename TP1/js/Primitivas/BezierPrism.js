import Objeto3D from '../Objeto3D.js';
import '../gl-matrix/gl-matrix-min.js';
import {getBezierPointCuadratic} from './CurvasBezier.js';

var vec3 = glMatrix.vec3;

export default class Prisma extends Objeto3D{
    constructor(largo, ancho, alto){
        super();
        this.largo = largo;
        this.ancho = ancho;
        this.alto = alto;
        this.filas = 50;
        this.columnas = 50;
    }

    getPosicion(u, v){
        var x, y, z;
        var xForma, yForma, zForma;
        var xRecorrido, yRecorrido, zRecorrido;
        
        //Armo el recorrido que es una circunferencia
        xRecorrido = 0;
        yRecorrido = v*this.alto;
        zRecorrido = 0;

        //Armo la forma
        let puntosDeControl=[
            [-this.ancho/2, 0, -this.largo/2 + this.largo/4],
            [-this.ancho/2, 0, this.largo/2 - this.largo/4],
            [-this.ancho/2, 0, this.largo/2 - this.largo/4],
            [-this.ancho/2, 0, this.largo/2],
            [-this.ancho/2 + this.ancho/4, 0, this.largo/2],
            [this.ancho/2-this.ancho/4, 0, this.largo/2],
            [this.ancho/2-this.ancho/4, 0, this.largo/2],
            [this.ancho/2, 0, this.largo/2],
            [this.ancho/2, 0, this.largo/2-this.largo/4],
            [this.ancho/2, 0, -this.largo/2+this.largo/4],
            [this.ancho/2, 0, -this.largo/2+this.largo/4],
            [this.ancho/2, 0, -this.largo/2],
            [this.ancho/2-this.ancho/4, 0, -this.largo/2],
            [-this.ancho/2+this.ancho/4, 0, -this.largo/2],
            [-this.ancho/2+this.ancho/4, 0, -this.largo/2],
            [-this.ancho/2, 0, -this.largo/2],
            [-this.ancho/2, 0, -this.largo/2 + this.largo/4]
        ];
       
        let bezierPoints = getBezierPointCuadratic(u, puntosDeControl);
        xForma = bezierPoints[0];
        yForma = bezierPoints[1];
        zForma = bezierPoints[2];
        
        //Aplico rotación como si multiplicara por una matriz de rotación

        //Asigno posiciones de vértices
        x = xForma + xRecorrido;
        y = yForma + yRecorrido;
        z = zForma + zRecorrido;
        return [x,y,z];
    }
    
    getCoordenadasTextura(u,v){
        return[u,v];
    }
    
}