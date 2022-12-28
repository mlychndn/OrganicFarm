const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

// const promise = new Promise((resolve, reject) => {
//   fs.readFile("./dev-data/data.json", "utf-8", (err, data) => {
//     if (err) {
//       reject(err);
//     } else {
//       resolve(data);
//     }
//   });
// });

// promise
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

const fruitsData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
);

const overviewHtml = fs.readFileSync("./templates/overview.html", "utf-8");
const productHtml = fs.readFileSync("./templates/product.html", "utf-8");

http
  .createServer((req, res) => {
    const { pathname, query } = url.parse(req.url);

    const htmlStr =
      '<div class="card__details"><div class="card__detail-box"><h6 class="card__detail card__detail--organic">Organic!</h6></div>';

    if (pathname === "/" || pathname === "/overview") {
      res.writeHead(200, { "Content-Type": "text/html" });
      const fruitsHtmlArr = fruitsData.map((el) => {
        //console.log(el.image);
        const htmlStrReplaceValue = el.organic ? htmlStr : "";
        return overviewHtml
          .replace(/{{IMAGE}}/g, el.image)
          .replace("{{TITLE}}", el.productName)
          .replace("{{DETAILS}}", el.description)
          .replace(/{{QUANTITY}}/g, el.quantity)
          .replace("{{PRICE}}", el.price)
          .replace("{{ORGANIC}}", htmlStrReplaceValue)
          .replace("{{ID}}", el.id);
      });

      let fruitsHtmlStr = fruitsHtmlArr.join("");
      fruitsHtmlStr = fruitsHtmlStr.replace(
        '<div class="container">',
        '<div class="container"><h1>🌽 Organic Farm 🥦</h1>s'
      );
      //console.log("pathname", pathname);

      res.end(fruitsHtmlStr);
    } else if (pathname === "/api") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(fruitsData));
    } else if (pathname === "/product") {
      console.log(query);
      const id = query.split("=")[1];
      const productDetail = fruitsData.find((el) => el.id === Number(id));
      const {
        productName,
        image,
        from,
        nutrients,
        quantity,
        price,
        organic,
        description,
      } = productDetail;

      let organicFlag = organic ? "" : "product_display";
      const productHtmlStr = productHtml
        .replace("{{TITLE}}", productName)
        .replace("{{PRODUCT_NAME}}", productName)
        .replace(/{{IMAGE}}/g, image)
        .replace("{{FROM}}", from)
        .replace("{{NUTRIENTS}}", nutrients)
        .replace("{{QUANTITY}}", quantity)
        .replace(/{{PRICE}}/g, price)
        .replace("{{ORGANIC}}", organic)
        .replace("{{DESCRIPTION}}", description)
        .replace("{{product_display}}", organicFlag);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(productHtmlStr);
    } else {
      res.writeHead("404", { "Content-Type": "text/html" });
      res.end("<h1>Page not found 😢</h1>");
    }
  })
  .listen("8000", "127.0.0.1", () => {
    console.log("Server is running on port 8000");
  });
