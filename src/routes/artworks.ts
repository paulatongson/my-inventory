import { Router, Request, Response } from "express";
import { exeQuery } from "../database/mssql";

const router = Router();

router.get("/api/shop/artworks", async (req: Request, res: Response) => {
  const data = await exeQuery(`SELECT * FROM Products WHERE CategoryID = 7`);
  const artworksArray = data.recordset;
  res.send(artworksArray);
});

export { router };
