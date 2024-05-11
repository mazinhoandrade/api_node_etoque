import { model, connection, Schema, set } from 'mongoose';

type SaleType = {
    Product: {
        idProduct: string,
        nameProduct: string,
        priceProduct: number
    },
    saleValue: number,
    qtd: Number,
    dateSale?: Date | string,
}   

const schema = new Schema<SaleType>({
    Product: { 
        idProduct: String,
        nameProduct : String,
        priceProduct : Number
    },
    saleValue: { 
        type: Number,
        required:[true, '(saleValue) Campo Obrigatorio'], 
    },
    qtd:{
        type: Number,
        required:[true, '(qtd) Campo Obrigatorio']
    },
    dateSale: {
        type: Date ,
        default: new Date()
    }

});



const modelName: string = 'sales';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<SaleType>(modelName, schema);
