const express = require('express');
const app = express();

const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const { url } = require('inspector');

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
        ]
    };

    

    const jsonData = JSON.stringify(data);
    
    const url = "https://us11.api.mailchimp.com/3.0/lists/41ee6e07c0";

    var apiKey = process.env.KEY
    const options = {
        method: "POST",
        auth: "afa1:" + apiKey
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) { 
            // success
            res.sendFile(__dirname + "/success.html");
        } else {
            // failure
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () { console.log("Server is running on port 3000.") });


// API KEY
// 4aadc5610774d8ade99ec6a2a20203ca-us11

// List ID
// 41ee6e07c0
