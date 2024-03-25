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
    const user = await store.show(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
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
    await store.delete(parseInt(req.params.id));
    res.json({message: `User ${req.params.id} deleted`});
  } catch (err) {
    next(err);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      id: parseInt(req.params.id),
    };
    const updated = await store.update(user);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await store.authenticate(parseInt(req.body.id), req.body.password);
    let token = jwt.sign({user: user}, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    next(err);
  }
};

router.post('/authenticate', authenticate);
router.get('/', verifyAuthToken, index);
router.get('/:id', verifyAuthToken, show);
router.post('/', create);
router.delete('/:id', verifyAuthToken, destroy);
router.put('/:id', verifyAuthToken, update);
export default router;
