const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');

const nodemailer = require("nodemailer");
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_user:'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'
    }
}));

// Creating access to the database in the atlas
mongoose.connect("mongodb+srv://access:123@cluster0.e1tzl.mongodb.net/shop", {useNewUrlParser: true});


const app = express(); 

app.use(bodyParser.urlencoded( {extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Fromat to create a mongoose schema
const appointmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	  },
	number: {
		type: Number,
		required: true
	  },
	email: {
		type: String,
		required: true
	  },
	date: {
		type: String,
		required: true
	  },
	time: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	}
})

//Creating a mongoose model and a schema in it
const App = mongoose.model('App', appointmentSchema);

//Setting up the ejs template
app.set('view engine', 'ejs');
app.set('views', 'views');

//Getting a request from the user
app.get('/',(req, res,next) => {
	res.render('home')
})

//Sending the data given by the user in the monogDb database
app.post("/", (req,res) => {
//The inputs being retrieved by the mongoDB user
	let newApp = new App({
	    name: req.body.name,
		number: req.body.number,
		email: req.body.email,
		date: req.body.date,
		time: req.body.time,
		comment: req.body.comment
	})
	newApp.save()
	res.redirect('/')
	const email = req.body.email;
	newApp.findOne({ email : email })
	.then(result => {
		transporter.sendMail({
			to : email,
			to : 'drxyz@email.com',
			from: 'plasmabiotech@biotech.com',
			subject: "sighup succefull",
			html: '<h1>Your appointment has been booked</h1>'
		})
		.catch(err => {
			console.log(err);
		})
		
		console.log(result)
	})
	
})

//Server creating a thread and going inside a loop
app.listen(3000, () =>{
	console.log("Server running")
})