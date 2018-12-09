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

### Paginação

Trazer todos os dados de uma collection pode resultar em problemas quando se tem uma grande quantidade de dados. Por isso, para paginar a aplicação foi utilizado o `mongoose-paginate`. <br>
Basta instalar `yarn add mongoose-paginate`, ir na model que deseja paginar, no caso Ad, importar e adicionar o `mongoose-paginate`.

```javascript
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const AdSchema = new mongoose.Schema();

AdSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Ad", AdSchema);
```

Feito isso, nas próximas requisições, podemos utilizar os métodos do mongoose-paginate da seguinte forma:

```javascript
class AdController {
  async index(req, res) {
    const ads = await Ad.paginate(
      {
        /* FILTROS DO FIND()*/
      },
      {
        limit: 20, // Limite por página
        page: req.query.page || 1, // A pagima atual, normalmente vem em query.params
        sort: "-createdAt", // Ordenação dos dados
        populate: "author" // Para popular os relacionamentos da collection
      }
    );

    return res.json(ads);
  }
}
```

Para mais informações sobre a lib, consulte a [documentação](https://github.com/edwardhotchkiss/mongoose-paginate)

### Envio de e-mail

Para envio de email está sendo utilizado o `nodemailer` + MailTrap. O MailTrap é um servidor SMTP onde todos os e-mails enviados caem na mesma caixa de entrada, usado em ambinete de desenvolvimento. Para produção, deve ser configurado um servidor externo como g-mail, mandril, Amazon Sas, ParkPost etc. <br>
Para utilizar o nodemail, bastar instalar `yarn add nodemailer` e configura-lo como serviço:

```javascript
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport(
  host: 'smtp.mailtrap.io',
  port: '2525',
  secure: false,
  auth: {
    user: '5a48bf600d3043',
    pass: 'e6dffb5e723c4d'
  }
});

module.exports = transport;
```

Para manter a organização do código, a configuração do método createTransport() pode ficar em um arquivo externo. <br>
Feito a configuração do nodemailer, basta importa-lo e utilizar seus métodos em uma controller, exemplo:

```javascript
// tranport
const Mail = require("../services/Mail");

Mail.sendMail({
  from: '"Maicon Silva" <email@email.com>',
  to: "com@com.br",
  subject: "Solicitação de compra",
  html: "<p>Test</p>"
});
```

### Template de e-mail

A configuração de template possui duas dependências, são elas:

- `nodemailer-express-handlebars`: Configurações do nodemailer
- `express-handlebars`: View engine

Após instalar as duas dependências, basta importa-las no arquivo de serviço do email `Mail.js` e configurar da seguinte forma:

```javascript
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const exphbs = require("express-handlebars");

const transport = nodemailer.createTransport(mailConfig);

// Configurações do template
transport.use(
  "compile",
  hbs({
    viewEngine: exphbs(), // ViewEngine
    viewPath: path.resolve(__dirname, "..", "views", "emails"), // Caminho das Views
    extName: ".hbs" // Extensão das Views
  })
);
```

Feito isso, na controller que enviará o e-mail, é necessário passar mais alguns parâmetros, ficando assim:

```javascript
Mail.sendMail({
  from: '"Maicon Silva" <maiconrs95@gmail.com>',
  to: purchaseAd.author.email,
  subject: `Solicitação de compra: ${purchaseAd.title}`,
  template: "purchase", // Nome da View
  context: { user, content, ad: purchaseAd } // Variáveis de template
});

return res.send();
```

### Configurando a fila

Para que o usuário não necessite aguardar a reposta do envio do e-mail, que pode levar alguns segundos, foi implementando a fila. A fila uma operação que irá ser executada em segundo plano e quando estiver completa retornará uma resposta. Para isso vamos utilizar o redis, também através do docker `sudo docker run --name noderedis -p 6379:6379 redis:alpine`. <br>
O redis básicamente funciona com chaves que representam processos e quando "chamadas" executam um processo. <br>
Para configurar o redis é necessário kue `yarn add kue`. <br>
Feito isso vamos configura-lo:

A pirmeira coisa foi remover o envio de e-mail do PurchaseController e passar a responsábilidade para um job `jobs/PurchaseMail.js`.
Jobs serão operações executadas em segundo plano:

```javascript
const Mail = require("../services/Mail");

// Job reponsável por enviar o email
class PurchaseMail {
  // Retorna a chave única do redis
  get keyof() {
    return "PurchaseMail ";
  }

  // Serviço responsável por enviar o email
  // job recebe todos os valores que serão passados para o job
  // done é chamado quando o processo é concluído
  async handle(job, done) {
    const { ad, user, content } = job.data;

    Mail.sendMail({
      from: '"Maicon Silva" <maiconrs95@gmail.com>',
      to: ad.author.email,
      subject: `Solicitação de compra: ${ad.title}`,
      template: "purchase",
      context: { user, content, ad }
    });

    return done();
  }
}

module.exports = new PurchaseMail();
```

Feito isso, nós criamos as chamadas de processos, passando o nome da fila e o processo a ser executado:

```javascript
const kue = require("kue");
const redisConfig = require("../../config/redis");
const jobs = require("../jobs");

const Queue = kue.createQueue({
  redis: {
    host: "127.0.0.1",
    port: 6379
  }
});

/**
 * @description:  Inicia o processo redis passando a key é o método chamado
 * Todos os processos que tiverem a mesma key serão iniciados na chamada
 */
Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle);

module.exports = Queue;
```

Agora, em PurchaseController basta chamar o processo passando as váriaves com os valores do template:

```javascript
// Executa e salva o job no redis
Queue.create(PurchaseMail.key, {
  ad: { obj, data },
  user: "User",
  content: "Content"
}).save();
```

É isso. Para mais consulte os arquivos da pasta jobs.

### Validações

Para validar os campos dos Schemas, foi utilizado a lib `yarn add joi`. Ela basicamente reflete o Schema e valida os campos que não estão preenchidos corretamente. <br>
Na utlização do Joi nós podemos validar tanto o body, params o os query params:

```javascript
const Joi = require("joi");

/**
 * @description: O Joi permite tanto a validação do body, params e query params
 */
module.exports = {
  body: {
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.strict()
      .required()
      .min(6)
  }
};
```

Para utilizar o Joi nas validações, é necessário a instalação do middleware express-validation `yarn add express-validation`. <br>
Feito isso, basta importar o express-validation e as validações feito pelo Joi no arquivo de rotas e configura-los como middleware da seguinte forma:

```javascript
const validate = require("express-validation");
const validators = require("./app/validators");

/**
 * User
 */
routes.post("/users", validate(validators.User), sua.controller);
```

### Exception Handling

As exception mostrará todos os possíveis erros na API. Para isso foi criado um método em Server.js que contém as configurações de error. <br>
Obs. Para que a exception capture os erros nas rotas, o método exception() deve ser chamado depois do routes(). <br>
Como utilizamos o express-validation nas models, a API pode lançar um erro vindo dessa lib. <br>
Para manipular essa exceção, basta validar no middleware que irá capturar os error da API, se o erro lançado é uma instância do express-validation:

```javascript
  const validator = require('express-validation')
  exception () {
    this.express.use((err, req, res, next) => {
      // Valida se o erro lançado é uma instância do express-validation
      if (err instanceof validatior.ValidationError) {
        return res.status(err.status).json(err)
      }
    })
  }
```

Para ter um acesso mais detalhado sobre o erro em ambiente de dev, foi utilizado a lib youch `yarn add youch`. <br>
Essa lib, básicamente, funciona como um formatador de erros. <br>
Como os métodos das controllers estão declarados com async, eles passam a ser uma Promisse. E com isso, não irão disparar um erro a não ser que estejam em volto de um try catch(err). Para passar os erros dos métodos para o express, foi adicionado a lib express-async-handler. <br>
Após a instalação da lib, basta adiciona-lá no arquivo de rotas e envolver a chamada das controllers na variável de import da lib:

```javascript
const handler = require("express-async-handler");
routes.delete("/ads/:id", handler(controllers.AdController.destroy));
```

E agora no método exception() em server.js é possível lançar as exceções utilizando o Youch.

```javascript
// Verifica se estamos em ambiente de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  const youch = new Youch(err, req);

  return res.json(await youch.toJSON());
  //return res.send(await youch.toHTML());
}
```

Para mais, consultar os arquivos routes.js e/ou Server.js

### Utilizando o Sentry

O Sentry é uma plataforma utilizada para capturar erros em produção, evitando que os usuários do sistema entrem ou percebam o erro. <br>
Toda vez que a API lançar um erro, esse erro é enviado para o Sentry.
[+Sentry](https://docs.sentry.io/)

Após seguir a documentação, instalado o Sentry `yarn add @sentry/node`, basta importa-lo e configurar o express() para receber os erros e enviar para o Sentry em ambiente de produção:

```javascript
const Sentry = require('@sentry/node')

  sentry () {
    Sentry.init({ dsn: 'https://a849399c2e534922b14f568b3dee5ae0@sentry.io/1340291' })
  }

  exception () {
  // Valida erros em produção
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }
    ...
  }
```

Também é possível utilizar o sentry em filas, como no envio de e-mail. Basta importar o Sentry no service e configurar o Queue:

```javascript
const Sentry = require("@sentry/node");
Queue.on("error", Sentry.captureException);
```

### Variaveis de ambiente

Variaveis de ambiente normalmente são diferentes em ambiente de produção x desenvolvimento. Para facilitar essa mudança, podemos centralizar a fonte desse valores, e altera-las dependendo do ambiente.
Para isso, na raiz do projeto é necessário um arquivo .env, que contém os valores das variaveis dea ambiente:

```javascript
NODE_ENV = development
APP_SECRET = GoNode2
DB_URL = mongodb://localhost:27017/gonode03

MAIL_HOST = smtp.mailtrap.io
MAIL_PORT = 2505
MAIL_USER = 5a48bf600d3043
MAIL_PASS = e6dffb5e723c4d

REDIS_HOST = 127.0.0.1
REDIS_PORT = 6379

SENTRY_DSN = https://a849399c2e534922b14f568b3dee5ae0@sentry.io/1340291
```

Feito isso, também é necessário a instalação da lib dotenv `yarn add dotenv`. <br>
Depois de instalada, deve ser chamada em server.js acima de todos os imports, para que toda a aplicação enxergue as variaveis:

```javascript
require("dotenv").config(); // 1 linha do server.js

const express = require("express");
const mongoose = require("mongoose");
const databaseConfig = require("./config/database");
```

Feito, todas as variaveis de ambiente ficam disponível em process.env.CHAVE, e podem ser usada na aplicação:

```javascript
module.exports = {
  secret: process.env.APP_SECRET // CHAVE = valor setado no arquivo .env,
  ttl: 86400
};
```

É isso. :blush:
