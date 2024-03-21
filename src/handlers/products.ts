import express, {NextFunction, Request, Response} from "express";
import {ProductStore} from "../models/product";
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
    const deleted = await store.delete(parseInt(req.params.id));
    res.json(deleted);
  } catch (error) {
    next(error);
  }
}
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const updated = await store.update(parseInt(req.params.id), data);
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

