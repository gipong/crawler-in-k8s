const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3709;

const multer = require('multer');
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/baseimages');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: Storage
}).array("baseimageUploaer", 10);

app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});
app.post('/baseimages/add', (req, res) => {
    upload(req, res, (err) => {
       if (err) {
           return res.end('upload image wrong')
       }

       return res.end('file upload successfully')
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
