const path = require('path');

const express = require('express');

const adminController=require('../controllers/admin');

const router=express.Router();

router.get('/login',adminController.getLogin);

router.get('/deletePost/:postId',adminController.deletePost);

router.get('/deleteUser/:userId',adminController.deleteUser);

router.get('/makeAdmin/:userId',adminController.makeAdmin);

router.post('/login',adminController.postLogin);

router.get('/posts',adminController.isAdmin,adminController.getPosts);

router.get('/users',adminController.isAdmin,adminController.getUsers);

module.exports=router;