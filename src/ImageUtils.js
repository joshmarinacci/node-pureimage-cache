const JPEG = "JPEG"
const PNG = "PNG"
const pi = require('pureimage')
const fs = require('fs')

module.exports = {
    loadImage: function (params) {
        if (params.extension === JPEG) return pi.decodeJPEGFromStream(fs.createReadStream(params.path))
        if (params.extension === PNG)   return pi.decodePNGFromStream(fs.createReadStream(params.path))
        throw new Error(`loadImage cannot handle extension ${params.extension}`)
    },

    scaleImage: function(params, image1) {
        const scale = image1.width / params.width
        const image2 = pi.make(image1.width / scale, image1.height / scale)
        const ctx = image2.getContext('2d')
        ctx.drawImage(image1,
            //src
            0, 0, Math.floor(image1.width), Math.floor(image1.height),
            //dst
            0, 0, Math.floor(image1.width / scale), Math.floor(image1.height / scale)
        )
        return image2
    },

    saveImage:function(params,image,path) {
        if(params.extension === JPEG) return pi.encodeJPEGToStream(image, fs.createWriteStream(path))
        if(params.extension === PNG) return pi.encodePNGToStream(image, fs.createWriteStream(path))
        throw new Error(`saveImage cannot handle extension ${params.extension}`)
    }
}