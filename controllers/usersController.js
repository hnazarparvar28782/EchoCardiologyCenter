import jwt from "jsonwebtoken";
import passport from "passport";
import captchapng from "captchapng";
import Yup from "yup";
import bcrypt from "bcryptjs";
import shortid from "shortid";
import fs from "fs";
import sharp from "sharp";
import moment from "moment-jalaali";

import { User, updateUser } from "../model/doctorsInfo.js";
import  {userDistruct}  from "./adminController.js";
import { getError500 } from "./errorController.js";
import { rootPrj } from "../utils/path.js";
import { schemaUpload } from "../model/secure/postvalidation.js";
import { nobatDoctors } from "../model/nobatDoctors.js";

let CAPTCHA_NUM;
const userControllerLogin = (req, res) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  try {
  res.render("login", {
    pageTitle: "ورود به بخش مدیریت",
    path: "/login",
    message: req.flash("success_register"),
    error: req.flash("error"),
  }); //filling by passport.js
} catch (error) {
  console.log(error);
  getError500(req, res);
}

};
const userControllerLoginPost = async (req, res, next) => {
  try {
  const errorArr = [];
  const { mobileId, PassWord, captcha } = req.body;

  if (parseInt(captcha) === CAPTCHA_NUM) {
    passport.authenticate("local", {
       failureRedirect: "/dashboard",
       failureFlash: true,
     })(req, res, next);
  } else {
    req.flash("errorCaptcha", "کد امنیتی صحیح نمی باشد");
    return res.redirect("/dashboard");
    // return res.render("../views/include/loginModal.ejs", {
    //   path: "/dashboard/modal",
    //   errorlogin:"کد امنیتی صحیح نمی باشد",
    //   layout:"",
    // })
  }
} catch (error) {
  console.log(error);
  getError500(req, res);
}
};
const userControllerrememberMe = async(req, res) => {
  if (req.body.remember) {
    console.log("remberar shodam!**********************");
    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 day 24
  } else {
    req.session.cookie.expire = null;
  }
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
  } = req.user;
  const user = {
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
  };
    //* fetch doctors data
  const activeDoctors=await User.find({panelIsActiveted:true});
  let IsDoctor= false
  if (user.nezam!=undefined) {
    if (user.nezam!="") {
            IsDoctor =true;
    } 
  }
  try{
   return res.render("../views/doctorCards.ejs", {
    pageTitle: "دکترپیش تو|صفحه اصلی",
    layout: "../views/layouts/dashboardlayout.ejs",
    path: "/logining",
    errorlogin: [],
    errorCaptcha: "",
    user,
    activeDoctors,
    IsDoctor,
    panelIsActiveted,
  });
} catch (error) {
  console.log(error);
  getError500(req, res);
}
};
const userControllerGetRegister = (req, res) => {
  try {
  res.render("register", {
    pageTitle: "ثبت نام کاربر جدید",
    path: "/register",
  });
} catch (error) {
  console.log(error);
  getError500(req, res);
}
};

const userControllerLogout = (req, res, next) => {
  try {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session = null;
    //* for no back action by user
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    return res.redirect("/dashboard");
  });
} catch (error) {
  console.log(error);
  getError500(req, res);
}
};

const userControllerCreateUser = async (req, res) => {
  const {
    FullName,
    PassWord,
    ConfirmPassword,
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
  } = req.body;

  const infoBack = { FullName, PassWord, ConfirmPassword, mobileId, takhasos, codemilli, nezam, mondayWork, afternonWork, Email, address, tellphone, workExperience, acceptPolicy, doctorPicture, doctorDocument, panelSelected, panelActiveDate, panelStopDate };

  try {
    // Validate user input
    await User.userValidation(req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ mobileId });
    if (existingUser) {
      return renderError(res, infoBack, "کاربری با شماره موبایل ذکر شده قبلا ثبت شده است");
    }

    // Create new user
    await User.create({
      FullName,
      PassWord,
      ConfirmPassword,
      mobileId,
      takhasos,
      codemilli,
      nezam,
      mondayWork,
      afternonWork,
      Email,
      address,
      tellphone,
      workExperience: "",
      acceptPolicy: false,
      doctorPicture: "",
      doctorDocument: "",
      panelSelected: "",
      panelActiveDate: "",
      panelStopDate: "",
      varizMab: "",
      transactMab: "",
      panelIsActiveted: "false",
    });

    // Flash messaging for successful registration
    req.flash("success_register", 
      "مشخصات فردی پزشک با موفقیت ثبت گردید. لطفا حتما برای تکمیل و فعال شدن صفحه مخصوص پزشک و همچنین برای ویرایش اطلاعات از طریق منوی ورود وارد سامانه شوید. (( باتشکر مدیریت سایت ))");
    return res.redirect("/dashboard/preregister");

  } catch (error) {
    handleError(res,error, infoBack);
  }
};

const renderError = (res, infoBack, message) => {
  const errors = [{ message }];
  return res.render("../views/private/preRejister.ejs", {
    pageTitle: "ثبت نام کاربر",
    path: "/preRegister",
    layout: "../views/layouts/dashboardlayout.ejs",
    errors,
    message: "",
    infoBack,
    IsDoctor: false,
    user: "",
    errorchangePass: "",
    errorCaptcha: "",
    errorlogin: "",
  });
};

const handleError = (res, error, infoBack) => {
  const errors = [];
  if (error.inner) {
    error.inner.forEach(err => {
      errors.push({ name: err.path, message: err.message });
    });
  } else {
    console.error("Unexpected error:", error);
    errors.push({ message: "خطای غیرمنتظره رخ داده است." });
  }

  return res.render("../views/private/preRejister.ejs", {
    pageTitle: "ثبت نام کاربر",
    path: "/preRegister",
    layout: "../views/layouts/dashboardlayout.ejs",
    errors,
    message: "",
    infoBack,
    user: infoBack,
    errorCaptcha: "",
    errorlogin: "",
    errorchangePass: "",
    IsDoctor: false,
  });
};
const postworkExperience = (req, res) => {
  const { workExperience } = req.body;
  const infoBack = { workExperience };

  try {
    if (workExperience.length < 11) {
      console.log("dakhel sodam**************************");
      const user = userDistruct(req);
      return res.render("../views/private/registerDoctors.ejs", {
        pageTitle: "دکترپیش تو| ثبت نام پزشک",
        layout: "../views/layouts/dashboardlayout.ejs",
        path: "/editworkExperience",
        message: "",
        errors: "",
        infoBack, //values of inputs after submit
        errorCaptcha: "",
        errorlogin: "",
        errorchangePass: "",
        errorEditingInfo: "لطفا اطلاعات سابقه کاری را به دقت  ثبت نمایید",
        user,
      });
    }

    //* then ifomation is corract
    updateUser(req.params.id, infoBack);
    req.flash("sucsessMsg", "خلاصه سابقه کاری ثبت گردید");
    return res.redirect("/dashboard/registerDoctor");
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};
const postAcceptLaw = (req, res) => {
  let { acceptPolicy } = req.body;

  try {
    if (!acceptPolicy) {
      const user = userDistruct(req);
      return res.render("../views/private/registerDoctors.ejs", {
        pageTitle: "دکترپیش تو| ثبت نام پزشک",
        layout: "../views/layouts/dashboardlayout.ejs",
        path: "/AcceptLow",
        message: "",
        errors: "",
        infoBack: "", //values of inputs after submit
        errorCaptcha: "",
        errorlogin: "",
        errorchangePass: "",
        errorAcceptLow: "پذیرش قوانین انجام نشده است!",
        user,
      });
    }

    //* then ifomation is corract
    //const infoBack = { acceptPolicy };
    updateUser(req.params.id, { acceptPolicy: true });
    req.flash("sucsessMsg", "پذیرش قوانین سایت  ثبت گردید");
    return res.redirect("/dashboard/registerDoctor");
  } catch (error) {
    console.log(error);
    getError500(req, res);
  }
};

const postEditDoctorInfo = async (req, res) => {
  const {
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
  } = req.body;

  const infoBack = {
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
  };
  const schema = Yup.object().shape({
    FullName: Yup.string()
      .required("نام و نام خانوادگی الزامی می باشد")
      .min(4, "نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد")
      .max(255, "نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد"),
    mobileId: Yup.string()
      .transform(value => value.trim()) // حذف فاصله‌های اضافی
      .required("شماره موبایل الزامی می باشد")
      .min(11, "شماره موبایل وارد شده معتبر نمی باشد") 
      .matches(/^\d+$/, "شماره موبایل باید فقط شامل اعداد باشد"), // بررسی عددی بودن
    takhasos: Yup.string()
      .required("تخصص ثبت نشده است")
      .min(4, "اطلاعات تخصص به درستی ثبت  نشده است"),
    codemilli: Yup.string() 
      .transform(value => value.trim()) // حذف فاصله‌های اضافی
      .required("کد ملی الزامی می باشد")
      .matches(/^\d+$/, "کد ملی وارد شده اشتباه است") // بررسی عددی بودن     
  });
  try {
    await schema.validate(req.body, { abortEarly: false });
    //* then ifomation is corract
    updateUser(req.params.id, infoBack);
    req.flash("sucsessMsg", "مشخصات فردی پزشک ویرایش شد");
    return res.redirect("/dashboard/registerDoctor");
  } catch (error) {
    console.log("**************");
    console.log("Eror in postEditDoctorInfo function usersController");
    console.log(error);
    //**************** */
    const errors = [];
    error.inner.forEach((err) => {
      errors.push({
        name: err.path,
        message: err.message,
      });
    });
    //*user info from password.js module.old info befor editing
    const user = userDistruct(req);
    return res.render("../views/private/registerDoctors.ejs", {
      pageTitle: "ثبت نام کاربر",
      path: "/registerDoctors",
      layout: "../views/layouts/dashboardlayout.ejs",
      errors,
      message: "",
      infoBack,
      user,
      errorCaptcha: "",
      errorlogin: "",
      errorchangePass:"",
      IsDoctor :true,
    });
  }
  //end error cactch
};

const getCaptcha = (req, res) => {
  CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
  const p = new captchapng(80, 30, CAPTCHA_NUM);
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);

  const img = p.getBase64();
  const imgBase64 = Buffer.from(img, "base64");

  res.send(imgBase64);
};

const getMynobat = async(req,res)=>{
 //* fetch doctors data
 const Mynobats = await nobatDoctors.find( {"nobats.mobileSick":req.user.mobileId},
 { "doctorName" : 1,"nobatDay":1,
   "nobats":{"$filter" : {"input" : "$nobats", "as" : "nobats", "cond" :{ "$eq" : [ "$$nobats.mobileSick",req.user.mobileId ]} }} })
  .sort({nobatDay:-1})
 const user = userDistruct(req);

 let IsDoctor= false
 if (user.nezam!=undefined) {
   if (user.nezam!="") {
     IsDoctor =true;
    }
  }
    try {
     res.render("../views/private/MyNobats.ejs", {
     errorlogin:"",
     errorCaptcha: "",
     user,
     pageTitle: "دکترپیش تو|صفحه اصلی",
     layout: "../views/layouts/dashboardlayout.ejs",
     path: "/dashboard",
     errorchangePass: "",
     errors: "",
     Mynobats,
     IsDoctor,
     moment,
   });
 } catch (error) {
   console.log(error);
   getError500(req, res);
 }

}

const userControllerGetResetPassword = async (req, res) => {
  const token = req.params.token;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
  } catch (err) {
    console.log(err);
    if (!decodedToken) return res.redirect("/404");
  }

  res.render("resetPassword", {
    pageTitle: "فراموشی رمز عبور",
    path: "/login",
    message: req.flash("success_register"),
    error: req.flash("error"),
    userId: decodedToken.userId,
  });
};

const userControllerResetPassword = async (req, res) => {
  const { PasswordEdit, ConfirmPasswordEdit, OldPassEdit } = req.body;
  const schema = Yup.object().shape({
    PasswordEdit: Yup.string()
      .min(4, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
      .max(255, "کلمه عبور نباید بیشتر از 255 کاراکتر باشد")
      .required("کلمه عبور الزامی می باشد"),
    ConfirmPasswordEdit: Yup.string()
      .required("تکرار کلمه عبور الزامی می باشد")
      .oneOf([Yup.ref("PasswordEdit"), null], "کلمه های عبور یکسان نیستند"),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
    //* then ifomation is corract
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.redirect("/404");
    }

    bcrypt.compare(OldPassEdit, user.PassWord, async function (err, result) {
      if (err) next(err);
      if (result) {
        try {
          user.PassWord = PasswordEdit;
          await user.save();
          req.flash("sucsessMsg", "تغییر رمز انجام شد");
          return res.redirect("/dashboard/registerDoctor");
        } catch (error) {
          console.log(error);
          return res.redirect("/404");
        }
      } else {
        //*old password incorrect
        req.flash("errorchangePass", "رمز قدیم اشتباه می باشد");
        req.flash("error", "رمز قدیم وارد شده اشتباه است");
        return res.redirect("/dashboard/registerDoctor");
      }
    });
  } catch (error) {
    console.log(error);
    const errors = [];
    error.inner.forEach((err) => {
      errors.push({
        name: err.path,
        message: err.message,
      });
    });
    const user = userDistruct(req);
    req.flash("errorchangePass", "خطای فیلدهای وارد شده");
    return res.render("../views/private/registerDoctors.ejs", {
      pageTitle: "دکترپیش تو| ثبت نام پزشک",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/dashboard",
      message: "",
      errors: errors,
      infoBack: req.user, //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      errorchangePass: req.flash("errorchangePass"),
      user,
      IsDoctor:true, 
    });
  }
  // if (password !== confirmPassword) {
  //   req.flash("errorchangePass", "کلمه های عبور یکسان نیستند");
  //   return res.redirect("/dashboard/registerDoctor");
  // }
};

const userControllerGetForgetPassword = (req, res) => {
  try {
  res.render("forgetPassword", {
    pageTitle: "فراموشی رمز عبور ",
    path: "/login",
    error: req.flash("error"),
    message: req.flash("success_msg"),
  });
} catch (error) {
  console.log(error);
  getError500(req, res);
}
};

const userControllerForgetPassword = async (req, res) => {
  try {
  const { email } = req.body;
  const person = await User.findOne({ Email: email });
  if (!person) {
    req.flash("error", "کاربری با این مشخصات  موجود نمی باشد");
    res.render("forgetPassword", {
      pageTitle: "فراموشی رمز عبور ",
      path: "/login",
      error: req.flash("error"),
      message: req.flash("success_msg"),
    });
  }
  const token = jwt.sign({ userId: person._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const resetLink = `http://localhost:3000/users/rest-password/${token}`;

  const errorEmail = sendEmail(
    person.Email,
    person.FullName,
    "فراموشی رمز عبور",
    `<a href="${resetLink}">لینک تغییر رمز عبور</a>
      `
  );

  req.flash("success_msg", "لینک تغییر رمز به آدرس  ایمیل  شما ارسال شد");

  res.render("forgetPassword", {
    pageTitle: "فراموشی رمز عبور ",
    path: "/login",
    error: req.flash("error"),
    message: req.flash("success_msg"),
  });
} catch (error) {
  console.log(error);
  getError500(req, res);
}
};

const editOrUploadImage = async (req, res) => {
  try {
    //* reciving file by Upload.js
    //* uploadjs laying the upload file in a requset 
    const doctorPicture = req.files ? req.files.doctorPicture : {};
    await schemaUpload.validate(
      {doctorPicture},
      { abortEarly: false }
    );
    
    //*so,the data is valided now.
      const fileName = `${shortid.generate()}_${doctorPicture.name}`;
      const user = await User.findOne({ _id: req.params.id });
      console.log("go to user finding0000000000000000000000");
      if (!user) {
        console.log("user not found >>>>>>>>>>>>>>>>>>>>");
        return res.redirect("errors/404");
      }
      //console.log(user.codemilli)
      //console.log("***************************")
      const uploadPath = `${rootPrj}/public/uploads/${user.mobileId}/${fileName}`;
      const createDir = fs.mkdir(`${rootPrj}/public/uploads/${user.mobileId}`, { recursive: true }
                                 ,(err)=>{
                                  console.log(err)
                                  console.log(createDir);
                                });
      
        console.log("*****************************");
        console.log("i enter to already image section ");
        //* remove already image file
        fs.unlink(`${rootPrj}/public/uploads/${user.mobileId}/${user.doctorPicture}`,async(err)=>{
          //*compress image by sharp
            await sharp(doctorPicture.data)
                 .jpeg({ quality: 60 })
                 .toFile(uploadPath)
                 .catch((err) => console.log(err));
          console.log("error for removing image")
          console.log(err);
        } );
     
      console.log(doctorPicture.name);
      console.log("*********************");
      user.doctorPicture = fileName;
      await user.save();
      console.log("want to save ....................................");
      req.flash("sucsessMsg", " عکس آپلود  شد");
      req.flash("error","");
      return res.redirect("/dashboard/registerDoctor");
   
  } catch (error) {
    console.log("error of input.........................")
    console.log(error);
    //* @if valdiation=false
    const errors = [];
    error.inner.forEach((err) => {
      errors.push({
        name: err.path,
        message: err.message,
      });
    });

    const user = userDistruct(req);
    let IsDoctor = false;
  if (user.nezam != undefined) {
    if (user.nezam != "") {
      IsDoctor = true;
    }
  }
    return res.render("../views/private/registerDoctors.ejs", {
      pageTitle: "دکترپیش تو| ثبت نام پزشک",
      layout: "../views/layouts/dashboardlayout.ejs",
      path: "/editUpaloadImage",
      message: "",
      errors,
      infoBack: user, //values of inputs after submit
      errorCaptcha: "",
      errorlogin: "",
      errorchangePass: "",
      errorEditingInfo: "خطا در آپلود فایل",
      user,
      IsDoctor,
    });
  }
};
const PostDisableDaysSave =async (req,res)=>{
  //* retriving  DisableDays
 let DisableDays = [];
 for (let index = 0; index < 7; index++) {
  const dayKey = `Day${index}`;
  if (req.body[dayKey] !== null && req.body[dayKey] !== undefined) {
    DisableDays.push(req.body[dayKey]);
  }

 }
 const {MessageWork} =req.body
  DisableDays = DisableDays.join(',');
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
  console.log(DisableDays) 
  const infoBack = {DisableDays,MessageWork }; 
 try {
  updateUser(req.user._id, infoBack);
  req.flash("sucsessMsg", "روزهای تعطیل اعلام شده  ثبت شدند!");
  return res.redirect("/dashboard/registerDoctor");
} catch (error) {
  console.log(error);
  getError500(req, res);
}

 }

export {
  userControllerLogin,
  userControllerGetRegister,
  userControllerCreateUser,
  userControllerLoginPost,
  userControllerLogout,
  userControllerrememberMe,
  userControllerForgetPassword,
  userControllerGetForgetPassword,
  userControllerGetResetPassword,
  userControllerResetPassword,
  getCaptcha,
  getMynobat,
  postEditDoctorInfo,
  postworkExperience,
  postAcceptLaw,
  editOrUploadImage,
  PostDisableDaysSave,
 };
