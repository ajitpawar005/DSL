var express = require('express')
var app = express()
// SHOW LIST OF PARAMETER
app.get('/getParameter', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT parameter.name AS name,parameter.isActive AS isActive,subcategory.pkey AS pkey,subcategory.name AS subcatname,subcategory.Category_pkey AS Category_pkey,category.name AS catname FROM parameter JOIN subcategory ON subcategory.pkey = parameter.SubCategory_pkey JOIN category ON category.pkey = subcategory.Category_pkey', function (err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)

			} else {
				console.log("Parameter Data:")
				console.log(rows)
				res.end(JSON.stringify(rows));
			}
		})

	})
})
// SHOW A SUBCATEGORY
app.get('/getParameter/:id', function (req, res, next) {

	
	var data = {
		"error": 1,
		"Parameter": ""
	};
	var ide=req.params.id;
	req.getConnection(function (error, conn) {
		
		conn.query('SELECT * FROM parameter WHERE isActive=1 AND pkey='+ide, function (err, rows, fields) {
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
// ADD NEW PARAMETER AND PARAMETRECRITERIA POST ACTION
app.post('/addParameter', function (req, res, next) {
	console.log("add Parameter Console ", req.body);
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('description', 'description is required').notEmpty()             //Validate description
	req.assert('code', 'code is required').notEmpty()
	var errors = req.validationErrors()

	if (!errors) {   //No errors were found.  Passed Validation!
		var CURRENT_TIMESTAMP = { toSqlString: function () { return 'CURRENT_TIMESTAMP()'; } };
		console.log(CURRENT_TIMESTAMP)
		var user = {
			name: req.sanitize('name').escape().trim(),
			description: req.sanitize('description').escape().trim(),
			code: req.body.code,
			isActive: 1,
			sDate: CURRENT_TIMESTAMP,
			createdBy: 'Messy',
			createdDate: CURRENT_TIMESTAMP,
			SubCategory_pkey: req.body.subcategory.pkey,
			isManual: req.body.isManual.name =='Manual'? 1:0,
			maxScore_copy1: req.body.maximummarks,
			ParameterUnit: req.body.ParameterUnit
		}
		
		console.log(" OBJECT TO +++++++++++++++++++++++++++++++++++++ ", user);
		req.getConnection(function (error, conn) {

			conn.query('INSERT INTO parameter SET ?', user, function (err, result) {
				//if(err) throw err
				console.log(" Err +++++++++++++++++++++++++++++++++++  ", err);
				console.log(" RESULT +++++++++++++++++++++++++++++++++++  ", result);
				if (err) {
					req.flash('error', err);
				} else {
					req.flash('success', 'Data added successfully!');
				}
			})
		})
		// var usercriteria = {
		// 	desc: req.sanitize('desc').escape().trim(),
		// 	code: req.body.code,
		//     criteria: req.body.criteria,
		//     condition: req.body.condition,
		//     value1: req.body.value1,
		//     value2: req.body.value2,
		//     Parameter_pkey: req.body.Parameter_pkey,


		// }

		// req.getConnection(function (error, conn) {
		// 	conn.query('INSERT INTO paramcriteria SET ?', usercriteria, function (err, result) {
		// 		//if(err) throw err
		// 		if (err) {
		// 			req.flash('error', err)


		// 		} else {
		// 			req.flash('success', 'Data added successfully!')

		// 		}
		// 	})
		// })
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)


		console.log(error_msg)
	}
})
// UPDATE PARAMETER POST ACTION
app.put('/updateParameter', function (req, res, next) {

	console.log(" Data for EDIT", req.body);

	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('description', 'description is required').notEmpty()             //Validate description 

	var errors = req.validationErrors()
	var d = timeInMss = new Date(Date.now());
	console.log("Current Date ", d);

	var CURRENT_TIMESTAMP = { toSqlString: function () { return 'CURRENT_TIMESTAMP()'; } };
	var user = {
		name: req.sanitize('name').escape().trim(),
		description: req.sanitize('description').escape().trim(),
		isActive: 0,
		pkey: req.body.pkey,
		eDate: CURRENT_TIMESTAMP
	}
	console.log(user)
	console.log(errors)
	if (!errors) {   //No errors were found.  Passed Validation!

		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/

		req.getConnection(function (error, conn) {
			console.log(" Update ", user.eDate, " " + req.body.pkey);
			conn.query('UPDATE parameter SET ? WHERE pkey = ' + user.pkey, user, function (err, result) {
				//if(err) throw err

				if (err) {
					req.flash('error', err)
					console.log(user)

				} else {
					req.flash('success', 'Data updated successfully!')
					console.log(user)
				}
			})
			var addUser = {
				name: req.sanitize('name').escape().trim(),
				description: req.sanitize('description').escape().trim(),
				isActive: 1,
				sDate: CURRENT_TIMESTAMP,
				createdBy: 'Messy',
				createdDate: CURRENT_TIMESTAMP
			}

			console.log(" addUser  ==============" + addUser);

			conn.query('INSERT INTO parameter SET ?', addUser, function (err, result) {
				console.log(" ADD ERR ==============", err, "================SUCCESS " + result);
				if (err) {
					req.flash('error', err)


				} else {
					req.flash('success', 'Data added successfully!')

				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)


	}
})
module.exports = app
