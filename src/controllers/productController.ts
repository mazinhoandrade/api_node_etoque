import { unlink } from "fs/promises";
import { Request, Response } from "express";
import sharp from "sharp";
import Product from "../models/product";

//adicionar produto no banco
export const createProduct = async (req: Request, res: Response) => {
    
    let { name, description, code, price} = req.body; 

    if ( req.file ){
        const filename = `${req.file.filename}.jpg`;

        await sharp(req.file.path)
            //.resize(500,500) definir o tamanho da imagem
            .toFormat('jpeg')
            .toFile(`./public/media/products/${filename}`);
        await unlink(req.file.path);

        //res.json({image: `${filename}`});
    } else {
        res.status(400);
        res.json({error: 'Envie o Arquivo'});
    }
    
    let list = await Product.find({code:code}).count();
    
    if (list === 0 ){
        let newProduct = await Product.create({ 
            name, 
            description, 
            code: parseInt(code),
            price: parseInt(price), 
            photo : `${req.file?.filename}.jpg`
        });
        //res.status(201);
        res.json({ _id: newProduct._id, name, description, code, price });
        
    } else {
        res.json({error: 'produto ja cadastrado com esse codigo' })
    }

};

//lista de todos os produtos
export const readProducts = async (req: Request, res: Response) => {
    
    let list = await Product.find();
    res.json({list})
};   

//produto selecionado pelo id
export const readOneProduct = async (req: Request, res: Response) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    if (product) {
        res.json({ product });
    } else {
        res.json({error: 'Produto não encontrado' })
    }
    
};  

//atualizando produto no banco com o id
export const updateProduct = async (req: Request, res: Response) => {
    let { id } = req.params;
    let { nome, descricao, cod, valor, foto } = req.body; 
    let product = await Product.findById(id);
    if ( product ) {
        if ( product.cod !== parseInt(cod) ){
            let verificaCod = await Product.find({cod:cod}).count();
            if (verificaCod === 0 ) {
                product.cod = parseInt(cod);
            } else {
                res.json({error: 'produto ja cadastrado com esse codigo' });
            }   
        } 

        product.nome = nome;
        product.descricao = descricao;
        product.valor = valor;
        product.foto = foto;
        await product.save();

        res.status(201);
        res.json({ product });
     
    } else {
        res.json({error: 'Produto não encontrado' });
    }    
  
}; 

//deleta produto
export const deleteProduct = async (req: Request, res: Response) => {
    let { id } = req.params;
    await Product.findById(id).remove();
    res.json({});
}; 


export const ping = (req: Request, res: Response) => {
    res.json({pong:true});
}
