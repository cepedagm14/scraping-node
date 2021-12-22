const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const casas = JSON.parse(fs.readFileSync("./casas.json"));

const campos = [
  "titulo",
  "ubuicacion",
  "precio",
  "numeroEstrellas",
  "numeroOpiniones",
  "url",
  {
    label: "baños",
    value: (row, campo) => {
      return row["comodidades"]["baños"] || campo.default;
    },
    default: "NULL",
  },
  {
    label: "habitaciones",
    value: (row, campo) => {
      return row["comodidades"]["habitaciones"] || campo.default;
    },
    default: "NULL",
  },
  {
    label: "camas",
    value: (row, campo) => {
      return row["comodidades"]["camas"] || campo.default;
    },
    default: "NULL",
  },
];

const json2csvParse = new Parser({ fields: campos });
const csv = json2csvParse.parse(casas);
fs.writeFileSync(path.join(__dirname, "casas.csv"), csv);
