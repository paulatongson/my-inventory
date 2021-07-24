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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var path_1 = __importDefault(require("path"));
var mssql_1 = require("../database/mssql");
var router = express_1.Router();
exports.router = router;
var htmlDirectory = path_1.default.join(__dirname, "../../public/html");
router.get("/shop", function (req, res) {
    res.sendFile(htmlDirectory + "/shop.html");
});
router.get("/shop/artworks", function (req, res) {
    res.sendFile(htmlDirectory + "/artworks.html");
});
router.get("/shop/materials", function (req, res) {
    res.sendFile(htmlDirectory + "/materials.html");
});
router.get("/cart", function (req, res) {
    res.sendFile(htmlDirectory + "/cart.html");
});
router.post("/api/cart", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ContactName, MobileNumber, EmailAdd, Address, orders, createContact, insertContactAffected, getNewContact, newContactRecord, createOrder, insertOrderAffected, getNewOrder, newOrderRecord, mappedOrders, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body.contact, ContactName = _a.ContactName, MobileNumber = _a.MobileNumber, EmailAdd = _a.EmailAdd, Address = _a.Address;
                orders = req.body.orders;
                return [4 /*yield*/, mssql_1.exeQuery("INSERT INTO Contacts\n  (ContactName, MobileNumber, EmailAdd, Address)\n  VALUES\n  (N'" + ContactName + "', N'" + MobileNumber + "', N'" + EmailAdd + "', N'" + Address + "')")];
            case 1:
                createContact = _b.sent();
                insertContactAffected = createContact.rowsAffected;
                if (!insertContactAffected[0]) {
                    res.status(400).send({ error: "Failed to Insert Contact" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, mssql_1.exeQuery("SELECT TOP 1 ContactID FROM Contacts ORDER BY ContactID DESC")];
            case 2:
                getNewContact = _b.sent();
                newContactRecord = getNewContact.recordset;
                return [4 /*yield*/, mssql_1.exeQuery("INSERT INTO Orders(ContactID)\n  VALUES(" + newContactRecord[0].ContactID + ")")];
            case 3:
                createOrder = _b.sent();
                insertOrderAffected = createOrder.rowsAffected;
                if (!insertOrderAffected[0]) {
                    res.status(400).send({ error: "Failed to Create Order" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, mssql_1.exeQuery("SELECT TOP 1 OrderID FROM Orders\n  ORDER BY OrderID DESC")];
            case 4:
                getNewOrder = _b.sent();
                newOrderRecord = getNewOrder.recordset;
                mappedOrders = "(" +
                    orders
                        .map(function (item) {
                        return newOrderRecord[0].OrderID + ",N'" + item.ProductName + "'," + item.Price + "," + item.Quantity;
                    })
                        .join("),(") +
                    ")";
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, , 9]);
                return [4 /*yield*/, mssql_1.exeQuery("INSERT INTO OrderDetails (OrderID, ProductName, Price, Quantity)\n      VALUES " + mappedOrders + "\n      ")];
            case 6:
                _b.sent();
                return [4 /*yield*/, mssql_1.exeQuery("\n    UPDATE Orders\n    SET TotalPrice =\n    (SELECT SUM(Price * Quantity) FROM OrderDetails WHERE OrderID = " + newOrderRecord[0].OrderID + ")\n    WHERE OrderID = " + newOrderRecord[0].OrderID + "\n  ")];
            case 7:
                _b.sent();
                return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                res.status(500).send({ error: error_1 });
                return [2 /*return*/];
            case 9:
                orders.forEach(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, mssql_1.exeQuery("\n      UPDATE Products\n      SET Quantity = Quantity - " + item.Quantity + "\n      WHERE ProductID = " + item.ProductID + "\n    ")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.send({ message: "Successful" });
                return [2 /*return*/];
        }
    });
}); });
