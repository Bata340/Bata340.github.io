import Objeto3D from '../Objeto3D.js';


//TAMBIEN UTILIZABLE COMO CILINDRIO SI TIENE RATIO RECORRIDO EN 0
export default class Trompo extends Objeto3D{
    constructor(radioInicial, longitud, ratioRecorrido, glContainer){
        if(ratioRecorrido > 1){
            throw new Error('Ratio Recorrido en Trompo es mayor a 1: ' + ratioRecorrido);
        }
        super(glContainer);
        this.radioInicial = radioInicial;
        this.ratioRecorrido = ratioRecorrido;
        this.longitud = longitud;
    }

    getPosicion(u, v){
        var x, y, z;
        z = Math.cos(u*Math.PI*2)*(this.radioInicial-v*this.ratioRecorrido*this.radioInicial);
        y = v*this.longitud;
        x = Math.sin(u*Math.PI*2)*(this.radioInicial-v*this.ratioRecorrido*this.radioInicial);
        return [x,y,z];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}