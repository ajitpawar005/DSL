var express = require('express')
var app = express()
// SHOW LIST OF DataAggrigatorList
app.get('/getDataAggrigatorList', function (req, res, next) {
	var data = {
		"error": 1,
		"DataAgreegator": ""
	};
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM DataAggrigatorList ORDER BY isActive DESC', function (err, rows, fields) {
			if (rows.length != 0) {
				data["error"] = 0;
				data["DataAgreegator"] = rows;
				res.json(data);
			} else {
				data["DataAgreegator"] = 'No DataAgreegator Found..';
				res.json(data);
			}
		})

	})
})
// ADD NEW DataAggrigatorListPOST ACTION
app.post('/addDataAggrigatorList', function (req, res, next) {
	var data = {
		"error": 1,
		"Result": ""
	};
		var CURRENT_TIMESTAMP = { toSqlString: function () { return 'CURRENT_TIMESTAMP()'; } };
		var user = {
			name: req.body.name,
			description: req.body.description,
            code: req.body.code,
            APILink: req.body.APILink,
			isActive: 1,
			sDate: CURRENT_TIMESTAMP,
			createdBy: 'Messy',
			createdDate: CURRENT_TIMESTAMP

		}

		req.getConnection(function (error, conn) {
			if (!!user.name && !!user.description && !!user.code && !!user.APILink) {
			conn.query('INSERT INTO DataAggrigatorList SET ?', user, function (err, result) {
				
				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "Data Agreegator Added Successfully";
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
// UPDATE DataAggrigatorList POST ACTION
app.put('/updateDataAggrigatorList', function (req, res, next) {
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
            APILink: req.body.APILink,
			isActive: 1,
			sDate: CURRENT_TIMESTAMP,
			createdBy: 'Messy',
			createdDate: CURRENT_TIMESTAMP
	}
		req.getConnection(function (error, conn) {
			conn.query('UPDATE DataAggrigatorList SET ? WHERE pkey = ' + user.pkey,user, function (err, result) {
			})
			if (!!user1.name && !!user1.description && !!user1.code && !!user1.APILink) {
			conn.query('INSERT INTO DataAggrigatorList SET ?', user1, function (err, result) {
				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "Data Agreegator Updated Successfully";
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
