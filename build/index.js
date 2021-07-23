"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hbs_1 = __importDefault(require("hbs"));
var express_1 = __importDefault(require("express"));
var mssql_1 = require("./database/mssql");
var path_1 = require("path");
var app_1 = require("./app");
// Dirs
var templatesDir = path_1.join(__dirname, "../templates");
var staticDir = path_1.join(__dirname, "../public");
// Initialize 
// FIXME uncomment initialize database
mssql_1.initializeTables();
var app = express_1.default();
var PORT = process.env.PORT || 3000;
// Templates
app.set("view engine", "hbs");
app.set("views", templatesDir + "\\views");
hbs_1.default.registerPartials(templatesDir + "\\partials");
hbs_1.default.registerHelper("compare", function (left, operator, right, options) {
    switch (operator) {
        case "===":
            if (left === right) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
            break;
        case "!==":
            if (left !== right) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
            break;
        default:
            return "Wrong Operator";
            break;
    }
});
// Middlewares 
var fs = require('fs');
app.get('*', function (req, res) {
    var read = '';
    fs.readdirSync(templatesDir + "\\views").forEach(function (file) {
        read += file + "\n";
    });
    res.send(read);
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static(staticDir));
app.use(app_1.router);
app.listen(PORT, function () { return console.log("Running on PORT " + PORT); });
