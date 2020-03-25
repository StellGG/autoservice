var express = require('express')
var body_parser = require('body-parser')
var path = require('path')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
const bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema

var blogSchema = new Schema({
    login: String,
    email: String,
    password: String
  });

var Reg = mongoose.model('Reg', blogSchema);

var app = express()

async function mongo() {
    try {
        await mongoose.connect('mongodb+srv://Stell:123321qq@cluster0-sg73n.mongodb.net/autos', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
    } catch (error) {
        console.log(error)
    }
}
mongo()

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))

function makeid()
{
    var text = "";
    var possible = "1234567890";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const urlencodedParser = body_parser.urlencoded({extended: false})
app.use(body_parser.json())
//css style
app.use(urlencodedParser)
app.use(express.static(path.join( __dirname, '/assets/css/')))
//js
app.use(express.static(path.join( __dirname, '/assets/js/')))
//image
app.use(express.static(path.join( __dirname, '/assets/image/')))



app.set("views", path.join(__dirname, "/views/"))
app.set("view engine", 'ejs')

//Router
app.get('/', (req, res) => {
    const id = req.session.id
    const login = req.session.login
    res.render('index', {
        title: "Главная",
        login: login
    })
})

app.get('/contact',urlencodedParser, (req, res) => {
    const id = req.session.id
    const login = req.session.login
    res.render('contact', {
        title: "Контакты",
        login: login
    })
})
app.post("/contact", urlencodedParser,async function (request, response) {
    if(!request.body) return response.sendStatus(400)
    response.render(path.join(__dirname, "/views/blocks/mailhtml.ejs"), {title: "Вопрос добавлен!"})
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'belyhartem1@gmail.com',
            pass: 'Stellartemvlog'
          }
    })
    //messagecontact
    await transporter.sendMail({
        from: request.body.emailcontact,
        to: "stell_artem@mail.ru",
        subject: "Вопрос №" + makeid(),
        text: request.body.themescontact,
        html: request.body.messagecontact
    })
})

app.get('/aboutus', (req, res) => {
    const id = req.session.id
    const login = req.session.login
    res.render('aboutus', {
        title: "О нас",
        login: login
    })
})

app.get('/price', (req, res) => {
    const id = req.session.id
    const login = req.session.login
    res.render('price', {
        title: "Цены",
        login: login
    })
})

app.get('/auth', async (req, res) => {
    const id = req.session.id
    const login = req.session.login
    res.render('auth', {
        title: "Авторизация",
        login: login
    })
})

app.post('/auth', function(req, res) {
    Reg.findOne({
        login: req.body.login
    }).then(async user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    req.session.login = user.login
                    res.redirect('/')
                }else {
                    res.send("Логин или пароль неверны") 
                }
            })
            
        }else {
            res.send("Логин или пароль неверны")
        }
    })
})

app.get('/register', async (req, res) => {
    const login = req.session.login
    res.render('register', {
        title: "Регистрация",
        login: login
    })
})

app.post('/register', async (req, res) => {

    Reg.findOne({
        login: req.body.login
    }).then(async user => {
        if (!user) {  
            bcrypt.hash(req.body.password, null, null, async (err,hash) => {
                const register = new Reg({
                    login: req.body.login,
                    email: req.body.email,
                    password: hash
                })

                req.session.login = user.login

                await register.save()
                res.redirect('/auth')
            }) 
            
        }else {
            res.send("Логин занят")
        }
        
    })
})

app.get('/profile/:user', (req,res) => {
    const login = req.session.login
    res.render('profile', {
        title: login,
        login: login
    })
})

app.get('/logout', (req,res) => {
    if (req.session) {
        req.session.destroy(function() {})
        res.redirect('/')
    }   
})

app.listen(3012, () => {
    console.log('Server is started')
})