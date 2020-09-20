const db = require('../models')
const restaurant = require('../models/restaurant')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit })
      .then(result => {
        // data for pagination
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(result.count / pageLimit) //無條件進位
        let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page + 1 > pages ? pages : page + 1

        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          //「現在這間餐廳」是否有出現在「使用者的收藏清單」裡面
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: req.user.LikedRestaurants.map(l => l.id).includes(r.id),
          categoryName: r.Category.name
        }))
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => {
          // console.log(req.user)
          return res.render('restaurants', {
            restaurants: data,
            categories: categories,
            categoryId: categoryId,
            page: page,
            totalPage: totalPage,
            prev: prev,
            next: next
          })
        })
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      // console.log(restaurant.Comments[0].dataValues)
      //「現在的 user」是否有出現在收藏「這間餐廳的使用者列表」裡面
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(l => l.id).includes(req.user.id)
      restaurant.increment('viewCounts')
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited, isLiked
      })
    })
  },

  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']], //要排序的欄位、方式
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10, //指定數量
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant] //引入相關 Model 
      }).then(comments => {
        return res.render('feeds', { restaurants, comments })
      })
    })
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurant => {
      // console.log(restaurant)
      const commentCount = restaurant.Comments.length
      const FavoriteCount = restaurant.FavoritedUsers.length
      const incrementResult = restaurant.viewCounts
      return res.render('dashboard', { restaurant: restaurant.toJSON(), commentCount, FavoriteCount, incrementResult })
    })
  },

  getTopRest: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return Restaurant.findAll({
      limit: 10,
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      // 整理restaurants資料
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        // 計算追蹤者人數
        FavoriteCount: r.FavoritedUsers.length,
        // 判斷目前登入使用者是否已追蹤該 restaurants 物件
        isFavorited: r.FavoritedUsers.map(d => d.id).includes(req.user.id)
      }))
      // console.log(restaurants)
      // 依追蹤者人數排序清單
      restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount)
      return res.render('topRest', { restaurants: restaurants })
    })
  }

}

module.exports = restController