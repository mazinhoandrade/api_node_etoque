import { unlink } from "fs/promises";
import { Request, Response } from "express";
import sharp from "sharp";
import Product from "../models/product";


//adicionar produto no banco
export const createProduct = async (req: Request, res: Response) => {
  let { name, units, description, code, price } = req.body;

  try {
    let hasCode = await Product.find({ code });
    if (hasCode.length)
      throw new Error("produto ja cadastrado com esse codigo");

    price = price.replace(".", "").replace(",", ".");
    price = parseFloat(price.toFixed(2));
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
  let { name, units, description, code, price } = req.body;
  
  try {
    let product = await Product.findById(id);

    if (product.code !== parseInt(code)) {
      let hasCode = await Product.find({ code });
      if (hasCode.length) throw new Error("produto ja cadastrado com esse codigo");
      product.code = parseInt(code);
    } 
    
    
    price = price.replace(".", "").replace(",", ".");
    price = parseFloat(price);
  

    product.name = name;
    product.units = parseInt(units),
    product.description = description;
    product.price = price;

    if (req.file) {
      const filename = `${req.file.filename}.jpg`;
      await sharp(req.file.path)
        //.resize(500,500) definir o tamanho da imagem
        .toFormat("jpeg")
        .toFile(`./public/media/products/${filename}`);
      //await unlink(req.file.path);
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
  await Product.findById(id).remove();
  res.json({});
};

export const ping = (req: Request, res: Response) => {
  res.json({ pong: true });
};
