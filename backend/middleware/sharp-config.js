


const sharp = require('sharp');
const fs = require('fs');

const OptimizeImg = async (req, res, next) => {
    try {
    if(req.file) {
        console.log(req.file.path)
        await sharp(req.file.path)
            .webp({ quality: 80 })
            .resize({
                width: 200,
                height: 300,
                fit: sharp.fit.cover
              })
            .toFile(req.file.path.replace(/\.jpeg|\.jpg|\.png/g, "_") + "thumbnail.webp")
    }
    next()  
    } catch (err) {
        res.status(500).json({ err })
}
}
module.exports = OptimizeImg;


