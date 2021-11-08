import Objeto3D from '../Objeto3D.js';
import Trompo from '../Primitivas/Trompo.js';
import Circulo from '../Primitivas/Circulo.js';
import BezierPrism from '../Primitivas/BezierPrism.js';

export default class CilindroConPrismaBez extends Objeto3D{
    constructor(){
        super();
        this.filas = 0;
        this.columnas = 0;
        for(let i=0; i<2; i++){
            let cilindroInicial = new Trompo(0.5,1,0);
            cilindroInicial.setColor(250/255,206/255,169/255);
            cilindroInicial.setPosicion(0,-1.9*i,0);
            this.hijos.push(cilindroInicial);
            for(let j=0; j<2; j++){
                let trompoParcial = new Trompo(0.5, 0.2, 0.25);
                trompoParcial.setColor(250/255,206/255,169/255);
                trompoParcial.setRotacion(1,0,0, j*Math.PI);
                trompoParcial.setPosicion(0,(-1+2*j)*1.9*i+(1-j)*1,0);
                this.hijos.push(trompoParcial);
            }
            let tapa = new Circulo(3/8);
            tapa.setColor(250/255,206/255,169/255);
            tapa.setPosicion(0,-1.9*i+1.2,0);
            this.hijos.push(tapa);

            let tapa_dos = new Circulo(3/8);
            tapa_dos.setRotacion(1,0,0, Math.PI);
            tapa_dos.setPosicion(0,1.9*i+0.2,0);
            tapa_dos.setColor(250/255,206/255,169/255);
            this.hijos.push(tapa_dos);

            let bezierPrism = new BezierPrism(0.35, 0.35, 0.5);
            bezierPrism.setColor(191/255,81/255,178/255);
            bezierPrism.setPosicion(0,-1.9*i+1.2,0);
            this.hijos.push(bezierPrism);
        }
    }

    getPosicion(u, v){        
        return [0,0,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}