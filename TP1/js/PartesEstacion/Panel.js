import Objeto3D from '../Objeto3D.js';
import Trompo from '../Primitivas/Trompo.js';
import Prisma from '../Primitivas/Prisma.js';

export default class Panel extends Objeto3D{
    constructor(rotacion, glContainer){
        super(glContainer);
        this.filas = 0;
        this.columnas = 0;
        let cilindroInicial = new Trompo(0.075,0.75,0, glContainer);
        cilindroInicial.initTextures('/models/grayMetal_redim.png');
        this.hijos.push(cilindroInicial);
        let prisma = new Prisma(0.1, 0.75, 1.75, glContainer);
        prisma.setRotacion(0,1,0, rotacion);
        prisma.setPosicion(0,0.5,0.075);
        prisma.initTextures('/models/paneles_solares.jpg');
        this.hijos.push(prisma);
    }

    getPosicion(u, v){        
        return [0,0,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }

    setRotacionPaneles(rotacion){
        this.hijos[1].setRotacion(0,1,0, rotacion);
    }
}