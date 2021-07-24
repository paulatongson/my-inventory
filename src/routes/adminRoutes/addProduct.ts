import { Router, Request, Response, NextFunction } from "express";
import { auth } from "../auth";
import multer from "multer";
import sharp from "sharp";
import { exeQuery } from "../../database/mssql";
import { Product } from "./Product";
import fs from "fs";

const router = Router();

interface InsertProduct {
  CategoryID: number;
  Name: String;
  Description: string;
  Price: string;
  Quantity: number;
}

interface RequestBody extends Request {
  body: InsertProduct;
}

// this enables the file upload to become a buffer
const storage = multer.memoryStorage();
const fileSizeLimit = 50000000; // bytes

const upload = multer({
  storage: storage,
  limits: {
    // file size limit
    fileSize: fileSizeLimit,
  },
}).single("avatar");

const categories = [
  { id: 1, name: "Pens & Pencils" },
  { id: 2, name: "Markers" },
  { id: 3, name: "Drawing Pads" },
  { id: 4, name: "Coloring" },
  { id: 5, name: "Brushes" },
  { id: 6, name: "Others" },
  { id: 7, name: "Artworks" },
];

router.get(
  "/admin/addProduct",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    sendRender(res, 200, { categories: categories });
  }
);

router.post("/admin/addProduct", auth, (req: RequestBody, res: Response) => {
  upload(req, res, async (error) => {
    const buffer = req.file?.buffer;
    if (error instanceof multer.MulterError) {
      sendRender(res, 400, {
        notification: `${error.message} - filesize limit ${fileSizeLimit}`,
        categories: categories,
      });
      return null;
    } else if (error) {
      sendRender(res, 400, {
        notification: `${error}`,
        categories: categories,
      });

      return null;
    }

    const product = await insertProducts(req.body);
    if (buffer instanceof Buffer) {
      try {
        await createImage(buffer, product.ImgName);
      } catch (error) {
        res.status(500).send({ error: error });
        return;
      }
    }

    sendRender(res, 200, {
      categories: categories,
      notification: "Product sucessfully added",
    });
  });
});

function sendRender(res: Response, statusCode: number, renderObject: Object) {
  res.status(statusCode).render("admin/addProduct", {
    productsSelected: "text-primary",
    addProduct: "text-primary",
    ordersSelected: "text-dark",
    inquiriesSelected: "text-dark",
    editDeleteProducts: "text-dark",
    ...renderObject,
  });
}

async function createImage(buffer: Buffer, fileName: string) {
  const img = sharp(buffer);
  const filePathAndName = `d:/home/${fileName}`;
  const bufferedSharp = await img
    .resize(1000, 1000, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .toFormat("webp")
    .toBuffer();
  fs.writeFileSync(filePathAndName, bufferedSharp);
}

async function insertProducts(insertObject: InsertProduct) {
  const { CategoryID, Name, Description, Price, Quantity } = insertObject;
  const insertQuery = `
    INSERT INTO Products(CategoryID, Name, Description, Price, Quantity) 
    VALUES (${CategoryID}, N'${Name}', N'${Description}', ${Price}, ${Quantity})`;
  await exeQuery(insertQuery);

  // get the inserted product by accessing last item
  const response = await exeQuery(`
    SELECT TOP 1 * FROM Products ORDER BY ProductID DESC
  `);
  const newRecord: Product = response.recordset[0];
  return newRecord;
}

export { router };
