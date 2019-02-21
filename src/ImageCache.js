const paths = require('path')
const fs = require('fs')
const ImageTask = require('./ImageTask')


class ImageCache {
    constructor(opts) {
        if (!opts) throw new Error("no options specified for the ImageCache")
        this.cacheDir = opts.cacheDir || paths.join(process.cwd(), 'thumbnails')  //set the cache dir
        if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir)
        console.log("making an image cache using the options", opts, this.cacheDir)
        this.useWorkers = (typeof opts.useWorkers !== 'undefined')?opts.useWorkers:false

        this.tasks = {}
    }

    makeThumbnail(params) {
        console.log("sending image with info",params)
        const final_path = this.calculateFinalPath(params)
        console.log("final path is",final_path)
        if (fs.existsSync(final_path)) return Promise.resolve(final_path)
        return this.generateImageOnDisk(params, final_path)
    }

    calculateFinalPath(params) {
        return paths.join(this.cacheDir, 'w_' + params.width + '_' + params.name + "." + params.extension)
    }

    generateImageOnDisk(params, fpath) {
        if (!fs.existsSync(params.path)) throw new Error("original image not found: " + params.path)

        if(!this.tasks[fpath]) this.tasks[fpath] = new ImageTask(params, fpath,this.useWorkers)

        return new Promise((res,rej)=>{
            this.tasks[fpath].listen(()=> res(fpath))
        })
    }

    sendImageFromDisk(params,path,res) {
        if(params.extension === ImageTask.JPEG || params.extension === ImageTask.PNG) {
            res.statusCode = 200;
            res.setHeader('Content-Type',params.contentType)
            fs.createReadStream(path).pipe(res)
        }
    }

    parseParams(path) {
        const params = {}
        path.substring(0, path.indexOf('/'))
            .split('-')
            .map(param => {
                const parts = param.split("_")
                params[parts[0]] = parts[1]
            })
        Object.keys(params).forEach(key => {
            if (key === 'w') params.width = parseInt(params[key])
            if (key === 'h') params.height = parseInt(params[key])
        })

        const img = path.substring(path.indexOf('/') + 1)
        params.path = img.substring(0, img.lastIndexOf('.'))
        params.ext = img.substring(img.lastIndexOf('.') + 1)
        if(params.ext.toLowerCase() === 'jpg' || params.ext.toLowerCase() === 'jpeg') {
            params.extension = ImageTask.JPEG
            params.contentType = 'image/jpeg'
        }
        if(params.ext.toLowerCase() === 'png') {
            params.extension = ImageTask.PNG
            params.contentType = 'image/png'
        }
        params.valid = params.extension?true:false
        // console.log("parsed parameters",params)
        return params
    }

    SEND_404(res, str) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.write(str)
        res.end()
    }

    sendInvalidFormat(params, res) {
        console.log("sending invalid format", params.ext)
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.write(params.ext + " is not an extension we can handle")
        res.end()
    }
}


ImageCache.JPEG = "JPEG"
ImageCache.PNG = "PNG"

module.exports = ImageCache


