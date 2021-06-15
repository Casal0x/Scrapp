const puppeteer = require("puppeteer");
const myCache = require("../cache/cacheProvider");
const { all } = require("../routes/dolar");
const CACHE_DURATION = 600;
const CACHE_KEY = "DOLAR";
// const chrome = require("chrome-aws-lambda");
const dolarCtrl = {};

const scrap = async () => {
  let url = "https://www.dolarhoy.com/";

  let browser = await puppeteer.launch({
    // args: chrome.args,
    // executablePath: chrome.executablePath,
    // headless: chrome.headless,
    // headless: true,
    args: ["--no-sandbox"],
  });
  let page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  let data = await page.evaluate(() => {
    const allData = [];

    const type = document.querySelectorAll(
      "div.tile.cotizaciones_more > div.tile.is-parent.entidad > div.tile.is-child > a > div.title"
    );
    const buy = document.querySelectorAll(
      "div.tile.cotizaciones_more > div.tile.is-parent.entidad > div.tile.is-child > a > div.compra"
    );
    const sell = document.querySelectorAll(
      "div.tile.cotizaciones_more > div.tile.is-parent.entidad > div.tile.is-child > a > div.venta"
    );
    const dolarSolidarioTitle = document.querySelectorAll(
      "div.tile.dolar > div.tile.is-parent.is-7 > div.tile.is-child > a.title"
    );
    const dolarSolidarioVal = document.querySelectorAll(
      "div.tile.dolar > div.tile.is-parent.is-7 > div.tile.is-child > div.values > div.venta > div.val"
    );

    for (let [idx, item] of type.entries()) {
      let newObj = {};

      newObj.title = item.innerText;
      newObj.buy = buy[idx].innerText;
      newObj.sell = sell[idx].innerText;

      allData.push(newObj);
    }

    allData.push({
      title: dolarSolidarioTitle[dolarSolidarioTitle.length - 1].innerText,
      buy: null,
      sell: dolarSolidarioVal[dolarSolidarioVal.length - 1].innerText,
    });

    return allData;
  });

  await browser.close();
  return data;
};

dolarCtrl.getData = async (req, res) => {
  const data = await scrap();
  console.log("asdadas");
  res.json(data);
};

dolarCtrl.getDataCached = async (req, res) => {
  const value = myCache.get(CACHE_KEY);
  if (value === undefined) {
    const data = await scrap();
    const success = myCache.set(CACHE_KEY, data, CACHE_DURATION);
    if (success) {
      return res.json(data);
    } else {
      return res.json({ error: "Ocurrio un error!." });
    }
  } else {
    res.json(value);
  }
};

module.exports = dolarCtrl;
