var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require('fs');

/* GET users listing. */
router.post('/setting/set', function(req, res, next) {
	var data = req.body.data;
  	fs.writeFileSync(path.join(__dirname, '..', 'conf', 'track-conf.json'), data);
	res.send(data);
});

router.get('/setting/get', function(req, res, next) {
	//var data = req.query.offset;
	var trackConf = fs.readFileSync(path.join(__dirname, '..', 'conf', 'track-conf.json'));
    var form = JSON.parse(trackConf.toString());
	res.send(form);
});

module.exports = router;
