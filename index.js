const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const multer=require("multer")();

const constantServer = require("./constantServer");

const uploadRoutes = require("./routes/uploadRoutes")
const publicRoute = require("./routes/publicRoutes");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use("/public", express.static("./public"));

app.get("/", publicRoute.renderPage);
app.get("/activeoptions",publicRoute.getActiveOptions)
app.get("/getfiles/:type",uploadRoutes.getUploadedFiles);
app.post("/upload/:type",uploadRoutes.postFile);
app.get("/gridfsimage/:name",uploadRoutes.getGridFile);

app.listen(constantServer.PORT, function () {
    console.log(`listening at ${constantServer.PORT}`)
});