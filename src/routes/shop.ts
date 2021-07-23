import { Router, Request, Response } from "express";
import path from "path";
import { exeQuery } from "../database/mssql";
const router = Router();

const htmlDirectory = path.join(__dirname, "../../public/html");

interface Order {
  ProductID: number;
  ProductName: string;
  Price: number;
  Quantity: number;
}

interface RequestBody extends Request {
  body: {
    contact: {
      ContactName: string;
      MobileNumber: string;
      EmailAdd: string;
      Address: string;
    };
    orders: Order[];
  };
}

router.get("/shop", (req: Request, res: Response) => {
  res.sendFile(`${htmlDirectory}/shop.html`);
});
router.get("/shop/artworks", (req: Request, res: Response) => {
  res.sendFile(`${htmlDirectory}/artworks.html`);
});
router.get("/shop/materials", (req: Request, res: Response) => {
  res.sendFile(`${htmlDirectory}/materials.html`);
});

router.get("/cart", (req: Request, res: Response) => {
  res.sendFile(`${htmlDirectory}/cart.html`);
});

router.post("/api/cart", async (req: RequestBody, res: Response) => {
  const { ContactName, MobileNumber, EmailAdd, Address } = req.body.contact;
  const { orders } = req.body;

  // create and get CONTACT
  const createContact = await exeQuery(`INSERT INTO Contacts
  (ContactName, MobileNumber, EmailAdd, Address)
  VALUES
  ('${ContactName}', '${MobileNumber}', '${EmailAdd}', '${Address}')`);
  const { rowsAffected: insertContactAffected } = createContact;
  if (!insertContactAffected[0]) {
    res.status(400).send({ error: "Failed to Insert Contact" });
    return;
  }

  const getNewContact = await exeQuery(
    `SELECT TOP 1 ContactID FROM Contacts ORDER BY ContactID DESC`
  );
  const { recordset: newContactRecord } = getNewContact;

  // create and get ORDER
  const createOrder = await exeQuery(`INSERT INTO Orders(ContactID)
  VALUES(${newContactRecord[0].ContactID})`);

  const { rowsAffected: insertOrderAffected } = createOrder;
  if (!insertOrderAffected[0]) {
    res.status(400).send({ error: "Failed to Create Order" });
    return;
  }

  const getNewOrder = await exeQuery(`SELECT TOP 1 OrderID FROM Orders
  ORDER BY OrderID DESC`);
  const { recordset: newOrderRecord } = getNewOrder;

  // // convert to multi sql insert
  const mappedOrders =
    `(` +
    orders
      .map((item) => {
        return `${newOrderRecord[0].OrderID},'${item.ProductName}',${item.Price},${item.Quantity}`;
      })
      .join("),(") +
    `)`;

  try {
    await exeQuery(`INSERT INTO OrderDetails (OrderID, ProductName, Price, Quantity)
      VALUES ${mappedOrders}
      `);

    await exeQuery(`
    UPDATE Orders
    SET TotalPrice =
    (SELECT SUM(Price * Quantity) FROM OrderDetails WHERE OrderID = ${newOrderRecord[0].OrderID})
    WHERE OrderID = ${newOrderRecord[0].OrderID}
  `);
  } catch (error) {
    res.status(500).send({ error: error });
    return;
  }

  orders.forEach(async (item) => {
    await exeQuery(`
      UPDATE Products
      SET Quantity = Quantity - ${item.Quantity}
      WHERE ProductID = ${item.ProductID}
    `);
  });

  res.send({ message: "Successful" });
});

export { router };
