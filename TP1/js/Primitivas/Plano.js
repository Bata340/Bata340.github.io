import Objeto3D from '../Objeto3D.js';
import '../gl-matrix/gl-matrix-min.js';

var vec3 = glMatrix.vec3;

export default class Plano extends Objeto3D{
    constructor(largo, ancho){
        super();
        this.largo = largo;
        this.ancho = ancho;
    }

    getPosicion(u, v){
        var x, y, z;
        x = this.ancho*(u-0.5);
        y=0;
        z = this.largo*(v-0.5);
        return [x,y,z];
    }

    getNormal(u,v){
        return [0,1,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}