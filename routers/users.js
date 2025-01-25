import { Router } from "express";
import { userControllerCreateUser,getCaptcha,userControllerLoginPost, userControllerLogout, postEditDoctorInfo, userControllerrememberMe, userControllerResetPassword, postworkExperience, postAcceptLaw, editOrUploadImage, getMynobat, PostDisableDaysSave } from "../controllers/usersController.js";
import { RemoveNobat } from "../controllers/adminController.js";
import { authenticatedCheek } from "../middlewares/Auth.js";
const usersRouter= new Router();


//* router for post create doctor's information 
//* from page Prerejisterdoctors page
usersRouter.post("/add-doctorInfo",userControllerCreateUser); 
//* from page post workexperience page
usersRouter.post("/postworkExperience/:id",postworkExperience); 
//* from page post acceptlaw page
usersRouter.post("/AcceptLaw/:id",postAcceptLaw); 
//* from page post EditUploadImage page
usersRouter.post("/EditUploadImage/:id",editOrUploadImage); 
//* from page rejisterdoctors page for edit userifo
usersRouter.post("/edit-doctorInfo/:id",postEditDoctorInfo); 
//* from page rejisterdoctors page for save DisableDays
usersRouter.post("/DisableDays/",PostDisableDaysSave); 
//* from page rejisterdoctors page for resetPass
usersRouter.post("/ResetPass/:id",userControllerResetPassword); 
//*  @route  GET /cpatcha.png
usersRouter.get("/cpatcha.png",getCaptcha);
//* @router POST /users/login
usersRouter.post("/login",userControllerLoginPost,userControllerrememberMe);
//* @router POST /users/RemoveNobat
usersRouter.post("/RemoveNobat",RemoveNobat);
//* @router get /users/logout
usersRouter.get("/logout",userControllerLogout)
//* @router get /users/Mynobat "Mynobats  show"
usersRouter.get("/Mynobats/",authenticatedCheek,getMynobat);


export{usersRouter}