
import { Schema, Connection, Model, createConnection } from 'mongoose';
import { ITrainerModel } from './trainerModel';
export class Database {

    private schema = new Schema({
        name: String,
        brand: String
    });

    private connection: Connection;

    constructor(connectionUri: string) {
        this.connection = createConnection(connectionUri);
        this.registerListeners();
    }

    public getTrainerModel(): Model<ITrainerModel> {
        return this.connection.model<ITrainerModel>('trainers', this.schema);
    }

    private registerListeners() {
        this.connection.on('connected', () => {
            console.log("database connected.");
        });
        this.connection.on('disconnected', () => {
            console.log("database disconnected.");
        });
        this.connection.on('error', (ex) => {
            console.log("database error.", ex);
        });
    }
}