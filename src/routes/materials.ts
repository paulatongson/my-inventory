import { Request, Response, Router } from "express";
import { exeQuery } from "../database/mssql";

const router = Router();

router.get("/api/shop/materials", async (req: Request, res: Response) => {
  const data = await exeQuery(`SELECT * FROM Products WHERE CategoryID <> 7`);
  const materialsArray = data.recordset;
  res.send(materialsArray);
});

export { router };
