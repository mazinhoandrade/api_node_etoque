import { Request, Response } from "express";
import Product from "../models/product";
import Sale from "../models/sale";


export const createSale = async (req: Request, res:Response) => {
    let { qtd, code} = req.body;

    try {
        let hasProduct = await Product.findOne({ code });
        if (hasProduct.units < qtd ) throw new Error('Total de Produto(s) no estoque: '+ hasProduct.units);
            hasProduct.units -= qtd;
            hasProduct.save();
        let saleValue = (hasProduct.price * qtd);    
        let makeSale = await Sale.create({
            qtd,
            Product: {
                idProduct: hasProduct.id,
                nameProduct: hasProduct.name,
                priceProduct: hasProduct.price
            },
            saleValue: saleValue
        });    
        
        res.status(201).json({makeSale})

    } catch(err:any){
        return res.status(400).json({ message: err.message });
    }
    
};

export const readSales = async (req: Request, res:Response) => {
    let saleList = await Sale.find();
    return res.json({ saleList });
};

export const readOneSale = async (req: Request, res:Response) => {
    let { id } = req.params;

    try {
      let sale = await Sale.findById(id);
      if (!sale) throw new Error("Nenhuma venda encotrada");
      res.json({ sale });
    } catch (err: any) {
      return res.json({ message: err.message });
    }
};

export const updateSale = async (req: Request, res:Response) => {
    let { id } = req.params;
    let { qtd, code} = req.body;

    try {
        let sale = await Sale.findById({_id:id});
        
        let hasProduct = await Product.findOne({ code });
        if (hasProduct.units < qtd ) throw new Error('Total de Produto(s) no estoque: '+ hasProduct.units);
            hasProduct.units += sale.qtd;
            hasProduct.units -= qtd;
            hasProduct.save();
        let saleValue = (hasProduct.price * qtd);    
        sale.qtd = qtd;
        sale.saleValue = saleValue;
        sale.Product = {
            idProduct: hasProduct.id,
            nameProduct: hasProduct.name,
            priceProduct: hasProduct.price
        }  
        sale.save();
        return res.status(201).json({sale})

    } catch(err:any){
        return res.status(400).json({ message: err.message });
    }
};

export const deleteSale = async (req: Request, res:Response) => {
    let { id } = req.params;
    let sale = await Sale.findById(id)
    let idProduct = sale.Product.idProduct;
    let product = await Product.findOne({ _id:idProduct })
        product.units += sale.qtd;
        product.save();
    sale.remove();
    res.json({});
};