const path = require("path");
const constantServer=require("../constantServer");

function renderPage(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"))
}

function getActiveOptions(req, res) {
 res.json({
     message:"success",
     data:{
         GridFs:constantServer.GridFS,
         S3:constantServer.S3
     }
 })
}

module.exports = {
    renderPage,
    getActiveOptions
}