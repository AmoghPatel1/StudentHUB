
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.getHome = (req, res, next) => {
    getBasicUserDetails(req, (userid, username, email, profilePic, bookmarks, friends) => {
        Post.find({
        })
            .sort({ postDate: -1 })
            .populate({
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
                    User.find({
                        $and: [
                            {
                                "_id": {
                                    $not: {
                                        $in: [friends]
                                    }
                                }
                            },
                            {
                                "_id": {
                                    $not: {
                                        $eq: userid
                                    }
                                }
                            }
                        ]
                    })
                        .limit(3)
                        .exec((err, suggestedUsers) => {
                            if (err) {
                                res.json('Error fetching suggessted users');
                            }
                            else {
                                Post.find({})
                                    .sort({ postLikes: -1 })
                                    .limit(6)
                                    .populate(
                                        {
                                            path: 'postedBy',
                                        })
                                    .exec((err, trendingPosts) => {
                                        res.render('home/home', {
                                            pageTitle: 'Home',
                                            path: '/home',
                                            userId: userid,
                                            username: username,
                                            email: email,
                                            profilePic: profilePic,
                                            posts: posts,
                                            bookmarks: bookmarks,
                                            suggestedUsers: suggestedUsers,
                                            trendingPosts: trendingPosts
                                        });
                                    });
                            }
                        });
                }
            });
    });

};

exports.getExplore = (req, res, next) => {
    getBasicUserDetails(req, (userid, username, email, profilePic, bookmarks, friends) => {
        User.find({
            $and: [
                {
                    "_id": {
                        $not: {
                            $in: [friends]
                        }
                    }
                },
                {
                    "_id": {
                        $not: {
                            $eq: userid
                        }
                    }
                }
            ]
        })
            .limit(3)
            .exec((err, suggestedUsers) => {
                if (err) {
                    res.json('Error fetching suggessted users');
                }
                else {
                    res.render('home/explore', {
                        pageTitle: 'Explore',
                        path: '/explore',
                        userId: userid,
                        username: username,
                        email: email,
                        profilePic: profilePic,
                        suggestedUsers: suggestedUsers
                    });
                }
            });
    });
};

exports.getNotifications = (req, res, next) => {
    getBasicUserDetails(req, (userid, username, email, profilePic, bookmarks, friends) => {
        User.findOne({ _id: userid }).populate({ path: 'notifications', populate: { path: 'notificationAboutUser' } }).exec((err, user) => {
            if (err) {
                console.log(err);
            }
            else {
                User.find({
                    $and: [
                        {
                            "_id": {
                                $not: {
                                    $in: [friends]
                                }
                            }
                        },
                        {
                            "_id": {
                                $not: {
                                    $eq: userid
                                }
                            }
                        }
                    ]
                })
                    .limit(3)
                    .exec((err, suggestedUsers) => {
                        if (err) {
                            res.json('Error fetching suggessted users');
                        }
                        else {
                            res.render('home/notification.ejs', {
                                pageTitle: 'Notification',
                                path: '/notification',
                                userId: userid,
                                username: username,
                                email: email,
                                profilePic: profilePic,
                                notifications: user.notifications,
                                suggestedUsers: suggestedUsers
                            });
                        }
                    });
            }
        });
    });
};

exports.getBookmarks = (req, res, next) => {

    getBasicUserDetails(req, (userid, username, email, profilePic, bookmarks, friends) => {
        User.findOne({ _id: userid }).populate(
            {
                path: 'booksmarks',
                populate: { path: 'postedBy' }
            })
            .populate(
                {
                    path: 'booksmarks',
                    populate: {
                        path: 'postLikedBy',
                        options: {
                            limit: 2,
                        }
                    }
                })
            .exec((err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    User.find({
                        $and: [
                            {
                                "_id": {
                                    $not: {
                                        $in: [friends]
                                    }
                                }
                            },
                            {
                                "_id": {
                                    $not: {
                                        $eq: userid
                                    }
                                }
                            }
                        ]
                    })
                        .limit(3)
                        .exec((err, suggestedUsers) => {
                            if (err) {
                                res.json('Error fetching suggessted users');
                            }
                            else {
                                res.render('home/bookmarks', {
                                    pageTitle: 'Home',
                                    path: '/bookmarks',
                                    userId: userid,
                                    username: username,
                                    email: email,
                                    profilePic: profilePic,
                                    posts: user.booksmarks,
                                    bookmarks: bookmarks,
                                    suggestedUsers: suggestedUsers
                                });
                            }
                        });
                }
            });
    });
};


exports.getSettings = (req, res, next) => {

    const id = getUserId(req);

    User.findOne({ _id: id }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            User.find({})
                .limit(3)
                .exec((err, suggestedUsers) => {
                    if (err) {
                        res.json('Error fetching suggessted users');
                    }
                    else {
                        res.render('home/settings.ejs', {
                            pageTitle: 'Settings',
                            path: '/settings',
                            userId: docs._id,
                            username: docs.username.trim(),
                            email: docs.email.trim(),
                            password: docs.password.trim(),
                            profilePic: docs.profilePic.trim(),
                            suggestedUsers: suggestedUsers
                        });
                    }
                });
        }
    });
};

exports.postSettings = (req, res, next) => {

    const id = getUserId(req);

    User.findOneAndUpdate({ _id: id },
        {
            $set: { username: req.body.username.trim(), email: req.body.email.trim(), password: req.body.password.trim }
        }, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/settings');
            }
        }
    );

};

exports.getContactUs = (req, res, next) => {
    res.render('home/contactus.ejs', {
        pageTitle: 'Contact Us',
        path: '/contactus'
    });
};

exports.getMeetTheTeam = (req, res, next) => {
    res.render('home/meet-the-team.ejs', {
        pageTitle: 'Meet the Team',
        path: '/meet-the-team'
    });
};

exports.getPostModal = (req, res, next) => {
    res.render('home/post-modal.ejs', {
        pageTitle: 'Post',
        path: '/post-modal'
    });
};

exports.getProfile = (req, res, next) => {
    const userId = req.query.id;
    getBasicUserDetails(req, (currentUserId, username, email, profilePic, bookmarks, friends) => {
        if (userId === currentUserId.toString()) {
            User.findOne({ _id: userId }).
                populate(
                    {
                        path: 'posts',
                        populate: {
                            path: 'postedBy'
                        }
                    }
                )
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'postLikedBy',
                        options: {
                            limit: 2
                        }
                    }
                })
                .exec((err, searchedUser) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        User.find({
                            $and: [
                                {
                                    "_id": {
                                        $not: {
                                            $in: [friends]
                                        }
                                    }
                                },
                                {
                                    "_id": {
                                        $not: {
                                            $eq: userId
                                        }
                                    }
                                }
                            ]
                        })
                            .limit(3)
                            .exec((err, suggestedUsers) => {
                                if (err) {
                                    res.json('Error fetching suggessted users');
                                }
                                else {
                                    res.render('user/profile.ejs', {
                                        pageTitle: 'Profile',
                                        path: '',
                                        userId: currentUserId,
                                        username: username,
                                        email: email,
                                        profilePic: profilePic,
                                        searchedUserUsername: searchedUser.username.trim(),
                                        searchedUserEmail: searchedUser.email.trim(),
                                        searchedUserProfilePic: searchedUser.profilePic.trim(),
                                        posts: searchedUser.posts,
                                        notMyProfile: false,
                                        bookmarks: bookmarks,
                                        suggestedUsers: suggestedUsers
                                    });
                                }
                            });
                    }
                });
        }
        else {
            User.findOne({ _id: userId }).populate
                ({
                    path: 'posts',
                    populate: {
                        path: 'postedBy'
                    }
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'postLikedBy',
                        options: {
                            limit: 2
                        }
                    }
                })
                .exec((err, searchedUser) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        User.find({
                            $and: [
                                {
                                    "_id": {
                                        $not: {
                                            $in: [friends]
                                        }
                                    }
                                },
                                {
                                    "_id": {
                                        $not: {
                                            $eq: userId
                                        }
                                    }
                                }
                            ]
                        })
                            .limit(3)
                            .exec((err, suggestedUsers) => {
                                if (err) {
                                    res.json('Error fetching suggessted users');
                                }
                                else {
                                    User.findOne({ 'friends': userId }, (err, docs) => {
                                        const isFriend = (docs !== null)
                                        res.render('user/profile.ejs', {
                                            pageTitle: 'Profile',
                                            path: '',
                                            userId: currentUserId,
                                            username: username,
                                            email: email,
                                            profilePic: profilePic,
                                            searchedUserId: userId,
                                            searchedUserUsername: searchedUser.username.trim(),
                                            searchedUserEmail: searchedUser.email.trim(),
                                            searchedUserProfilePic: searchedUser.profilePic.trim(),
                                            posts: searchedUser.posts,
                                            notMyProfile: true,
                                            isFriend: isFriend,
                                            bookmarks: bookmarks,
                                            suggestedUsers: suggestedUsers
                                        });
                                    });
                                }
                            });
                    }
                });
        }
    });
}

exports.postAddPost = (req, res, next) => {
    let { category, description } = req.body;
    let filename;
    if (req.file) {
        filename = req.file.filename;
    }

    try {
        getBasicUserDetails(req, (userid, username, email, profilePic) => {
            const post = new Post({
                postDate: Date.now(),
                postCategory: category,
                postDescription: description,
                postImage: filename,
                postedBy: userid
            });
            post.save((err, postdocs) => {
                if (err) {
                    console.log(err);
                }
                else {
                    User.updateOne({ _id: userid },
                        {
                            $push: {
                                posts: {
                                    _id: postdocs._id
                                }
                            }
                        }, (err, docs) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.redirect('/home');
                            }
                        }
                    );
                }
            });
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.searchAutocomplete = (req, res, next) => {
    var regex = new RegExp(req.query["term"], 'i');
    var userFilter = User.find({ username: regex }, { 'username': 1 }).sort({ "updated_at": -1 }).sort({ "created_at": -1 }).limit(20);
    userFilter.exec((err, data) => {
        var result = [];
        if (!err) {
            if (data && data.length && data.length > 0) {
                data.forEach(user => {
                    let obj = {
                        id: user._id,
                        label: user.username
                    };
                    result.push(obj);
                });
            }
            res.jsonp(result);
        }
        else {

        }
    });
};

exports.getCategory = (req, res, next) => {
    const category = req.query.category;

    getBasicUserDetails(req, (userid, username, email, profilePic, bookmarks, friends) => {
        Post.find({ postCategory: category }).populate(
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
                    User.find({
                        $and: [
                            {
                                "_id": {
                                    $not: {
                                        $in: [friends]
                                    }
                                }
                            },
                            {
                                "_id": {
                                    $not: {
                                        $eq: userid
                                    }
                                }
                            }
                        ]
                    })
                        .limit(3)
                        .exec((err, suggestedUsers) => {
                            if (err) {
                                res.json('Error fetching suggessted users');
                            }
                            else {
                                res.render('home/category.ejs', {
                                    pageTitle: `${category.toUpperCase()}`,
                                    path: '/explore',
                                    userId: userid,
                                    username: username,
                                    email: email,
                                    profilePic: profilePic,
                                    posts: posts,
                                    bookmarks: bookmarks,
                                    suggestedUsers: suggestedUsers
                                });
                            }
                        });
                }
            });
    });
};

exports.followUser = (req, res, next) => {
    const userToFollow = req.query.id;
    const currentUserId = getUserId(req);

    User.updateOne({ _id: currentUserId },
        {
            $push: {
                friends: {
                    _id: userToFollow
                }
            }
        }, (err, docs) => {
            const notification = new Notification({
                notificationDate: Date.now(),
                notificationType: 'started following you.',
                notificationAboutUser: currentUserId
            });

            notification.save((err, notidocs) => {
                if (err) {
                    console.log(err);
                }
                else {

                    User.updateOne({ _id: userToFollow }, {
                        $push: {
                            notifications: {
                                _id: notidocs._id
                            }
                        }
                    }, (err, docs) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.redirect(`/profile?id=${userToFollow}`);
                        }
                    });
                }
            });

        }
    );
};

exports.unfollowUser = (req, res, next) => {
    const userToUnFollow = req.query.id;
    const currentUserId = getUserId(req);

    User.updateOne({ _id: currentUserId },
        {
            $pull: {
                friends: {
                    $in: [userToUnFollow]
                }
            }
        }, (err, docs) => {
            const notification = new Notification({
                notificationDate: Date.now(),
                notificationType: 'stoped following you.',
                notificationAboutUser: currentUserId
            });

            notification.save((err, notidocs) => {
                if (err) {
                    console.log(err);
                }
                else {
                    User.updateOne({ _id: userToUnFollow }, {
                        $push: {
                            notifications: {
                                _id: notidocs._id
                            }
                        }
                    }, (err, docs) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.redirect(`/profile?id=${userToUnFollow}`);
                        }
                    });
                }
            });
        });
};

exports.likePost = (req, res, next) => {
    const postId = req.query.postId;
    const currentUserId = getUserId(req);

    Post.findOneAndUpdate({ _id: postId }, {
        $addToSet: {
            postLikedBy: {
                _id: [currentUserId]
            }
        },
        $inc: {
            postLikes: 1,
        }
    }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            const notification = new Notification({
                notificationDate: Date.now(),
                notificationType: 'liked your post.',
                notificationAboutUser: currentUserId
            });

            notification.save((err, notidocs) => {
                if (err) {
                    console.log(err);
                }
                else {
                    User.updateOne({ _id: docs.postedBy }, {
                        $push: {
                            notifications: {
                                _id: notidocs._id
                            }
                        }
                    }, (err, docs) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.json({
                                "status": "liked",
                                "message": "Post has been liked"
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.unlikePost = (req, res, next) => {
    const postId = req.query.postId;
    const currentUserId = getUserId(req);

    Post.findOneAndUpdate({ _id: postId }, {
        $pull: {
            postLikedBy: {
                $in: [currentUserId]
            }
        },
        $inc:{
            postLikes: -1,
        }
    }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            const notification = new Notification({
                notificationDate: Date.now(),
                notificationType: 'unliked your post.',
                notificationAboutUser: currentUserId
            });

            notification.save((err, notidocs) => {
                if (err) {
                    console.log(err);
                }
                else {
                    User.updateOne({ _id: docs.postedBy }, {
                        $push: {
                            notifications: {
                                _id: notidocs._id
                            }
                        }
                    }, (err, docs) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.json({
                                "status": "unliked",
                                "message": "Post has been unliked"
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.bookmarkPost = (req, res, next) => {
    const postId = req.query.postId;
    const currentUserId = getUserId(req);

    User.findOneAndUpdate({ _id: currentUserId }, {
        $addToSet: {
            booksmarks: {
                _id: [postId]
            }
        }
    }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            const notification = new Notification({
                notificationDate: Date.now(),
                notificationType: 'bookmarked your post.',
                notificationAboutUser: currentUserId
            });

            notification.save((err, notidocs) => {
                if (err) {
                    console.log(err);
                }
                else {

                    User.updateOne({ _id: docs.postedBy }, {
                        $push: {
                            notifications: {
                                _id: notidocs._id
                            }
                        }
                    }, (err, docs) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.json({
                                "status": "bookmarked",
                                "message": "Post has been bookmarked"
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.unbookmarkPost = (req, res, next) => {
    const postId = req.query.postId;
    const currentUserId = getUserId(req);

    User.findOneAndUpdate({ _id: currentUserId }, {
        $pull: {
            booksmarks: {
                $in: [postId]
            }
        }
    }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            const notification = new Notification({
                notificationDate: Date.now(),
                notificationType: 'unbookmarked your post.',
                notificationAboutUser: currentUserId
            });

            notification.save((err, notidocs) => {
                if (err) {
                    console.log(err);
                }
                else {

                    User.updateOne({ _id: docs.postedBy }, {
                        $push: {
                            notifications: {
                                _id: notidocs._id
                            }
                        }
                    }, (err, docs) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.json({
                                "status": "Unbookmarked",
                                "message": "Post has been unbookmarked"
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.deleteNotification=(req,res,next)=>{
    const notiId=req.query.notiId;

    Notification.deleteOne({_id:notiId},(err,docs)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/notifications');
        }
    });
};

const getBasicUserDetails = (req, cb) => {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    User.findOne({ _id: verifyUser._id }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            let userid = docs._id;
            let username = docs.username.trim();
            let email = docs.email.trim();
            let profilePic = docs.profilePic.trim();
            let bookmarks = docs.booksmarks;
            let friends = docs.friends;
            cb(userid, username, email, profilePic, bookmarks, friends);
        }
    });
};

const getUserId = (req) => {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    return verifyUser._id;
}

