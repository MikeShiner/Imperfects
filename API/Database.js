"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = __importStar(require("mongoose"));
var Database = /** @class */ (function () {
    function Database(connectionUri) {
        this.Schema = mongoose.Schema;
        this.schema = new this.Schema({
            name: {
                type: String,
                required: true
            },
            stock_img: {
                type: String
            },
            price: {
                type: Number
            },
            link: {
                type: Array
            },
            previous_price: {
                type: Number
            },
            type: {
                type: String
            },
            brand: {
                type: String
            },
            size: {
                type: String
            }
        });
        this.connection = mongoose.createConnection(connectionUri);
        this.connection.on('connection', function () {
            console.log("database connected.");
        });
    }
    Database.prototype.getTrainerModel = function () {
        return this.connection.model('trainers', this.schema);
    };
    return Database;
}());
exports.Database = Database;
