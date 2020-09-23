const db = require('../../models/')
const Category = db.Category
const categoryService = require('../../services/categoryService')

const categoryController = {
  // 瀏覽分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  postCategories: (req, res) => {
    categoryService.postCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      return res.json(data)
    })
  }

}

module.exports = categoryController