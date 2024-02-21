const express = require('express');
const app = express();
const port = 3002;
app.use(express.json());

/*BANK PAYMENTS*/
app.post('/payment', (req, res) => {
  //Gets the request from payment_module
  var payment = new Object();
  payment.paymentId = (
    Math.floor(Math.random() * (999999 - 1000)) + 1000
  ).toString();
  payment.amount = req.body.amount.toString();
  payment.account = req.body.account.toString();

  var strPayment = JSON.stringify(payment);
  res.send(JSON.parse(strPayment));
});

app.listen(port, () => {
  console.log('App listening on Port ' + port);
});
