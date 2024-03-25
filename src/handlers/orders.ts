import express, {NextFunction, Request, Response} from "express";
import {Order, OrderStore} from "../models/order";
import {userFromToken, verifyAuthToken} from "../middleware";

const router = express.Router()

const store = new OrderStore();

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await store.index();
    res.json(results);
  } catch (error) {
    next(error);
  }
};
const orderProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await store.products(parseInt(req.params.id));
    res.json(results);
  } catch (error) {
    next(error);
  }
}
const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await store.show(parseInt(req.params.id));
    res.json(data);
  } catch (error) {
    next(error);
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = userFromToken(req);
    const data: Order = {...req.body, user_id: user.id};
    const newWeapon = await store.create(data);
    res.json(newWeapon);
  } catch (error) {
    next(error);
  }
}
const _delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await store.delete(parseInt(req.params.id));
    res.json({message: `Order ${req.params.id} deleted`});
  } catch (error) {
    next(error);
  }
}
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = userFromToken(req);
    const data: Order = {...req.body, user_id: user.id};
    const product: Order = {
      ...data,
      id: parseInt(req.params.id),
    }
    const updated = await store.update(product);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

router.use(verifyAuthToken);
router.get('/', index);
router.get('/:id', show);
router.post('/', create);
router.delete('/:id', _delete);
router.put('/:id', update);
router.get('/:id/products', orderProducts);

export default router;
