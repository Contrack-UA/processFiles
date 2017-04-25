var jsonfile = require('jsonfile');
var contratos = require('../data/datos-secop2.json');

module.exports.process = function() {
  var newFile = [];
  var pagina = 0;
  for(var i=0; i<contratos.length; i++) {
    if(i%6 === 0) {
      pagina++;
    }
    var sospechosidad = 0;
    var sospechas = [];
    var contrato = contratos[i];
    if(contrato['Estado Contrato'] === 'Modificado') {
      sospechosidad++;
      sospechas.push('Se ha modificado el estado');
    }
    var precioBase = contrato['Precio Base Propuesta'];
    precioBase.replace(/,/g, '').replace(/.00/g, '');
    if(precioBase === '-') {
      sospechosidad++;
      sospechas.push('Precio base 0');
    }
    var anticipo = contrato['Porcentaje Anticipo'];
    if(anticipo !== '-' && anticipo > 15) {
      sospechosidad++;
      sospechas.push('Anticipo alto');
    }
    var valorFacturado = contrato['Valor Facturado'];
    valorFacturado.replace(/,/g, '').replace(/.00/g, '');
    if(valorFacturado != '-' && valorFacturado > precioBase) {
      sospechosidad++;
      sospechas.push('Facturas mayores a valor base');
    }
    contrato.sospechosidad = sospechosidad;
    contrato.sospechas = sospechas;
    contrato.pagina = pagina;
    newFile.push(contrato);
  }
  jsonfile.writeFile('../results/secop2.json', newFile, function(err) {
    console.error(err)
  });
}
