const paths = require('path')
const {fork} = require('child_process')
const ImageUtils = require("./ImageUtils")

class ImageTask {
    constructor(params, fpath, USE_WORKERS) {
        this.listeners = []
        console.log("generating image from params",params,'and final path',fpath,'workers = ', USE_WORKERS)

        if(USE_WORKERS) {
            const ch = fork(paths.join(__dirname,'./ImageWorker'))
            ch.on('message',(msg => this.listeners.forEach(cb => cb(msg))))
            ch.send({params:params, fpath:fpath})
        } else {
            ImageUtils.loadImage(params).then(image1 => {
                const image2 = ImageUtils.scaleImage(params, image1)
                return ImageUtils.saveImage(params, image2, fpath)
            }).then((path) => {
                this.listeners.forEach(cb => cb(path))
            })
        }
    }

    listen(cb) {
        this.listeners.push(cb)
    }

}

ImageTask.JPEG = "JPEG"
ImageTask.PNG = "PNG"

module.exports = ImageTask


