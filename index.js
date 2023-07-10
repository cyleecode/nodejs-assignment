const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const app = express();
const errorHandler = require("./handler/errorHandler");
const port = 3001;

app.use(express.json());

//api route
app.use("/api", require("./api/converter/converter.controller"));
//error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log("App listening to port 3001");
});
