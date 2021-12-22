const path = require("path");
const fs = require("fs");
const { guardarCasas } = require("./saveInDB");
const puppeteer = require("puppeteer");

// extraccion de datos - scraper
(async () => {
  console.log("empezando scraping...");

  const brawser = await puppeteer.launch({
    // headless: false,
    // slowMo: 500,
  });
  const page = await brawser.newPage();
  await page.goto("https://nextviaje.vercel.app/");

  // convertir lista de nodos en array opcion 1
  const urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".FilaCasas__cartas a"),
      (nodo) => nodo.href
    )
  );

  const casas = [];

  //recorrer todas las url
  for (const url of urls) {
    await page.goto(url);
    // convertir lista de nodos en array opcion 2
    const detallesDeLaCasa = await page.evaluate(() => {
      const imagenes = [
        ...document.querySelectorAll(".CasaVista__fotos img "),
      ].map((img) => img.src);

      const titulo = document.querySelector(".CasaVista__titulo").innerText;
      const ubuicacion = document.querySelector(
        ".CasaVista__titulo + div"
      ).innerText;
      const precio = Number(
        document
          .querySelector(".CasaVista__precio")
          .innerText.replace(/[^0-9]/g, "")
      );

      const comodidades = [
        ...document.querySelectorAll(".CasaVista__cuartos span"),
      ].reduce((acumulador, comodidad) => {
        const [cantidad, nombre] = comodidad.innerText.split(" ");
        acumulador[nombre] = Number(cantidad);
        return acumulador;
      }, {});

      const servicios = [...document.querySelectorAll(".CasaVista__extra")].map(
        (nodo) => nodo.innerText.toLowerCase()
      );

      const numeroEstrellas = Number(
        document.querySelector(".Opiniones__numero-de-estrellas").innerText
      );

      const numeroOpiniones = Number(
        document
          .querySelector(".Opiniones__numero-de-opiniones")
          .innerText.replace(/[^0-9]/g, "")
      );

      return {
        imagenes,
        titulo,
        ubuicacion,
        precio,
        comodidades,
        servicios,
        numeroEstrellas,
        numeroOpiniones,
        url: window.location.href,
      };
    });
    casas.push(detallesDeLaCasa);
    console.log(detallesDeLaCasa);
  }

  // const data = JSON.stringify(casas);
  // fs.writeFileSync(path.join(__dirname, "casas.json"), data);

  await guardarCasas(casas);
  console.log("finalizando scraping...");
  console.log("Casas guardadas exitosamente");
  await brawser.close();
  process.exit();
})();
