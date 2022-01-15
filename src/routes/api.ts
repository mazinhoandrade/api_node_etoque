import { Router } from "express";
import * as productController from "../controllers/productController";

const router = Router();

// rotas de produtos
router.post('/products', productController.createProduct);
router.get('/products', productController.readProducts);
router.get('/products/:id', productController.readOneProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

//rota pra testa a api
router.get('/ping', productController.ping);


export default router;