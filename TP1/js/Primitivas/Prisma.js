import Objeto3D from '../Objeto3D.js';
import '../gl-matrix/gl-matrix-min.js';
import getBezierPointLinear from './CurvasBezier.js';
import Plano from './Plano.js'

var vec3 = glMatrix.vec3;

export default class Prisma extends Objeto3D{
    constructor(largo, ancho, alto){
        super();
        this.largo = largo;
        this.ancho = ancho;
        this.alto = alto;
        let cara_baja = new Plano(largo, ancho);
        let cara_alta = new Plano(largo, ancho);
        cara_baja.setPosicion(0, alto, 0);
        cara_baja.setRotacionFinal(1,0,0, Math.PI);
        cara_alta.setPosicion(0, 0, 0);
        this.hijos.push(cara_baja);
        this.hijos.push(cara_alta);
    }

    getPosicion(u, v){
        var x, y, z;
        var xForma, yForma, zForma;
        var xRecorrido, yRecorrido, zRecorrido;
        
        //Armo el recorrido que es una circunferencia
        xRecorrido = 0;
        yRecorrido = v*this.alto;
        zRecorrido = 0;

        //Armo la forma de la circunferencia de forma en polares
        u = u*5;
        let puntosDeControl=[
            [-this.ancho/2, 0, -this.largo/2],
            [-this.ancho/2, 0, this.largo/2],
            [this.ancho/2, 0, this.largo/2],
            [this.ancho/2, 0, -this.largo/2],
            [-this.ancho/2, 0, -this.largo/2]
        ];
       
        let bezierPoints = getBezierPointLinear(u, puntosDeControl);
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