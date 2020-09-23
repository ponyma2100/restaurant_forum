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
    categoryService.postCategories(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      res.redirect('/admin/categories')
    })
  },

  // 修改分類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/categories')
      }
    })
  }
}

module.exports = categoryController