# marketplace-api

RESTApi desenvolvida em nodejs + mongodb + express

## Getting Started

O projeto possui duas branchs, são:

- master: contém todo o desenvolvimento da API
- master-clean: contém os aquivos inicias da configuração do projeto(a base da api)

### Ambiente de desenvolvimento

O ambiente de desenvolvimento foi configurado com .editorconfig + eslint.<br>
Para isso, na raiz do projeto foi criado o arquivo .editorconfig com algumas configurações do editor. <br>
Depois foi instalado o eslint `yarn add eslit`. Logo após a instalação o eslint precisa ser configurado `npx eslint --init`, onde foi selecionado as opções <b>user a popular style guide, standard e JSON</b>.

## Configurado o servidor

O servidor <b>./src/server.js</b> possui a classe app, responsável por iniciar as rotas e middlewares do server:

```javascript
const express = require("express");

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== "production";

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new App().express;
```

O server é iniciado em <b>./index.js</b>:

```javascript
const server = require("./server");

server.listen(3000 || process.env.PORT);
```

### Banco de dados

Após configurar o ambiente, o banco de dados foi instalado e configurado com Docker utilizando a imagem mongo `sudo docker run --name mongonode -p 27017:27017 -d -t mongo`. <br>
Feito isso, temos um banco de dados rodando na porta 27017. <br>
Para manipulação do banco de dados pela aplicação, está sendo utilizado o ORM mongoose `yarn add mongoose`. <br>
Feito isso, em ./src/config foi criado o arquivo database.js, que contém a string de conexão com o banco. Esse arquivo foi importado no server.js para configuração do mongoose. <br>
A conexão com o mongo esrá sendo feita pelo mongoose. Para isso o mongoose deve ser importado no server.js e configurado da seguinte forma:

```javascript
database () {
    mongoose.connect(databaseConfig.uri, {
        useCreateIndex: true,
        useNewUrlParser: true
    })
}
```
