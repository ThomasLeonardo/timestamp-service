'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var moment= require('moment');
var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);
app.use(express.static('public'));

app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.get('/:date',function(req,res){
	var formats=['x','MMMM DD, YYYY'];
	var date=moment(req.params.date, formats, true);
	var dates={};
	if(date.isValid())
	{
		dates['unix']=date.format('x');
		dates['natural']=date.format('MMMM DD, YYYY');
	}
	else
	{
		dates['unix']=null;
		dates['natural']=null;
	}
	res.end(JSON.stringify(dates));
	
});
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});