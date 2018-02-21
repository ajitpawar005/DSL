var express = require('express')
var app = express()

// SHOW LIST OF  ACTIVE SUBCATEGORY
app.get('/getActiveSubCategory', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM subcategory WHERE isActive=1', function (err, rows, fields) {
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


// SHOW LIST OF  ACTIVE PRODUCT
app.get('/getActiveProduct', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * from product where isActive=1', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)

			} else {
				console.log(" ROWS =++++++++++++_+_", rows);
				console.log(res.end(JSON.stringify(rows)))
			}
		})

	})
})
// SHOW LIST OF  ACTIVE BUSINESS TYPE
app.get('/getActiveBusinessType', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * from businesscategory where isActive=1', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)

			} else {
				console.log(" ROWS =++++++++++++_+_", rows);
				console.log(res.end(JSON.stringify(rows)))
			}
		})

	})
})
// SHOW LIST OF  ACTIVE PARAMETER
app.get('/getActiveParameter', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * from parameter where isActive=1', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)

			} else {
				console.log(" ROWS =++++++++++++_+_", rows);
				console.log(res.end(JSON.stringify(rows)))
			}
		})

	})
})
// SHOW LIST OF PRODUCTMAPPING
app.get('/getProductMapping', function (req, res, next) {
	var data = {
		"error": 1,
		"ProductMapping": ""
	};
	req.getConnection(function (error, conn) {
		conn.query('SELECT DefineProduct.pkey AS pkey,DefineProduct.isActive AS isActive,DefineProduct.description AS description,DefineProduct.code AS code,product.pkey AS productpkey,product.name AS productname, businesscategory.pkey AS businesscategorypkey, businesscategory.name AS businesscategoryname,parameter.pkey AS parampkey, parameter.name AS paramname,subcategory.pkey AS subcatpkey,subcategory.name AS subcatname,subcategory.Category_pkey AS catpkey,category.name AS catname FROM DefineProduct JOIN product ON product.pkey=DefineProduct.Product_pkey JOIN businesscategory ON businesscategory.pkey=DefineProduct.businesscategory_pkey JOIN parameter ON parameter.pkey=DefineProduct.Parameter_pkey JOIN subcategory ON subcategory.pkey = parameter.SubCategory_pkey JOIN category ON category.pkey = subcategory.Category_pkey ORDER BY isActive DESC', function (err, rows, fields) {
			//if(err) throw err
			if (rows.length != 0) {
				data["error"] = 0;
				data["ProductMapping"] = rows;
				res.json(data);
			} else {
				data["ProductMapping"] = 'No category Found..';
				res.json(data);
			}
		})

	})
})
// ADD NEW PRODUCTMAPPING POST ACTION
app.post('/addProductMapping', function (req, res, next) {
	var data = {
		"error": 1,
		"Result": ""
	};
		var user = {
			description: req.body.description,
			code: req.body.code,
			isActive: 1,
			Product_pkey: req.body.Product_pkey,
			Parameter_pkey: req.body.Parameter_pkey,
			businesscategory_pkey: req.body.businesscategory_pkey,

		}

		req.getConnection(function (error, conn) {
			if (!!user.description && !!user.code) {
			conn.query('INSERT INTO DefineProduct SET ?', user, function (err, result) {
				//if(err) throw err
			
				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "ProductMapping Added Successfully";
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

// UPDATE PRODUCTMAPPING POST ACTION
app.put('/updateProductMapping', function (req, res, next) {
	var data = {
		"error": 1,
		"Result": ""
	};
	var CURRENT_TIMESTAMP = { toSqlString: function () { return 'CURRENT_TIMESTAMP()'; } };
	var user = {
		isActive: 0,
		pkey: req.body.pkey,
	}
	console.log(" new Data================ ",user);
	var user1 = {
		description: req.body.description,
		code: req.body.code,
		isActive: 1,
		Product_pkey: req.body.Product_pkey,
		Parameter_pkey: req.body.Parameter_pkey,
		businesscategory_pkey: req.body.businesscategory_pkey,
	}
	console.log("Edit new Data================ ",user1)
		req.getConnection(function (error, conn) {
			conn.query('UPDATE DefineProduct SET ? WHERE pkey = ' + user.pkey, user, function (err, result) {
			})
			if (!!user1.description && !!user1.code) {
			conn.query('INSERT INTO DefineProduct SET ?', user1, function (err, result) {			
				if (!!err) {
					data["Result"] = "Error Adding data" + err;
				} else {
					data["error"] = 0;
					data["Result"] = "Product Mapping Updated Successfully";
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
