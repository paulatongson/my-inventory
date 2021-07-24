"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var auth_1 = require("../auth");
var multer_1 = __importDefault(require("multer"));
var sharp_1 = __importDefault(require("sharp"));
var mssql_1 = require("../../database/mssql");
var fs_1 = __importDefault(require("fs"));
var router = express_1.Router();
exports.router = router;
// this enables the file upload to become a buffer
var storage = multer_1.default.memoryStorage();
var fileSizeLimit = 50000000; // bytes
var upload = multer_1.default({
    storage: storage,
    limits: {
        // file size limit
        fileSize: fileSizeLimit,
    },
}).single("avatar");
var categories = [
    { id: 1, name: "Pens & Pencils" },
    { id: 2, name: "Markers" },
    { id: 3, name: "Drawing Pads" },
    { id: 4, name: "Coloring" },
    { id: 5, name: "Brushes" },
    { id: 6, name: "Others" },
    { id: 7, name: "Artworks" },
];
router.get("/admin/addProduct", auth_1.auth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        sendRender(res, 200, { categories: categories });
        return [2 /*return*/];
    });
}); });
router.post("/admin/addProduct", auth_1.auth, function (req, res) {
    upload(req, res, function (error) { return __awaiter(void 0, void 0, void 0, function () {
        var buffer, product, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    buffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
                    if (error instanceof multer_1.default.MulterError) {
                        sendRender(res, 400, {
                            notification: error.message + " - filesize limit " + fileSizeLimit,
                            categories: categories,
                        });
                        return [2 /*return*/, null];
                    }
                    else if (error) {
                        sendRender(res, 400, {
                            notification: "" + error,
                            categories: categories,
                        });
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, insertProducts(req.body)];
                case 1:
                    product = _b.sent();
                    if (!(buffer instanceof Buffer)) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, createImage(buffer, product.ImgName)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    res.status(500).send({ error: error_1 });
                    return [2 /*return*/];
                case 5:
                    sendRender(res, 200, {
                        categories: categories,
                        notification: "Product sucessfully added",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
function sendRender(res, statusCode, renderObject) {
    res.status(statusCode).render("admin/addProduct", __assign({ productsSelected: "text-primary", addProduct: "text-primary", ordersSelected: "text-dark", inquiriesSelected: "text-dark", editDeleteProducts: "text-dark" }, renderObject));
}
function createImage(buffer, fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var img, filePathAndName, bufferedSharp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    img = sharp_1.default(buffer);
                    filePathAndName = "d:/home/" + fileName;
                    return [4 /*yield*/, img
                            .resize(1000, 1000, {
                            withoutEnlargement: true,
                            fit: "inside",
                        })
                            .toFormat("webp")
                            .toBuffer()];
                case 1:
                    bufferedSharp = _a.sent();
                    fs_1.default.writeFileSync(filePathAndName, bufferedSharp);
                    return [2 /*return*/];
            }
        });
    });
}
function insertProducts(insertObject) {
    return __awaiter(this, void 0, void 0, function () {
        var CategoryID, Name, Description, Price, Quantity, insertQuery, response, newRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CategoryID = insertObject.CategoryID, Name = insertObject.Name, Description = insertObject.Description, Price = insertObject.Price, Quantity = insertObject.Quantity;
                    insertQuery = "\n    INSERT INTO Products(CategoryID, Name, Description, Price, Quantity) \n    VALUES (" + CategoryID + ", '" + Name + "', '" + Description + "', " + Price + ", " + Quantity + ")";
                    return [4 /*yield*/, mssql_1.exeQuery(insertQuery)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mssql_1.exeQuery("\n    SELECT TOP 1 * FROM Products ORDER BY ProductID DESC\n  ")];
                case 2:
                    response = _a.sent();
                    newRecord = response.recordset[0];
                    return [2 /*return*/, newRecord];
            }
        });
    });
}
