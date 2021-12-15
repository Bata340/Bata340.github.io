import Objeto3D from '../Objeto3D.js';
import '../gl-matrix/gl-matrix-min.js';

var vec3 = glMatrix.vec3;

export default class Circulo extends Objeto3D{
    constructor(radio, glContainer){
        super(glContainer);
        this.radio = radio;
    }

    getPosicion(u, v){
        var x, y, z;
        x = Math.cos(u*Math.PI*2)*this.radio*v;
        y=0;
        z = Math.sin(u*Math.PI*2)*this.radio*v;
        return [x,y,z];
    }

    getNormal(u,v){
        return [0,1,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}