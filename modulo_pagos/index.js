const express = require('express');
const app = express();
const port = 3000;
app.use(express.json())

const axios = require('axios');
const users = require('./abs');
const pagos = require('./pagos');
var fs = require('fs');

app.get('/users', (req, res) => {
  res.send(users);
});

app.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  var user = users.filter(u => u.id == userId);
  res.send(user);
});

app.post('/user', (req, res) => {
  if(!req.body.name) {
    res.status(400).send({
      error: "El nombre es obligatorio"
    });
  } else if (!req.body.account) {
    res.status(400).send({
      error: "La cuenta es obligatoria"
    });
  } else {
    var u1 = new Object();
    u1.id = users.length++;
    u1.name = req.body.name;
    u1.lastname = req.body.lastname;
    u1.description = req.body.description;
    u1.account = req.body.account;
    var jsonU1 = JSON.stringify(u1);
    console.log(jsonU1);
    users.push(JSON.parse(jsonU1));
    //console.log(users[users.length - 2]);
    fs.writeFile("abs.json",  JSON.stringify(users), function(err) {
      if (err) {
        console.log(err);
        res.status(400).send({
          error: "Error al guardar el nuevo usuario"
        });
      }
    });

    res.send(JSON.parse(jsonU1));
  }

});

/*PAGOS*/

app.post('/pago', (req, res) => {
  if(!req.body.account) {
    res.status(400).send({
      body: "El numero de cuenta es obligatorio"
    });
  } else if (!req.body.amount) {
    res.status(400).send({
      body: "El monto del pago es obligatorio"
    });
  } else {
    newPay(req.body)
    .then((resBank) => {
        pagos.push(resBank);
        //Guardar un nuevo pago
        fs.writeFile("pagos.json",  JSON.stringify(pagos), function(err) {
          if (err) {
            console.log(err);
            res.status(400).send({
              error: "Error al generar el pago"
            });
          }
        });
        res.status(201).send({
          response: resBank
        });
    })
    .catch((error) => {
      res.status(500).send({
        body: "Error inesperado al crear el pago"
      });
    });
  }
});

async function newPay(body){
  const { data } = await axios({
    baseURL: 'http://localhost:8081/',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    url: `pago`,
    data: body,
    responseType: 'json',
  });
  console.log(data);
  return data;
}


app.get('/pagos', (req, res) => {
  const {amount} = req.query;
  if(amount) {
    if(!isNaN(amount)) {
      const result = pagos.filter(p => p.amount >= amount);
      if(!result || result.length == 0)
        res.status(204).send(result)
      else
        res.send(result);
    } else {
      res.status(400).send({error:"El monto debe ser un numero"})
    }
  } else {
    res.send(pagos);
  }

});

app.listen(port, () => {
  console.log('Escuchando en ' + port);
});
