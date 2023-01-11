require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Modelagem da nossa base de dados

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit("Pronto");
    console.log("Conectou a base de dados.");
  })
  .catch((e) => {
    console.log(e);
  });

const session = require("express-session"); // Salvar dados do cliente com cookies
const MongoStore = require("connect-mongo"); // Salvar os dados da session na base de dados
const flash = require("connect-flash"); // Mensagens autodestrutivas, salvas na session
const routes = require("./routes"); // Rotas da aplicação
const path = require("path").resolve; // Trabalhar com caminhos
const helmet = require("helmet"); // Segurança da aplicação
const csurf = require("csurf"); // Formulários com token
const {
  checkCsurf,
  csurfMiddleware,
  middlewareGlobal,
} = require("./src/middlewares/middleware"); // Meus middlewares

app.use(helmet());

// permitindo recebimento de dados pelo corpo da requisição post
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// configurando o caminho dos arquivos estaticos
app.use(express.static(path(__dirname, "public")));

// configurando o session e o flash
const sessionOptions = session({
  secret: "aaaaaaaaa",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

// Configurando o ejs para o view
app.set("views", path(__dirname, "src", "views"));
app.set("view engine", "ejs");

// configurando csrfToken
app.use(csurf());

// Mandando usar as rotas
app.use(middlewareGlobal);
app.use(checkCsurf);
app.use(csurfMiddleware);
app.use(routes);

// Escute na porta 3000 meu site
app.on("Pronto", () => {
  app.listen(5000, () => {
    console.log(`Server is running http://localhost:5000`);
  });
});
