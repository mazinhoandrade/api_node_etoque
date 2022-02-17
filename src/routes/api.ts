import { randomInt } from "crypto";
import {celebrate, Joi} from "celebrate"
import { Router } from "express";
import multer from "multer";
import { Auth } from "../middlewares/auth";
import * as productController from "../controllers/productController";
import * as userController from "../controllers/userController";
import * as saleController from "../controllers/saleController";

import { privateRoute } from "../config/passport";
import { join } from "path";

const storageConfig = multer.diskStorage({
  /* destination: (req, file, cb) => {
    cb(null, "./tmp/up");
  }, */
  filename: (req, file, cb) => {
    let radomName = randomInt(9 * 99999);
    cb(null, `${radomName + Date.now()}`);
  },
});
const upload = multer({
  storage: storageConfig,
  fileFilter: (req, file, cb) => {
    const allowed: string[] = ["image/jpg", "image/jpeg", "image/png"];
    // verifica se os nimestype dentro do array e retorna true ou false
    let found = allowed.includes(file.mimetype);
    if (!found) cb(new Error("Formato de arquivo inválido!"));
    cb(null, true);
  },
  limits: {
    files: 1,
    fieldSize: 500000,
  },
});

const router = Router();

// rotas de users
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/list", Auth.private, userController.listUsers);

// rotas de produtos
router.post("/product", privateRoute,  upload.single("photo"), productController.createProduct);
router.get("/products", privateRoute, productController.readProducts);
router.get("/product/:id", privateRoute, productController.readOneProduct);
router.put("/product/:id", privateRoute, upload.single("photo"), productController.updateProduct);
router.delete("/product/:id", privateRoute, productController.deleteProduct);

// rotas de Vendas
//router.get("/sale", privateRoute, saleController.makeSale);
router.post("/sale", privateRoute, saleController.createSale);
router.get("/sales", privateRoute, saleController.readSales);
router.get("/sale/:id", privateRoute, saleController.readOneSale);
router.put("/sale/:id", privateRoute, saleController.updateSale);
router.delete("/sale/:id", privateRoute, saleController.deleteSale);

//rota pra testa a api
router.get("/ping", productController.ping);

export default router;
