const express = require('express')
const router = express.Router()
// 引入 multer 並設定上傳資料夾 
const multer = require('multer')
const passport = require('passport')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController')
// const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// restaurants
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)

router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)

router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)

router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

// categories

router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)

router.get('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.getCategories)

router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategories)

router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)

// 登入登出
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

module.exports = router