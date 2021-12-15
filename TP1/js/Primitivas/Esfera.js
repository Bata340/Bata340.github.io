import Objeto3D from '../Objeto3D.js';

export default class Esfera extends Objeto3D{
    constructor(radio, ratioRecorrido, glContainer){
        super(glContainer);
        this.radio = radio;
        if(ratioRecorrido > 1){
            throw new Error('Ratio Recorrido en Trompo es mayor a 1: ' + ratioRecorrido);
        }
        this.ratioRecorrido = ratioRecorrido;
    }

    getPosicion(u, v){
        var x, y, z;
        y = (u-0.5) * this.ratioRecorrido * this.radio * 2;
        x = Math.cos(v*Math.PI*2)*Math.sqrt(this.radio**2-y**2);
        z = Math.sin(v*Math.PI*2)*Math.sqrt(this.radio**2-y**2);
        return [x,y,z];
    }

    getNormal(u,v){

        //Conozco la normal exacta, le hago override al metodo
        var x,y,z;
        y = (u-0.5)*2;
        x = Math.cos(v*Math.PI*2)*Math.sqrt(1-y**2);
        z = Math.sin(v*Math.PI*2)*Math.sqrt(1-y**2);
        return [x,y,z];
    }

    getCoordenadasTextura(u,v){
        return[v,u];
    }
}