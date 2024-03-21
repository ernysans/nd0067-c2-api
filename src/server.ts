import express, {Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import products_routes from './handlers/products';
import user_routes from './handlers/users';
import {middlewareErrorAPI} from "./middleware";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.get('/', function (req: Request, res: Response) {
  res.status(200).json({
    "message": "Storefront Backend Project"
  });
});

app.use('/products', products_routes);
app.use('/users', user_routes);

app.use(middlewareErrorAPI);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`)
});
