const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate')

/**
 * File System module practices

 // Blocking, synchronous way
 const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
 const textOut = `This is what we know about the avacado: ${textIn}.\nCreated on ${Date().toLocaleString(
   "en-US",
   {
     hour: "numeric",
     minute: "numeric",
     hour12: true,
    }
    )}.`;
    fs.writeFileSync("./txt/output.txt", textOut);
    console.log("File Written!");
    
    // Non-Blocking, Asynchronous way
    fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
      fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
        fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
          fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been written 😊.");
      });
    });
  });
});

// the above code is a callback hell which leads to unreadable code.
console.log("Reading file Successfull");

*/

/** SERVER */
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {

  let {query, pathname} = url.parse(req.url, true)
  // Overview Page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    let product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output)
    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("Page Not Found!, 404 Error");
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("Listening to requests on port 8000")
);
