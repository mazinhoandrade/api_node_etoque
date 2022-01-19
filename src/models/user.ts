import { model, connection, Schema } from 'mongoose';

type ProductType = {
    nome: string,
    descricao: string,
    valor: number,
    cod: number,
    foto: string
}   

const schema = new Schema<ProductType>({
    nome: { type: String, required:true },
    descricao: String,
    valor: { type: Number, required:true},
    cod: Number,
    foto: String
});

const modelName: string = 'products';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<ProductType>(modelName, schema);
