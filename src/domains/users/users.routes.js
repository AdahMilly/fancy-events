import { Router } from 'express';
import { protectedAsyncRequestHandler } from '../../lib/utils/protectedAsyncHandler';
import validateAuthData from '../../lib/middlewares/validateAuthData';
import { usersService } from './users.service';

export function getUsersRouter() {
  const usersRouter = Router();

  usersRouter.post(
    '/signup',
    validateAuthData,
    protectedAsyncRequestHandler(async (req, res) => {
      const user = await usersService.create(req.body);
      res.status(201).json({ message: 'User created', token: user.token });
    }),
  );

  return usersRouter;
}