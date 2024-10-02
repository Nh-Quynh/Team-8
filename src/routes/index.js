const ProductRouter = require('./ProductRouter')
const CategoryRouter = require('./CategoryRouter')
const MaterialRouter = require('./MaterialRouter')
const OrderRouter = require('./OrderRouter')

const routes = (app) => {
    app.use('/api', ProductRouter)
    app.use('/api', OrderRouter)
}

module.exports = routes