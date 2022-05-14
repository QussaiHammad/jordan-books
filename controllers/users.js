const User = require('../models/user');
const passport = require('passport');
const Cart = require('../models/cart')
module.exports.userLogin= (req, res) => {
    const redirectUrl = req.session.returnTo || '/books';
    delete req.session.returnTo;
    req.flash('success', 'Welcome Back')
    res.redirect(redirectUrl);
}

module.exports.userLogout= (req,res)=>{
    req.logOut()
    req.flash('success','you have logout')
    res.redirect ('/books')
}

module.exports.showLogin = (req, res) => {
    res.render('users/login');
}

module.exports.userRegister= async(req, res) => {
    try {
        const { email, username, password ,location } = req.body;
        const user = new User({ email, username ,location});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/books');
            
        })
    } catch (e) {
        res.redirect('/register');
    }

}
module.exports.showRegister =(req, res) => {
    res.render('users/register');
}