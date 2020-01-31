import { Router } from 'express';
import { eventsService } from './events.service';
import { protectedAsyncRequestHandler } from '../../lib/utils/protectedAsyncHandler';
import { jwtAuthentication } from '../../lib/utils/passportSetup';

export function getEventsRouter(){
  const eventsRouter = Router();

  eventsRouter.post(
    '/events',
    jwtAuthentication,
    protectedAsyncRequestHandler( async (req, res) => {
      const event = await eventsService.create({...req.body, createdBy: req.user.id});
      res.status(201).json({ message: 'event created', event});
    })
    )
   
  eventsRouter.get(
    '/events',
    protectedAsyncRequestHandler( async (req, res) => {
      const events = await eventsService.get();
      res.status(200).json({ message: 'events', events});
    })
  )

  eventsRouter.get(
    '/events/:id',
    protectedAsyncRequestHandler( async (req, res) => {
      const event = await eventsService.getEvent('id', req.params.id);
      res.status(200).json({ message: 'success', event});
    })
  )

  eventsRouter.put(
    '/events/:id',
    jwtAuthentication,
    protectedAsyncRequestHandler( async (req, res) => {
      const event = await eventsService.updateEvent(req.body, req.params.id);
      res.status(200).json({ message: 'success', event});
    })

  )

  eventsRouter.delete(
    '/events/:id',
    jwtAuthentication,
    protectedAsyncRequestHandler( async (req, res) => {
      await eventsService.deleteEvent(req.params.id);
      res.status(200).json({message: 'event deleted successfuly'});
    })
  )

  eventsRouter.post(
    '/events/:id/rsvp',
    jwtAuthentication,
    protectedAsyncRequestHandler( async (req, res) => {
      await eventsService.rsvp(req.params.id, req.user.id)
      res.status(201).json({ message: 'ticket reserved successfuly'})
    })
  )

  eventsRouter.get(
    '/events/:id/rsvps',
    jwtAuthentication,
    protectedAsyncRequestHandler( async (req, res) => {
      const rsvps = await eventsService.getRsvps('eventId', req.params.id);
      res.status(200).json({ message: 'success', rsvps});
    })

  )
  
  return eventsRouter;
}