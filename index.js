if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const morgan= require('morgan')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer= require('multer')
const upload = multer({dest:'upload/'})
const axios = require('axios').default;


const sanitize = require('express-mongo-sanitize')
const helmet = require("helmet");

//
//for errors handeling
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {bookSchema, reviewSchema}= require('./sc')
//modules
const Book = require('./models/book.js');
const Review = require('./models/review');
const User = require('./models/user')
const Cart = require('./models/cart')
const { find } = require('./models/book.js');
const { render } = require('express/lib/response');
//routing 
const booksRoutes = require('./routes/books')
const userRoutes= require('./routes/users')
const reviewsRoutes= require('./routes/reviews')
const cartRoutes= require('./routes/cart')
const ordersRoutes= require('./routes/orders')
const theordersRoutes= require('./routes/theorders')
const db_url= process.env.DB_URL

// mongodb://localhost:27017/jordan-books
mongoose.connect('mongodb+srv://Qussai:a6qIdWmGAbPXRkg8@cluster0.ikrht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'))
app.use(sanitize())



const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//use the routing that we have 
app.use('/', userRoutes)
app.use('/books', booksRoutes)
app.use('/books/:id/reviews',reviewsRoutes )
app.use('/mycart', cartRoutes)
app.use('/myorders',ordersRoutes )
app.use('/theorders',theordersRoutes )




app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/paypal/:userid',async(req,res)=>{
const userid = await req.params.userid
const user = await User.findById(userid)
const usercart = await Cart.findById(user.cart).populate({
    path: 'books',
    populate: {
        path:'_id',
        path: 'name',
        path: 'image',
        path:'price',
        path:'author'
    }})
    let total = 0
    for(let books of usercart.books){
        let price=books.price
total = total + price
}
res.render('users/paypal',{usercart,total})
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port= process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
