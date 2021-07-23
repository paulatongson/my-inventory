import { Router, Request, Response, NextFunction } from "express";
import { auth } from "../auth";
import path from "path";
import { exeQuery } from "../../database/mssql";

interface RequestBody {
  body: {
    OrderID: number;
  };
}

interface Orders {
  OrderID: number;
  ContactID: number;
  ContactName: string;
  Address: string;
  MobileNumber: string;
  EmailAdd: string;
  ProductQuantity?: number;
  ProductName?: string;
  Products?: [{ ProductName: string; ProductQuantity: number }];
}

const htmlDirectory = path.join(__dirname, "../../../public/html");

const router = Router();

router.get(
  "/admin/orders",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(`${htmlDirectory}/orders.html`);
  }
);

router.get(
  "/api/admin/orders",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await exeQuery(`SELECT 
    o.OrderID,
    c.ContactID, c.ContactName , c.Address , c.MobileNumber, c.EmailAdd,
    d.Quantity as ProductQuantity,
    d.ProductName
    FROM Orders as o
    JOIN Contacts as c
    ON o.ContactID = c.ContactID
    JOIN OrderDetails as d
    ON o.OrderID = d.OrderID
    Order BY OrderID ASC`);

    const ordersArray: Orders[] = data.recordset;

    if (ordersArray.length === 0) return res.status(200).send([]);

    const mergeSameOrders = ordersArray.reduce((acc: Orders[], curr) => {
      const { ProductName, ProductQuantity } = curr;
      const { length } = acc;

      if (!acc.length) {
        const currentOrder = { ...curr };
        delete currentOrder.ProductName;
        delete currentOrder.ProductQuantity;
        if (ProductName && ProductQuantity) {
          currentOrder.Products = [{ ProductName, ProductQuantity }];
        }
        return [currentOrder];
      }

      const lastItem = acc[length - 1];
      if (lastItem.OrderID === curr.OrderID) {
        if (ProductName && ProductQuantity) {
          lastItem.Products?.push({ ProductName, ProductQuantity });
        }
        return [...acc];
      }

      // if length is not 0 AND lastItem OrderID !== to currentItem OrderID
      const currentOrder = { ...curr };
      delete currentOrder.ProductName;
      delete currentOrder.ProductQuantity;
      if (ProductName && ProductQuantity) {
        currentOrder.Products = [{ ProductName, ProductQuantity }];
      }
      return [...acc, currentOrder];
    }, []);

    return res.json(mergeSameOrders);
  }
);

router.delete(
  "/api/admin/orders",
  auth,
  async (req: RequestBody, res: Response, next: NextFunction) => {
    const { OrderID } = req.body;
    if (!OrderID) {
      return res.status(400).send();
    }
    const data = await exeQuery(`
    DELETE OrderDetails
    FROM OrderDetails
        INNER JOIN Orders ON OrderDetails.OrderID=Orders.OrderID
    WHERE Orders.OrderID=${OrderID}

    DELETE Orders
    FROM Orders
    WHERE Orders.OrderID=${OrderID}
    `);

    const { rowsAffected } = data;
    if (rowsAffected[0]) {
      res.send({ message: "Successful" });
      return;
    }
    res.send({ message: "No orders deleted" });
  }
);

export { router };
