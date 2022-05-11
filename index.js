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
const { find } = require('./models/book.js');
const { render } = require('express/lib/response');
//routing 
const booksRoutes = require('./routes/books')
const userRoutes= require('./routes/users')
const reviewsRoutes= require('./routes/reviews')
const cartRoutes= require('./routes/cart')
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
// app.use(helmet());


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );

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



app.get('/',(req,res)=>{
    res.render('home')
})

// app.get('/myorders',isLoggedIn,(req,res)=>{
//     res.render('users/myOrders')
// })
// app.get('/theorders',isLoggedIn,catchAsync((req,res)=>{
//     res.render('books/theOrders')
// }))
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
