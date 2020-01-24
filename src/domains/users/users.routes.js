import { Router } from 'express';
import { protectedAsyncRequestHandler } from '../../lib/utils/protectedAsyncHandler';
import validateAuthData from '../../lib/middlewares/validateAuthData';
import { usersService } from './users.service';
import { localAuthentication } from '../../lib/utils/passportSetup';

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


  usersRouter.post(
    '/login',
    localAuthentication,
    protectedAsyncRequestHandler(async (req, res) => {
      const token = await usersService.login(req.user);
      res.status(200).json({ message: "login successful", token });
    }),
  )

  return usersRouter;
}