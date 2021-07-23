import { Router, Request, Response, NextFunction } from "express";
import { exeQuery } from "../../database/mssql";
import { auth } from "../auth";
import path from "path";

const htmlDirectory = path.join(__dirname, "../../../public/html");

const router = Router();

interface RequestBody extends Request {
  body: {
    id: number;
  };
}

router.get(
  "/admin/inquiries",
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    exeQuery("");
    res.sendFile(`${htmlDirectory}/inquiries.html`);
  }
);

router.get(
  "/api/admin/inquiries",
  auth,
  async (req: Request, res: Response) => {
    const data = await exeQuery(`SELECT * FROM ContactUs`);
    const { recordset } = data;
    res.send(recordset);
  }
);

router.delete(
  "/api/admin/inquiries",
  auth,
  async (req: RequestBody, res: Response) => {
    const { id } = req.body;

    const data = await exeQuery(`DELETE FROM ContactUs WHERE ID = ${id}`);
    const { rowsAffected } = data;
    if (rowsAffected[0]) {
      res.send({ message: "Successful" });
      return;
    }
    res.send({ message: "No contact deleted" });
  }
);

export { router };
