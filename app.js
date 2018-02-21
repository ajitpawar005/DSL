var express = require('express')
var app = express()

var mysql = require('mysql');
var path = require('path');
var cors = require('cors');
var bodyparser = require('body-parser');


/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))


// const route = require('./routes/route');


/**
 * Express Validator Middleware for Form Validation
 */ 
var expressValidator = require('express-validator')
app.use(expressValidator())


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


/**
 * This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */ 
var methodOverride = require('method-override')

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */ 
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())


//port no
const port = 3000;

//adding middleware - cors
app.use(cors());

//body - parser
app.use(bodyparser.json());


//static files 
app.use(express.static(path.join(__dirname,'/dist')));

//routes
app.set('view engine', 'ejs')


const category = require('./routes/category');
app.use('/api', category);

const subcategory = require('./routes/subcategory');
app.use('/api', subcategory);

const product = require('./routes/product');
app.use('/api', product);

const productmapping = require('./routes/productmapping');
app.use('/api', productmapping);

const industry = require('./routes/industry');
app.use('/api', industry);

// const subindustry = require('./routes/subindustry');
// app.use('/api', subindustry);

const businesstype = require('./routes/businesstype');
app.use('/api', businesstype);

const dataagreegators = require('./routes/dataagreegators');
app.use('/api', dataagreegators);

// const icraa = require('./routes/icraa');
// app.use('/api', icraa);

const parameters = require('./routes/parameters');
app.use('/api', parameters);

// const parameters = require('./routes/parameters');
// app.use('/api', parameters);

// const ratingmaster = require('./routes/ratingmaster');
// app.use('/api', ratingmaster);

// const team = require('./routes/team');
// app.use('/api', team);


// const userRoutes = require('./routes/user');
// const campgroundRoutes = require('./routes/campground');
// const commentRoutes = require('./routes/comment');

// app.use('/api', userRoutes);
// app.use('/api', campgroundRoutes);
// app.use('/api', commentRoutes);


//testing server
app.get('/',(req, res) =>{
    res.send('Successfully executed');
});

app.listen(port, ()=>{
    console.log('Server started at port:'+port);
});

