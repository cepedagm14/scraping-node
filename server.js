const express = require("express");
const mongoose = require("mongoose");
const Casa = require("./casa");

mongoose.connect("mongodb://127.0.0.1/nextviaje", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", function (error) {
  console.log(`error conectando a mongodb ${error}`);
  process.exit(1);
});

const app = express();
const puerto = 3010;
app.listen(puerto, () => {
  console.log(`escuchando en el puerto ${puerto}`);
});

app.get("/api/casas", async (req, res) => {
  const { numeroDeEstrellas, servicios, comodidad, numeroDeComodidad } =
    req.query;

  const query = {};
  if (numeroDeEstrellas) {
    query.numeroDeEstrellas = Number(numeroDeEstrellas);
  }
  if (servicios) {
    const s = servicios.split(",");
    query.servicios = { $all: s };
  }

  if (comodidad && numeroDeComodidad) {
    query[`comodidades.${comodidad}`] = Number(numeroDeComodidad);
  }

  const resultados = await Casa.find(query);

  res.json(resultados);
});
