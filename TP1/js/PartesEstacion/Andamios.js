import Objeto3D from '../Objeto3D.js';
import Prisma from '../Primitivas/Prisma.js';

export default class Andamio extends Objeto3D{
    constructor(cantidadTriangulos){
        super();
        this.filas = 0;
        this.columnas = 0;
        for(let i=0; i < cantidadTriangulos; i++){
            let prismaArriba = new Prisma(0.5,0.5,4);
            prismaArriba.setColor(225/255, 183/255, 145/255);
            prismaArriba.setPosicion(-1,-2+4*i,0);
            let prismaAbajo = new Prisma(0.5,0.5,4);
            prismaAbajo.setPosicion(1,-2+4*i,0);
            prismaAbajo.setColor(225/255, 183/255, 145/255);
            let primerPrismaInclinado = new Prisma(0.25,0.25,2/Math.sin(Math.PI/4));
            primerPrismaInclinado.setColor(225/255, 183/255, 145/255);
            primerPrismaInclinado.setPosicion(-1,-2+4*i,0);
            primerPrismaInclinado.setRotacionFinal(0,0,1, -Math.PI/4);
            let segundoPrismaInclinado = new Prisma(0.25,0.25,2/Math.sin(Math.PI/4));
            segundoPrismaInclinado.setColor(225/255, 183/255, 145/255);
            segundoPrismaInclinado.setPosicion(-1+2/Math.tan(Math.PI/4),4*i,0);
            segundoPrismaInclinado.setRotacionFinal(0,0,1, Math.PI/4);
            this.agregarHijo(prismaAbajo);
            this.agregarHijo(prismaArriba);
            this.agregarHijo(primerPrismaInclinado);
            this.agregarHijo(segundoPrismaInclinado);
        }
    }

    getPosicion(u, v){        
        return [0,0,0];
    }

    getCoordenadasTextura(u,v){
        return[u,v];
    }
}
