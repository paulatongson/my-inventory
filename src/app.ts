import { Router } from "express";
import { router as roots } from "./routes/roots";
import { router as artworks } from "./routes/artworks";
import { router as materials } from "./routes/materials";
import { router as shop } from "./routes/shop";
import { router as admin } from "./routes/adminRoutes/admin";
import { router as addProduct } from "./routes/adminRoutes/addProduct";
import { router as orders } from "./routes/adminRoutes/orders";
import { router as inquiries } from "./routes/adminRoutes/inquiries";
import { router as editDeleteProducts } from "./routes/adminRoutes/editDeleteProducts";
import cookieSession from "cookie-session";
const cookie = cookieSession({
  name: "session",
  keys: ["auth"],
  path: "/",
});

const router = Router();

// Middleware
router.use(cookie);
router.use(roots);
router.use(artworks);
router.use(materials);
router.use(shop);
router.use(admin);
router.use(addProduct);
router.use(orders);
router.use(inquiries);
router.use(editDeleteProducts);

export { router };
