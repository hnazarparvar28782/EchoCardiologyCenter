import sharp from "sharp";
import shortId from "shortid";
import moment from "moment-jalaali";
import url from "url";
import pdf from 'html-pdf'
import PDFDocument from 'pdfkit';
import PdfPrinter from 'pdfmake'
import OpenAI from "openai";

import { rootPrj } from "../utils/path.js";
import { getError404, getError500 } from "./errorController.js";
import fs from "fs";
import {
  SchemaHandDoctrorImage,
  SchemaNazarat,
  SchemaSingUpSick,
  schemaCreateNonbat,
  schemaUploadMardarek,
} from "../model/secure/postvalidation.js";
import { User, updateUser } from "../model/doctorsInfo.js";
import { insertNobat, nobatDoctors } from "../model/nobatDoctors.js";
import passport from "passport";
import { NazarKarBaran, UpdateNazar, insertNazar } from "../model/NazaratKarbaran.js";
import mongoose, { mongo } from "mongoose";
import path from "path";
import shortid from "shortid";
// import mongoose, { mongo } from "mongoose";
// import { string } from "yup";
// import  from './../node_modules/pdfkit/js/pdfkit.js';
import { deleteEchoSick, EchoSicks, insertEchoSick } from "../model/echosicks.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const getDashboard = async (req, res) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  //* fetch doctors data
  const activeDoctors = await User.find({ panelIsActiveted: true });
  const user = userDistruct(req);
  let IsDoctor = false
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/doctorCards.ejs", {
      errorlogin: req.flash("error"),
      errorCaptcha: req.flash("errorCaptcha"),
      user,
      pageTitle: "دکترپیش تو|صفحه اصلی",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      errorchangePass: "",
      errors: "",
      activeDoctors,
      IsDoctor,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getContackt = async (req, res) => {

  //* fetch doctors data
  const activeDoctors = await User.find({ panelIsActiveted: true });
  const user = userDistruct(req);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/private/Contackt.ejs", {
      errorlogin: req.flash("error"),
      errorCaptcha: req.flash("errorCaptcha"),
      user,
      pageTitle: "دکترپیش تو|صفحه اصلی",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      errorchangePass: "",
      errors: "",
      activeDoctors,
      IsDoctor,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }

};
const getHelp = async (req, res) => {

  //* fetch doctors data
  const activeDoctors = await User.find({ panelIsActiveted: true });
  const user = userDistruct(req);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/private/Help.ejs", {
      errorlogin: req.flash("error"),
      errorCaptcha: req.flash("errorCaptcha"),
      user,
      pageTitle: "دکترپیش تو|صفحه اصلی",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      errorchangePass: "",
      errors: "",
      activeDoctors,
      IsDoctor,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getRegisterDoctor = async (req, res) => {
  console.log("vard getRegisterDoctor...................");
  console.log("*******************************");
  const user = userDistruct(req);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    const errorchangePass = req.flash("errorchangePass");
    req.flash("errorchangePass", "");

    console.log(user)
    res.render("../views/private/registerDoctors.ejs", {
      pageTitle: "دکترپیش تو| ثبت نام پزشک",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      message: req.flash("sucsessMsg"),
      error: req.flash("error"),
      infoBack: req.user, //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      errorchangePass,
      errors: req.flash("error"),
      user,
      IsDoctor,
      moment,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getPreRegister = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/private/preRejister.ejs", {
      pageTitle: "دکترپیش تو| ثبت نام پزشک",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      errorchangePass: "",
      errors: "",
      IsDoctor,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};

const getSearchForDoctor = async (req, res) => {
  const { SerachFordoctor } = req.query
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  //* fetch doctors data
  const activeDoctors = await User.find({
    $or: [{ panelIsActiveted: true, FullName: { $regex: SerachFordoctor } },
    { panelIsActiveted: true, takhasos: { $regex: SerachFordoctor } },
    { panelIsActiveted: true, address: { $regex: SerachFordoctor } },
    ]
  });
  const user = userDistruct(req);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/doctorCards.ejs", {
      errorlogin: req.flash("error"),
      errorCaptcha: req.flash("errorCaptcha"),
      user,
      pageTitle: "دکترپیش تو|صفحه اصلی",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      errorchangePass: "",
      errors: "",
      activeDoctors,
      IsDoctor,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
}
const getSearchForSickUser = async (req, res) => {
  const { SerachFordoctorr } = req.query
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  //* fetch doctors data
  const SickList = await User.find({
    $or: [{ nezam: "", FullName: { $regex: SerachFordoctorr } },
    { nezam: "", takhasos: { $regex: SerachFordoctorr } },
    { nezam: "", address: { $regex: SerachFordoctorr } },
    { nezam: "", mobileId: { $regex: SerachFordoctorr } },
    { nezam: "", codemilli: { $regex: SerachFordoctorr } },
    ]
  });
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.user._id);
  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");

  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/private/NobatHozri.ejs", {
      pageTitle: "دکترپیش تو|نوبت حضوری در مطب",
      layout: "../views/layouts/MatabNobatHozriLayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      UserSelectedDate,
      SickList,
      disableBeforeDate: "",
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
}

const getDoctorProfile = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  const NazaratDoctor = await NazarKarBaran.find({ DoctorId: req.params.id, AprovNazar: true });
  const TedadNazar = await NazarKarBaran.count({ DoctorId: req.params.id, AprovNazar: true });
  const DoctorStars = await NazarKarBaran.aggregate([
    { $match: { DoctorId: req.params.id, AprovNazar: true } },
    { $group: { _id: "$DoctorId", TotalStar: { $sum: "$SumStars" } } },
  ]);
  console.log(DoctorStars)
  let TotalStar = 0
  let Emtiaz = 0
  if (DoctorStars != "") {
    TotalStar = DoctorStars[0].TotalStar;
    Emtiaz = Math.ceil(((TotalStar / 4) * 100) / TedadNazar);
  }

  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/private/doctorProfile.ejs", {
      pageTitle: "دکترپیش تو| ثبت نام پزشک",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      NazaratDoctor,
      moment,
      Emtiaz,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getNobatDoctor = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/private/nobat.ejs", {
      pageTitle: "دکترپیش تو| نوبت اینترنتی",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      disableBeforeDate: new Date(),
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getNobatDoctorHozori = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");
  const SickList = [];
  try {
    res.render("../views/private/NobatHozri.ejs", {
      pageTitle: "دکترپیش تو|نوبت حضوری در مطب",
      layout: "../views/layouts/MatabNobatHozriLayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      UserSelectedDate,
      SickList,
      disableBeforeDate: new Date(),
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getCreateNobat = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    res.render("../views/private/createNobat.ejs", {
      pageTitle: "دکترپیش تو| ثبت نام پزشک",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getMatabView = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");
  const selectdate = moment(Date.now());
  console.log(selectdate.format("YYYY-MM-DD"))
  console.log(doctor)
  //* convert id mongoose to string
  const doctorId = new mongoose.Types.ObjectId(doctor._id).toString();
  const nobats = await nobatDoctors.aggregate([
    {
      $match: {
        doctorId: doctorId,
        nobatDay: new Date(selectdate.format("YYYY-MM-DD"))
      }
    },
    {
      $addFields: {
        nobats: {
          $filter: {
            input: "$nobats",
            as: "nobat",
            cond: {
              $and: [
                { $ne: ["$$nobat.mobileSick", ""] },
              ]
            }
          }
        },
        VisitCount: {
          $size: {
            $filter: {
              input: "$nobats",
              as: "nobat",
              cond: { $eq: ["$$nobat.Visit", true] }
            }
          }
        },
        HozorCount: {
          $size: {
            $filter: {
              input: "$nobats",
              as: "nobat",
              cond: { $and: [{ $eq: ["$$nobat.Hozor", true] }, { $eq: ["$$nobat.Visit", false] }] }
            }
          }
        }
      }
    },
    {
      $sort: { "nobats.nobatTime": -1 }
    },
    {
      $project: {
        nobatDay: 1,
        NobatInternet: 1,
        nobatType: 1,
        VisitCount: 1,
        HozorCount: 1,
        nobats: 1,
        doctorName: 1,
      }
    }
  ]).exec();
  //* init disabledDays,next config it in Matablayout 
  console.log("***********************************")
  console.log(nobats)
  let HozorCountAfter = 0
  let VisitCountAfter = 0
  let HozorCountMon = 0;
  let VisitCountMon = 0;
  if (nobats.length === 0) {
    console.log("No matching documents found.");
  } else {
    nobats.forEach(doc => {
      console.log(`Doctor: ${doc.doctorName}, Visit Count: ${doc.VisitCount}
                  Hozer Count: ${doc.HozorCount}`);
      if (doc.nobatType == "monday") {
        HozorCountMon += doc.HozorCount;
        VisitCountMon += doc.VisitCount;
      }
      if (doc.nobatType == "afternon") {
        HozorCountAfter += doc.HozorCount;
        VisitCountAfter += doc.VisitCount;
      }
    });
  }

  let NobatsResult = [];
  if (nobats) {
    NobatsResult = nobats;
  }

  // const nobats = await nobatDoctors.find({
  //   doctorId: doctor._id,
  //   nobatDay: selectdate.format("YYYY-MM-DD"),
  //   }, 
  //   { "nobatDay":1,"NobatInternet":1,
  //     "nobats" : {"$filter" : {"input" : "$nobats", "as" : "nobats", "cond" :  {"$ne" : ["$$nobats.mobileSick", "" ]}}
  //                },
  // })

  // .sort([["nobats.nobatTime", "descending"]]); 
  // .sort({ "nobats.Visit": 0 }); 
  //* init disabledDays,next config it in Matablayout 
  // let NobatsResult = [];
  // if (nobats) NobatsResult=nobats
  //   console.log(nobats)
  try {
    return res.render("../views/private/MatabView.ejs", {
      pageTitle: "مطب پزشک",
      layout: "../views/layouts/Matablayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      moment,
      NobatsResult,
      UserSelectedDate,
      disableBeforeDate: "",
      HozorCountAfter,
      VisitCountAfter,
      HozorCountMon,
      VisitCountMon,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getTotalNormalValues = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }

  let dataPath = path.join(`${rootPrj}/data/`, '1NormalRange.json');
  let data1 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '2NormalRange.json');
  let data2 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '3NormalRange.json');
  let data3 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '4NormalRange.json');
  let data4 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '5NormalRange.json');
  let data5 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '6NormalRange.json');
  let data6 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '7NormalRange.json');
  let data7 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '8NormalRange.json');
  let data8 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '9NormalRange.json');
  let data9 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '10NormalRange.json');
  let data10 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '11NormalRange.json');
  let data11 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '12NormalRange.json');
  let data12 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '13NormalRange.json');
  let data13 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '14NormalRange.json');
  let data14 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '15NormalRange.json');
  let data15 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '16NormalRange.json');
  let data16 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '17NormalRange.json');
  let data17 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '18NormalRange.json');
  let data18 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let userEchoSelectWithRow=[];
  if (req.user && req.user.userEchoSelectWithRow && Object.keys(req.user.userEchoSelectWithRow).length > 0) 
    {userEchoSelectWithRow = user.userEchoSelectWithRow;} 

  return res.render("../views/private/DisplayTotalNormalValue.ejs", {
    pageTitle: "مطب پزشک",
    layout: "../views/layouts/EchoLayout.ejs",
    path: "setEcho",
    data1, data2, data3, data4, data5, data6, data7, data8,
    data9, data10, data11, data12, data13, data14, data15,
    data16, data17,data18,
    UserSelectedDate: "",
    message: req.flash("success_register"),
    error: req.flash("error"),
    infoBack: [], //values of inputs after submit
    errorCaptcha: "",
    errorlogin: "",
    user,
    doctor,
    errorchangePass: "",
    errors: "",
    IsDoctor,
    userEchoSelectWithRow,
  });

};



const getBlankEchoConfig = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }

  let config=[];
  if (req.user.userEchoConfig && req.user.userEchoConfig != null) {
     config = JSON.parse(req.user.userEchoConfig);
  }
  return res.render("../views/private/BlankEchoConfig.ejs", {
    pageTitle: "مطب پزشک",
    layout: "../views/layouts/EchoLayout.ejs",
    path: "setEchoconfig",
    UserSelectedDate: "",
    message: req.flash("success_register"),
    error: req.flash("error"),
    infoBack: [], //values of inputs after submit
    errorCaptcha: "",
    errorlogin: "",
    user,
    doctor,
    errorchangePass: "",
    errors: "",
    IsDoctor,
    config,
  });

};

const getِcreateechoreport = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  let data=[];
  let userEchoSelectWithRow=[];
  if (req.user && req.user.userEchoData && Object.keys(req.user.userEchoData).length > 0) {
    data = JSON.parse(req.user.userEchoData);
    if (data.data) data=data.data;
    if (req.user && req.user.userEchoSelectWithRow && Object.keys(req.user.userEchoSelectWithRow).length > 0) 
      {userEchoSelectWithRow = user.userEchoSelectWithRow;} 
    // let dataPath = path.join(`${rootPrj}/public/uploads/${user.mobileId}/`, `echoprofile${user.codemilli}.json`);
    // let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    // console.log(data.data)
    // new hassan
    // let data = JSON.parse(doctor.userEchoData);
    // console.log(data);
    // new  hassan
    
    let dataPath = path.join(`${rootPrj}/data/`, '18NormalRange.json');
    let data18 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

    const SickEchos = [];
    const SickInfoSave = [];
    let SickInfo = [];
    return res.render("../views/private/BlankEchoReport.ejs", {
      pageTitle: "مطب پزشک",
      layout: "../views/layouts/EchoLayout.ejs",
      path: "/getEchoCreate",
      data: data, // ارسال داده‌ها
      UserSelectedDate: "",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      SickEchos,
      SickInfo,
      SickInfoSave,
      moment,
      data18,
      userEchoSelectWithRow,
    });
  } else {
    // req.flash('error','شما باید از قسمت اکوپروفایل -اکو آزمایش های منتخب ابتدا  اکوهای مورد نظر خود را انتخاب نمایید'),
    // getError404(req, res);
    req.flash('error','کاربر محترم اکوهای پرکاربرد خود را اینجا برای راحتی کار انتخاب نمایید');
    res.redirect(`/dashboard/TotalNormalValues/${req.user._id}` ) 
  }
};


const getVisitWithLisit = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(req.params.id);
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");
  const selectdate = moment(Date.now());

  console.log(selectdate.format("YYYY-MM-DD"))
  //* convert id mongoose to string
  const doctorId = new mongoose.Types.ObjectId(doctor._id).toString();
  const nobats = await nobatDoctors.aggregate([
    {
      $match: {
        doctorId: doctorId,
        nobatDay: new Date(selectdate.format("YYYY-MM-DD"))
      }
    },
    {
      $addFields: {
        nobats: {
          $filter: {
            input: "$nobats",
            as: "nobat",
            cond: {
              $and: [
                { $ne: ["$$nobat.mobileSick", ""] },
                { $eq: ["$$nobat.Visit", false] },
                { $eq: ["$$nobat.Erja", true] }
              ]
            }
          }
        },
        VisitCount: {
          $size: {
            $filter: {
              input: "$nobats",
              as: "nobat",
              cond: { $eq: ["$$nobat.Visit", true] }
            }
          }
        },
        HozorCount: {
          $size: {
            $filter: {
              input: "$nobats",
              as: "nobat",
              cond: { $and: [{ $eq: ["$$nobat.Hozor", true] }, { $eq: ["$$nobat.Visit", false] }] }
            }
          }
        }
      }
    },
    {
      $sort: { "nobats.nobatTime": -1 }
    },
    {
      $project: {
        nobatDay: 1,
        NobatInternet: 1,
        nobatType: 1,
        VisitCount: 1,
        HozorCount: 1,
        nobats: 1,
        doctorName: 1,
      }
    }
  ]).exec();
  //* init disabledDays,next config it in Matablayout 
  console.log("***********************************")
  console.log(nobats)
  let HozorCountAfter = 0
  let VisitCountAfter = 0
  let HozorCountMon = 0;
  let VisitCountMon = 0;
  if (nobats.length === 0) {
    console.log("No matching documents found.");
  } else {
    nobats.forEach(doc => {
      console.log(`Doctor: ${doc.doctorName}, Visit Count: ${doc.VisitCount}
                   Hozer Count: ${doc.HozorCount}`);
      if (doc.nobatType == "monday") {
        HozorCountMon += doc.HozorCount;
        VisitCountMon += doc.VisitCount;
      }
      if (doc.nobatType == "afternon") {
        HozorCountAfter += doc.HozorCount;
        VisitCountAfter += doc.VisitCount;
      }
    });
  }

  let NobatsResult = [];
  if (nobats) {
    NobatsResult = nobats;
  }
  try {
    return res.render("../views/private/VisitWithList.ejs", {
      pageTitle: "پزشک (ویزیت از  لیست )",
      layout: "../views/layouts/VisitWithListLayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      doctor,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      moment,
      NobatsResult,
      UserSelectedDate,
      disableBeforeDate: "",
      HozorCountAfter,
      VisitCountAfter,
      HozorCountMon,
      VisitCountMon,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const getLightPenVisit = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const SickCodeMilli = req.query.SickCodemilli;
  const SickFullName = req.query.FullName;
  const DoctorCodemilli = req.user.codemilli;
  const IdRecord = req.query.IdRecord;
  const IdNobat = req.query.IdNobat;

  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");

  let ListVistFiles = [];
  if (fs.existsSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`)) {
    ListVistFiles = fs.readdirSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`);
  }
  let IsDoctor = true;

  try {
    return res.render("../views/private/LightPenVisit.ejs", {
      pageTitle: "دکترپیش تو| ویزت پزشک ",
      layout: "../views/layouts/LightPenVisitLayout.ejs",
      path: "/LightPenVisit",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      SickCodeMilli,
      SickFullName,
      DoctorCodemilli,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      ListVistFiles,
      IdNobat,
      IdRecord,
      moment,
      UserSelectedDate,

    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }


}
const getLightPenVisitWithList = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  const SickCodeMilli = req.query.SickCodemilli;
  const SickFullName = req.query.FullName;
  const DoctorCodemilli = req.user.codemilli;
  const IdRecord = req.query.IdRecord;
  const IdNobat = req.query.IdNobat;

  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");

  let ListVistFiles = [];
  if (fs.existsSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`)) {
    ListVistFiles = fs.readdirSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`);
  }
  let IsDoctor = true;

  try {
    return res.render("../views/private/LightPenVisitWithList.ejs", {
      pageTitle: "دکترپیش تو| ویزت پزشک ",
      layout: "../views/layouts/LightPenVisitLayout.ejs",
      path: "/LightPenVisit",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      SickCodeMilli,
      SickFullName,
      DoctorCodemilli,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      ListVistFiles,
      IdNobat,
      IdRecord,
      moment,
      UserSelectedDate,

    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }


}
const getAdminUserPanel = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");

  //* retreving Nobats today
  const UserList = await User
    .find({ nezam: { $ne: "" } })
  // .sort([["Visit", "descending"]]);

  let NobatsResult = [];
  // const UserSelectedDateMil = UserSelectedDate
  try {
    return res.render("../views/private/AdminUserPanel.ejs", {
      pageTitle: "مطب پزشک",
      layout: "../views/layouts/AdminLayout.ejs",
      path: "/getAdminUserPanel",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      moment,
      NobatsResult: "",
      UserList,
      UserSelectedDate,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
}
const getAdminNazarat = async (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }

  //* retreving Nobats today
  const UserList = await NazarKarBaran
    .find({})
  // .sort([["Visit", "descending"]]);

  let NobatsResult = [];
  // const UserSelectedDateMil = UserSelectedDate
  try {
    return res.render("../views/private/AdminNazarat.ejs", {
      pageTitle: "مطب پزشک",
      layout: "../views/layouts/AdminLayout.ejs",
      path: "/getAdminNazarat",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      moment,
      NobatsResult: "",
      UserList,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }

}
const userDistruct = (req) => {
  let user = [];
  // console.log("request sended!")
  //console.log("discrit***************************")
  // console.log(req);
  if (req.user != undefined) {
    const {
      _id,
      FullName,
      mobileId,
      takhasos,
      codemilli,
      nezam,
      mondayWork,
      afternonWork,
      Email,
      address,
      tellphone,
      workExperience,
      acceptPolicy,
      doctorPicture,
      doctorDocument,
      panelSelected,
      panelActiveDate,
      panelStopDate,
      panelIsActiveted,
      panelNumberActive,
      DisableDays,
      MessageWork,
    } = req.user;
    user = {
      _id,
      FullName,
      mobileId,
      takhasos,
      codemilli,
      nezam,
      mondayWork,
      afternonWork,
      Email,
      address,
      tellphone,
      workExperience,
      acceptPolicy,
      doctorPicture,
      doctorDocument,
      panelSelected,
      panelActiveDate,
      panelStopDate,
      panelIsActiveted,
      panelNumberActive,
      DisableDays,
      MessageWork,
    };
  }

  return user;
};

const uploadImageMadarek = async (req, res) => {
  try {
    //* receiving file by Ajax , fromData
    if (req.files) {
      const uploadfiledoctor = req.files.uploadfiledoctor;
      await schemaUploadMardarek.validate(
        { uploadfiledoctor },
        { abortEarly: false }
      );
      //*so,the data is valided now.
      const codemilli = req.user.codemilli;
      if (!fs.existsSync(`${rootPrj}/public/uploads/madarek/${codemilli}`)) {
        const res = fs.mkdir(
          `${rootPrj}/public/uploads/madarek/${codemilli}`,
          (event) => {
            console.log(event);
          }
        );
      }
      const fileName = `${shortId.generate()}_${uploadfiledoctor.name}`;
      const uploadPath = `${rootPrj}/public/uploads/madarek/${codemilli}/${fileName}`;
      //*compress image by sharp
      await sharp(uploadfiledoctor.data)
        .jpeg({ quality: 60 })
        .toFile(uploadPath)
        .catch((err) => console.log(err));
      res
        .status(200)
        .json({ message: "مدرک یاسند مورد نظر  ارسال شد", done: "true" });
    } else {
      res.send("  فایلی برای آپلود شدن انتخاب  نشده است ");
    }
  } catch (error) {
    console.log(error.errors);
    res.status(201).json({ message: error.errors, done: "false" });
  }
};

const selectedPlan = async (req, res) => {
  try {
    //*info is formData
    //* change json to js & destruture
    const { panelSelected, varizMab, transactMab } = JSON.parse(req.body.info);
    let panelActiveDate = "";
    let panelStopDate = "";
    switch (panelSelected) {
      case "نوبت اینترنتی ماهانه":
        panelActiveDate = moment(Date()).format("YYYY-MM-DD")
        panelStopDate = moment(Date()).add(1, 'month').format("YYYY-MM-DD")
        break
      case "نوبت اینترنتی سالیانه":
        panelActiveDate = moment(Date()).format("YYYY-MM-DD")
        panelStopDate = moment(Date()).add(1, 'year').format("YYYY-MM-DD")
        break
      case "فول امکانات ماهیانه":
        panelActiveDate = moment(Date()).format("YYYY/MM/DD")
        panelStopDate = moment(Date()).add(1, 'month').format("YYYY/MM/DD")
        break
      case "فول امکانات سالیانه":
        panelActiveDate = moment(Date()).format("YYYY/MM/DD")
        panelStopDate = moment(Date()).add(1, 'year').format("YYYY/MM/DD")
        break
      case "کاربری رایگان":
        panelActiveDate = moment(Date()).format("YYYY/MM/DD")
        panelStopDate = moment(Date()).add(10, 'day').format("YYYY/MM/DD")
        break
      default:
        break;
    }
    const selectedInfo = { panelSelected, varizMab, transactMab, panelActiveDate, panelStopDate };
    updateUser(req.user._id, selectedInfo);
    res.status(200).json({ message: "اطلاعات ثبت گردید" });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};

const createNobat = async (req, res) => {
  try {
    //*info is formData
    //* change json to js & destruture
    const { aztarekh, tatarekh, monday, afternon, NobatHozori, NobatInterneti, azsaat, tasaat, interval } =
      JSON.parse(req.body.nobat);

    await schemaCreateNonbat.validate(
      { aztarekh, tatarekh, azsaat, tasaat, interval },
      { abortEarly: false }
    );
    //* then data is valid
    const nobatType = monday == true ? "monday" : "afternon";
    const NobatInternet = NobatInterneti == true ? true : false;
    const nobats = [];
    let nobatTime = azsaat;
    let aztarekhMoment = moment(
      `${aztarekh} ${nobatTime}`,
      "jYYYY/jMM/jDD HH:mm"
    ); // Parse a Jalaali date
    let taMilDate = moment(`${tatarekh} `, "jYYYY/jMM/jDD");
    let currMilDate = moment(`${aztarekh} `, "jYYYY/jMM/jDD");
    do {
      //* loop nobat time
      nobatTime = aztarekhMoment.format("HH:mm");
      nobats.push({
        nobatTime,
        reserve: false,
        mobileSick: "",
        codemilli: "",
        TrackingCode: "",
        FullName: "",
        Hozor: false,
        Erja: false,
        Visit: false,
        Pardakhti: 0,
        Tozieh: "",
      });
      aztarekhMoment.add(interval, "minute");
      nobatTime = aztarekhMoment.format("HH:mm");
    } while (nobatTime <= tasaat); //* loop nobat time
    const nobatFrei = nobats.length; //*viel frei nobats.
    do {
      //* chcek allredy day nobat exist is?
      const Daynobat = await nobatDoctors.findOne({
        nobatDay: currMilDate.format("YYYY-MM-DD"),
        NobatInternet: NobatInternet,
        doctorId: req.user._id,
        nobatType: nobatType
      })
      //*loop day nobat
      if (Daynobat == null) {
        insertNobat(
          req.user.FullName,
          req.user._id,
          currMilDate.format("YYYY-MM-DD"),
          nobats,
          nobatType,
          NobatInternet,
          nobatFrei
        );
      }
      currMilDate.add(1, "day"); //* next day
    } while (currMilDate <= taMilDate); //* loop day nobat
    //* miladi's mongo to persion jlali
    //* console.log(moment('2023-12-27T00:00:00.000+00:00').format('JYYYY/jMM/jDD'))
    return res
      .status(200)
      .json({ message: "فهرست نوبت های خواسته شده ایجاد گردید", done: "true" });
  } catch (error) {
    return res.status(201).json({ message: error.errors, done: "false" });
  }
};

const FetchNobat = async (req, res) => {
  if (req.query) {
    // console.log(req.query);
    try {
      const selectdate = moment(req.query.SelectedDateMil);
      const nobats = await nobatDoctors
        .find({
          doctorId: req.query.id,
          nobatDay: selectdate.format("YYYY-MM-DD"),
          NobatInternet: req.query.NobatInternet,
        })
        .sort([["nobatType", "descending"]]);

      if (nobats) {
        //*convet to JSON array
        const jsonobat = JSON.stringify(nobats); //*jsondata
        res.status(200).json(jsonobat);
      } else {
        res
          .status(201)
          .json({ message: "برای روز انتخاب شده هیچ نوبتی وجود ندارد" });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error });
    }
  } //*if req.query
};
const ReservNobat = async (req, res) => {
  const { idDay, idNobat } = req.body.params;
  //  const AnyNobat = await CanItReserv(idDay,req.user.mobileId);
  if (!req.isAuthenticated()) {
    //*send to  ".then(function (response)" ReservNobat in client mode
    return res
      .status(201)
      .json({
        autorised: "false",
        message:
          " شما ابتدا باید  با شماره موبایل خود ثبت نمایید سپس می توانید از خدمات سایت استفاده نمایید",
      });
  } else {
    try {
      if (await CanItReserv(idDay, req.user.mobileId)) {
        return res
          .status(203)
          .json({
            Done: "false",
            message:
              " هر کاربر دریک روز نمی تواند بیش از یک نوبت انتخاب نمایید. درصورت اشتباه نوبت  قبلی خود را از منوی نوبت های من ابطال نمایید با تشکر",
          });
      }
      const nobatsDay = await nobatDoctors.findOne({ _id: idDay });
      if (nobatsDay != null) {
        if (nobatsDay.nobats.id(idNobat).reserve == false) {
          //* find in array and update
          nobatsDay.nobats.id(idNobat).reserve = true;
          nobatsDay.nobats.id(idNobat).mobileSick = req.user.mobileId;
          nobatsDay.nobats.id(idNobat).codemilli = req.user.codemilli;
          nobatsDay.nobats.id(idNobat).FullName = req.user.FullName;
          nobatsDay.nobats.id(idNobat).TrackingCode = TrackingCode();
          const updated = await nobatsDay.save();
          //console.log(updated)
          if (updated != null) {
            const message = `نوبت   ساعت ${nobatsDay.nobats.id(idNobat).nobatTime
              } مورخه ${moment(nobatsDay.nobatDay).format(
                "jYYYY/jMM/jDD"
              )}  با کد رهگیری  ${nobatsDay.nobats.id(idNobat).TrackingCode
              } ثبت  گردید در ضمن  شما می توانید در صورت انصراف نوبت خود را حذف نمایید  تا بیمار دیگر از این وقت بهره مند شود`;
            return res.status(200).json({ message });
          }
        } else {
          const message = "این نوبت قبلا رزرو  شده است";
          return res.status(201).json({ message });
        }
      }
    } catch (error) {
      console.log(error);
      //* 404 reserving code fro error
      return res.status(404).json({ error });
    }
  }
};
const ReservNobatHozri = async (req, res) => {
  const { idDay, idNobat, codemilli, MobileId, FullName } = req.body.params;
  //  const AnyNobat = await CanItReserv(idDay,req.user.mobileId);
  if (!req.isAuthenticated()) {
    //*send to  ".then(function (response)" ReservNobat in client mode
    return res
      .status(201)
      .json({
        autorised: "false",
        message:
          " شما ابتدا باید  با شماره موبایل خود ثبت نمایید سپس می توانید از خدمات سایت استفاده نمایید",
      });
  } else {
    //* is selected sick?
    if (FullName == "") {
      return res
        .status(203)
        .json({
          Done: "false",
          message:
            "کاربر محترم بیمار را از لیست بالا با کلیک کردن ابتدا انتخاب نموده سپس تعیین وقت نمایید با تشکر",
        });
    }
    try {
      if (await CanItReserv(idDay, MobileId)) {
        return res
          .status(203)
          .json({
            Done: "false",
            message:
              " هر کاربر دریک روز نمی تواند بیش از یک نوبت انتخاب نمایید. درصورت اشتباه نوبت  قبلی خود را از منوی نوبت های من ابطال نمایید با تشکر",
          });
      }

      const nobatsDay = await nobatDoctors.findOne({ _id: idDay });
      if (nobatsDay != null) {
        if (nobatsDay.nobats.id(idNobat).reserve == false) {
          //* find in array and update
          nobatsDay.nobats.id(idNobat).reserve = true;
          nobatsDay.nobats.id(idNobat).mobileSick = MobileId;
          nobatsDay.nobats.id(idNobat).codemilli = codemilli;
          nobatsDay.nobats.id(idNobat).FullName = FullName;
          nobatsDay.nobats.id(idNobat).TrackingCode = TrackingCode();
          const updated = await nobatsDay.save();
          //console.log(updated)
          if (updated != null) {
            const message = `نوبت   ساعت ${nobatsDay.nobats.id(idNobat).nobatTime
              } مورخه ${moment(nobatsDay.nobatDay).format(
                "jYYYY/jMM/jDD"
              )}  با کد رهگیری  ${nobatsDay.nobats.id(idNobat).TrackingCode
              } ثبت  گردید در ضمن  شما می توانید در صورت انصراف نوبت خود را حذف نمایید  تا بیمار دیگر از این وقت بهره مند شود`;
            return res.status(200).json({ message });
          }
        } else {
          const message = "این نوبت قبلا رزرو  شده است";
          return res.status(201).json({ message });
        }
      }
    } catch (error) {
      console.log(error);
      //* 404 reserving code fro error
      return res.status(404).json({ error });
    }
  }
};
const TrackingCode = () => {
  const max = 100000000;
  const min = 1;
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return rand;
};
const SignUpSick = async (req, res) => {
  try {
    //* receiving request by Ajax and validating
    await SchemaSingUpSick.validate(req.body, { abortEarly: false });
    //*so,the data is valided now.
    const mobileId = req.body.mobileId;
    const codemilli = req.body.codemilli;
    const person = await User.findOne({ mobileId });
    const person2 = await User.findOne({ codemilli });
    let msg = ""
    if (person) msg = "شماره موبایل قبلا ثبت شده است"
    if (person2) msg = msg + " " + "شماره ملی قبلا ثبت شده است"
    //* first way to creating a user,please select one of them
    if (!person & !person2) {
      console.log("to person hastam");
      const result = await User.create({ ...req.body, nezam: "" });
      if (result) {
        passport.authenticate("local", {
          failureRedirect: "/dashboard",
          failureFlash: true,
        })(req, res, () => {
          res.status(200).json({ message: "اطلاعات  بیمار ثبت شد" });
        });
        //res.status(200).json({"message":"ثبت نام با موفقیت انجام شد اکنون می توانید با شماره موبایل خود وارد سامانه شوید",})
      }
    } else {
      // res.status(201).json({ message: "این شماره موبایل قبلا ثبت شده است" });
      res.status(201).json({ message: msg });
    }
  } catch (error) {
    console.log(error.errors);
    res.status(201).json({ message: error.errors, done: "false" });
  }
};

const SignUpEditSick = async (req, res) => {
  try {
    //* receiving request by Ajax and validating
    await SchemaSingUpSick.validate(req.body, { abortEarly: false });
    //*so,the data is valided now.
    const { mobileId, FullName, codemilli, PassWord, Email } = req.body

    const user = await User.findOne({ mobileId });

    // if (!user) {
    //   return res.redirect("/404");
    // }
    if (user) {
      console.log("to user hastam");
      user.FullName = FullName;
      user.codemilli = codemilli;
      user.Email = Email;
      user.nezam = "";
      user.PassWord = PassWord;
      const result = await user.save();
      if (result) {
        passport.authenticate("local", {
          failureRedirect: "/dashboard",
          failureFlash: true,
        })(req, res, () => {
          res.status(200).json({ message: "اطلاعات  بیمار ثبت شد" });
        });
        //res.status(200).json({"message":"ثبت نام با موفقیت انجام شد اکنون می توانید با شماره موبایل خود وارد سامانه شوید",})
      }
    } else {
      res.status(201).json({ message: "شماره موبایل غیر قابل تغییر است در صورت   نیاز با شماره جدید مجددا ثبت نام انجام دهید" });
    }
  } catch (error) {
    console.log(error.errors);
    res.status(201).json({ message: error.errors, done: "false" });
  }
};


const SignUpSickHozri = async (req, res) => {
  try {
    //* receiving request by Ajax and validating
    await SchemaSingUpSick.validate(req.body, { abortEarly: false });
    //*so,the data is valided now.
    const mobileId = req.body.mobileId;
    const codemilli = req.body.codemilli;
    const person = await User.findOne({ mobileId });
    const person2 = await User.findOne({ codemilli });
    let msg = ""
    if (person) msg = "شماره موبایل قبلا ثبت شده است"
    if (person2) msg = msg + " " + "شماره ملی قبلا ثبت شده است"
    //* first way to creating a user,please select one of them
    if (!(person) & !(person2)) {
      console.log("to person hastam");
      const result = await User.create({ ...req.body, nezam: "" });
      if (result) {
        res.status(200).json({ message: "اطلاعات  بیمار ثبت شد" });
      }
    } else {
      // res.status(201).json({ message: "این شماره موبایل قبلا ثبت شده است" });
      res.status(201).json({ message: msg });
    }
  } catch (error) {
    console.log(error.errors);
    res.status(201).json({ message: error.errors, done: "false" });
  }
};
const SabtNazarKarbar = async (req, res) => {
  try {
    //* receiving request by Ajax and validating
    await SchemaNazarat.validate(req.body, { abortEarly: false });
    //*so,the data is valided now.
    const {
      DoctorFullName,
      DoctorId,
      KarbarFullName,
      KarbarId,
      NazarKarbar,
      SumStars,
    } = req.body;
    const nazar = insertNazar(
      DoctorFullName,
      DoctorId,
      KarbarFullName,
      KarbarId,
      NazarKarbar,
      SumStars
    );

    if (nazar) {
      return res
        .status(200)
        .json({
          autorised: "false",
          message:
            "مراجعه کننده محترم  ضمن تشکر که در این نظر سنجی شرکت نمودید. به زودی نظر شما در سایت  قرار خواهد گرفت",
        });
    } else {
      return res
        .status(201)
        .json({
          autorised: "false",
          message: "خطا در ثبت اطلاعات مجددا تلاش کنید",
        });
    }
  } catch (error) {
    return res.status(202).json({ message: error.errors, done: "false" });
  }
};
const RemoveNobat = async (req, res) => {
  const { idDay, idNobat } = req.body.params;
  try {
    console.log(idDay);
    const nobatsDay = await nobatDoctors.findOne({ _id: idDay });
    console.log("********** next nobatsDay");
    if (nobatsDay != null) {
      if (nobatsDay.nobats.id(idNobat).reserve == true) {
        //* find in array and update
        const KodRahgieri = nobatsDay.nobats.id(idNobat).TrackingCode;
        nobatsDay.nobats.id(idNobat).reserve = false;
        nobatsDay.nobats.id(idNobat).mobileSick = "";
        nobatsDay.nobats.id(idNobat).codemilli = "";
        nobatsDay.nobats.id(idNobat).TrackingCode = "";
        nobatsDay.nobats.id(idNobat).FullName = "";
        const updated = await nobatsDay.save();
        console.log("********** next updated");
        //console.log(updated)
        if (updated != null) {
          const message = `نوبت   ساعت ${nobatsDay.nobats.id(idNobat).nobatTime
            } مورخه ${moment(nobatsDay.nobatDay).format(
              "jYYYY/jMM/jDD"
            )}  با کد رهگیری  ${KodRahgieri}   ابطال و هم اکنون می تواند بیمار دیگری از این نوبت استفاده نماید با تشکر از دقت نظر شما مراجعه کننده گرامی`;
          return res.status(200).json({ message });
        }
      } else {
        const message = "این نوبت    قبلا آزاد شده است ";
        return res.status(201).json({ message });
      }
    }
  } catch (error) {
    console.log(error);
    //* 404 reserving code fro error
    return res.status(404).json({ error });
  }
};
const CanItReserv = async (idDay, mobileSick) => {
  const AnyNobat = await nobatDoctors.findOne({
    _id: idDay,
    "nobats.mobileSick": mobileSick,
  });
  return AnyNobat;
};

const MatabNobatsFetch = async (req, res) => {
  console.log(req.query)
  //* retrive from submited form "FormSearch"
  let { UserSelectedDate, iddoctor, UserSelectedDateMil } = req.query
  // console.log(UserSelectedDate)k
  if (UserSelectedDate != undefined) {
    try {
      if (UserSelectedDate) {
        const user = req.user == undefined ? [] : req.user;
        const doctor = await User.findById(iddoctor);
        let IsDoctor = true;
        const selectdate = moment(UserSelectedDateMil);
        console.log(selectdate.format("YYYY-MM-DD"))
        console.log(iddoctor)
        //* convert id mongoose to string
        const doctorId = new mongoose.Types.ObjectId(doctor._id).toString();
        const nobats = await nobatDoctors.aggregate([
          {
            $match: {
              doctorId: doctorId,
              nobatDay: new Date(selectdate.format("YYYY-MM-DD"))
            }
          },
          {
            $addFields: {
              nobats: {
                $filter: {
                  input: "$nobats",
                  as: "nobat",
                  cond: {
                    $and: [
                      { $ne: ["$$nobat.mobileSick", ""] },
                    ]
                  }
                }
              },
              VisitCount: {
                $size: {
                  $filter: {
                    input: "$nobats",
                    as: "nobat",
                    cond: { $eq: ["$$nobat.Visit", true] }
                  }
                }
              },
              HozorCount: {
                $size: {
                  $filter: {
                    input: "$nobats",
                    as: "nobat",
                    cond: { $and: [{ $eq: ["$$nobat.Hozor", true] }, { $eq: ["$$nobat.Visit", false] }] }
                  }
                }
              }
            }
          },
          {
            $sort: { "nobats.nobatTime": -1 }
          },
          {
            $project: {
              nobatDay: 1,
              NobatInternet: 1,
              nobatType: 1,
              VisitCount: 1,
              HozorCount: 1,
              nobats: 1,
              doctorName: 1,
            }
          }
        ]).exec();
        //* init disabledDays,next config it in Matablayout 
        console.log("***********************************")
        console.log(nobats)
        let HozorCountAfter = 0
        let VisitCountAfter = 0
        let HozorCountMon = 0;
        let VisitCountMon = 0;
        if (nobats.length === 0) {
          console.log("No matching documents found.");
        } else {
          nobats.forEach(doc => {
            console.log(`Doctor: ${doc.doctorName}, Visit Count: ${doc.VisitCount}
                  Hozer Count: ${doc.HozorCount}`);
            if (doc.nobatType == "monday") {
              HozorCountMon += doc.HozorCount;
              VisitCountMon += doc.VisitCount;
            }
            if (doc.nobatType == "afternon") {
              HozorCountAfter += doc.HozorCount;
              VisitCountAfter += doc.VisitCount;
            }
          });
        }
        const disabledDays = [6]
        let NobatsResult = [];
        if (nobats) {
          NobatsResult = nobats;
        }
        // const nobats = await nobatDoctors.find({
        //   doctorId: iddoctor,
        //   nobatDay: selectdate.format("YYYY-MM-DD"),
        //   }, 
        //   { "nobatDay":1,"NobatInternet":1,
        //     "nobats" : {"$filter" : {"input" : "$nobats", "as" : "nobats","cond" :  { "$ne" : [ "$$nobats.mobileSick", "" ]    }}}
        //   },
        //    )

        // .sort([["nobats.nobatTime", "descending"]]); 
        // //* init disabledDays,next config it in Matablayout 
        // const disabledDays=[6] 
        // if (nobats) {
        //   let NobatsResult = [];
        //     NobatsResult=nobats

        return res.render("../views/private/MatabView.ejs", {
          pageTitle: "دکترپیش تو| ثبت نام پزشک",
          layout: "../views/layouts/Matablayout.ejs",
          path: "/dashboard",
          message: "DonDon!",
          error: "",
          infoBack: [], //values of inputs after submit
          errorCaptcha: "",
          errorlogin: "",
          user,
          doctor,
          errorchangePass: "",
          errors: "",
          IsDoctor: true,
          moment,
          NobatsResult,
          pageTitle: "",
          disabledDays,
          UserSelectedDate,
          disableBeforeDate: "",
          HozorCountAfter,
          VisitCountAfter,
          HozorCountMon,
          VisitCountMon,
        });

      } else {
        res
          .status(201)
          .json({ message: "برای روز انتخاب شده هیچ نوبتی وجود ندارد" });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error });
    }


  }
}

const EchoSerachFetch = async (req, res) => {
  //* retrive from submited form "FormSearch"
  const { UserSelectedDate } = req.query
  if (UserSelectedDate != '') {
    try {
      const createDate = moment(UserSelectedDate, 'jYYYY/jM/jD').format('YYYY-MM-DD');
      console.log(createDate)
      const EchosOfSicks = await EchoSicks.find(
        {
          createDate:
          { //*Adding time to last of stringDate  
            $gte: moment(createDate).startOf('day').toISOString(),
            $lte: moment(createDate).endOf('day').toISOString()
          },
          "DoctorId": req.user._id
        },)
        .sort([["createDate", "descending"]]);
      console.log(EchosOfSicks)

      return res.render("../views/private/EchoslistOfday.ejs", {
        pageTitle: "مطب پزشک/قسمت اکو",
        layout: "../views/layouts/EchoLayout.ejs",
        path: "/getEchoListOfday",
        UserSelectedDate,
        message: req.flash("success_register"),
        error: req.flash("error"),
        errorCaptcha: "",
        errorlogin: "",
        user: req.user,
        doctor: req.user,
        errorchangePass: "",
        errors: "",
        IsDoctor: true,
        EchosOfSicks,
        moment,
      });

    } catch (err) {
      console.log(err);
      getError500(req, res);
    }

  }



}


const MatabNobatsFetchWithList = async (req, res) => {
  console.log(req.query)
  //* retrive from submited form "FormSearch"
  let { UserSelectedDate, iddoctor, UserSelectedDateMil } = req.query

  // console.log(UserSelectedDate)k
  if (UserSelectedDate != undefined) {
    if (UserSelectedDate) {
      try {
        const user = req.user == undefined ? [] : req.user;
        const doctor = await User.findById(iddoctor);
        let IsDoctor = true;
        const selectdate = moment(UserSelectedDateMil);
        console.log(selectdate.format("YYYY-MM-DD"))
        console.log(iddoctor)
        //* convert id mongoose to string
        const doctorId = new mongoose.Types.ObjectId(doctor._id).toString();
        const nobats = await nobatDoctors.aggregate([
          {
            $match: {
              doctorId: doctorId,
              nobatDay: new Date(selectdate.format("YYYY-MM-DD"))
            }
          },
          {
            $addFields: {
              nobats: {
                $filter: {
                  input: "$nobats",
                  as: "nobat",
                  cond: {
                    $and: [
                      { $ne: ["$$nobat.mobileSick", ""] },
                      { $eq: ["$$nobat.Visit", false] },
                      { $eq: ["$$nobat.Erja", true] }
                    ]
                  }
                }
              },
              VisitCount: {
                $size: {
                  $filter: {
                    input: "$nobats",
                    as: "nobat",
                    cond: { $eq: ["$$nobat.Visit", true] }
                  }
                }
              },
              HozorCount: {
                $size: {
                  $filter: {
                    input: "$nobats",
                    as: "nobat",
                    cond: { $and: [{ $eq: ["$$nobat.Hozor", true] }, { $eq: ["$$nobat.Visit", false] }] }
                  }
                }
              }
            }
          },
          {
            $sort: { "nobats.nobatTime": -1 }
          },
          {
            $project: {
              nobatDay: 1,
              NobatInternet: 1,
              nobatType: 1,
              VisitCount: 1,
              HozorCount: 1,
              nobats: 1,
              doctorName: 1,
            }
          }
        ]).exec();
        //* init disabledDays,next config it in Matablayout 
        console.log("***********************************")
        console.log(nobats)
        let HozorCountAfter = 0
        let VisitCountAfter = 0
        let HozorCountMon = 0;
        let VisitCountMon = 0;
        if (nobats.length === 0) {
          console.log("No matching documents found.");
        } else {
          nobats.forEach(doc => {
            console.log(`Doctor: ${doc.doctorName}, Visit Count: ${doc.VisitCount}
                  Hozer Count: ${doc.HozorCount}`);
            if (doc.nobatType == "monday") {
              HozorCountMon += doc.HozorCount;
              VisitCountMon += doc.VisitCount;
            }
            if (doc.nobatType == "afternon") {
              HozorCountAfter += doc.HozorCount;
              VisitCountAfter += doc.VisitCount;
            }
          });
        }

        //* init disabledDays,next config it in Matablayout 
        const disabledDays = [6]
        if (nobats) {
          let NobatsResult = [];
          NobatsResult = nobats

          return res.render("../views/private/VisitWithList.ejs", {
            pageTitle: "پزشک (ویزیت از  لیست )",
            layout: "../views/layouts/VisitWithListLayout.ejs",
            path: "/dashboard",
            message: req.flash("success_register"),
            error: req.flash("error"),
            infoBack: [], //values of inputs after submit
            errorCaptcha: "",
            errorlogin: "",
            user,
            doctor,
            errorchangePass: "",
            errors: "",
            IsDoctor,
            moment,
            NobatsResult,
            UserSelectedDate,
            disableBeforeDate: "",
            HozorCountMon,
            VisitCountMon,
            HozorCountAfter,
            VisitCountAfter,
          });
        } else {
          res
            .status(201)
            .json({ message: "برای روز انتخاب شده هیچ نوبتی وجود ندارد" });
        }
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error });
      }


    }
  }

};
const MatabNobatUsersearch = async (req, res) => {
  const { searchInputId, iddoctor } = req.query
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(iddoctor);
  let HozorCountAfter = 0
  let VisitCountAfter = 0
  let HozorCountMon = 0;
  let VisitCountMon = 0;
  try {
    let NobatsResult = await nobatDoctors.find({ $text: { $search: searchInputId }, "doctorId": req.user._id },
      {
        "nobatDay": 1, "NobatInternet": 1,
        "nobats": {
          "$filter": {
            "input": "$nobats", "as": "nobats",
            "cond": {
              "$or": [{ "$eq": ["$$nobats.codemilli", searchInputId] },
              { "$eq": ["$$nobats.mobileSick", searchInputId] },
              { "$eq": ["$$nobats.TrackingCode", searchInputId] },
              { "$eq": ["$$nobats.FullName", searchInputId] }
              ]
            }
          }
        }
      },
    )

      .sort([["nobatDay", "descending"]]);
    const UserSelectedDate = "";
    if (NobatsResult) {
      return res.render("../views/private/MatabView.ejs", {
        pageTitle: "مطب پزشک",
        layout: "../views/layouts/Matablayout.ejs",
        path: "/dashboard",
        message: "DonDon!",
        error: "",
        infoBack: [], //values of inputs after submit
        errorCaptcha: "",
        errorlogin: "",
        user,
        doctor,
        errorchangePass: "",
        errors: "",
        IsDoctor: true,
        moment,
        NobatsResult,
        pageTitle: "",
        UserSelectedDate: "",
        disableBeforeDate: "",
        HozorCountMon,
        VisitCountMon,
        HozorCountAfter,
        VisitCountAfter,
      });

    } else {
      res
        .status(201)
        .json({ message: "اطلاعاتی جهت نمایش پیدا نشد" });
    }

  } catch (err) {
    console.log(err)
  }
}

const UserEchoSearch = async (req, res) => {
  const { searchInputId, iddoctor } = req.query
  const user = req.user == undefined ? [] : req.user;
  const doctor = await User.findById(iddoctor);
  const IsDoctor = true;
  try {
    let SickEchos = await EchoSicks.find({ "sickcodemilli": searchInputId, "DoctorId": req.user._id },)
      .sort([["crateDate", "descending"]]);
    // console.log(SickEchos)

    // let dataPath = path.join(`${rootPrj}/public/uploads/${user.mobileId}/`, `echoprofile${user.codemilli}.json`);
    // let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    // console.log(data.data)
    // let data =JSON.parse(req.user.userEchoData);
    let data = [];
    if (req.user && req.user.userEchoData && Object.keys(req.user.userEchoData).length > 0) {
      //* add hassan
      data = JSON.parse(req.user.userEchoData);
      if (data.data) data=data.data;
      //* add hassan
    } else {
      // getError404(req, res);
      // return
      req.flash('error','کاربر محترم اکوهای پرکاربرد خود را اینجا برای راحتی کار انتخاب نمایید');
      res.redirect(`/dashboard/TotalNormalValues/${req.user._id}` ) 
    }

    // let SickEchos = await EchoSicks.find({ $text: { $search: searchInputId }, "DoctorId": req.user._id }, )
    // .sort([["crateDate", "descending"]]);
    let dataPath = path.join(`${rootPrj}/data/`, '18NormalRange.json');
    let data18 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    let SickInfo = [];
    let SickInfoSave = {};
    const Sick = await User.find({ $text: { $search: searchInputId }, "nezam": "" });
    if (Sick.length > 0) {
      SickInfoSave = {
        sickcodemilli: Sick[0].codemilli,
        fullnamesick: Sick[0].FullName,
        mobilesick: Sick[0].mobileId,
        FinalResult: 'Das ist Finalresult..................',
      };
    }
    if (SickEchos != []) SickInfo = Sick;

    console.log("sickinfosave***********************")
    console.log(SickInfoSave)
    const UserSelectedDate = "";

    let userEchoSelectWithRow=[];
    if (req.user && req.user.userEchoSelectWithRow && Object.keys(req.user.userEchoSelectWithRow).length > 0) 
    {userEchoSelectWithRow = user.userEchoSelectWithRow;} 

    if (SickEchos) {
      return res.render("../views/private/BlankEchoReport.ejs", {
        pageTitle: "مطب پزشک",
        layout: "../views/layouts/EchoLayout.ejs",
        path: "/dashboard",
        data: data, // ارسال داده‌ها
        UserSelectedDate: "",
        message: req.flash("success_register"),
        error: req.flash("error"),
        infoBack: [], //values of inputs after submit
        errorCaptcha: "",
        errorlogin: "",
        user,
        doctor,
        errorchangePass: "",
        errors: "",
        IsDoctor,
        SickEchos,
        SickInfo,
        //* send as text or json
        SickInfoSave: JSON.stringify(SickInfoSave),
        moment,
        data18,
        userEchoSelectWithRow,
      });


    } else {
      res
        .status(201)
        .json({ message: "اطلاعاتی جهت نمایش پیدا نشد" });
    }

  } catch (err) {
    console.log(err)
  }
}

const MatabNobatUsersearchVisitWithList = async (req, res) => {
  const { searchInputId, iddoctor } = req.query
  const user = req.user == undefined ? [] : req.user;
  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  const doctor = await User.findById(iddoctor);
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&")
  console.log(searchInputId)
  try {
    let NobatsResult = await nobatDoctors.find({ $text: { $search: searchInputId }, "doctorId": req.user._id },
      {
        "nobatDay": 1, "NobatInternet": 1,
        "nobats": {
          "$filter": {
            "input": "$nobats", "as": "nobats",
            "cond": {
              "$or": [{ "$eq": ["$$nobats.codemilli", searchInputId] },
              { "$eq": ["$$nobats.mobileSick", searchInputId] },
              { "$eq": ["$$nobats.TrackingCode", searchInputId] },
              { "$eq": ["$$nobats.FullName", searchInputId] }
              ]
            }
          }
        }
      },
    )

      .sort([["nobatDay", "descending"]]);
    const UserSelectedDate = "";
    let HozorCountMon = 0;
    let VisitCountMon = 0;
    let HozorCountAfter = 0;
    let VisitCountAfter = 0;
    if (NobatsResult) {
      return res.render("../views/private/VisitWithList.ejs", {
        pageTitle: "پزشک (ویزیت از  لیست )",
        layout: "../views/layouts/VisitWithListLayout.ejs",
        path: "/dashboard",
        message: req.flash("success_register"),
        error: req.flash("error"),
        infoBack: [], //values of inputs after submit
        errorCaptcha: "",
        errorlogin: "",
        user,
        doctor,
        errorchangePass: "",
        errors: "",
        IsDoctor,
        moment,
        NobatsResult,
        UserSelectedDate,
        disableBeforeDate: "",
        HozorCountMon,
        VisitCountMon,
        HozorCountAfter,
        VisitCountAfter,
      });

    } else {
      res
        .status(201)
        .json({ message: "اطلاعاتی جهت نمایش پیدا نشد" });
    }

  } catch (err) {
    console.log(err)
  }
}

const SaveHandDoctorVisit = async (req, res) => {
  //* receiving file by Ajax , fromData
  try {
    if (req.files) {
      const HandDoctrorImage = req.files.HandDoctrorImage;
      await SchemaHandDoctrorImage.validate(
        { HandDoctrorImage },
        { abortEarly: false }
      );
      //*so,the data is valided now.
      const DoctorCodemilli = req.user.codemilli;//*doctor as user is logined,codemillidoctor=codemiliuser
      const SickCodeMilli = req.body.SickCodeMilli;

      if (!fs.existsSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}`)) {
        const res = fs.mkdirSync(
          `${rootPrj}/public/handdoctor/${DoctorCodemilli}`,
          (event) => {
            console.log(event);
          }
        );
      }

      if (!fs.existsSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`)) {
        const res = fs.mkdirSync(
          `${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`,
          (event) => {
            console.log(event);
          }
        );
      }
      // console.log("*****************************createDirectoryIfNotExists")
      // await createDirectoryIfNotExists(`${rootPrj}/public/handdoctor/${DoctorCodemilli}`);
      // await createDirectoryIfNotExists(`${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`);
      // console.log("*****************************createDirectoryIfNotExists")


      const fileName = `${shortId.generate()}_${HandDoctrorImage.name}`;
      const uploadPath = `${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}/${fileName}`;
      //*compress image by sharp
      await sharp(HandDoctrorImage.data)
        .png({ quality: 100, palette: true })
        .toFile(uploadPath)
        .catch((err) => console.log(err));
      res
        .status(200)
        .json({ message: "سند ذخیره شد ", done: "true" });

    } else {
      res.send("سندی جهت ذخیره ارسال نشده است");
    }
  } catch (error) {
    console.log(error.errors);
    res.status(201).json({ message: error.errors, done: "false" });
  }

}//*end of metthod SaveHandDoctorVisit

const createDirectoryIfNotExists = async (dirPath) => {
  try {
    // Use the recursive option to create nested directories
    await fsnew.mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } catch (error) {
    console.log("****************************")
    console.error(`Error creating directory ${dirPath}:`, error.message);
    console.log("****************************")

    throw error; // Rethrow the error for handling in the main function
  }
};
const SaveEditHandDoctorVisit = async (req, res) => {
  //* receiving file by Ajax , fromData
  try {
    if (req.files) {
      const HandDoctrorImage = req.files.HandDoctrorImage;
      await SchemaHandDoctrorImage.validate(
        { HandDoctrorImage },
        { abortEarly: false }
      );
      //*so,the data is valided now.
      const DoctorCodemilli = req.user.codemilli;//*doctor as user is logined,codemillidoctor=codemiliuser
      const SickCodeMilli = req.body.SickCodeMilli;
      const FilePic = req.body.FilePic;
      if (!fs.existsSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}`)) {
        const res = fs.mkdir(
          `${rootPrj}/public/handdoctor/${DoctorCodemilli}`,
          (event) => {
            console.log(event);
          }
        );
      }


      if (!fs.existsSync(`${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`)) {
        const res = fs.mkdir(
          `${rootPrj}/public/handdoctor/${DoctorCodemilli}/${SickCodeMilli}`,
          (event) => {
            console.log(event);
          }
        );
      }
      console.log(FilePic)
      //*compress image by sharp
      await sharp(HandDoctrorImage.data)
        .png({ quality: 100, palette: true })
        .toFile(`${rootPrj}/public${FilePic}`)
        .catch((err) => console.log(err));
      res
        .status(200)
        .json({ message: "سند ذخیره شد ", done: "true" });
    } else {
      res.send("سندی جهت ذخیره ارسال نشده است");
    }
  } catch (error) {
    console.log(error.errors);
    res.status(201).json({ message: error.errors, done: "false" });
  }

}

const SavePanelByadmin = async (req, res) => {
  let { IdRecord, panelActiveDate, panelStopDate, panelIsActiveted, panelNumber, panelNumberActive } = req.body;
  if (panelIsActiveted == "on") { panelIsActiveted = "true" } else { panelIsActiveted = "false" }
  if (panelNumberActive == "on") { panelNumberActive = "true" } else { panelNumberActive = "false" }
  let selectedInfo = {}
  try {
    if (panelActiveDate != "") {
      panelActiveDate = moment(panelActiveDate, "jYYYY/jMM/jDD")
      selectedInfo["panelActiveDate"] = panelActiveDate
    }

    if (panelStopDate != "") {
      panelStopDate = moment(panelStopDate, "jYYYY/jMM/jDD");
      selectedInfo["panelStopDate"] = panelStopDate
    }
    selectedInfo["panelIsActiveted"] = panelIsActiveted;
    selectedInfo["panelNumberActive"] = panelNumberActive;
    selectedInfo["panelNumber"] = panelNumber;
    console.log(selectedInfo)
    updateUser(IdRecord, selectedInfo);
    // res.status(200).json({ message: "اطلاعات ثبت گردید" });
    res.redirect("/dashboard/AdminUserPanel/")
  } catch (error) {
    console.log(error)
    getError404(req, res);
  }
}

const EndVisit = async (req, res) => {
  const { IdRecord, IdNobat } = req.body
  try {
    const nobatsDay = await nobatDoctors.findOne({ _id: IdRecord });
    if (nobatsDay != null) {
      //* find in array and update
      nobatsDay.nobats.id(IdNobat).Visit = true;
      //* just updated it!
      const updated = await nobatsDay.save();
      return res.redirect(url.format({
        pathname: "/dashboard/MatabNobats/",
        query: {
          "UserSelectedDate": moment(Date()).format("jYYYY/jMM/jDD"),
          "iddoctor": String(req.user._id),//* convert new  monogodb'objectid to string
          "UserSelectedDateMil": moment(Date()).format("YYYY/MM/DD")
        }
      }));

    }
  } catch (error) {
    console.log(error);
    //* 404 reserving code fro error
    return res.status(404);
  }
}
const EndVisitWithList = async (req, res) => {
  const { IdRecord, IdNobat } = req.body
  try {
    const nobatsDay = await nobatDoctors.findOne({ _id: IdRecord });
    if (nobatsDay != null) {
      //* find in array and update
      nobatsDay.nobats.id(IdNobat).Visit = true;
      //* just updated it!
      const updated = await nobatsDay.save();
      return res.redirect(url.format({
        pathname: "/dashboard/MatabNobatsWithList/",
        query: {
          "UserSelectedDate": moment(Date()).format("jYYYY/jMM/jDD"),
          "iddoctor": String(req.user._id),//* convert new  monogodb'objectid to string
          "UserSelectedDateMil": moment(Date()).format("YYYY/MM/DD")
        }
      }));

    }
  } catch (error) {
    console.log(error);
    //* 404 reserving code fro error
    return res.status(404);
  }
}
const SaveStateNobat = async (req, res) => {
  const { IdRecord, IdNobat, Hozor, Erja, Visit, Tozieh, Pardakhti } = req.body
  console.log(IdRecord, IdNobat, Hozor, Visit, Tozieh, Pardakhti, Erja)
  try {
    const nobatsDay = await nobatDoctors.findOne({ _id: IdRecord });
    if (nobatsDay != null) {
      //* find in array and update
      nobatsDay.nobats.id(IdNobat).Hozor = (Hozor == "on" ? true : false)
      nobatsDay.nobats.id(IdNobat).Erja = (Erja == "on" ? true : false)
      nobatsDay.nobats.id(IdNobat).Visit = (Visit == "on" ? true : false)
      nobatsDay.nobats.id(IdNobat).Pardakhti = Pardakhti;
      nobatsDay.nobats.id(IdNobat).Tozieh = Tozieh;
      //* just updated it!
      const updated = await nobatsDay.save();
      return res.redirect(url.format({
        pathname: "/dashboard/MatabNobats/",
        query: {
          "UserSelectedDate": moment(Date()).format("jYYYY/jMM/jDD"),
          "iddoctor": String(req.user._id),//* convert new  monogodb'objectid to string
          "UserSelectedDateMil": moment(Date()).format("YYYY/MM/DD")
        }
      }));

    }
  } catch (error) {
    console.log(error);
    //* 404 reserving code fro error
    return res.status(404);
  }
}

const DeleteEchoById = async (req, res) => {
  console.log("***********DeleteEchoById*")
  const { IdRecord, codemilli } = req.query
  console.log(IdRecord, codemilli)
  try {
    const deletedData = await deleteEchoSick({ _id: IdRecord });
    if (deletedData != null) {
      res.status(200).redirect(`/dashboard/userEchoSerach/?searchInputId=${codemilli}&iddoctor=${req.user._id}`);
    }
  } catch (error) {
    console.log(error);
    //* 404 reserving code fro error
    return res.status(404);
  }
}

const AdminSearchNazarkarbaran = async (req, res) => {
  const { SerachFordoctor } = req.query
  //* fetch doctors data
  const UserList = await NazarKarBaran.find(
    { DoctorFullName: { $regex: SerachFordoctor } },
  );
  const user = req.user == undefined ? [] : req.user;

  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    return res.render("../views/private/AdminNazarat.ejs", {
      pageTitle: "مطب پزشک",
      layout: "../views/layouts/AdminLayout.ejs",
      path: "/getAdminNazarat",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      moment,
      NobatsResult: "",
      UserList,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }


}
const PanelSerach = async (req, res) => {
  const { SerachFordoctor } = req.query
  //* fetch doctors data
  const UserList = await User.find({
    $or: [{ nezam: { $ne: "" }, FullName: { $regex: SerachFordoctor } },
    { nezam: { $ne: "" }, takhasos: { $regex: SerachFordoctor } },
    { nezam: { $ne: "" }, address: { $regex: SerachFordoctor } },
    { nezam: { $ne: "" }, mobileId: { $regex: SerachFordoctor } },
    { nezam: { $ne: "" }, codemilli: { $regex: SerachFordoctor } },
    ]
  });
  const user = req.user == undefined ? [] : req.user;
  const UserSelectedDate = moment(Date.now()).format("jYYYY/jMM/jDD");

  let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
  try {
    return res.render("../views/private/AdminUserPanel.ejs", {
      pageTitle: "مطب پزشک",
      layout: "../views/layouts/AdminLayout.ejs",
      path: "/dashboard",
      message: req.flash("success_register"),
      error: req.flash("error"),
      infoBack: [], //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      user,
      errorchangePass: "",
      errors: "",
      IsDoctor,
      moment,
      NobatsResult: "",
      UserList,
      UserSelectedDate,
      EndVisitWithList,
    });
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }





}
const AdminSaveNazarat = async (req, res) => {
  let { IdRecord, NazarKarbar, AprovNazar } = req.body
  console.log(AprovNazar)
  if (AprovNazar == undefined) { AprovNazar = "false" } else { AprovNazar = "true" }

  UpdateNazar(IdRecord, { NazarKarbar, AprovNazar })
  res.redirect('/dashboard/AdminNazarat/')
}


const getNormalValueSelectUser = async (req, res) => {
  if (req.user) {
    try {
      const{ data,userEchoSelectWithRow} = req.body;
      const { mobileId, codemilli } = req.user;
      // new hassan save defalut echo of user
      updateUserEchoData(mobileId, JSON.stringify(data, null, 2),userEchoSelectWithRow)
      // new hassan 

      //*now remove
      // const filePath = path.join(`${rootPrj}/public/uploads/${mobileId}`, `echoprofile${codemilli}.json`);
      // const createDir = fs.mkdir(`${rootPrj}/public/uploads/${mobileId}`, { recursive: true }
      //   , (err) => {
      //     console.log(err)
      //     console.log(createDir);
      //   });
      // // ذخیره داده‌ها در فایل
      // fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      //   if (err) {
      //     console.error('Error writing file:', err);
      //     return res.status(500).json({ message: 'اشکال در ذخیره سازی داده' });
      //   }

      //   res.status(200).json({ message: 'موارد انتخابی به عنوان موارد آزمایش اکوی  پیش فرض شما  در پروفایل شخصی شما ذخیره گردید' });
      // });
      //*now remove
      res.status(200).json({ message: 'موارد انتخابی به عنوان موارد آزمایش اکوی  پیش فرض شما  در پروفایل شخصی شما ذخیره گردید' });

    } catch (error) {
      console.log(error);
      getError500(req, res);
    }
  } else {
    res.status(201).json({ message: "جهت استفاده از این بخش ابتدا باید از منوی کاربران ثبت نام نمایید " })
  }

}

async function updateUserEchoData(mobileId, newUserEchoData,userEchoSelectWithRow) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { mobileId: mobileId }, // شرط برای پیدا کردن رکورد
      { userEchoData: newUserEchoData , userEchoSelectWithRow},
       // فیلدی که باید به‌روزرسانی شود
      { new: true, runValidators: true } // گزینه‌ها: new برای دریافت رکورد به‌روزرسانی شده و runValidators برای اجرای اعتبارسنجی‌ها
    );
    if (!updatedUser) {
      console.log("کاربر با این شماره موبایل پیدا نشد.");
      return null;
    }

    console.log("کاربر با موفقیت به‌روزرسانی شد:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("خطا در به‌روزرسانی کاربر:", error);
    throw error; // می‌توانید خطا را مدیریت کنید یا به پرتاب کنید
  }
}

async function updateUserEchoConfig(mobileId, newUserEchoConfig) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { mobileId: mobileId }, // شرط برای پیدا کردن رکورد
      { userEchoConfig: newUserEchoConfig }, // فیلدی که باید به‌روزرسانی شود
      { new: true, runValidators: true } // گزینه‌ها: new برای دریافت رکورد به‌روزرسانی شده و runValidators برای اجرای اعتبارسنجی‌ها
    );

    if (!updatedUser) {
      // console.log("کاربر با این شماره موبایل پیدا نشد.");
      return null;
    }

    // console.log("کاربر با موفقیت به‌روزرسانی شد:", updatedUser);
    return updatedUser;
  } catch (error) {
    // console.error("خطا در به‌روزرسانی کاربر:", error);
    throw error; // می‌توانید خطا را مدیریت کنید یا به پرتاب کنید
  }
}


const saveEchoCreatedByCodemilli = async (req, res) => {
  if (req.user) {
    try {
      const { data, sickcodemilli, fullnamesick, mobilesick, FinalResult } = req.body;
      const { _id: DoctorId, FullName: DoctorFullname, mobileId: DoctorMobileId } = req.user;
      //* convert to json
      const echolabData = JSON.stringify(data, null, 2);
      const LabEcho = {
        sickcodemilli, fullnamesick, mobilesick,
        DoctorId, DoctorFullname, DoctorMobileId, FinalResult, echolabData
      }

      //* save in mongodb
      const saveData = await insertEchoSick(LabEcho);
      // console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
      //  let recordID =''
      //  if (saveData) recordID=saveData._id;
      //   res.status(200).json({ message: 'پزشک محترم گزارش اکو ذخیره شد' ,recordID });

      if (saveData) {
        // console.log("savedata*********************************")
        res.redirect(`/dashboard/userEchoSerach/?searchInputId=${sickcodemilli}&iddoctor=${req.user._id}`);
      }

      // const fileName = `${shortId.generate()}_${sickCodemilli}`;
      // const dirPath = path.join(`${rootPrj}/public/labsicks/${codemilli}/${sickCodemilli}`);
      // const filePath = path.join(dirPath, fileName);




      // const createDir = fs.mkdir(dirPath, { recursive: true }
      //   , (err) => {
      //     console.log(err)
      //     console.log(createDir);
      //   });

      //* save result as pdf file.
      // const dataPath = path.join(`${rootPrj}/data/`, 'fullnormalranges.json');
      //let normalranges = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
      // normalranges= JSON.stringify(normalranges, null, 2);
      // createEchoPDFReport(data,normalranges,filePath)

      //* result save as json file
      // fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      //   if (err) {
      //     console.error('Error writing file:', err);
      //     return res.status(500).json({ message: 'اشکال در ذخیره سازی داده' });
      //   }

      //   res.status(200).json({ message: 'پزشک محترم گزارش اکو ذخیره شد' });
      // });
    } catch (error) {
      console.log(error);
      getError500(req, res);
    }
  } else {
    res.status(201).json({ message: "جهت استفاده از این بخش ابتدا باید از منوی کاربران ثبت نام نمایید " })
  }

}
function createEchoPDFReport(data, normalRanges, outputDir) {
  console.log('start creating pdf report....')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, 'Echocardiography_Report.pdf');
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(12).text('Echocardiography Report', { align: 'center' });
  doc.moveDown();

  data.forEach(section => {
    doc.fontSize(12).font('Helvetica-Bold').text(section.title);
    doc.moveDown(0.5);

    (section.categories || []).forEach(category => {
      if (category.category) {
        doc.fontSize(10).font('Helvetica-Bold').text(`Category: ${category.category}`);
        doc.moveDown(0.5);
      }

      (category.parameters || []).forEach(param => {
        const parameterName = param['Parameter'] || 'Unknown Parameter';
        doc.fontSize(10).font('Helvetica-Bold').text(`Parameter: ${parameterName}`);
        doc.fontSize(10).font('Helvetica').text(`User Value: ${param['User Value'] || 'N/A'}`);
        doc.fontSize(10).font('Helvetica').text(`Result: ${param['Result'] || 'N/A'}`);

        const normalParam = normalRanges.find(p => p.parameter === parameterName);
        if (normalParam) {
          const maleRange = normalParam.male?.range || 'N/A';
          const femaleRange = normalParam.female?.range || 'N/A';
          doc.fontSize(10).font('Helvetica').text(`Normal Range (Male): ${maleRange}`);
          doc.fontSize(10).font('Helvetica').text(`Normal Range (Female): ${femaleRange}`);
        }
        doc.moveDown(0.5);
      });
    });

    doc.addPage();
  });

  doc.end();
  console.log(`PDF report saved at: ${filePath}`);
}

function generateReportHtml(data, fullNormalRanges) {
  let html = `
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2, h3 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          .result { font-weight: bold; color: #d9534f; }
      </style>
  </head>
  <body>
      <h1>گزارش پزشکی اکو قلب</h1>
      <h2>نام بیمار: John Doe</h2>
      <h2>نام پزشک: Dr. Smith</h2>
      <h3>تاریخ: ${new Date().toLocaleDateString('fa-IR')}</h3>
  `;

  data.forEach(section => {
    html += `<h3>${section.title}</h3>`;
    section.categories.forEach(category => {
      if (category.category) {
        html += `<h4>${category.category}</h4>`;
      }
      html += '<table><thead><tr><th>پارامتر</th><th>مقدار کاربر</th><th>محدوده نرمال</th><th>نتیجه</th></tr></thead><tbody>';
      category.parameters.forEach(parameter => {
        const normalRange = fullNormalRanges.find(range => range.title === section.title)?.parameters.find(p => p.parameter === parameter.Parameter);
        let normalValue = '';
        if (normalRange) {
          normalValue = `مردان: ${normalRange.male.range} | زنان: ${normalRange.female.range}`;
        }
        let result = 'نرمال';
        if (parameter["User Value"] < normalRange.male.range.split('–')[0] || parameter["User Value"] > normalRange.male.range.split('–')[1]) {
          result = 'غیر نرمال';
        }
        html += `<tr><td>${parameter.Parameter}</td><td>${parameter["User Value"]}</td><td>${normalValue}</td><td class="result">${result}</td></tr>`;
      });
      html += '</tbody></table>';
    });
  });

  html += `
      <h3>نتیجه نهایی</h3>
      <p>با توجه به داده‌های ارائه شده و مقایسه با محدوده‌های نرمال، برخی از پارامترها خارج از محدوده نرمال قرار دارند که نیاز به بررسی دقیق‌تر و مشاوره پزشکی دارد. پیشنهاد می‌شود که بیمار تحت نظارت و بررسی‌های بیشتر قرار گیرد.</p>
  </body>
  </html>
  `;

  return html;
}


const generateReportEchoBycodemilli = async (req, res) => {
  const { idlab } = req.body;
  try {
    const DataLab = await EchoSicks.findById(idlab);
    if (DataLab) {
      // generateAIreport(DataLab,res);
      genEchoRep([DataLab], req, res);
    } else {
      console.log("error darim....")
      res.status(203).json({ message: "اطلاعات اکو پیدا نشد" });
    }
  } catch (error) {
    console.log(error)
    console.log("error logic....")
    //  res.status(202).json({message:"خطای ناشناخته سمت سرور رخ داده است"})
    res.status(202).json({ message: [error] })
  }

  return

  const dataPath = path.join(`${rootPrj}/data/`, 'fullnormalranges.json');
  const fullNormalRanges = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  const reportHtml = generateReportHtml(JSON.parse(DataLab.echolabData), fullNormalRanges);

  pdf.create(reportHtml).toBuffer((err, buffer) => {
    if (err) return res.status(500).send('Error generating PDF');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  });
}
const generateOpenAiReport = async (req, res) => {
  const { dataEcho, finalResult, Gender } = req.body;
  const jsonDataEcho = JSON.stringify(dataEcho);
  console.log("*********************************************")
  console.log("********************")
  // بررسی داده‌های ورودی
  if (!jsonDataEcho || !finalResult) {
    return res.status(400).json({ error: 'Both dataEcho and finalResult are required.' });
  }

  try {
    //* sending request to OpenAi....
    const baseURL = "https://api.avalapis.ir/v1";

    const openai = new OpenAI({
      // apiKey: `aa-Exsz4qyYtGHpePcYrXdWdbFLqNqW29qMmJkiLizTq42k1buv`, // کلید API خود را اینجا قرار دهید,
      apiKey: process.env.openAIapiKey, // کلید API خود را اینجا قرار دهید,
      baseURL: baseURL
    });

    const question = [`Please analyze the following data: ${jsonDataEcho}
                      and provide a final medical report based on this information.
                      The report should be well-organized and neatly formatted,
                      resembling an echocardiography report from hospitals and 
                      cardiac care centers. Importantly, do not include the names of 
                      the doctor or patient, or the date of the report.
                      The patient’s gender is ${Gender}.
                      Additionally, ensure that the standards of echocardiography 
                      reporting in the United States are taken into account: ${finalResult}`,

    `Please analyze the following data: ${jsonDataEcho} and provide a
                      final and highly specialized medical report based on this information.
                       The report must fully adhere to the standards set by the U.S. Department
                       of Health and Human Services and the American Society of Echocardiography.
                       Avoid using general recommendations or common phrases.
                       The patient’s gender is ${Gender}.
                       The final report should not include the input data itself; 
                       it should solely contain the report and the final opinion. 
                       Additionally, do not include the name of the physician or the name 
                       of the facility at the end. Only the final opinion is important.`,

    `Please analyze the following data: ${jsonDataEcho} and provide a 
                       final, highly specialized medical report based on this information. 
                       The report must fully adhere to the standards set by the U.S. Department
                       of Health and Human Services and the American Society of Echocardiography.
                       The patient’s gender is ${Gender}.
                       Avoid using general recommendations or common phrases. The final report
                       should not include the input data itself; it should solely contain the
                       report and the final opinion. Additionally, do not include the name of 
                       the physician or the name of the facility at the end. Only the final 
                       opinion is important. Please ensure that the output is presented in a 
                       well-formatted and visually appealing HTML format.`,

    ]

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: question[1] }],
      model: "gpt-3.5-turbo",
    });
    // const response = await axios.post('https://api.avalapis.ir/v1', {
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //         { role: 'user', content: `Please analyze the following data: ${jsonDataEcho} and provide a medical report based on this: ${finalResult}` }
    //     ]
    // }, {
    //     headers: {
    //         'Authorization': `aa-Exsz4qyYtGHpePcYrXdWdbFLqNqW29qMmJkiLizTq42k1buv`, // کلید API خود را اینجا قرار دهید
    //         'Content-Type': 'application/json'
    //     }
    // });
    console.log(response)

    const report = response.choices[0].message.content; // استخراج گزارش
    console.log(report)
    res.json({ report }); // ارسال گزارش به کلاینت
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }

}


const generateAIreport = (data, res) => {
  const fonts = {
    Roboto: {
      normal: path.join(`${rootPrj}/public/fonts`, 'Roboto-Regular.ttf'),
      bold: path.join(`${rootPrj}/public/fonts`, 'Roboto-Bold.ttf'),
      italics: path.join(`${rootPrj}/public/fonts`, 'Roboto-BlackItalic.ttf'),
      bolditalics: path.join(`${rootPrj}/public/fonts`, 'Roboto-BoldItalic.ttf')
    }
  };

  const printer = new PdfPrinter(fonts);

  const tableBody = [
    [{ text: 'Parameter', style: 'tableHeader' }, { text: 'Value', style: 'tableHeader' }]
  ];

  let echolabData;
  try {
    echolabData = JSON.parse(data.echolabData);
  } catch (error) {
    echolabData = [];
  }

  echolabData.forEach(report => {
    report.categories.forEach(category => {
      category.parameters.forEach(param => {
        const record = [];
        for (const [key, value] of Object.entries(param)) {
          record.push([
            { text: key, style: 'tableCell' },
            { text: value || 'N/A', style: 'tableCell' }
          ]);
        }
        tableBody.push(...record);
        tableBody.push([{ text: '', colSpan: 2, border: [false, false, false, false] }]);
      });
    });
  });

  const docDefinition = {
    content: [
      { text: 'Echocardiogram Report', style: 'header' },
      { text: `Patient ID: ${data.sickcodemilli || 'N/A'}`, style: 'subheader' },
      { text: `Patient Name: ${data.fullnamesick || 'N/A'}`, style: 'subheader' },
      { text: `Doctor Name: ${data.DoctorFullname || 'N/A'}`, style: 'subheader' },
      { text: 'Echocardiogram Details', style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: tableBody
        },
        layout: {
          fillColor: (rowIndex) => {
            return rowIndex % 2 === 0 ? '#f3f3f3' : null;
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#aaa',
          vLineColor: () => '#aaa'
        },
        dontBreakRows: true
      },
      { text: 'Final Result:', style: 'subheader' },
      { text: data.FinalResult || 'No final result provided.', margin: [0, 0, 0, 20] }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black'
      },
      tableCell: {
        margin: [0, 5, 0, 5],
        fontSize: 10
      }
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  res.setHeader('Content-disposition', 'attachment; filename=echocardiogram_report.pdf');
  res.setHeader('Content-type', 'application/pdf');
  pdfDoc.pipe(res);
  pdfDoc.end();
};

// تابعی برای تبدیل اعداد به فارسی
const toPersianNumbers = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
};


async function genEchoRep(data, req, res) {
  let bodyFont,bodyFontSize, reportTitle, reportFooter, finalFont, finalFontSize;

  if (req.user.userEchoConfig && req.user.userEchoConfig != null) {
    const config = JSON.parse(req.user.userEchoConfig);
    config.bodyFont!==""? bodyFont = config.bodyFont:bodyFont="BYekan";
    config.bodyFontSize!==""? bodyFontSize = config.bodyFontSize:bodyFontSize=10;
    config.reportTitle!=="" ? reportTitle = config.reportTitle: reportTitle = "Echo Cardiography Report";
    config.reportFooter !=="" ? reportFooter = config.reportFooter:reportFooter="Dr................";
    config.finalFont!==""?finalFont = config.finalFont:finalFont="BYekan";
    config.finalFontSize!==""?finalFontSize = config.finalFontSize:finalFontSize=10;
  } else {
    bodyFont = "BYekan";
    bodyFontSize = 10;
    reportTitle = "Echo Cardiography Report";
    reportFooter = "DR.............................";
    finalFont = "BYekan";
    finalFontSize =10;
  }
  try {
    if (!data || !Array.isArray(data) || !data[0]) {
      console.error("Invalid data.", data);
      res.status(500).send("Invalid data provided.");
      return;
    }

    const data0 = data[0];
    const fullnamesick = data0.fullnamesick || "Unknown Patient";
    const sickcodemilli = data0.sickcodemilli || "Unknown Doctor";
    const DoctorFullname = data0.DoctorFullname || "Unknown Doctor";
    const EchoDate = moment(data0.createDate).format('jYYYY/jMM/jDD');
    const echolabDataString = data0.echolabData;

    const address = req.user.address;
    const tellphone = req.user.tellphone;
    const mondayWork = req.user.mondayWork ? `صبها:${req.user.mondayWork}` : "";
    const afternonWork = req.user.afternonWork ? `عصرها:${req.user.afternonWork}` : "";

    if (!echolabDataString) {
      console.error("Missing echolabData.", data0);
      res.status(500).send("Missing echolabData.");
      return;
    }

    const echolabData = JSON.parse(echolabDataString);
    const finalResult = JSON.parse(data0.FinalResult).FinalResult || "No final result provided.";

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const fontPath = path.join(__dirname, '../public/fonts/Satisfy-Regular.ttf');
    const fontData = fs.readFileSync(fontPath);
    const base64FontSatisfy = fontData.toString('base64');

    const fontPathBYekanwebfont = path.join(__dirname, '../public/fonts/BYekan-webfont.ttf');
    const fontDataBYekan = fs.readFileSync(fontPathBYekanwebfont);
    const base64FontBYekan = fontDataBYekan.toString('base64');

    const fontPathparastoo = path.join(__dirname, '../public/fonts/Parastoo.ttf');
    const fontDataparasto = fs.readFileSync(fontPathparastoo);
    const base64Fontparastoo = fontDataparasto.toString('base64');

    const fontPathTomatoes = path.join(__dirname, '../public/fonts/Tomatoes-O8L8.ttf');
    const fontDataTomatoes = fs.readFileSync(fontPathTomatoes);
    const base64FontTomatoes = fontDataTomatoes.toString('base64');

    const fontPathReenieBeanie = path.join(__dirname, '../public/fonts/ReenieBeanieRegular.ttf');
    const fontDataReenieBeanie = fs.readFileSync(fontPathReenieBeanie);
    const base64FontReenieBeanie = fontDataReenieBeanie.toString('base64');

    const fontPathRoboto = path.join(__dirname, '../public/fonts/Roboto-Bold.ttf');
    const fontDataroboto = fs.readFileSync(fontPathRoboto);
    const base64Fontroboto = fontDataroboto.toString('base64');
   
    let selectedfontresult = "";
    finalFont==""? selectedfontresult = "Satisfy" : selectedfontresult=finalFont;
    
    const htmlContent = `
    <html>
    <head>
        <title>Echocardiographic Report</title>
        <style>
            @font-face {
                font-family: 'Satisfy';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontSatisfy}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'Tomatoes-O8L8';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontTomatoes}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'ReenieBeanie';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontReenieBeanie}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'parastoo';
                src: url('data:font/truetype;charset=utf-8;base64,${base64Fontparastoo}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'Roboto';
                src: url('data:font/truetype;charset=utf-8;base64,${base64Fontroboto}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'BYekan';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontBYekan}');
                font-weight: normal;
                font-style: normal;
            }

            body {
                font-family: '${bodyFont}', sans-serif;
                margin: 0;
                padding: 0;
            }

            h1 {
                text-align: center;
            }

            .title {
                font-size: 11px;
                font-weight: bold;
                margin: 10px 0;
                font-style: normal;
            }

            .reportTitle {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin: 10px 0;
                font-style: normal;
                border-bottom: 2px solid black;
            }

            .reportDoctorTitle {
                font-size: 20px;
                font-weight: bold;
                margin: 0;
                font-style: normal;
                font-family: 'BYekan';
            }
            .reportDoctorTakhasos {
                font-size: 12px;
                font-weight: bold;
                margin: 0;
                font-style: normal;
                font-family: 'BYekan';
            }

            .category {
                font-size: 10px;
                font-weight: bold;
                margin: 5px 0;
            }

            .tableHeader {
                font-weight: bold;
                text-align: center;
                font-size:${bodyFontSize}px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
                font-size:${bodyFontSize}px;
            }
            th, td { border: 1px solid #ddd; padding: 8px;font-size:${bodyFontSize}px; }
            th { background-color: #f2f2f2; }    

            .hidentable th, .hidentable td {
                border: none;
                padding: 8px;
                font-size: 9px;
                vertical-align: top;
            }
            .hidentable tr {
                border-bottom: 2px solid #000;
            }    

            .finalResultContainer {
                border: 2px solid #4CAF50;
                border-radius: 10px;
                padding: 6px;
                margin-top: 20px;
                background-color: #f9f9f9;
                page-break-inside: avoid;
            }

            .persian-font {
                font-family: 'BYekan';
            }

            .finalResult {
                font-family: ${selectedfontresult};
                font-size:${finalFontSize}px;
                font-weight: normal;
                color: #333;
            }

            .report-container {
                margin-top: 10px;
            }
          .details-cell {
            white-space: pre-wrap; /* این باعث می‌شود که متن به درستی در خطوط جدید نمایش داده شود */
          }    
        </style>
    </head>
    <body>
        <pre class="reportTitle">${reportTitle}</pre>
        <table class="report-container hidentable">
            <tr>
                <td class="patient-info" style="text-align:center;padding:0;margin:0; width: 50%;">
                    <p class="title persian-font">نام بیمار: ${translateName(fullnamesick)}</p>
                    <p class="title persian-font">کد ملی: ${toPersianNumbers(sickcodemilli)}</p>
                    <p class="title persian-font">تاریخ: ${toPersianNumbers(EchoDate)}</p>
                </td>
                <td class="doctor-info" style="text-align: center; width: 50%;">
                    <pre class="reportDoctorTitle">دکتر ${req.user.FullName}</pre>
                    <pre class="reportDoctorTakhasos">${req.user.takhasos}</pre>
                </td>
            </tr>
        </table>
        ${echolabData.map(report => `
            <h2 class="title">${report.title}</h2>
            ${report.categories.map(category => `
                ${category.category ? `<div class="category">${category.category}</div>` : ''}
                <table>
                    <thead>
                        <tr>${Object.keys(category.parameters[0]).filter(header => header !== "Result").map(header => `<th class="tableHeader">${header}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${category.parameters.map(parameter => `
                            <tr>${Object.keys(parameter).map(key => `<td class="details-cell">${parameter[key]}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
            `).join('')}
        `).join('')}
        <div style="margin:0;"  class="finalResultContainer">
        <div><h5 style="margin:0;;padding:0;">Result And Comment :</h5></div>
            <div class="finalResult">${finalResult}</div>
            <div class=" container text-center">${reportFooter}</div>
        </div>
    </body>
    </html>
    `;

    const persianMondayWork = toPersianNumbers(mondayWork);
    const persianAfternonWork = toPersianNumbers(afternonWork);
    const persiantellphone = toPersianNumbers(tellphone);
    const persianaddress = toPersianNumbers(address);

    const options = {
      format: 'A4',
      border: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      footer: {
        height: "10mm",
        contents: {
          default:
            `<div class="persian-font" style="border: 1px solid black;border-radius: 5px; padding: 5px; text-align: right; padding:0;font-size:10px; direction: rtl;">
                ${persianaddress} ${persianMondayWork} ${persianAfternonWork} - تلفن: ${persiantellphone}
            </div>`
        }
      }
    };

    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        console.error("Error creating PDF:", err);
        res.status(500).send("Error creating PDF");
        return;
      }
      res.setHeader('Content-Disposition', 'attachment; filename=echocardiogram_report.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    });

  } catch (error) {
    console.error("Error generating report:", error);
    req.flash("errormsg","اشکال در داده های اکو");
    res.status(500).send("Error generating report");
  }
}
// تابع تبدیل HTML به متن ساده
function convertHtmlToText(html) {
  // استفاده از DOMParser برای تبدیل HTML به متن ساده
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.innerText || tempDiv.textContent;
}

// Utility function to translate Persian names to English
function translateName(persianName) {
  return persianName;
}
//* search in date,create an expretion  for searching date 


const saveEchoConfig = async (req, res) => {
  const { bodyFont,bodyFontSize, reportTitle,reportFooter,finalFont,finalFontSize } = req.body;
  console.log(bodyFont,bodyFontSize, reportTitle,reportFooter,finalFont,finalFontSize)
  const mobileId = req.user.mobileId;

  const userEchoConfig = JSON.stringify({ bodyFont,bodyFontSize,reportTitle,reportFooter,finalFont,finalFontSize }, null, 2);
  try {
    const echoConfig = await updateUserEchoConfig(mobileId, userEchoConfig);
    console.log(echoConfig)
    res.status(200).json({ message: "تنطیمات گزارش اکو ثبت شد" })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export {
  getDashboard,
  getRegisterDoctor,
  getNobatDoctor,
  getCreateNobat,
  getMatabView,
  getPreRegister,
  getSearchForDoctor,
  getSearchForSickUser,
  getAdminUserPanel,
  getNobatDoctorHozori,
  getDoctorProfile,
  getVisitWithLisit,
  getLightPenVisit,
  getAdminNazarat,
  getLightPenVisitWithList,
  getTotalNormalValues,
  getBlankEchoConfig,
  getِcreateechoreport,
  getHelp,
  getContackt,
  userDistruct,
  createNobat,
  uploadImageMadarek,
  selectedPlan,
  FetchNobat,
  ReservNobat,
  ReservNobatHozri,
  SignUpSick,
  SignUpSickHozri,
  SabtNazarKarbar,
  RemoveNobat,
  MatabNobatsFetch,
  MatabNobatUsersearch,
  MatabNobatUsersearchVisitWithList,
  SaveHandDoctorVisit,
  SaveEditHandDoctorVisit,
  SavePanelByadmin,
  EndVisit,
  EndVisitWithList,
  SaveStateNobat,
  AdminSaveNazarat,
  AdminSearchNazarkarbaran,
  PanelSerach,
  SignUpEditSick,
  MatabNobatsFetchWithList,
  getNormalValueSelectUser,
  saveEchoCreatedByCodemilli,
  generateReportEchoBycodemilli,
  UserEchoSearch,
  DeleteEchoById,
  generateOpenAiReport,
  EchoSerachFetch,
  saveEchoConfig,
}
