/* eslint-disable */
const jsonfile = require('jsonfile');
// const contratos = require('../data/data-secop1.json');
const file = require('../data/data-secop1.json');

function encontrarSospechas(contrato) {
  let sospechosidad = 0;
  const sospechas = [];
  // Valor de las adiciones superior al 15% del valor del contrato
  if (parseInt(contrato[47]) > parseInt(contrato[46]) * 0.15) {
    sospechosidad += 1;
    sospechas.push('Anticipo muy alto');
  }
  // Estado 'Terminado anormalmente después de convocado'
  if (contrato[12] === 'Terminado Anormalmente después de Convocado') {
    sospechosidad += 1;
    sospechas.push('Terminado Anormalmente después de Convocado');
  }
  // Plazo de ejecución no definido
  if (contrato[41] === 'No definido') {
    sospechosidad += 1;
    sospechas.push('Plazo de ejecución no definido');
  } else if (contrato[41] === 'D') {
    // Tiempo de adición superior a la mitad del plazo de ejecución del proyecto
    if (parseInt(contrato[42]) >= parseInt(contrato[40]) * 0.5) {
      sospechosidad += 1;
      sospechas.push('Mucho tiempo de adición');
    }
  } else if (contrato[41] === 'M') {
    // Tiempo de adición superior a la mitad del plazo de ejecución del proyecto
    if (parseInt(contrato[43]) >= parseInt(contrato[40]) * 0.5) {
      sospechosidad += 1;
      sospechas.push('Mucho tiempo de adición');
    }
  }
  // 8 o más campos sin definir
  let count = 0;
  for (let i = 0; i < contrato.length; i += 1) {
    const campo = contrato[i];
    if (!campo || campo === 0 || campo === 'No definido') {
      count += 1;
    }
  }
  if (count >= 6) {
    sospechosidad += 3;
    sospechas.push('8 o más campos sin definir');
  } else if (count >= 4 && count < 6) {
    sospechosidad += 2;
    sospechas.push('Entre 4 y 6 campos sin definir');
  } else if (count > 1 && count < 4) {
     sospechosidad += 1;
     sospechas.push('Entre 1 y 4 campos sin definir');
   }
  return {
    sospechosdidad: sospechosidad,
    sospechas: sospechas
  };
}


module.exports.process = function process() {
  const contratos = file.data;
  const newFile = [];
  let pagina = 0;
  for (let i = 0; i < contratos.length; i += 1) {
    const contrato = contratos[i];
    if (i % 6 === 0) {
      pagina += 1;
    }
    let contratoObj = {};
    contratoObj._id = contrato[0];
    contratoObj.nomEntidad = contrato[10];
    contratoObj.detalle = contrato[16];
    contratoObj.lugar = contrato[19];
    contratoObj.valor = contrato[46];
    contratoObj.pagina = pagina;
    const sos = encontrarSospechas(contrato);
    contratoObj.sospechosidad = sos.sospechosidad;
    contratoObj.sospechas = sos.sospechas;
    newFile.push(contratoObj);
  }
  jsonfile.writeFile('secop1.json', newFile, (err) => {
    console.error(err);
  });
};
