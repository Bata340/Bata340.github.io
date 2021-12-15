import Objeto3D from '../Objeto3D.js';
import '../gl-matrix/gl-matrix-min.js';
import getBezierPointLinear from './CurvasBezier.js';

var vec3 = glMatrix.vec3;

export default class ToroidePrismatico extends Objeto3D{
    constructor(largo, ancho, radioRecorrido, ratioLargoRecorrido=1, glContainer){
        if(ratioLargoRecorrido > 1){
            throw new Error('Ratio Recorrido en ToroidePrismático es mayor a 1: ' + ratioLargoRecorrido);
        }
        super(glContainer);
        this.largo = largo;
        this.ancho = ancho;
        this.radioRecorrido = radioRecorrido;
        this.ratioLargoRecorrido = ratioLargoRecorrido;
    }

    getPosicion(u, v){
        var x, y, z;
        var xForma, yForma, zForma;
        var xRecorrido, yRecorrido, zRecorrido;
        
        //Armo el recorrido que es una circunferencia
        xRecorrido = Math.cos(v*Math.PI*2*this.ratioLargoRecorrido)*this.radioRecorrido;
        yRecorrido = Math.sin(v*Math.PI*2*this.ratioLargoRecorrido)*this.radioRecorrido;;
        zRecorrido = 0;

        //Armo la forma de la circunferencia de forma en polares
        u = u*5
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
        x = xForma*Math.cos(-v*Math.PI*2*this.ratioLargoRecorrido) + yForma*Math.sin(-v*Math.PI*2*this.ratioLargoRecorrido);
        y = -xForma*Math.sin(-v*Math.PI*2*this.ratioLargoRecorrido) + yForma*Math.cos(-v*Math.PI*2*this.ratioLargoRecorrido);
        z = zForma;

        //Asigno posiciones de vértices
        x = x + xRecorrido;
        y = y + yRecorrido;
        z = z + zRecorrido;
        return [x,y,z];
    }

    /*getNormal(u,v){
        var x,y,z;
        y = Math.sin(u*Math.PI*2)*this.radioForma;
        x = Math.cos(u*Math.PI*2)*this.radioForma;
        z =  //Ver esta
        return [x,y,z];
    }*/

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}