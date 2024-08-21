const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const cors = require("cors");
const bodyParser = require("body-parser");

server.use(cors());
server.use(bodyParser.json());

// Add custom routes before JSON Server router
server.post("/schedules", (req, res) => {
  console.log(req.body);
  res.status(200);
  res.jsonp(req.query);
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
