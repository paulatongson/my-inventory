"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var auth = function (req, res, next) {
    var cookie = req.session;
    if (!(cookie === null || cookie === void 0 ? void 0 : cookie.isLogged)) {
        res.status(401).render("admin/unauthorized");
        return;
    }
    next();
};
exports.auth = auth;
