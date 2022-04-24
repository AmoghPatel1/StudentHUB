const User = require('../models/User');
const Post = require('../models/Post'); 

exports.getLogin = (req, res, next) => {
    res.render('admin/login.ejs', {
        pageTitle: 'Admin login',
        username: '',
        password: '',
        warningSignIn: '',
        infoSignIn: '',
    });
}

exports.postLogin = (req, res, next) => {
    let { username, password } = req.body;

    username = username.trim();
    password = password.trim();

    if (username === '' || password == "") {
        res.render('admin/login', {
            pageTitle: 'Admin login',
            username: '',
            password: '',
            warningSignIn: 'Empty input fields!',
            infoSignIn: '',
        });
    }
    else {
        if (username === 'admin' && password === 'safepassword') {
        }
        else {
            res.render('admin/login', {
                pageTitle: 'Admin login',
                username: '',
                password: '',
                warningSignIn: 'Wrong credentials!',
                infoSignIn: '',
            });
        }
    }
};

exports.getPosts = (req, res, next) => {
    Post.find({}).populate(
        {
            path: 'postedBy',
        })
        .populate({
            path: 'postLikedBy',
            options: {
                limit: 2,
            }
        })
        .exec((err, posts) => {
            if (err) {
                res.json('Error fetching posts');
            }
            else {
                res.render('admin/home.ejs', {
                    pageTitle: 'Admin home',
                    path: '/posts',
                    posts: posts,
                });
            }
        });
}