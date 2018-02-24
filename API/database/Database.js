"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Database {
    constructor(connectionUri) {
        this.schema = new mongoose_1.Schema({
            name: String,
            brand: String
        });
        this.connection = mongoose_1.createConnection(connectionUri);
        this.registerListeners();
    }
    getTrainerModel() {
        return this.connection.model('trainers', this.schema);
    }
    registerListeners() {
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
exports.Database = Database;
