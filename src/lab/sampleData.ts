// Datos inventados para la demostración: no corresponden a ningún negocio real.
// Las galletas venden más unidades que el café pero ingresan menos, lo que muestra por qué no se suman cantidades de productos distintos.
export const SAMPLE_CSV = `fecha,producto,cantidad,precio_unitario
2026-03-02,Café molido 500 g,6,12.50
2026-03-02,Té verde (caja),4,8.75
2026-03-02,Galletas de avena,10,3.20
2026-03-03,Café molido 500 g,8,12.50
2026-03-03,Té verde (caja),3,8.75
2026-03-03,Galletas de avena,12,3.20
2026-03-04,Café molido 500 g,3,12.50
2026-03-04,Galletas de avena,6,3.20
2026-03-05,Café molido 500 g,7,12.50
2026-03-05,Té verde (caja),5,8.75
2026-03-05,Galletas de avena,9,3.20
2026-03-06,Café molido 500 g,9,12.50
2026-03-06,Té verde (caja),2,8.75
2026-03-06,Galletas de avena,15,3.20
`

// Salvo la primera, cada línea con datos tiene al menos un error distinto; la línea vacía se omite sin error.
export const INVALID_SAMPLE_CSV = `fecha,producto,cantidad,precio_unitario
2026-03-02,Café molido 500 g,6,12.50
05/03/2026,Té verde (caja),4,8.75
2026-02-30,Galletas de avena,10,3.20
2026-03-03,,8,12.50
2026-03-03,Té verde (caja),-2,8.75
2026-03-04,Galletas de avena,6,"1,250.00"
2026-03-04,Café molido 500 g,tres,₡12.50

2026-03-05,Café molido 500 g,7,12.505
2026-03-05,Galletas de avena,9,3,20
`

export const SAMPLE_FILE_NAME = 'ventas-ejemplo.csv'
