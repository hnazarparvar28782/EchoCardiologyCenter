import {Router} from 'express'
import {FetchNobat, getLightPenVisit, MatabNobatUsersearch, MatabNobatsFetch, ReservNobat, SabtNazarKarbar, SignUpSick, createNobat, getCreateNobat, getDashboard,getDoctorProfile,getMatabView,getNobatDoctor,getPreRegister,getRegisterDoctor, getSearchForDoctor, selectedPlan, uploadImageMadarek, SaveHandDoctorVisit, SaveEditHandDoctorVisit, EndVisit, SaveStateNobat, getNobatDoctorHozori, SignUpSickHozri, getSearchForSickUser, ReservNobatHozri, getAdminUserPanel, SavePanelByadmin, PanelSerach, getAdminNazarat, AdminSaveNazarat, AdminSearchNazarkarbaran, SignUpEditSick, getVisitWithLisit, EndVisitWithList, getLightPenVisitWithList, MatabNobatsFetchWithList, MatabNobatUsersearchVisitWithList, getHelp, getContackt, getTotalNormalValues, getNormalValueSelectUser, getِcreateechoreport , saveEchoCreatedByCodemilli, generateReportEchoBycodemilli, UserEchoSearch, DeleteEchoById, generateOpenAiReport, EchoSerachFetch, getBlankEchoConfig, saveEchoConfig } from '../controllers/adminController.js';
import { authenticatedCheek } from '../middlewares/Auth.js';


const dashboardRouter = new Router(); 
//* @router for /dashboard this is homepage
dashboardRouter.get("/",getDashboard);
//* @router for /dashboard this is Help page
dashboardRouter.get("/getHelp",getHelp );
//* @router for /dashboard this is Contackt with us page
dashboardRouter.get("/getContackt",getContackt );
//* @router for /dashboard/registerDoctor//for editing or updating one register 
dashboardRouter.get("/registerDoctor",authenticatedCheek,getRegisterDoctor);
//* @router for /dashboard/preRegister//for first register 
dashboardRouter.get("/preRegister",getPreRegister);
//* @router for /dashboard/doctorProfile/for doctors profile
dashboardRouter.get("/doctorProfile/:id",getDoctorProfile);
//* @router for /dashboard/nobatDoctor/for doctors nobat
dashboardRouter.get("/nobatDoctor/:id",getNobatDoctor);
//* @router for /dashboard/createNobatDoctor/for doctors create nobat
dashboardRouter.get("/createNobatDoctor/:id",authenticatedCheek,getCreateNobat);
//* @router for /dashboard/MatabView/for matab's doctors 
dashboardRouter.get("/MatabView/:id",authenticatedCheek,getMatabView);

//* @router for /dashboard/ِTotalNormalValues/for matab's doctors 
dashboardRouter.get("/TotalNormalValues/:id",authenticatedCheek,getTotalNormalValues);

//* @router for /dashboard/ِBlankEchoConfig/for matab's echo report config 
dashboardRouter.get("/BlankEchoConfig/:id",authenticatedCheek,getBlankEchoConfig);

//* @router for /dashboard/ِcreateechoreport/for matab's doctors 
dashboardRouter.get("/createechoreport/:id",authenticatedCheek,getِcreateechoreport);

//* @router for /dashboard/VisitWithList/for matab's vistit with list for doctors 
dashboardRouter.get("/VisitWithList/:id",authenticatedCheek,getVisitWithLisit);
//* @router for /dashboard/AdminUserPanel/for admin site  for managing user panel selected 
dashboardRouter.get("/AdminUserPanel/",authenticatedCheek,getAdminUserPanel);
//* @router for /dashboard/nobatmekham/for fetch nobats
//* query is in request "SelectedDateMil nobat show"
dashboardRouter.get("/nobatmekham/",FetchNobat);
//* query is in request "MatabNobats nobats show from one day!!"
dashboardRouter.get("/MatabNobats/",MatabNobatsFetch);

//* query is in request "Eho search menu tooles !!"
dashboardRouter.get("/EchoSerachFetch/",EchoSerachFetch);

//* query is in request "MatabNobats with list visit=0 nobats show from one day!!"
dashboardRouter.get("/MatabNobatsWithList/",MatabNobatsFetchWithList);
//* query is in request "serachuser in MatabNobats page
dashboardRouter.get("/SearchUser/",MatabNobatUsersearch);

//* query is in request "deleteEchoById 
dashboardRouter.get("/deleteEchoById/",DeleteEchoById);

//* query is in request "userEchoSerach 
dashboardRouter.get("/userEchoSerach/",UserEchoSearch);

//* query is in request "serachuserVisitWithList  in MatabNobats page
dashboardRouter.get("/SearchUserVisitWithList/",MatabNobatUsersearchVisitWithList);
//* query is in request "serachuser for doctos of this site
dashboardRouter.get("/SearchForDoctor/",getSearchForDoctor);
//* query is in request "serachuser from Sickperson of this site
dashboardRouter.get("/SearchForSickUser/",getSearchForSickUser);
//* query is in request " SearchDoctorPanel from admin of this site
dashboardRouter.get("/SearchDoctorPanel/",PanelSerach);
//* query is in request " AdminSearchNazarkarbaran from admin of this site
dashboardRouter.get("/AdminSearchNazarkarbaran/",AdminSearchNazarkarbaran);
//* query is in request " SearchDoctorNazarat from admin of this site
dashboardRouter.get("/AdminNazarat/",getAdminNazarat);
//* LightPen vist page  for doctos of this site
dashboardRouter.get("/LightPenvisit/",getLightPenVisit);
//* LightPen vist page with list  for doctos of this site
dashboardRouter.get("/LightPenvisitWithList/",getLightPenVisitWithList);
//* NobatHozri vist page  for doctos of this site(matab)
dashboardRouter.get("/NobatHozri/:id",getNobatDoctorHozori);
//* post id for reseving nobat by _id "
dashboardRouter.post("/ReservNobat/",ReservNobat);
//* post id for reseving nobat Hozri by _id doctor and Sick"
dashboardRouter.post("/ReservNobatHozri/",ReservNobatHozri);
//* @router for /dashboard/createNobat/for creating  doctors nobat
dashboardRouter.post("/createNobat",createNobat);
//* @router for /dashboard/image-upload//for first register load imge in client side
dashboardRouter.post("/image-upload",uploadImageMadarek);
//* @router for /dashboard/save selectred paln//
dashboardRouter.post("/selectedPlan",selectedPlan)
//* @router for /dashboard/DosabtSick  SignUpSick//
dashboardRouter.post("/DosabtSick",SignUpSick);
//* @router for /dashboard/DosabtEditSick  SignUpSick//
dashboardRouter.post("/DosabtEditSick",SignUpEditSick);
//* @router for /dashboard/DosabtSickHozri  SignUpSickHozri//
dashboardRouter.post("/DosabtSickHozri",SignUpSickHozri);
//* @router for /dashboard/SabtNazar  DoctorProfile//
dashboardRouter.post("/SabtNazar/",SabtNazarKarbar);
//* @router for /dashboard/SaveHandDoctor  save handdoctor//
dashboardRouter.post("/SaveHandDoctor/",SaveHandDoctorVisit);
//* @router for /dashboard/SaveHandDoctor  save handdoctor//
dashboardRouter.post("/SaveEditHandDoctor/",SaveEditHandDoctorVisit);
//* @router for /dashboard/EndVisit  Done a visit handdoctor//
dashboardRouter.post("/EndVisit/",EndVisit);
//* @router for /dashboard/EndVisitWithList  Done a visit handdoctor//
dashboardRouter.post("/EndVisitWithList/",EndVisitWithList);
//* @router for /dashboard/SaveStateNobat  Save a nobat's state //
dashboardRouter.post("/SaveStateNobat/",SaveStateNobat);
//* @router for /dashboard/SavePanel  Save selected panel by Admin //
dashboardRouter.post("/SavePanelByadmin/",SavePanelByadmin);
//* @router for /dashboard/SavePanel  Save selected panel by Admin //
dashboardRouter.post("/AdminSaveNazarat/",AdminSaveNazarat);
//* @router for /dashboard/saveUserValueselected  Save selected echo normal ranges //
dashboardRouter.post("/saveUserValueselected/",getNormalValueSelectUser);
//* @router for /dashboard/saveCreatedEcho  Save sick's echo by codemilli//
dashboardRouter.post("/saveCreatedEcho/",saveEchoCreatedByCodemilli);
//* @router for /dashboard/generate-report-echo  for sick's echo by codemilli//
dashboardRouter.post("/generate-report-echo/",generateReportEchoBycodemilli );

//* @router for /dashboard/AIapireport  for open Ai report generator//
dashboardRouter.post("/AIapireport/",generateOpenAiReport );

//* @router for /dashboard/saveEchoConfig  for config's Echo//
dashboardRouter.post("/saveEchoConfig/",saveEchoConfig );

export{dashboardRouter} 