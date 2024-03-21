import express, {NextFunction, Request, Response} from 'express';
import {User, UserStore} from '../models/user';
import jwt from 'jsonwebtoken';
import {verifyAuthToken} from "../middleware";

const router = express.Router()

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    let newUser = await store.create(user);
    let token = jwt.sign({user: newUser}, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await store.delete(parseInt(req.params.id));
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const updated = await store.update(parseInt(req.params.id), user);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

router.get('/', index);
router.get('/:id', show);
router.post('/', verifyAuthToken, create);
router.delete('/:id', verifyAuthToken, destroy);
router.put('/:id', verifyAuthToken, update);
export default router;
