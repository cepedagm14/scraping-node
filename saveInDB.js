const mongoose = require("mongoose");
const Casa = require ('./casa')

mongoose.connect("mongodb://127.0.0.1/nextviaje", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", function (error) {
  console.log(`error conectando a mongodb ${error}`);
  process.exit(1);
});

exports.guardarCasas = async (casas) => {
  for (const casa of casas) {
    try {
      await new Casa(casa).save();
    } catch (error) {
      console.log(`problema al guardar casa con el titulo ${titulo}`, error);
    }
  }
};
