import Objeto3D from '../Objeto3D.js';
import CilindroConPrismaBez from './CilindroConPrismaBez.js';
import Circulo from '../Primitivas/Circulo.js';
import Esfera from '../Primitivas/Esfera.js';

export default class Nucleo extends Objeto3D{
    constructor(){
        super();
        this.filas = 0;
        this.columnas = 0;

        let parteCilindrica = new CilindroConPrismaBez();
        this.hijos.push(parteCilindrica);

        let esferaParcial = new Esfera(0.5, 0.75);
        esferaParcial.setColor(252/255,208/255,171/255);
        esferaParcial.setPosicion(0,2.05,0);
        esferaParcial.setRotacionFinal(1,0,0,Math.PI);
        this.hijos.push(esferaParcial);

        let tapaEsferaParcial = new Circulo(1/3);
        tapaEsferaParcial.setPosicion(0,1.7,0);
        tapaEsferaParcial.setColor(252/255,208/255,171/255);
        this.hijos.push(tapaEsferaParcial);

        let tapaEsferaParcial_Dos = new Circulo(1/3);
        tapaEsferaParcial_Dos.setPosicion(0,2.4,0);
        tapaEsferaParcial_Dos.setColor(252/255,208/255,171/255);
        this.hijos.push(tapaEsferaParcial_Dos);
        
    }

    getPosicion(u, v){        
        return [0,0,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}