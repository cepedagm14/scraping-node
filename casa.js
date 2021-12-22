//esquema de mongo
const mongoose = require("mongoose");

const CasaEsquema = new mongoose.Schema({
  imagenes: [{ type: String }],
  titulo: String,
  ubuicacion: String,
  precio: Number,
  comodidades: { habitaciones: Number, camas: Number, baños: Number },
  servicios: [{ type: String }],
  numeroEstrellas: Number,
  numeroOpiniones: Number,
  url: String,
});

module.exports = mongoose.model("Casa", CasaEsquema);
