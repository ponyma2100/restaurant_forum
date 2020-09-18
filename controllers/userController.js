const bcrypt = require('bcryptjs')
const db = require('../models')
const user = require('../models/user')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (passwordCheck !== password) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複')
            return res.redirect('/signup')
          } else {
            User.create({
              name,
              email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號')
              return res.redirect('/signin')
            }).catch(error => console.log(error))
          }
        })
    }


  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] }]
    }
    )
      .then(user => {
        // console.log(user.Comments[0].Restaurant.dataValues.name)
        return res.render('user', { user: user.toJSON() })
      })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('edit', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    const id = req.params.id
    const { name, image } = req.body
    const { file } = req
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then((user) => {
            user.update({
              name: name,
              image: file ? img.data.link : user.image,
            }).then((user) => {
              req.flash('success_messages', `User's profile was successfully to update`)
              res.redirect(`/users/${id}`)
            })
          })
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({
            name: name,
            image: user.image,
          }).then(() => {
            req.flash('success_messages', `User's profile was successfully to update`)
            res.redirect(`/users/${id}`)
          })
        })

    }
  }

}

module.exports = userController