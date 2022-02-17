
import { Request, Response } from "express";
import sharp from "sharp";
import Product from "../models/product";

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';


//adicionar produto no banco
export const createProduct = async (req: Request, res: Response) => {
  let { name, units, description, code, price } = req.body;

  try {
    if (!(name && units && code && price) ) throw new Error("Campos Obrigatorios exeto Descrição");

    let hasCode = await Product.find({ code });
    if (hasCode.length)
      throw new Error("produto ja cadastrado com esse codigo");

    price = price.replace(".", "").replace(",", ".");
    price = parseFloat(price);
    let newProduct = await Product.create({
      name,
      units: parseInt(units),
      description,
      code: parseInt(code),
      price,
    });

    if (req.file) {
      const filename = `${req.file.filename}.jpg`;
      await sharp(req.file.path)
        //.resize(500,500) definir o tamanho da imagem
        .toFormat("jpeg")
        .toFile(`./public/media/products/${filename}`);
      //await unlink(req.file.path);
      newProduct.photo = filename;
    }

    newProduct.save();
    return res.status(201).json({ newProduct });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

//lista de todos os produtos
export const readProducts = async (req: Request, res: Response) => {
  let products = await Product.find();
  res.json({ products });
};

//produto selecionado pelo id
export const readOneProduct = async (req: Request, res: Response) => {
  let { id } = req.params;

  try {
    let product = await Product.findById(id);
    if (!product) throw new Error("Nenhun produto encotrado");
    res.json({ product });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

//atualizando produto no banco com o id
export const updateProduct = async (req: Request, res: Response) => {
  let { id } = req.params;
  let {name, units, description, code, price } = req.body;
  
  try {
    let product = await Product.findById(id);
    if (code) {
      if (product.code !== parseInt(code)) {
        let hasCode = await Product.find({ code });
          if (hasCode.length) throw new Error("produto ja cadastrado com esse codigo");
          product.code = parseInt(code);
      } 
    }

    if (name) {
      product.name = name;
    } 
    if (units) {
      product.units = parseInt(units);
    }
    if(price) {
      price = price.replace(".", "").replace(",", ".");
      price = parseFloat(price);
      product.price = price;
    }
    await product.save();
    product.description = description;

    if (req.file) {           
      const filename = `${req.file.filename}.jpg`;
      await sharp(req.file.path)
          //.resize(500,500) definir o tamanho da imagem
        .toFormat("jpeg")
        .toFile(`./public/media/products/${filename}`);
        if (product.photo !== null) {
          promisify(fs.unlink)
          (path.resolve(__dirname, '..' , '..', 'public', 'media', 'products', product.photo));
        }
      product.photo = filename;    
    }
    
    await product.save(); 
    return res.status(201).json({ product });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
  
};

//deleta produto
export const deleteProduct = async (req: Request, res: Response) => {
  let { id } = req.params;
  let product = await Product.findById(id)

  if (product.photo !== null) {
    promisify(fs.unlink)
    (path.resolve(__dirname, '..' , '..', 'public', 'media', 'products', product.photo));
  }
  product.remove();
  res.json({});
};

export const ping = (req: Request, res: Response) => {
  res.json({ pong: true });
};
