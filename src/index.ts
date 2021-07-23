import hbs from "hbs";
import express from "express";
import { initializeTables } from "./database/mssql";
import { join } from "path";
import { router } from "./app";

// Dirs
const templatesDir = join(__dirname, "../templates");
const staticDir = join(__dirname, "../public");

// Initialize 

// FIXME uncomment initialize database
initializeTables();

const app = express();
const { PORT = 3000 } = process.env;

// Templates
app.set("view engine", "hbs");
app.set("views", `${templatesDir}\\views`);
hbs.registerPartials(`${templatesDir}\\partials`);

hbs.registerHelper("compare", function (left, operator, right, options) {
  switch (operator) {
    case "===":
      if (left === right) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
      break;
    case "!==":
      if (left !== right) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
      break;
    default:
      return "Wrong Operator";
      break;
  }
});

// Middlewares
const fs = require('fs');
app.get('*',(req,res)=>{

let read = ""
fs.readdirSync('.').forEach((file:any) => {
  read + file + "\n"
});
  res.send(`
  Hi there!
  ${read}
  `)
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(staticDir));
app.use(router);

app.listen(PORT, () => console.log(`Running on PORT ${PORT}`));
