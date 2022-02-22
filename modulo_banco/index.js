const express = require('express');
const app = express();
const port = 3002;
app.use(express.json())

const users = require('./abs');
var fs = require('fs');

/*PAGOS BANCO*/
app.post('/pago', (req, res) => {
  //recibe la peticion desde modulo_pagos
  var pay = new Object();
  pay.payId = Math.floor(Math.random() * (999999 - 1000)) + 1000;
  pay.amount = req.body.amount;
  pay.account = req.body.account;

  var strPay = JSON.stringify(pay);
  res.send(JSON.parse(strPay));

});

app.listen(port, () => {
  console.log('Escuchando en ' + port);
});
