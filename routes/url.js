const express = require('express');
const router = express.Router();
const {GenerateShortUrl, GetAnalytics} = require('../controllers/url');

router.post('/', GenerateShortUrl);

router.get('/analytics/:shortId', GetAnalytics);

module.exports = router;