const fs = require('fs')
const db = require('../models')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const Restaurant = db.Restaurant
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true
    }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id,
      { raw: true }).then(restaurant => {
        return res.render('admin/restaurant', { restaurant: restaurant })
      })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then(restaurants => {
          req.flash('success_messages', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then(restaurants => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
    }
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id,
      { raw: true }).then(restaurant => {
        return res.render('admin/create', { restaurant: restaurant })
      })
  },

  putRestaurant: (req, res) => {

    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })

    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            res.redirect('/admin/restaurants')
          })
      })
  },

  getUsers: (req, res) => {
    return User.findAll({
      raw: true
    }).then(users => {
      return res.render('admin/users', { users: users })
    })
  },
  putUsers: (req, res) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (user.isAdmin) {
          user.update({
            isAdmin: false
          }).then(() => {
            req.flash('success_messages', `User'roll was successfully update to user`)
            return res.redirect('/admin/users')
          })
        } else {
          user.update({
            isAdmin: true
          }).then(() => {
            req.flash('success_messages', `User'roll was successfully update to admin`)
            return res.redirect('/admin/users')
          })
        }
      })

  }
}

module.exports = adminController
