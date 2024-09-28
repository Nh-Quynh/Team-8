const ProductRouter = require('./ProductRouter')
const CategoryRouter = require('./CategoryRouter')
const MaterialRouter = require('./MaterialRouter')

const routes = (app) => {
    app.use('/api', ProductRouter)
}

module.exports = routes