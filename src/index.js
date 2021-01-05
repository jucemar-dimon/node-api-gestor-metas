const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("./models/Metas");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type,Authorization"
  );
  app.use(cors());
  next();
});

const Meta = mongoose.model("Meta");

mongoose
  .connect("mongodb://localhost/gestor-metas", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexão com mongo realizada com sucesso.");
  })
  .catch((error) => {
    console.log("Erro ao conectar com o mongo", error);
  });

app.get("/metas", async (req, res) => {
  await Meta.find({})
    .then((metas) => {
      return res.json({ error: false, metas });
    })
    .catch((error) => {
      return res
        .status(400)
        .json({ erro: true, message: "Nenhum registro encontrado!" });
    });
});

app.post("/metas", async (req, res) => {
  await Meta.create(req.body, (error) => {
    if (error) {
      return res.status(400).json({
        error: true,
        message: "Erro: A meta não foi cadastrada com sucesso!",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Meta cadastrada com sucesso!",
    });
  });
});

app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080");
});
