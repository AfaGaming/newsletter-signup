const express = require('express');
const app = express();

const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const { url } = require('inspector');
const nodemailer = require('nodemailer');
require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.emailOfUser;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ],
        update_existing: true // add this line to update existing contacts
    };
    

    

    const jsonData = JSON.stringify(data);
    
    const url = "https://us11.api.mailchimp.com/3.0/lists/41ee6e07c0";

    var apiKey = process.env.KEY
    const options = {
        method: "POST",
        auth: "Afa:" + apiKey
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) { 
            // success
            res.sendFile(__dirname + "/success.html");

            // send email

            // transporter
            let transporter = nodemailer.createTransport({
                service: 'Outlook',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });


            // create message
            const messageBody = `Hey Afa! <br> <br>

            Great news! You're now part of our awesome newsletter community! You can look forward to loads of helpful tech tools and news that I'm sure you'll love.
            <br> <br>
            But if you didn't intend to join us, don't worry! You can always opt-out by clicking the <a href="https://www.example.com">unsubscribe</a> button at the bottom of any of our emails.
            <br> <br>
            Thanks for joining our community, Afa! We're excited to have you on board.
            <br> <br>
            Cheers, <br>
            Afa
            <br> <br>
            P.S. This email was sent automatically through an unmonitored mailbox. For questions, please email ayaanfurruqaziz88@gmail.com or you may simply click <a href="mailto:ayaanfurruqaziz88@gmail.com">here</a>.` 

            // mail options
            let mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Confirm Your Subscription to Our Newsletter",
                html: messageBody
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent! ');
                }
            });


        } else {
            // failure
            res.sendFile(__dirname + "/failure.html");
        }
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () { console.log("Server is running on port 3000.")});