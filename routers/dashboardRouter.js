import { Router } from 'express'
import { generateOpenAiReport, getEchoForAll } from '../controllers/adminController.js';



const dashboardRouter = new Router();
//* @router for /dashboard/ِEchoForAll-free report Echo for all users
dashboardRouter.get("/", getEchoForAll);
//* @router for /dashboard/AIapireport  for open Ai report generator//
dashboardRouter.post("/AIapireport/", generateOpenAiReport);

export { dashboardRouter } 