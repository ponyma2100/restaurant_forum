const db = require('../models')
const Category = db.Category


const categoryService = {

  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            callback({ categories: categories, category: category.toJSON() })
          })
      } else {
        callback({ categories: categories })
      }
    })
  },


  postCategories: (req, res, callback) => {
    const name = req.body.name
    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      Category.create({
        name: name
      })
        .then(() => {
          callback({ status: 'success', message: '' })
        })
    }
  },
}

module.exports = categoryService