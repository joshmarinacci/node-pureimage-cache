# node-pureimage-cache
Image Thumbnail cache built on [PureImage](https://github.com/joshmarinacci/node-pureimage).
It scales down images
Typically it would be used inside of a web-server application.  Create an instance of the





``` javascript

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

```
