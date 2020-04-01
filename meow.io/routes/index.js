const express = require('express');
const util = require('util');

var router = express.Router();

// REDIS
const redis = require('redis');
let client = redis.createClient(6379, '127.0.0.1', {});

const clientGet = util.promisify(client.get).bind(client);
const clientSet = util.promisify(client.set).bind(client);
const clientLrange = util.promisify(client.lrange).bind(client);

const db = require('../data/db');

/**
 * Returns a JSON array of the best cat facts
 *
 */
async function bestFacts() {
  var key = 'meow-best-facts';
  var result = await clientGet(key);

  if (!result) {
    result = JSON.stringify((await db.votes()).slice(0,100));
    clientSet([key, result, 'EX', 10]);
  }

  return JSON.parse(result);
}

/**
 * Returns an array of the most recently uploaded base64-encoded cat images
 *
 * @param {*} count number of images
 */
async function recentCats(count) {
  var key = 'meow-recent-uploads';
  return await clientLrange(key, 0, count - 1);
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'meow.io', recentUploads: await recentCats(5), bestFacts: await bestFacts() });
});

module.exports = router;
