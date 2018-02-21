var express = require('express')
var app = express()
// SHOW LIST OF  ACTIVE CATEGORY
app.get('/getActiveCategory', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM category WHERE isActive=1', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)

			} else {
				//console.log(rows)
				res.end(JSON.stringify(rows));
			}
		})

	})
})


// SHOW LIST OF SUBCATEGORY
app.get('/getsubCategory', function (req, res, next) {
	var data = {
		"error": 1,
		"SubCategory": ""
	};
	req.getConnection(function (error, conn) {
		conn.query('SELECT subcategory.pkey AS pkey,subcategory.code AS code,subcategory.name AS name,subcategory.description AS description,subcategory.isActive AS isActive,subcategory.Category_pkey AS Category_pkey,category.name AS categoryname FROM subcategory LEFT JOIN category ON subcategory.Category_pkey = category.pkey', function (err, rows, fields) {
			if (rows.length != 0) {
				data["error"] = 0;
				data["SubCategory"] = rows;
				res.json(data);
			} else {
				data["SubCategory"] = 'No subcategory Found..';
				res.json(data);
			}
		})
	})
})
// SHOW A SUBCATEGORY
app.get('/getsubCategory/:id', function (req, res, next) {

	
	var data = {
		"error": 1,
		"SubCategorie": ""
	};
	var ide=req.params.id;
	req.getConnection(function (error, conn) {
		
		conn.query('SELECT * FROM subcategory WHERE isActive=1 AND pkey='+ide, function (err, rows, fields) {
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
// ADD NEW SUBCATEGORY POST ACTION
app.post('/addsubCategory', function (req, res, next) {
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
		createdDate: CURRENT_TIMESTAMP,
		Category_pkey: req.body.pkey
	}
	console.log(user)
	req.getConnection(function (error, conn) {
		if (!!user.name && !!user.description && !!user.code) {
			conn.query('INSERT INTO subcategory SET ?', user, function (err, result) {
				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "SubCategory Added Successfully";
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

// UPDATE SUBCATEGORY POST ACTION
app.put('/updatesubCategory', function (req, res, next) {
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
		createdDate: CURRENT_TIMESTAMP,
		Category_pkey: req.body.pkey
	}
	req.getConnection(function (error, conn) {

		conn.query('UPDATE subcategory SET ? WHERE pkey = ' + user.pkey, user, function (err, result) {
		});
		if (!!user1.name && !!user1.description && !!user1.code) {
			conn.query('INSERT INTO subcategory SET ?', user1, function (err, result) {


				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "SubCategory Updated and Added  Successfully";
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
