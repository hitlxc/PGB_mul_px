const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');

/* GET users listing. */
router.post('/setting/set', function(req, res, next) {
	let data = req.body.data;
  	fs.writeFileSync(path.join(__dirname, '..', 'conf', 'track-conf.json'), data);
	res.send(data);
});

router.get('/setting/get', function(req, res, next) {
	//let data = req.query.offset;
	let trackConf = fs.readFileSync(path.join(__dirname, '..', 'conf', 'track-conf.json'));
    let form = JSON.parse(trackConf.toString());
	res.send(form);
});

router.get('/track/get', function(req, res, next) {
	
	try{
		let start = parseInt(req.query.start);
		let end = parseInt(req.query.end);
		let chr = req.query.chr
		console.log(chr)
		let realStart = start + chr.length + start/50 + 2;
		let realEnd = end + chr.length + end/50 + 2

		rs = fs.createReadStream(path.join(__dirname, '..', 'public', 'genome', `${chr}.fa`), {start:realStart,end:realEnd});

		let sequnce = ''

		rs.on("data", function(data) {
		    let data_format = data.toString().replace(/\n/g,'').replace(/\r\n/g,'');
		    sequnce += data_format;
		});

		rs.on('end', function() {
			console.log({
		    	start:start,
		    	end:end,
		    	len:sequnce.length
		    })
		    res.send({
		    	start:start,
		    	end:end,
		    	sequnce:sequnce,
		    	len:sequnce.length
		    });
		});
	} catch (e){
		console.error(e)
	}
	
	
});
module.exports = router;
