import Objeto3D from '../Objeto3D.js';
import Toroide from '../Primitivas/Toroide.js';
import ToroidePrismatico from '../Primitivas/ToroidePrismatico.js';
import Andamios from './Andamios.js';
import Trompo from '../Primitivas/Trompo.js';
import Circulo from '../Primitivas/Circulo.js';

export default class Aro extends Objeto3D{
    constructor(cantidadModulos, containerGL){
        super(containerGL);
        this.velocidadRotacion = 0.02;
        let ratioRecorrido = parseFloat(1/(cantidadModulos*2));
        let toroide = new Toroide(0.125, 2, 1, 1, containerGL);
        toroide.initTextures('/models/shiphull.jpg');
        this.filas = 0;
        this.columnas = 0;
        this.hijos.push(toroide);

        let cilindro = new Trompo(0.35, 0.25, 0, containerGL);
        let primerTapa = new Circulo(0.35, containerGL);
        let segundaTapa = new Circulo(0.35, containerGL);
        cilindro.initTextures('/models/BronceCobrex2.jpg');
        cilindro.setPosicion(0,0,-0.125);
        primerTapa.setRotacion(1,0,0,Math.PI/2);
        primerTapa.setPosicion(0,-0.125,0);
        segundaTapa.setRotacion(1,0,0,Math.PI/2);
        segundaTapa.setPosicion(0,0.125,0);
        primerTapa.initTextures('/models/BronceCobrex2.jpg');
        segundaTapa.initTextures('/models/BronceCobrex2.jpg');
        cilindro.setRotacionFinal(1,0,0,Math.PI/2);
        this.hijos.push(cilindro);
        this.hijos.push(primerTapa);
        this.hijos.push(segundaTapa);

        for(let i=0; i<cantidadModulos; i++){
            let toroideP = new ToroidePrismatico(0.5, 0.3, 2, ratioRecorrido, containerGL);
            let andamios = new Andamios(6, containerGL);
            andamios.setEscala(0.075,0.075,0.075);
            andamios.setPosicion(0,4,0);
            andamios.setRotacion(0,0,1, i*2*Math.PI/cantidadModulos + ratioRecorrido*Math.PI-Math.PI/2);
            toroideP.initTextures('/models/modulo.jpg')
            toroideP.setRotacionFinal(0, 0, 1, i*2*Math.PI/cantidadModulos);
            this.hijos.push(toroideP);
            this.hijos.push(andamios);
        }
    }

    setVelocidadRotacion(valor){
        this.velocidadRotacion = valor;
    }

    getPosicion(u, v){        
        return [u,v];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }

    animate(glContainer, matrizPadre){
        this.setRotacionFinal(0,0,1,this.anguloRotacionFinal+this.velocidadRotacion);
        this.animationSet(glContainer, matrizPadre)
    }
}
