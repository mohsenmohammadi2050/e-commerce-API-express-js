require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const bodyParser = require("body-parser");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var roleRouter = require("./routes/roles");
var membershipRouter = require("./routes/memberships");
var initialRouter = require("./routes/initial");
var brandRouter = require("./routes/brands");
var categoryRouter = require("./routes/categories");
var productRouter = require("./routes/products");
var statusRouter = require("./routes/statuses");
var cartsRouter = require("./routes/carts");
var ordersRouter = require("./routes/orders");
var searchRouter = require("./routes/search");

var indexRouter = require("./routes/admin/index");
var loginAdminRouter = require("./routes/admin/login");
var prouctsAdminRouter = require("./routes/admin/products")
var brandsAdminRouter = require("./routes/admin/brands")
var categoriesAdminRouter = require("./routes/admin/categories")
var rolesAdminRouter = require("./routes/admin/roles")
var statusesAdminRouter = require("./routes/admin/statuses")
var membershipsAdminRouter = require("./routes/admin/memberships")
var ordersAdminRouter = require("./routes/admin/orders")
var usersAdminRouter = require("./routes/admin/users")
var itemsAdminRouter = require("./routes/admin/items")


var db = require("./models");
db.sequelize.sync({ force: false });

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/roles", roleRouter);
app.use("/memberships", membershipRouter);
app.use("/init", initialRouter);
app.use("/brands", brandRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/statuses", statusRouter);
app.use("/checkout", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/search", searchRouter);

app.use("/", indexRouter);
app.use("/admin/auth", loginAdminRouter);
app.use("/admin/products", prouctsAdminRouter)
app.use("/admin/brands", brandsAdminRouter)
app.use("/admin/categories", categoriesAdminRouter)
app.use("/admin/roles", rolesAdminRouter)
app.use("/admin/statuses", statusesAdminRouter)
app.use("/admin/memberships", membershipsAdminRouter)
app.use("/admin/orders", ordersAdminRouter)
app.use("/admin/users", usersAdminRouter)
app.use("/admin/items", itemsAdminRouter)



app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
