import { randomInt } from "crypto";
import { Router } from "express";
import multer from "multer";
import * as productController from "../controllers/productController";

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

// rotas de produtos
router.post('/products', upload.single('photo'), productController.createProduct);
router.get('/products', productController.readProducts);
router.get('/products/:id', productController.readOneProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

//rota pra testa a api
router.get('/ping', productController.ping);


export default router;