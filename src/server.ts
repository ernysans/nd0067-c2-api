import express, {Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import products_routes from './handlers/products';
import user_routes from './handlers/users';
import orders_routes from './handlers/orders';
import order_products_routes from './handlers/order_products';
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
app.use('/orders', orders_routes);
app.use('/order_products', order_products_routes);

app.use(middlewareErrorAPI);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`)
});
