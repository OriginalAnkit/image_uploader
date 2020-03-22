const multer = require('multer')
const path = require("path");
const fs = require('fs');

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


function postFile(req, res) {

    let type = req.params.type;
    switch (type) {
        case "Local":
            const upload = multer({ storage: storageLocal })
            upload.single("file")(req, res, (e, d) => {
                if (!e) {
                    res.json({
                        message: "success"
                    })
                }
            })
            break;
        

    }

}

function getUploadedFiles(req, res) {
    let fileUrl = [];
    fs.readdirSync(uploadDir).forEach(file => {
        fileUrl.push("/public/uploads/" + file)
    });
    res.json(
        {
            message: "success",
            data: fileUrl
        }
    )
}

module.exports = {
    postFile,
    getUploadedFiles
}