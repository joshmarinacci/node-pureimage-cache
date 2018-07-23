const paths = require('path')
const ImageCache = require('../index.js')
const cache = new ImageCache({
    cacheDir:paths.join(__dirname,"thumbnails"), //absolute path of the dir to store thumbnails
    useWorkers:false, //use a background process to do the scaling
})

cache.makeThumbnail({
    width:100,  //desired width
    path: paths.join(__dirname,'bizcard.png'),  //absolute path on disk of the original image
    name: 'bizcard', //name used to generate the cached file on disk
    extension: ImageCache.PNG,
}).then(thumbPath =>{
    console.log("generated a thumbnail on disk at", thumbPath)
})

