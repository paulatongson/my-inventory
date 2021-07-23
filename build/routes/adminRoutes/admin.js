"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var mssql_1 = require("../../database/mssql");
var auth_1 = require("../auth");
var router = express_1.Router();
exports.router = router;
router.get("/login/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
        session = req.session;
        if (session && session.isLogged) {
            res.redirect("/admin");
            return [2 /*return*/];
        }
        res.render("admin/login");
        return [2 /*return*/];
    });
}); });
router.post("/login/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, session, request, isUserExist;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                session = req.session;
                return [4 /*yield*/, mssql_1.exeQuery("SELECT * FROM ADMIN WHERE UserName = '" + username + "' AND Password = '" + password + "'")];
            case 1:
                request = _b.sent();
                isUserExist = request.recordset.length;
                if (isUserExist) {
                    // checking is needed to assign true on isLogged
                    if (session && !session.isLogged) {
                        session.isLogged = true;
                    }
                    res.redirect("/admin/");
                    return [2 /*return*/];
                }
                res.render("admin/login", {
                    unauthorized: true,
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/admin/", function (req, res) {
    var session = req.session;
    if (session && session.isLogged) {
        res.render("admin/index", {
            title: "Welcome to admin page",
            productsSelected: "text-dark",
            ordersSelected: "text-dark",
            inquiriesSelected: "text-dark",
        });
        return;
    }
    // go to login page if not logged in
    res.redirect("/login");
});
router.post("/logout/", auth_1.auth, function (req, res) {
    var session = req.session;
    if (session && session.isLogged) {
        session.isLogged = null;
    }
    res.redirect("/");
});
router.get("/admin/", // (Add Product) and (Edit / Delete Product)
auth_1.auth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("/admin/addProduct");
        return [2 /*return*/];
    });
}); });
