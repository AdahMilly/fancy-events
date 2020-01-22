import { Router } from 'express';
import { eventsService } from './events.service';
import { protectedAsyncRequestHandler } from '../../lib/utils/protectedAsyncHandler';
export function getEventsRouter(){
  const eventsRouter = Router();

  eventsRouter.post(
    '/events',
    protectedAsyncRequestHandler( async (req, res) => {
      const event = await eventsService.create(req.body);
      res.status(201).json({ message: 'event created', event});
    })
    )
  return eventsRouter;
}