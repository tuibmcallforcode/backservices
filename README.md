# Roo-Pai Application

Backend service for universal languages disaster warning application(Roo Pai) for making people aware and be prepared to response wisely and stay safe.

## Installing / Getting started

This project required following program to be install on host

- Node version 10
- MongoDB

or you can use our docker-compose.yml to easily run our service

#### Node version 10

Using n package, we can change running Node version on host

```shell
npm i -g n
n stable
```

and your host should be running node with the stable version which is 10.11.0 (28/09/2018)

#### MongoDB

Any version of MongoDB (3.6 or 4.0) is compatible for the project despite some function we used is deprecated in Mongo version 4.0

### Initial Configuration

We use `dotenv` package for managing configuration of services.

All of required configuration is shown in .env.example so before running any script. Environment variable should be assigned accordingly or copy content in .env.example to .env file and fill all variable by these shell script

```shell
cp .env.example .env
vi .env # or any preferred editor
```

lastly to install dependency package

```shell
npm i
```

or by yarn

```shell
yarn
```

### Building

As we are using ES6 for most of our code, either run our application with babel-node by following code

```shell
babel-node src/index.js # make sure that you have babel-node installed globally
```

or complied to ES5 before execute

```shell
npm run build # or yarn build
node dist/index.js
```

## Features

This project consist of 3 essential features for Roo Pai application which are following Data Crawling, Language Understanding and Web services. In our `api_doc` folder contains exported postman_collection which can be easily import to postman to view all available endpoint of our services

#### Data Crawling

We initaily use data from 3 trustworthy sources `www.pdc.org`, `https://reliefweb.int` and `ready.gov` to provide news and alert for our application

to trigger Crawling service, we use simple http request for ease of prototyping

```shell
curl -X POST {{host}}:{{port}}/crawler/pdc/db # to fetch disaster alerts to our database
curl -X POST {{host}}:{{port}}/crawler/relief/db # to fetch disaster news to our database
curl -X POST {{host}}:{{port}}/crawler/prepareness/readygov/db # to fetch all preparation steps for each disaster type to our database
```

#### Language Understanding

Watson's Natural Language Understanding takes important roles in our application in order to summarize, filter and categorize news from our raw data sources

againg to trigger Language Understanding, we use simple http request for ease of prototyping

```shell
curl -X POST {{host}}:{{port}}/crawler/analyzed/relief/db # to fetch all news in our database to watson natural language understanding for catagorizing and filtering content and save to our database
```

#### Web services

Apart from two significant features above, we have web service that used for communicate with our mobile application, in some feature such as weather forcast we use our web service to act as proxy server for mobile to communicate with weather service server

<!--
## Licensing

One really important part: Give your project a proper license. Here you should
state what the license is and how to find the text version of the license.
Something like:

"The code in this project is licensed under MIT license." -->
