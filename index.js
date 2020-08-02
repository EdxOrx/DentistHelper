const express = require("express");
const pug = require("pug");
const mongoose = require("mongoose");
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const session = require('express-session');
var morgan = require('morgan');

const MongoDBStore = require('connect-mongodb-session')(session);
const configDB = require('./config/db');
const Salt = require("./config/salt");

//configure mongodb
mongoose
.connect(configDB.dbName, configDB.dbConfig)
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});


morgan.token('id', function getId (req) {
    return req.id
})
function assignId (req, res, next) {
    req.id = uuidv4()
    next()
}
app.use(assignId);
// setup the logger
app.use(morgan(':id [:date[clf]] :remote-addr :remote-user ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"', { stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }))

//set engine views
app.set('views', 'views');
app.set("view engine", "pug");


//Set public directory
app.use(express.static(path.join(__dirname + '/public')));


app.use(express.urlencoded({ extended: true  }));
app.use(express.json({  }));

//Session manager
var storeSession = new MongoDBStore({
	uri: configDB.dbName,
	collection: 'sessions'
})
storeSession.on('error', function(error){
	console.log(error);
});
app.use(require('express-session')({
	secret: Salt(25),
	cookie: {
		maxAge: 1000*60*60
	},
	store: storeSession,
	resave: true,
	saveUninitialized: true
}));

function requiredLogin(req, res, next){
	if(req.session.adminAccess){
		next();
	}else{
		res.redirect('/admin-login-5052136');
	}
}

//Routes users
const index = require("./routes/users/index.js");
const posts = require("./routes/users/posts.js");
const doctor = require("./routes/users/doctor.js");
const contact = require("./routes/users/contact.js");
const users = require("./routes/users/users.js");
app.use("/", index);
app.use("/noticias", posts);
app.use("/doctor", doctor);
app.use("/contacto", contact);
app.use("/usuarios", users);


const loginA = require("./routes/admin/login.js");
app.use("/admin-login-5052136",loginA);

app.all('/admin-8*', requiredLogin, function(req, res, next){
	next();
});
//Routes admin
const indexA = require("./routes/admin/index.js");
const postsA = require("./routes/admin/posts.js");
const calendarA = require("./routes/admin/calendar.js");
const patientsA = require("./routes/admin/patients.js");
const usersA = require("./routes/admin/users.js");
const treatmentsA = require("./routes/admin/treatments.js");
const questionnaireA = require("./routes/admin/questionnaire.js");
const emailsA = require("./routes/admin/emails.js");

app.use("/admin-8E4145", indexA);
app.use("/admin-8E4145/posts", postsA);
app.use("/admin-8E4145/calendar", calendarA);
app.use("/admin-8E4145/patients", patientsA);
app.use("/admin-8E4145/users", usersA);
app.use("/admin-8E4145/treatments", treatmentsA);
app.use("/admin-8E4145/questionnaire",questionnaireA);
app.use("/admin-8E4145/emails",emailsA);



//Port to listen
app.listen(3000, (req, res) => {
    console.log("Running in the 3000 port");
});