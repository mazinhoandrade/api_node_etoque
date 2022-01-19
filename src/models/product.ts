import { model, connection, Schema, set } from 'mongoose';

type ProductType = {
    name: string,
    description: string,
    price: number,
    code: number,
    photo: string | null 
}   

const schema = new Schema<ProductType>({
    name: { type: String, required:true },
    description: String,
    price: { type: Number, required:true},
    code: Number,
    photo: { type: String, default: null }
});



const modelName: string = 'products';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<ProductType>(modelName, schema);
