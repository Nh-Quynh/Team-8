const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const CategoryRouter = require("./CategoryRouter");
const MaterialRouter = require("./MaterialRouter");
const StatusRouter = require('./StatusRouter')
const DiscountRouter = require('./DiscountRouter');
const Discount = require("../models/DiscountModel");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/material", MaterialRouter);
  app.use('/api/status', StatusRouter)
  app.use('/api/discount', DiscountRouter)
};
module.exports = routes;
