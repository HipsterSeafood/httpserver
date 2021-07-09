const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const axios = require('axios').default
const port = 3000

app.use(express.json())

authenticationInfo = {
    'access_token': '8769ec7cb23453b4351e482c9ee218f7da616e9a',
    'token_type': "Bearer",
    'refresh_token': "5b3208cf9e78c1e943e2fcdfd22dd0214638099e",
    'account_id': 3376284,
    'account_username': "radsmush12993",
    'client_id': 'd54932d40f00665'
}

const headersInfo = {

}


var slpstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, (__dirname + '\\slpfiles\\'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

var gifstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, (__dirname + '\\gifs\\'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.slp/i)) {
        req.fileValidationError = 'Only .slp files are allowed'
        return cb(new Error('Only .slp files are allowed'), false)
    }
    cb(null, true)
}

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/file/imgurupload', (req,res) => {
    console.log('Received POST request to /file/imgurupload')

    const gifUpload = multer({storage: gifstorage}).single('smashgif')
    gifUpload(req, res, err => {
        var apiInfo = {
            method: 'post',
            url: 'https://api.imgur.com/3/upload',
            headerInfo: {
                'Authorization': `Bearer ${authenticationInfo.access_token}`
                //'Authoriztion': clientId,
            },
            bodyInfo: {
                'image': req.file,
                'type': 'file',
                'name': req.file,
                'description': '',
                'title': ''
            }
        }
        console.log(req.body)
        //axios
        //    .post(apiInfo.url, apiInfo.bodyInfo, apiInfo.headerInfo)
        //    .then(console.log(res.body)).catch(console.log)
            
    })

})

app.post('/file/sendmeslps', (req, res) => {
    console.log('Received POST request')
    //Create multer object with options specified
    const upload = multer({storage: slpstorage, fileFilter: imageFilter}).single('slpfile')
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
        console.log(req.body)
        res.send(`You have uploaded ${req.file.originalname} successfully`)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on localhost:${port}`)
})