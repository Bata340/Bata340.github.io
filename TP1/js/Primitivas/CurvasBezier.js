export default function getBezierPointLinear(u, points){
    let x,y,z;
    u = u * (points.length-1);
    let parteEnteraU = parseInt(u);
    let parteFlotanteU = parseFloat(u - parteEnteraU);

    if (u < points.length-1){
        x = points[parteEnteraU][0] * (1-parteFlotanteU) + points[parteEnteraU+1][0] * parteFlotanteU;
        y = points[parteEnteraU][1] * (1-parteFlotanteU) + points[parteEnteraU+1][1] * parteFlotanteU;
        z = points[parteEnteraU][2] * (1-parteFlotanteU) + points[parteEnteraU+1][2] * parteFlotanteU;
    }else{
        x = points[points.length-1][0]
        y = points[points.length-1][1]
        z = points[points.length-1][2]
    }
    return [x,y,z];
}

export function getBezierPointCuadratic(u, points){
    let x,y,z
    u = u * (points.length-1)/2;
    let parteEnteraU = parseInt(u);
    let parteFlotanteU = parseFloat(u - parteEnteraU);
    if (parteEnteraU*2 < points.length-2){
        x = (1-parteFlotanteU)**2*points[parteEnteraU*2][0] + 2*parteFlotanteU*(1-parteFlotanteU)*points[parteEnteraU*2+1][0] + parteFlotanteU**2*points[parteEnteraU*2+2][0];
        y = (1-parteFlotanteU)**2*points[parteEnteraU*2][1] + 2*parteFlotanteU*(1-parteFlotanteU)*points[parteEnteraU*2+1][1] + parteFlotanteU**2*points[parteEnteraU*2+2][1];
        z = (1-parteFlotanteU)**2*points[parteEnteraU*2][2] + 2*parteFlotanteU*(1-parteFlotanteU)*points[parteEnteraU*2+1][2] + parteFlotanteU**2*points[parteEnteraU*2+2][2];
    }else{
        x = points[points.length-1][0];
        y = points[points.length-1][1];
        z = points[points.length-1][2];
    }
    return [x,y,z];
}