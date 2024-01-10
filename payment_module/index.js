require('dotenv').config({ path: `.env-${process.env.ENV}` });
const BANK_URL = process.env.BANK_URL;

const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const axios = require('axios');
const users = require('./abs');
const payments = require('./payments');
var fs = require('fs');

app.get('/users', (req, res) => {
  res.send(users);
});

app.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  var user = users.filter((u) => u.id == userId);
  res.send(user[0]);
});

app.post('/user', (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      error: "Missing 'name', 'name' is required",
    });
  } else if (!req.body.account) {
    res.status(400).send({
      error: "Missing 'account', 'account' is required",
    });
  } else {
    var newUser = new Object();
    newUser.id = users.length++;
    newUser.name = req.body.name;
    newUser.lastname = req.body.lastname;
    newUser.description = req.body.description;
    newUser.account = req.body.account;
    var newUserJson = JSON.stringify(newUser);
    console.log(newUserJson);
    users.push(JSON.parse(newUserJson));
    var user = users.filter((u) => u != null);
    fs.writeFile('abs.json', JSON.stringify(user), function (err) {
      if (err) {
        console.log(err);
        res.status(400).send({
          error: 'There was an error trying to save the user information',
        });
      }
    });

    res.status(201).send(JSON.parse(newUserJson));
  }
});

/*PAYMENTS*/

app.post('/payment', (req, res) => {
  if (!req.body.account) {
    res.status(400).send({
      body: 'The account number is required',
    });
  } else if (!req.body.amount) {
    res.status(400).send({
      body: 'The amount is required',
    });
  } else {
    newPay(req.body)
      .then((resBank) => {
        payments.push(resBank);
        //Store the new payment
        fs.writeFile('payments.json', JSON.stringify(payments), function (err) {
          if (err) {
            console.log(err);
            res.status(400).send({
              error: 'There was an error trying to process the payment',
            });
          }
        });
        res.status(201).send({
          response: resBank,
        });
      })
      .catch((error) => {
        res.status(500).send({
          body: `Unexpected error trying to create the payment ${error}`,
        });
      });
  }
});

async function newPay(body) {
  const { data } = await axios({
    baseURL: BANK_URL,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    url: `payment`,
    data: body,
    responseType: 'json',
  });
  console.log(data);
  return data;
}

app.get('/payments', (req, res) => {
  const { amount } = req.query;
  if (amount) {
    if (!isNaN(amount)) {
      const result = payments.filter((p) => p.amount >= amount);
      if (!result || result.length == 0) res.status(204).send(result);
      else res.send(result);
    } else {
      res.status(400).send({ error: 'The amount must be a number' });
    }
  } else {
    res.send(payments);
  }
});

app.listen(port, () => {
  console.log('App listening on Port ' + port);
});
