const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

require('./routes')(app)