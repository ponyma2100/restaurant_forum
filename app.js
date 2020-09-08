const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

require('./routes')(app)