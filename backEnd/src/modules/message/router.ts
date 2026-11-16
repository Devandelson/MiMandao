import { Router } from "express";
import { MessageController } from './mController.ts';

const messageRoute: Router = Router();

// middleware
import upload from '@middle/image.ts'

// ----------- Save
messageRoute.post('/message', upload.array("images", 3), MessageController.createMessage);

// --------- Read all info
messageRoute.get('/message/:id_order', MessageController.getAllMessages);

// --------- Delete
messageRoute.delete('/message/:id_message', MessageController.deleteMessage);

export default messageRoute;