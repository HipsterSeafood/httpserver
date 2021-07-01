const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const port = 3000


app.use(express.json())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, (__dirname + '\\slpfiles\\'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.slp/i)) {
        req.fileValidationError
        return cb(new Error('Only .slp files are allowed'), false)
    }
    cb(null, true)
}

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/fileupload/sendmeslps', (req, res) => {
    console.log('Received POST request')
    //Create multer object with options specified
    const upload = multer({storage: storage, fileFilter: imageFilter}).single('slpfile')
    //Run multer object, file validation is broken so idk when i will fix that
    upload(req, res, err =>{
        if (req.fileValidationError) {
            return res.send(req.fileValidationError)
        }
        else if (!req.file){
            return res.send('Please specify a file to upload')
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err)
        }
        else if (err){
            return res.send(err)
        }
        //console.log(req.file)
        res.send(`You have uploaded ${req.file.originalname}sucessfully`)
    })
    
    
})

app.listen(port, () => {
    console.log(`Example app listening on localhost:${port}`)
})