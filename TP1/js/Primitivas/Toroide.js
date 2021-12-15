import Objeto3D from '../Objeto3D.js';

export default class Toroide extends Objeto3D{
    constructor(radioForma, radioRecorrido, ratioLargoRecorrido=1, ratioLargoForma=1, glContainer){
        super(glContainer);
        this.radioForma = radioForma;
        if(ratioLargoRecorrido > 1 || ratioLargoForma > 1){
            throw new Error('Ratio Recorrido en Toroide es mayor a 1. RatioLargoRecorrido= ' + ratioLargoRecorrido + ' ; RatioLargoForma = ' + ratioLargoForma);
        }
        this.radioRecorrido = radioRecorrido;
        this.ratioLargoForma = ratioLargoForma;
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
        zForma = Math.cos(u*Math.PI*2*this.ratioLargoForma)*this.radioForma;
        yForma = 0;
        xForma = Math.sin(u*Math.PI*2*this.ratioLargoForma)*this.radioForma;
        
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

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}