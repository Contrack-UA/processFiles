/* eslint-disable */
const jsonfile = require('jsonfile');
// const contratos = require('../data/data-secop1.json');
const file = require('../results/secop2.json');

function getColor(num) {
  let color = '#ECECEC';
  if (num === 0) {
    color = '#7BF010';
  } else if (num === 1) {
    color = '#F9E613';
  } else if (num === 2) {
    color = '#FF7300';
  } else if (num === 3) {
    color = '#FF2702';
  } else {
    color = '#860D00';
  }
  return color;
}

function process() {
  const contratos = file;
  contratos.sort((a, b) => {
    let valor2 = b['Valor Contrato'].toString();
    let valor1 = a['Valor Contrato'].toString();
    valor1 = valor1.replace(/\,|\$/g, '');
    valor2 = valor2.replace(/\,|\$/g, '');
    return parseInt(valor2) - parseInt(valor1);
  });
  const newFile = [];
  for (let i = 0; i < 20; i++) {
    let data = {};
    data.x = 'Contrato ' + contratos[i]['ID Contrato'];
    data.y = contratos[i]['Valor Contrato'].toString().replace(/\,|\$/g, '');
    data.color = getColor(contratos[i].sospechosidad);
    newFile.push(data);
  }
  jsonfile.writeFile('s2top20.json', newFile, (err) => {
    console.error(err);
  });
}

process();
