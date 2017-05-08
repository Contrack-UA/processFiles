/* eslint-disable */
const jsonfile = require('jsonfile');
// const contratos = require('../data/data-secop1.json');
const file = require('../results/secop1.json');

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
    return b.valor - a.valor;
  });
  const newFile = [];
  for (let i = 0; i < 20; i++) {
    let data = {};
    data.x = 'Contrato ' + contratos[i]._id;
    data.y = contratos[i].valor;
    data.color = getColor(contratos[i].sospechas.length);
    newFile.push(data);
  }
  jsonfile.writeFile('s1top20.json', newFile, (err) => {
    console.error(err);
  });
}

process();
