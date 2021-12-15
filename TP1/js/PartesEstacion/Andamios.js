import Objeto3D from '../Objeto3D.js';
import Prisma from '../Primitivas/Prisma.js';

export default class Andamio extends Objeto3D{
    constructor(cantidadTriangulos, glContainer){
        super(glContainer);
        this.filas = 0;
        this.columnas = 0;
        for(let i=0; i < cantidadTriangulos; i++){
            let prismaArriba = new Prisma(0.5,0.5,4, glContainer);
            prismaArriba.setPosicion(-1,-2+4*i,0);
            let prismaAbajo = new Prisma(0.5,0.5,4, glContainer);
            prismaAbajo.setPosicion(1,-2+4*i,0);
            let primerPrismaInclinado = new Prisma(0.25,0.25,2/Math.sin(Math.PI/4), glContainer);
            primerPrismaInclinado.setPosicion(-1,-2+4*i,0);
            primerPrismaInclinado.setRotacionFinal(0,0,1, -Math.PI/4);
            let segundoPrismaInclinado = new Prisma(0.25,0.25,2/Math.sin(Math.PI/4), glContainer);
            segundoPrismaInclinado.setPosicion(-1+2/Math.tan(Math.PI/4),4*i,0);
            segundoPrismaInclinado.setRotacionFinal(0,0,1, Math.PI/4);
            prismaAbajo.initTextures('/models/shiphull.jpg');
            prismaArriba.initTextures('/models/shiphull.jpg');
            primerPrismaInclinado.initTextures('/models/shiphull.jpg');
            segundoPrismaInclinado.initTextures('/models/shiphull.jpg');
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
