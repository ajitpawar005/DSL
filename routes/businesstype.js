var express = require('express')
var app = express()
// SHOW LIST OF BUSINESSTYPE
app.get('/getBusinessType', function (req, res, next) {
	var data = {
		"error": 1,
		"BusinessType": ""
	};
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM businesscategory ORDER BY isActive DESC', function (err, rows, fields) {
			if (rows.length != 0) {
				data["error"] = 0;
				data["BusinessType"] = rows;
				res.json(data);
			} else {
				data["BusinessType"] = 'No category Found..';
				res.json(data);
			}
		})

	})
})
// ADD NEW BUSINESSTYPE POST ACTION
app.post('/addBusinessType', function (req, res, next) {
	var data = {
		"error": 1,
		"Result": ""
	};
	var CURRENT_TIMESTAMP = { toSqlString: function () { return 'CURRENT_TIMESTAMP()'; } };
	var user = {
		name: req.body.name,
		description: req.body.description,
		code: req.body.code,
		isActive: 1,
		sDate: CURRENT_TIMESTAMP,
	}

	req.getConnection(function (error, conn) {
		if (!!user.name && !!user.description && !!user.code) {
			conn.query('INSERT INTO businesscategory SET ?', user, function (err, result) {
				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "BusinessType Added Successfully";
				}
				res.json(data);
			});
		}
		else {
			data["Result"] = "Please provide all required data (i.e : name, description, code)";
			res.json(data);
		}
	})
})
// UPDATE BUSINESSTYPE POST ACTION
app.put('/updateBusinessType', function (req, res, next) {
	console.log("Edit data", req.body)
	var data = {
		"error": 1,
		"Result": ""
	};
	var CURRENT_TIMESTAMP = { toSqlString: function () { return 'CURRENT_TIMESTAMP()'; } };
	var user = {
		isActive: 0,
		pkey: req.body.pkey,
		eDate: CURRENT_TIMESTAMP
	}
	var user1 = {
		name: req.body.name,
		description: req.body.description,
		code: req.body.code,
		isActive: 1,
		sDate: CURRENT_TIMESTAMP,
	}


	req.getConnection(function (error, conn) {
		conn.query('UPDATE businesscategory SET ? WHERE pkey = ' + user.pkey, user, function (err, result) {
		})
		if (!!user1.name && !!user1.description && !!user1.code) {
			conn.query('INSERT INTO businesscategory SET ?', user1, function (err, result) {
				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "Business Type Updated Successfully";
				}
				res.json(data);
			});
		}
		else {
			data["Result"] = "Please provide all required data (i.e : name, description, code)";
			res.json(data);
		}
	})

})
module.exports = app
