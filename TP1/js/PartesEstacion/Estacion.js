import Objeto3D from '../Objeto3D.js';
import Nucleo from './Nucleo.js';
import Aro from './Aro.js';
import Paneles from './ModuloPaneles.js';
import '../gl-matrix/gl-matrix-min.js';

var vec3 = glMatrix.vec3;

export default class Estacion extends Objeto3D{
    constructor(cantidadPaneles, rotacionPaneles, velocidadRotacionAro, cantidadModulosAro){
        super();
        this.filas = 0;
        this.columnas = 0;

        let aro = new Aro(cantidadModulosAro);
        aro.setVelocidadRotacion(velocidadRotacionAro);
        this.hijos.push(aro);

        let nucleo = new Nucleo();
        nucleo.setRotacion(1,0,0,-Math.PI/2);
        nucleo.setPosicion(0,-0.5,0);
        nucleo.setEscala(0.5,0.5,0.5);
        this.hijos.push(nucleo);

        let paneles = new Paneles(cantidadPaneles, rotacionPaneles);
        paneles.setEscala(0.5,0.5,0.5);
        paneles.setRotacion(1,0,0,Math.PI/2);
        paneles.setPosicion(0,2.6,0);
        this.hijos.push(paneles);

    }

    getPosicion(u, v){        
        return [0,0,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }

    getPosActual(){
        return this.posicion;
    }

    getPosPaneles(){
        let posSatelite = this.hijos[2].getPosActual();
        //Debido a rotación respecto de X de PI/2 retorno así la posición
        return vec3.fromValues(posSatelite[0], -posSatelite[2], -posSatelite[1]);
        
    }
}