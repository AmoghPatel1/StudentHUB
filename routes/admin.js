const path = require('path');

const express = require('express');

const adminController=require('../controllers/admin');

const router=express.Router();

router.get('/login',adminController.getLogin);

router.get('/home',adminController.getPosts);

router.post('/login',adminController.postLogin);

module.exports=router;