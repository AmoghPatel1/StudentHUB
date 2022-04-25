const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        User.findOne({
            username:username
        },(err,docs)=>{
            if(err){
                res.render('admin/login', {
                    pageTitle: 'Admin login',
                    username: '',
                    password: '',
                    warningSignIn: 'Login Failed!',
                    infoSignIn: '',
                });
            }
            else{
                if(docs===null){
                    res.render('admin/login', {
                        pageTitle: 'Admin login',
                        username: '',
                        password: '',
                        warningSignIn: 'Wrong credentials!',
                        infoSignIn: '',
                    });
                }
                else{
                    bcrypt.compare(password, docs.password, (err, result) => {
                        if(err){
                            res.render('admin/login', {
                                pageTitle: 'Admin login',
                                username: '',
                                password: '',
                                warningSignIn: err,
                                infoSignIn: '',
                            });
                        }
                        else{
                            if(result&&docs.isAdmin===true){
                                const token = docs.generateAuthToken();
                                res.cookie("jwt", token, {
                                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                                    httponly: true
                                });
                                res.redirect('/admin/posts');
                            }
                            else{
                                res.render('admin/login', {
                                    pageTitle: 'Admin login',
                                    username: '',
                                    password: '',
                                    warningSignIn: 'Wrong credentials!',
                                    infoSignIn: '',
                                });
                            }
                        }
                    });
                }
            }
        })
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
                res.render('admin/posts.ejs', {
                    pageTitle: 'Posts',
                    path: '/posts',
                    posts: posts,
                });
            }
        });
}

exports.deletePost = (req,res,next)=>{
    const postId=req.query.postId;
    Post.deleteOne({_id:postId},(err,docs)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/admin/posts');
    });
};

exports.deleteUser=(req,res,next)=>{
    const userId=req.query.userId;
    User.deleteOne({_id:userId},(err,docs)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin/users');
        }
    });
}

exports.makeAdmin=(req,res,next)=>{
    const userId=req.query.userId;
    User.updateOne({_id:userId},{$set:{isAdmin:true}},(err,docs)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin/users');
        }
    })
}

exports.getUsers = (req, res, next) => {
    User.find({
        'isAdmin':{
            $not:{
                $eq:true
            }
        }
    }).populate()
        .exec((err, users) => {
            if (err) {
                res.json('Error fetching users');
            }
            else {
                res.render('admin/users.ejs', {
                    pageTitle: 'Users',
                    path: '/users',
                    Users: users,
                });
            }
        });
}

exports.isAdmin = (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        User.findOne({ _id: verifyUser._id }, (err, user) => {
            if (err) {
                res.redirect('/login');
            }
            else {
                if (user.isAdmin) {
                    next();
                }
                else {
                    res.redirect('/login');
                }
            }
        })
    }
    catch (error) {
        res.redirect('/login');
    }
}