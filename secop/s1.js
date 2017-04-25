const jsonfile = require('jsonfile');
const contratos = require('./../data/datos-secop2.json');

module.exports.process = function process() {
  const newFile = [];
  let pagina = 0;
  for (let i = 0; i < contratos.length; i += 1) {
    if (i % 6 === 0) {
      pagina += 1;
    }
    let sospechosidad = 0;
    const sospechas = [];
    const contrato = contratos[i];
    if (contrato['Estado Contrato'] === 'Modificado') {
      sospechosidad += 1;
      sospechas.push('Se ha modificado el estado');
    }
    const precioBase = contrato['Precio Base Propuesta'];
    precioBase.replace(/,/g, '').replace(/.00/g, '');
    if (precioBase === '-') {
      sospechosidad += 1;
      sospechas.push('Precio base 0');
    }
    const anticipo = contrato['Porcentaje Anticipo'];
    if (anticipo !== '-' && anticipo > 15) {
      sospechosidad += 1;
      sospechas.push('Anticipo alto');
    }
    const valorFacturado = contrato['Valor Facturado'];
    valorFacturado.replace(/,/g, '').replace(/.00/g, '');
    if (valorFacturado !== '-' && valorFacturado > precioBase) {
      sospechosidad += 1;
      sospechas.push('Facturas mayores a valor base');
    }
    contrato.sospechosidad = sospechosidad;
    contrato.sospechas = sospechas;
    contrato.pagina = pagina;
    newFile.push(contrato);
  }
  jsonfile.writeFile('../results/secop2.json', newFile, (err) => {
    console.error(err);
  });
};
