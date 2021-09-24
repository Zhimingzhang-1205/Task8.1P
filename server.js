const express = require("express")
const bodyParser = require('body-parser')
const https = require("https")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const User = require("./models/User.js")
const AuthMiddleware = require("./models/authMiddleware.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require('passport')
const session = require('express-session')
const path = require("path");
const e = require('express')


mongoose.connect("mongodb+srv://admin:zhimingzhang@cluster0.bxxpf.mongodb.net/deakin?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(session({
    secret: '$$$DEakinSecret',
    resave: false,
    saveUninitialized: false,
    //   cookie: {maxAge: 120000 }
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy())

passport.use(
    new GoogleStrategy(
        {
            clientID:
                "1057177087299-s3rcjj4mnjt4gv44a4asjfam95ck65qh.apps.googleusercontent.com",
            clientSecret: "CDzotf9gLNGkOqpM41ICoftA",
            callbackURL:
                "https://loginzzm.herokuapp.com/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile, done) {
            const oldUser = await User.findOne({
                username: profile.emails[0].value,
            });
            if (oldUser) {
                done(null, oldUser);
            } else {
                const newUser = await User.create({
                    username: profile.emails[0].value,
                });
                done(null, newUser);
            }
        }
    )
);
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
    "/public/img/google.png",
    function (req, res) {
        res.sendFile(path.resolve(__dirname, "public/img/google.png"))
    }
);
app.get('/auth/google/callback',
    passport.authenticate("google", { failureRedirect: "./custlogin" }),
    function (req, res) {
        res.redirect('../../success');
    }
);

app.get('/', AuthMiddleware.isAuth, async (req, res) => {
    try {
        res.sendFile(path.resolve(__dirname, "./success.html"));
    } catch (err) { }
})
app.get('/payment', (req, res) => {
    res.sendFile(path.resolve(__dirname, "./payment.html"));
})
app.get('/success', (req, res) => {
    try {
        res.sendFile(path.resolve(__dirname, "./success.html"));
    } catch (err) { }
})
app.get('/custlogin', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/");
        return;
    }
    res.sendFile(path.resolve(__dirname + "/custlogin.html"));
})
app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, "/register.html"));
})

app.post('/register', (req, res) => {
    const lname = req.body.lastName
    const fname = req.body.firstName
    const city = req.body.city
    const email = req.body.email
    var password = req.body.password
    var cpassword = req.body.ConfirmPassword
    const address = req.body.address
    const address1 = req.body.address2
    const region = req.body.region
    const zip = req.body.zip
    const phone = req.body.phone


    const saltRouns = 10;
    const salt = bcrypt.genSaltSync(saltRouns);
    var hashpass = bcrypt.hashSync(password, salt);
    password = hashpass;
    var hashcpass = bcrypt.hashSync(cpassword, salt);
    cpassword = hashcpass;
    const user = new User(
        {
            lname: lname,
            fname: fname,
            city: city,
            email: email,
            password: password,
            cpassword: cpassword,
            address: address,
            address1: address1,
            region: region,
            zip: zip,
            phone: phone
        }
    )


    user.save((err) => {
        if (err) {
            console.log(err)
            req.flash('erron', 'erro')
            return res.redirect('/register.html')
        }
        else { console.log("Successfull!") }
        res.redirect('/')
    })

    User.register({ username: email }, password, (err, newUser) => {
        if (err) {
            res.send(err);
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/custlogin");
            });
        }
    });

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }]
    }
    jsonData = JSON.stringify(data)

    const apikey = "420e7e94f1749cd77058f9ba2770594e-us5"
    const url = "https://us5.api.mailchimp.com/3.0/lists/29e7bbe168"
    const options = {
        method: "POST",
        auth: "azi:420e7e94f1749cd77058f9ba2770594e-us5"
    }


    const request = https.request(url, options, (response) => {

        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })

    })

    request.write(jsonData)
    request.end()

})

app.post('/', (req, res) => {
    passport.authenticate("local", {
        failureRedirect: "/custlogin",
    }),
        (req, res) => {
            if (req.body.remeberMe) {
                var sevenDays = 1000 * 60 * 60 * 24 * 7;
                req.session.cookie.expires = new Date(Date.now() + sevenDays);
                req.session.cookie.maxAge = sevenDays;
            } else {
                req.session.cookie.expires = false;
            }
            const email = req.body.inputEmail
            var password = req.body.inputPassword


            User.find({ email: email }, function (erro, result) {
                for (var i = 0; i < result.length; i++) {


                    if (result[i] == null) {
                        res.flash("no users!")
                        console.log(erro)
                    } else {
                        var temp = result[i].password
                        console.log(temp)
                        const pwd = bcrypt.compareSync(password, temp)
                        console.log(pwd)
                        if (pwd) {
                            console.log("Successfull!")
                            res.sendFile(__dirname + "/success.html")
                        } else {
                            res.flash("password erro!")

                        }

                    }
                }



            })

        }


})

app.post('/payment', (req, res) => {

})

app.post('/custlogin',
    passport.authenticate("local", {
        failureRedirect: "./custlogin",
    }),
    (req, res) => {
        if (req.body.remeberMe) {
            var sevenDays = 1000 * 60 * 60 * 24 * 7;
            req.session.cookie.expires = new Date(Date.now() + sevenDays);
            req.session.cookie.maxAge = sevenDays;
        } else {
            req.session.cookie.expires = false;
        }
        const email = req.body.inputEmail
        var password = req.body.inputPassword

    }
);

app.post("/payment", function (req, res) {
    const items = [{ id: 1, price: 150000 }];

    let total = 0;
    req.body.items.forEach(function (item) {
        const itemJson = items.find(function (i) {
            return i.id == item.id;
        });
        total = total + itemJson.price * item.quantity;
    });

    stripe.charges
        .create({
            amount: total,
            source: req.body.stripeTokenId,
            currency: "usd",
        })
        .then(function () {
            console.log("Charge Successful");
            res.json({ message: "Successfully" });
        })
        .catch(function () {
            console.log("Charge Fail");
            res.status(500).end();
        });
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}

app.listen(port, (req, res) => {
    console.log("Server is running successfullly!")
})
