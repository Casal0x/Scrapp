const puppeteer = require("puppeteer");
// const chrome = require("chrome-aws-lambda");
const dolarCtrl = {};

dolarCtrl.getData = async (req, res) => {
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
      "div.container > div.row > div.col-md-8 > div.row h4 a"
    );
    const subtitle = document.querySelectorAll(
      "div.container > div.row > div.col-md-8 > div.row small"
    );
    const price = document.querySelectorAll(
      "div.container > div.row > div.col-md-8 > div.row span.price"
    );
    const tables = document.querySelectorAll(
      "div.table-responsive tbody > tr > td"
    );

    let k = 0;
    for (let i = 0; i < type.length; i++) {
      if (type[i] && type[i].innerText === "Dólar Turista ") {
        allData.push({
          type: type[i] ? type[i].innerText : "",
          sellTitle: "VENTA",
          sellPrice: price[k] ? price[k].innerText : "",
        });
        k += 1;
      } else {
        allData.push({
          type: type[i] ? type[i].innerText : "",
          sellTitle: "VENTA",
          sellPrice: price[k + 1] ? price[k + 1].innerText : "",
          buyTitle: "COMPRA",
          buyPrice: price[k] ? price[k].innerText : "",
        });
        k += 2;
      }
    }

    for (let h = 0; h < tables.length; h++) {
      if (
        tables[h].innerText === "Real brasileño" ||
        tables[h].innerText === "Euro"
      ) {
        allData.push({
          type: tables[h].innerText,
          sellTitle: "VENTA",
          sellPrice: tables[h + 2] ? tables[h + 2].innerText : "",
          buyTitle: "COMPRA",
          buyPrice: tables[h + 1] ? tables[h + 1].innerText : "",
        });
      }
    }

    return allData;
  });

  await browser.close();
  res.json(data);
};

module.exports = dolarCtrl;
