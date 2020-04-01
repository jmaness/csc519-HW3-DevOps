const multer = require('multer');
const fs = require('fs');
const util = require('util');

const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});
const clientRpush = util.promisify(client.rpush).bind(client);

var express = require('express');
var router = express.Router();

const uploadQueueKey = 'meow-upload-queue';

/* GET users listing. */
const upload = multer({ dest: './uploads/' })

router.post('/', upload.single('image'), function (req, res) {
  console.log(req.body) // form fields
  console.log(req.file) // form files

  if (req.file.fieldname === 'image') {
    fs.readFile(req.file.path, async function (err, data) {
      if (err) throw err;
      var img = new Buffer(data).toString('base64');

      // Push image onto queue to be processed later
      await clientRpush(uploadQueueKey, img);

      res.send('Ok');

    });
  }
});

module.exports = router;
