"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var roots_1 = require("./routes/roots");
var artworks_1 = require("./routes/artworks");
var materials_1 = require("./routes/materials");
var shop_1 = require("./routes/shop");
var admin_1 = require("./routes/adminRoutes/admin");
var addProduct_1 = require("./routes/adminRoutes/addProduct");
var orders_1 = require("./routes/adminRoutes/orders");
var inquiries_1 = require("./routes/adminRoutes/inquiries");
var editDeleteProducts_1 = require("./routes/adminRoutes/editDeleteProducts");
var cookie_session_1 = __importDefault(require("cookie-session"));
var cookie = cookie_session_1.default({
    name: "session",
    keys: ["auth"],
    path: "/",
});
var router = express_1.Router();
exports.router = router;
// Middleware
router.use(cookie);
router.use(roots_1.router);
router.use(artworks_1.router);
router.use(materials_1.router);
router.use(shop_1.router);
router.use(admin_1.router);
router.use(addProduct_1.router);
router.use(orders_1.router);
router.use(inquiries_1.router);
router.use(editDeleteProducts_1.router);
