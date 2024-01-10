# API Examples demo repo

Javascript application endpoints using [**express**](https://webdriver.io/).

The bank_module folder contains the implementation of the _POST_ method for the _payment_ endpoint. This endpoint is used on the payment_module, in order to generate a dependance between the _POST_ method for the _payment_ endpoint on the PAYMENT app and the _POST_ method for the _payment_ endpoint on the BANK app.

## Installing Dependencies

Before installing all the dependencies you will need:

- _Node.js_ [here](https://nodejs.org/en/).

### BANK APP build

1- Open the terminal, run the following command on the bank_module folder to install the dependencies:

```sh
npm install
```

This should install all the dependencies on the _package.json_

2- Run the start command on the bank_module folder:

```sh
npm run start
```

### PAYMENTS APP build

1- Open the terminal, run the following command on the payments_module folder to install the dependencies:

```sh
npm install
```

This should install all the dependencies on the _package.json_

2- Change the URL on the BANK_URL environment variable at the .template-env-qa file to the one where the bank module is running (It should be 'http://localhost:3002/' if you didn´t change it and it is running locally). And rename the file to .env-qa.

3- Change the URL on the BANK_URL environment variable at the .template-env-mock file to the one where the mock is running. And rename the file to .env-mock.

4.1- To build the application pointing to the BANK application, execute the following command on the payments_module folder:

```sh
npm run startQA
```

4.2- To build the application pointing to the MOCK application, execute the following command on the payments_module folder:

```sh
npm run startMOCK
```

## Static Code Analysis and Formatting

The automation code should follow good coding practices as well. In this case, we are using EsLint recommended rules.

To run the ESLint analysis you could use the following command:

```sh
npm run lint
```
