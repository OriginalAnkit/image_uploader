const multer = require('multer')
const path = require("path");
const fs = require('fs');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const constantServer = require("../constantServer")

//Local dir config
const uploadDir = path.join(__dirname, '../public/uploads')

const storageLocal = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        let { originalname } = file;
        let tempName = originalname.split(".")
        cb(null, (req.body.name || Date.now()) + "." + tempName[tempName.length - 1]);
    }
})

//gridfs config
const conn = mongoose.createConnection(constantServer.MongoURL);

let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storageGFs = new GridFsStorage({
    url: constantServer.MongoURL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = (req.body.name || Date.now()) + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

function postFile(req, res) {

    let type = req.params.type;
    let upload = null;
    switch (type) {
        case "Local":
            upload = multer({ storage: storageLocal })
            break;
        case "Grid_Fs":
            upload = multer({ storage: storageGFs })
            break;

    }
    upload.single("file")(req, res, (e, d) => {
        console.log(e)
        if (!e) {
            res.json({
                message: "success"
            })
        }
    })

}

async function getUploadedFiles(req, res) {
    let fileUrl = [];
    switch (req.params.type) {
        case "Local":
            fs.readdirSync(uploadDir).forEach(file => {
                fileUrl.push("/public/uploads/" + file)
            });
            break;
        case "Grid_Fs":
            let data = await gfs.files.find({}).toArray();
            data.forEach(
                d => {
                    fileUrl.push("/gridfsimage/" + d.filename)
                }
            )
            break;
    }

    res.json(
        {
            message: "success",
            data: fileUrl
        }
    )
}

function getGridFile(req, res) {
    let fileName = req.params.name;
    gfs.files.findOne({ filename: fileName }, (err, file) => {
        if (!file || file.length === 0) return res.status(404).json({ err: 'No file exists' });
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);

    });
}

module.exports = {
    postFile,
    getUploadedFiles,
    getGridFile
}