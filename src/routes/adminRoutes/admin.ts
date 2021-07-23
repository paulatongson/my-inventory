import { Router, Request, Response, NextFunction } from "express";
import { exeQuery } from "../../database/mssql";
import { auth } from "../auth";
const router = Router();

interface AuthRequestBody extends Request {
  body: { username: string; password: string };
}

router.get("/login/", async (req: Request, res: Response) => {
  const session = req.session;

  if (session && session.isLogged) {
    res.redirect("/admin");
    return;
  }
  res.render("admin/login");
});

router.post("/login/", async (req: AuthRequestBody, res: Response) => {
  const { username, password } = req.body;
  const session = req.session;

  const request = await exeQuery(
    `SELECT * FROM ADMIN WHERE UserName = '${username}' AND Password = '${password}'`
  );

  const isUserExist = request.recordset.length;
  if (isUserExist) {
    // checking is needed to assign true on isLogged
    if (session && !session.isLogged) {
      session.isLogged = true;
    }

    res.redirect("/admin/");
    return;
  }

  res.render("admin/login", {
    unauthorized: true,
  });
});

router.get("/admin/", (req: Request, res: Response) => {
  const session = req.session;

  if (session && session.isLogged) {
    res.render("admin/index", {
      title: "Welcome to admin page",
      productsSelected: "text-dark",
      ordersSelected: "text-dark",
      inquiriesSelected: "text-dark",
    });
    return;
  }

  // go to login page if not logged in
  res.redirect("/login");
});

router.post("/logout/", auth, (req: Request, res: Response) => {
  const session = req.session;

  if (session && session.isLogged) {
    session.isLogged = null;
  }
  res.redirect("/");
});

router.get(
  "/admin/", // (Add Product) and (Edit / Delete Product)
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    res.render("/admin/addProduct");
  }
);

export { router };
