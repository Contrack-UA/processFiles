const jsonfile = require('jsonfile');
// const contratos = require('../data/data-secop1.json');
const file = require('../data/data-secop1.json');

function encontrarSospechas(contrato) {
  let sospechosidad = 0;
  const sospechas = [];
  // Valor de las adiciones superior al 10% del valor del contrato
  if (contrato[47] > contrato[46] * 0.35) {
    sospechosidad += 1;
    sospechas.push('Anticipo muy alto');
  }
  // Estado 'Terminado anormalmente después de convocado'
  if (contrato[12] === 'Terminado Anormalmente después de Convocado') {
    sospechosidad += 1;
    sospechas.push('Estado anormal');
  }
  // Plazo de ejecución no definido
  if (contrato[41] === 'No definido') {
    sospechosidad += 1;
    sospechas.push('Plazo de ejecución no definido');
  } else if (contrato[41] === 'D') {
    // Tiempo de adición superior a la mitad del plazo de ejecución del proyecto
    if (contrato[42] >= contrato[40] * 0.5) {
      sospechosidad += 1;
      sospechas.push('Mucho tiempo de adición');
    }
  } else if (contrato[41] === 'M') {
    // Tiempo de adición superior a la mitad del plazo de ejecución del proyecto
    if (contrato[43] >= contrato[40] * 0.5) {
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
  if (count >= 8) {
    // console.log('hay');
    sospechosidad += 1;
    sospechas.push('8 o más campos sin definir');
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
