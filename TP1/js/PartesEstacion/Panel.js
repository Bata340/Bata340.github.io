import Objeto3D from '../Objeto3D.js';
import Trompo from '../Primitivas/Trompo.js';
import Prisma from '../Primitivas/Prisma.js';

export default class Panel extends Objeto3D{
    constructor(rotacion){
        super();
        this.filas = 0;
        this.columnas = 0;
        let cilindroInicial = new Trompo(0.075,0.75,0);
        cilindroInicial.setColor(149/255,111/255,66/255);
        this.hijos.push(cilindroInicial);
        let prisma = new Prisma(0.1, 0.75, 1.75);
        prisma.setRotacion(0,1,0, rotacion);
        prisma.setPosicion(0,0.5,0.075);
        prisma.setColor(187/255,139/255,99/255);
        this.hijos.push(prisma);
    }

    getPosicion(u, v){        
        return [0,0,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}