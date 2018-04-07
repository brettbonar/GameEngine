import express from "express"
import http from "http"

const app = express();
let server = http.Server(app);
server.listen(3000);

app.use(express.static("public"));
app.use("/modules", express.static("modules"));
app.use("/shared", express.static("shared/client"));
app.use("/extern", express.static("node_modules"));
app.use("/node_modules", express.static("node_modules"));

app.use(function (error, req, res, next) {
  res.status(400).send(error);
});
