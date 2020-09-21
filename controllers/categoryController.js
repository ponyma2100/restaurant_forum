const db = require('../models/')
const Category = db.Category
const categoryService = require('../services/categoryService')

const categoryController = {
  // 瀏覽分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  // 新增分類
  postCategories: (req, res) => {
    const name = req.body.name
    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      Category.create({
        name: name
      })
        .then(() => res.redirect('/admin/categories'))
    }
  },

  // 修改分類
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then(() => {
              res.redirect('/admin/categories')
            })
        })
    }
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(() => {
            res.redirect('/admin/categories')
          })
      })
  }

}

module.exports = categoryController