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

Após configurar o ambiente, o banco de dados foi instalado e configurado com Docker, utilizando a imagem mongo `sudo docker run --name mongonode -p 27017:27017 -d -t mongo`. <br>
Feito isso, temos um banco de dados rodando na porta 27017. <br>
Para manipulação do banco de dados pela aplicação, está sendo utilizado o ORM mongoose `yarn add mongoose`. <br>
Feito isso, em ./src/config foi criado o arquivo database.js, que contém a string de conexão com o banco. <br>
A conexão com o mongo é feita pelo mongoose. Para isso o mongoose deve ser importado no server.js e configurado da seguinte forma:

```javascript
database () {
    mongoose.connect(databaseConfig.uri, {
        useCreateIndex: true,
        useNewUrlParser: true
    })
}
```

### Criptografia da senha

Foi adicionado um hook na model User para criptografar a senha do usuário antes de ser salva no banco. Para a criptografia, foi utilizado o bcryptjs. <br>
Obs. Hooks são operações realizadas na model antes que os dados sejam salvos, atualizdos, criados e/ou deletados do banco.<br>

```javascript
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 8);
});
```

### Autenticação

A Autenticação foi feita utilizando JWT(Json Web Token). Para isso, foi adicionado a controller SessionController e o método store(). <br>
Na model User, foi adicionado 2 métodos, são eles:

- compareHash: Método chamado para validar a senha na autenticação do usuário.
- generateToken: Caso o usuário passe na validação de e-mail e senha, é chamado o méotod generateToken({ user.id }), para retornar um token válido. O método é estático, por isso não necessita de uma instância da Classe User.

### Auth Middleware

Para controlar as rotas seguras da aplicação, está sendo utilizado o auth middleware. <br>
Aqui, básicamente ele recebe o token via header, captura o token e o valida. <br>
Obs. Foi utilizado o `{ promisify } = require('util')` para transformar o jwt.verify em uma promisse, permitindo o uso do async await.

```javascript
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

const { promisify } = require("util");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
```

Para mais, consultar a documentação no arquivo `./app/middlewares/auth.js`.
