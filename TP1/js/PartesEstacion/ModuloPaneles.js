import Objeto3D from '../Objeto3D.js';
import Trompo from '../Primitivas/Trompo.js';
import Panel from './Panel.js';
import Circulo from '../Primitivas/Circulo.js';
import '../gl-matrix/gl-matrix-min.js';

var vec3 = glMatrix.vec3;

export default class Paneles extends Objeto3D{
    constructor(cantidadPaneles, rotacionPaneles, glContainer){
        super(glContainer);
        this.filas = 0;
        this.columnas = 0;
        this.cantidadPaneles = cantidadPaneles;
        let cilindroInicial = new Trompo(0.125,1,0, glContainer);
        cilindroInicial.initTextures('/models/grayMetal_redim.png');
        this.hijos.push(cilindroInicial);
        for(let i=0; i < cantidadPaneles; i++){
            let cilindro = new Trompo(0.125,1,0, glContainer);
            cilindro.initTextures('/models/grayMetal_redim.png');
            cilindro.setPosicion(0,1*(i+1),0);
            let panelIzquierdo = new Panel(rotacionPaneles, glContainer);
            let panelDerecho = new Panel(-rotacionPaneles, glContainer);
            panelIzquierdo.setRotacionFinal(0,0,1, -Math.PI/2);
            panelIzquierdo.setPosicion(0,1*(i+1)+0.75,0);
            panelDerecho.setRotacionFinal(0,0,1, Math.PI/2);
            panelDerecho.setPosicion(0,1*(i+1)+0.75,0);
            this.hijos.push(cilindro);
            this.hijos.push(panelIzquierdo);
            this.hijos.push(panelDerecho);
        }
        let tapaSuperior = new Circulo(0.125, glContainer);
        tapaSuperior.setPosicion(0,cantidadPaneles+1,0);
        tapaSuperior.initTextures('/models/grayMetal_redim.png');
        this.hijos.push(tapaSuperior);
        let tapaInferior = new Circulo(0.125, glContainer);
        tapaInferior.initTextures('/models/grayMetal_redim.png');
        this.hijos.push(tapaInferior);
    }

    getPosicion(u, v){        
        return [0,0,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }

    getPosActual(){
        return vec3.fromValues(this.posicion[0], this.posicion[1]+parseFloat((this.cantidadPaneles)/4)-1, this.posicion[2]);
    }

    setRotacionPaneles(rotacion){
        this.hijos[1].setRotacion(0,1,0, rotacion);
        for(let i=2; i<this.hijos.length-2; i+=3){
            this.hijos[i].setRotacionPaneles(rotacion);
            this.hijos[i+1].setRotacionPaneles(-rotacion);
        }
    }
}
