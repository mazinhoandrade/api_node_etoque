import { randomInt } from "crypto";
import { Router } from "express";
import multer from "multer";
import { Auth } from "../middlewares/auth";
import * as productController from "../controllers/productController";
import * as userController from "../controllers/userController";


import { privateRoute } from "../config/passport";
  
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp'); 
    },
    filename: (req, file, cb) => {
        let radomName = randomInt(9*99999);
        cb(null, `${radomName+Date.now()}`);
    } 
});
const upload = multer({
    storage: storageConfig,
    fileFilter: (req , file, cb) =>{
        const allowed: string[] = ['image/jpg','image/jpeg','image/png']
        // verifica se os nimestype dentro do array e retorna true ou false
        cb(null , allowed.includes(file.mimetype ));     
    },
    limits: {
        files: 1,
        fieldSize: 500000     
    }
});

const router = Router();

// rotas de users
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/list', Auth.private, userController.listUsers);

// rotas de produtos
router.post('/product', privateRoute, upload.single('photo'), productController.createProduct);
router.get('/products', privateRoute, productController.readProducts);
router.get('/product/:id', privateRoute, productController.readOneProduct);
router.put('/product/:id', privateRoute, productController.updateProduct);
router.delete('/product/:id', privateRoute, productController.deleteProduct);

//rota pra testa a api
router.get('/ping', productController.ping);


export default router;