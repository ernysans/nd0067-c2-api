import express, {NextFunction, Request, Response} from "express";
import {Product, ProductStore} from "../models/product";
import {verifyAuthToken} from "../middleware";

const router = express.Router()

const store = new ProductStore();
const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await store.index();
    res.json(results);
  } catch (error) {
    next(error);
  }
};
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
    const data = req.body;
    const newWeapon = await store.create(data);
    res.json(newWeapon);
  } catch (error) {
    next(error);
  }
}
const _delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await store.delete(parseInt(req.params.id));
    res.json({message: `Product ${req.params.id} deleted`});
  } catch (error) {
    next(error);
  }
}
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const product: Product = {
      ...data,
      id: parseInt(req.params.id),
    }
    const updated = await store.update(product);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

router.get('/', index);
router.get('/:id', show);
router.post('/', verifyAuthToken, create);
router.delete('/:id', verifyAuthToken, _delete);
router.put('/:id', verifyAuthToken, update);

export default router;

