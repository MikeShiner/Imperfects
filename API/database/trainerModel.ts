import { Document } from 'mongoose';
export interface ITrainerModel extends Document {
    name: string;
    stock_img: string;
    price: number;
    link: Array<string>;
    previous_price: number;
    type: string;
    brand: string;
    size: number;
}