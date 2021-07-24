import { Router, Request, Response, NextFunction } from "express";
import { auth } from "../auth";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";
import { exeQuery } from "../../database/mssql";
import { Product } from "./Product";
const router = Router();

interface RequestParamsID extends Request {
  params: {
    ProductID: string;
  };
}

router.get(
  "/admin/editDeleteProducts",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await exeQuery("SELECT * FROM Products");
    const allProducts: Product[] = result.recordset;

    sendRender(res, 200, {
      allProducts: allProducts,
    });
  }
);

router.delete(
  "/admin/editDeleteProducts/:ProductID",
  auth,
  async (req: RequestParamsID, res: Response) => {
    const { ProductID } = req.params;
    if (!ProductID) {
      res.status(400).send();
      return;
    }
    let notification: string = "";
    let product: Product | null = null;
    if (ProductID) {
      product = await (
        await exeQuery(`SELECT * FROM Products WHERE ProductID=${ProductID}`)
      ).recordset[0];

      if (product) {
        try {
          fs.unlinkSync(`public/imgs/${product?.ImgName}`);
        } catch (error) {}
        await exeQuery(`DELETE FROM Products WHERE ProductID=${ProductID}`);
        notification = `Successful: ${product.Name} is deleted`;
      }
    }

    sendRender(res, 200, { notification: notification });
  }
);

/*
EDIT PRODUCTS BELOW
*/

// this enables the file upload to become a buffer
const storage = multer.memoryStorage();
const fileSizeLimit = 5000000; // bytes

const upload = multer({
  storage: storage,
  limits: {
    // file size limit
    fileSize: fileSizeLimit,
  },
}).single("avatar");

// Edit
router.get(
  "/admin/editDeleteProducts/:ProductID",
  auth,
  async (req: Request, res: Response) => {
    const { ProductID } = req.params;

    const response = await exeQuery(
      `SELECT * FROM Products WHERE ProductID=${ProductID}`
    );
    const isNullResponse = response.recordset.length;

    if (!isNullResponse) {
      res.redirect("/admin/editDeleteProducts/");
      return;
    }
    const updateProduct: Product = response.recordset[0];

    const categories = [
      { id: 1, name: "Pens & Pencils" },
      { id: 2, name: "Markers" },
      { id: 3, name: "Drawing Pads" },
      { id: 4, name: "Coloring" },
      { id: 5, name: "Brushes" },
      { id: 6, name: "Others" },
      { id: 7, name: "Artworks" },
    ];

    sendRender(
      res,
      201,
      {
        categories: categories,
        updateProduct: updateProduct,
      },
      "admin/editProduct"
    );
  }
);

router.post(
  "/admin/editDeleteProducts/:ProductID",
  auth,
  (req: RequestBody, res: Response) => {
    upload(req, res, async (error) => {
      const { ProductID } = req.params;
      req.body.ProductID = ProductID;

      const buffer = req.file?.buffer;
      if (error instanceof multer.MulterError) {
        sendRender(res, 400, {
          notification: `${error.message} - filesize limit ${fileSizeLimit}`,
        });
        return null;
      } else if (error) {
        sendRender(res, 400, { notification: `${error}` });
        res.status(400).send(error);

        return null;
      }

      const product = await updateProducts(req.body);

      if (buffer instanceof Buffer) {
        try {
          await createImage(buffer, product.ImgName);
        } catch (error) {
          res.status(500).send({ error: error });
          return;
        }
      }

      const result = await exeQuery("SELECT * FROM Products");
      const allProducts: Product[] = result.recordset;

      sendRender(res, 200, {
        allProducts: allProducts,
        notification: "Product successfully updated",
      });
    });
  }
);

// Reusable and Configured response render

function sendRender(
  res: Response,
  statusCode: number,
  renderObject: {},
  handlebarPath = "admin/listProducts"
) {
  res.status(statusCode).render(handlebarPath, {
    productsSelected: "text-primary",
    editDeleteProducts: "text-primary",
    addProduct: "text-dark",
    ordersSelected: "text-dark",
    inquiriesSelected: "text-dark",
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

interface updateProduct {
  ProductID: string;
  CategoryID: number;
  Name: String;
  Description: string;
  Price: string;
  Quantity: number;
}

interface RequestBody extends Request {
  body: updateProduct;
}

async function updateProducts(insertObject: updateProduct) {
  const { CategoryID, Name, Description, Price, Quantity, ProductID } =
    insertObject;
  const updateQuery = `
  UPDATE Products
  SET
    --ProductID - column value is auto-generated
    Products.CategoryID = ${CategoryID}, -- int
    Products.Name = '${Name}', -- nvarchar
    Products.Description = '${Description}', -- nvarchar
    Products.Price = ${Price}, -- int
    Products.Quantity = ${Quantity} -- int 
    --ImgName will not change, only the img file stored
	WHERE PRODUCTS.ProductID = ${ProductID}
  `;
  await exeQuery(updateQuery);

  // get the updated product
  const response = await exeQuery(`
    SELECT * FROM Products WHERE ProductID = ${ProductID}
  `);
  const updatedRecord: Product = response.recordset[0];
  return updatedRecord;
}

export { router };
