const http = require("http");
const url = require("url");
var send = require("send-data")
var sendJson = require("send-data/json")
var sendHtml = require("send-data/html")
var sendError = require("send-data/error")
const { BodyParser } = require("../helper/bodyParser");
var redis = require("redis");
var client = redis.createClient();

module.exports = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);

  // GET Endpoint
  if (reqUrl.pathname == "/buyers" && req.method === "POST") {
    const body = await BodyParser(req, res);
    try {
    //   send(req, res, {
    //     body: req.body,
    //     statusCode: 200,
    //     headers: {
    //         bar: "baz"
    //     }
    // })
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User was created succesfully" }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User was created succesfully" }));
    }
  }  else if (reqUrl.pathname == "/buyers/:id" && req.method === "GET") {
    const body = await BodyParser(req, res);
    try {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User was created succesfully" }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User was created succesfully" }));
    }
  } 
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: `The route does not exist`,
        status: 404,
      })
    );
  }
});
