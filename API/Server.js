"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const Database_1 = require("./database/Database");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Configurable Variables
const port = 3000;
const mongoUri = "mongodb://localhost:27017/imperfects";
class Server {
    constructor(port, database) {
        this.app = express_1.default();
        this.pageSize = 50;
        this.router = express_1.default.Router();
        this.trainerModel = database.getTrainerModel();
        this.registerRoutes();
        this.app.use(this.router);
        this.app.set("port", port);
        this.app.use(cors_1.default({ origin: true }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    }
    registerRoutes() {
        this.router.use("/api", (req, res) => {
            let query = this.buildQueryParameters(req.query);
            let offset = req.query.page != null ?
                (parseInt(req.query.page) * this.pageSize) - this.pageSize : 0;
            this.trainerModel.find(query)
                .limit(this.pageSize)
                .skip(offset)
                .exec((err, trainers) => {
                if (err) {
                    console.log(err);
                }
                res.send(trainers);
            });
        });
        this.router.use("/api/options", (req, res) => __awaiter(this, void 0, void 0, function* () {
            let options = {};
            options.brands = yield this.trainerModel.distinct("brand").exec();
            options.sizes = yield this.trainerModel.distinct("size").exec();
            options.sizes = options.sizes.sort((a, b) => { return a - b; });
            res.send(options);
        }));
        this.router.use("/", express_1.default.static('index.html'));
    }
    buildQueryParameters(urlParams) {
        console.log(urlParams);
        let query = {};
        let and = [];
        if (urlParams.brand) {
            and.push({ 'brand': { $in: urlParams.brand.split(",") } });
        }
        if (urlParams.size) {
            and.push({ "size": parseInt(urlParams.size) });
        }
        if (and.length > 0) {
            query["$and"] = and;
        }
        console.log(query);
        return query;
    }
    bootstrap() {
        return this.app;
    }
}
exports.Server = Server;
const app = new Server(port, new Database_1.Database(mongoUri));
const server = http_1.default.createServer(app.bootstrap());
server.on("listening", () => {
    console.log("API running on port " + 3000);
});
server.listen(3000);
