var express = require('express')
var app = express()
// SHOW LIST OF CATEGORY
app.get('/getCategory', function (req, res, next) {
	console.log(" One");
	var data = {
		"error": 1,
		"Category": ""
	};
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM category ORDER BY isActive DESC', function (err, rows, fields) {
			if (rows.length != 0) {
				data["error"] = 0;
				data["Category"] = rows;
				res.json(data);
			} else {
				data["Category"] = 'No category Found..';
				res.json(data);
			}
		})

	})
})
// SHOW A CATEGORY
app.get('/getCategory/:id', function (req, res, next) {

	
	var data = {
		"error": 1,
		"Categorie": ""
	};
	var ide=req.params.id;
	req.getConnection(function (error, conn) {
		
		conn.query('SELECT * FROM category WHERE isActive=1 AND pkey='+ide, function (err, rows, fields) {
			console.log(" ARRRRRRRRRRRARRRRRRRRRRRR", rows);
			res.json(rows);
			// if (rows.length != 0) {
			// 	data["error"] = 0;
			// 	data["Categorie"] = rows;
			// 	res.json(data);
			// } else {
			// 	data["Categorie"] = 'No category Found..';
			// 	res.json(data);
			// }
		})

	})
})
// ADD NEW CATEGORY POST ACTION
app.post('/addCategory', function (req, res, next) {
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
		createdBy: 'Messy',
		createdDate: CURRENT_TIMESTAMP

	}
	req.getConnection(function (error, conn) {
		if (!!user.name && !!user.description && !!user.code) {
			conn.query('INSERT INTO category SET ?', user, function (err, result) {

				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "Category Added Successfully";
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

// UPDATE CATEGORY POST ACTION
app.put('/updateCategory', function (req, res, next) {
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
		createdBy: 'Messy',
		createdDate: CURRENT_TIMESTAMP
	}
	console.log("add new data ", user)
	req.getConnection(function (error, conn) {

		conn.query('UPDATE category SET ? WHERE pkey = ' + user.pkey, user, function (err, result) {
		});
		if (!!user1.name && !!user1.description && !!user1.code) {
			conn.query('INSERT INTO category SET ?', user1, function (err, result) {

				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "Category Updated Successfully";
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
