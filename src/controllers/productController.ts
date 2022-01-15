import { Request, Response } from "express";
import Product from "../models/product";

//adicionar produto no banco
export const createProduct = async (req: Request, res: Response) => {
    
    let { nome, descricao, cod, valor, foto } = req.body; 

    let list = await Product.find({cod:cod}).count();
    
    if (list === 0 ){
        let newProduct = await Product.create({ nome, 
            descricao, 
            cod: parseInt(cod),
            valor: parseInt(valor), 
            foto 
        });
        res.status(201);
        res.json({ _id: newProduct._id, nome, descricao, cod, valor, foto});
        
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
