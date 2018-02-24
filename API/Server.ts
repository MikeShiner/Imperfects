import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Database } from './database/Database';
import { ITrainerModel } from './database/trainerModel';

// Configurable Variables
const port = 3000;
const mongoUri = "mongodb://localhost:27017/imperfects";

export class Server {

    public app: express.Application = express();

    private pageSize = 50;
    private router: express.Router = express.Router();
    private trainerModel: mongoose.Model<ITrainerModel>;

    constructor(port: number, database: Database) {
        this.trainerModel = database.getTrainerModel();
        this.registerRoutes();
        this.app.use(this.router);
        this.app.set("port", port);
    }
    registerRoutes() {
        this.router.use("/api", (req, res) => {
            let query = this.buildQueryParameters(req.query);
            let offset = req.query.page != null ?
                (parseInt(req.query.page) * this.pageSize) - this.pageSize : 0;

            console.log("Offset: ", offset);
            this.trainerModel.find(query)
                .limit(this.pageSize)
                .skip(offset)
                .exec((err, trainers) => {
                    if (err) { console.log(err); }
                    res.send(trainers);
                });
        });

        this.router.use("/api/options", async (req, res) => {
            let options: any = {};
            options.brands = await this.trainerModel.distinct("brand").exec();
            options.sizes = await this.trainerModel.distinct("size").exec();
            options.sizes = options.sizes.sort((a: number, b: number) => { return a - b });
            res.send(options);
        });
    }

    private buildQueryParameters(urlParams: any) {
        console.log(urlParams);

        let query: any = {};
        let and: Array<object> = [];
        if (urlParams.brand) {
            and.push({ 'brand': { $in: urlParams.brand.split(",") } })
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

    public bootstrap() {
        return this.app;
    }
}

const app = new Server(port, new Database(mongoUri));
const server = http.createServer(app.bootstrap());
server.on("listening", () => {
    console.log("API running on port " + 3000)
});
server.listen(3000);