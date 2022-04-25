const path = require('path');

const express = require('express');

const homeController = require('../controllers/home');
const authController = require('../controllers/auth');

const Upload = require('../util/Upload');

const router=express.Router();

router.get('/',authController.getNone);

router.get('/login',authController.getLogin);

router.get('/home',authController.isAuth,homeController.getHome);

router.get('/explore',authController.isAuth,homeController.getExplore);

router.get('/bookmarks',authController.isAuth,homeController.getBookmarks);

router.get('/notification',authController.isAuth,homeController.getNotifications);

router.get('/settings',authController.isAuth,homeController.getSettings);

router.post('/settings',authController.isAuth,homeController.postSettings);

router.get('/profile',authController.isAuth,homeController.getProfile);

router.get('/contactus',authController.isAuth,homeController.getContactUs);

router.get('/meet-the-team',authController.isAuth,homeController.getMeetTheTeam);

router.post('/addPost',authController.isAuth,Upload.upload.single('file'),homeController.postAddPost);

router.get('/autocomplete/',authController.isAuth,homeController.searchAutocomplete);

router.get('/follow',authController.isAuth,homeController.followUser);

router.get('/unfollow',authController.isAuth,homeController.unfollowUser);

router.get('/like',authController.isAuth,homeController.likePost);

router.get('/unlike',authController.isAuth,homeController.unlikePost);

router.get('/bookmark',authController.isAuth,homeController.bookmarkPost);

router.get('/unbookmark',authController.isAuth,homeController.unbookmarkPost);

router.get('/category',authController.isAuth,homeController.getCategory);

router.get('/delete-notification',authController.isAuth,homeController.deleteNotification);

router.get('/search',authController.isAuth,homeController.searchByName);

module.exports=router;