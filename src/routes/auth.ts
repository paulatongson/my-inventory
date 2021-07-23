import { Request, Response, NextFunction } from "express";
export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const cookie = req.session;
  if (!cookie?.isLogged) {
    res.status(401).render("admin/unauthorized");
    return;
  }

  next();
};
