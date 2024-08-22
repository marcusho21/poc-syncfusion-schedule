const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const cors = require("cors");
const bodyParser = require("body-parser");

server.use(cors());
server.use(bodyParser.json());
const mockData = [
  {
    Id: 1,
    Subject: "HighWay Thru Hell",
    StartTime: "2024-08-22T10:52:00Z",
    EndTime: "2024-08-22T12:52:00Z",
  },
];

server.post("/schedules", (req, res) => {
  return res.status(200).json(mockData);
});

// Add custom routes before JSON Server router
server.post("/schedules/add", (req, res) => {
  mockData.push({
    Id: mockData.length + 1,
    Subject: "Hello World",
    StartTime: "2024-08-23T10:52:00Z",
    EndTime: "2024-08-23T12:52:00Z",
  });

  return res.status(200).json({ message: "Batch action success" });
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
