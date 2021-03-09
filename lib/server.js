const http = require("http");
const url = require("url");
var send = require("send-data");
const { BodyParser } = require("../helper/bodyParser");
var redis = require("redis");
var client = redis.createClient();
var buyers = require("../test/buyers.json");

module.exports = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathName = reqUrl.pathname;
  const parts = pathName.split("/").slice(1);

  // POST Endpoint
  if (reqUrl.pathname == "/buyers" && req.method === "POST") {
    try {
      await BodyParser(req);
      const id = req.body.id;
      const offersData = [];

      req.body.offers.map((data) => {
        offersData.push(data);
      });
      client.set(
        id,
        JSON.stringify({ id: id, offers: offersData }),
        (err, reply) => {
          if (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Buyer was not created successfully" })
            ); // callback to log errors
          } else {
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "User was created succesfully" })
            );
          }
        }
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    }
  } else if (reqUrl.pathname == "/route" && req.method === "GET") {
    // ROUTE Endpoint
    const timestamp = reqUrl.query.timestamp;
    const device = reqUrl.query.device;
    const state = reqUrl.query.state;

    const date = new Date(timestamp);
    const day = date.getDay();
    const hours = date.getHours();
    const selection = [];
    buyers.map((buyer) => {
      const criteria = buyer.offers.filter(
        (offer) =>
          offer.criteria.device.includes(device) &&
          offer.criteria.day.includes(day) &&
          offer.criteria.state.includes(state)
      );
      if (criteria.length !== 0) {
        selection.push(criteria[0]);
      }
    });

    if (selection.length <= 1) {
      send(req, res, {
        statusCode: 302,
        headers: {
          Location: selection[0].location,
        },
      });
    } else {
      if (hours <= 3) {
        send(req, res, {
          statusCode: 302,
          headers: {
            Location: selection[2].location,
          },
        });
      } else {
        send(req, res, {
          statusCode: 302,
          headers: {
            Location: selection[0].location,
          },
        });
      }
    }
  } else if (parts[0] == "buyers" && parts[1] !== "" && req.method === "GET") {
    // BUYER GET Endpoint
    try {
      const id = parts[1];

      client.get(id, (err, obj) => {
        if (!obj) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Buyer with the provided id does not exist",
            })
          );
        } else {
          obj.id = id;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(JSON.parse(obj)));
        }
      });
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "internal server error" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: `The route does not exist`,
        status: 404,
      })
    );
  }
});
