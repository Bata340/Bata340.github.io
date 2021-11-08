import Objeto3D from '../Objeto3D.js';
import '../gl-matrix/gl-matrix-min.js';
import {getBezierPointCuadratic} from '../Primitivas/CurvasBezier.js';

var vec3 = glMatrix.vec3;

export default class TuboCapsula extends Objeto3D{
    constructor(){
        super();
    }

    logKey(e){
        console.log(e);
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
            [-1, 0.1, 0],
            [0.5, 0.3, 0],
            [0, 0.2, 0]
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
    
}