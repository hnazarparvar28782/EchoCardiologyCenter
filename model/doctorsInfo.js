//* #######################################
//* this is model  for users of site
//* ##################################### 
import mongoose from "mongoose";
import {schema } from "./secure/userValidation.js";
import bcrypt from "bcryptjs";



const userSchema = new mongoose.Schema({
  FullName: {
    type: String,
    trim: true,
    required: [true, "نام و نام خانوادگی الزامی است"],
  },
    mobileId: {
    type: String,
    trim: true,
    unique: [true, "شماره موبایل نباید تکراری باشد"],
    minlength:[ 11,"شماره موبایل حداقل باید یازده رقم باشد"]
  },
  PassWord: {
    type: String,
    trim: true,
    require: [true, "کلمه عبور الزامی است"],
    maxlength: 255,
    minlength: [4, "کلمه عبور باید حداقل 4 حرف باشد"],
  },
  takhasos: {
    type: String,
    trim: true,
    maxlength: 255,
  },
  codemilli: {
    type: String,
    trim: true,
    minlength: 10,
     },
  nezam: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  mondayWork: {
    type: String,
    trim: true,
     },
  afternonWork: {
    type: String,
    trim: true,
     },
  DisabledDays :{
    type:String,
    trim:true,
  },  
  Email: {
    type: String,
    trim: true,
    unique:false,
    required:true
  },
  address: {
    type: String,
    trim: true,
    maxlength: 255,
  },
  tellphone: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  workExperience: {
    type: String,
    trim: true,
    maxlength: 600,
  },
  acceptPolicy: {
    type: Boolean,
    require: [true, "پذیرش قوانین سایت  تایید نشده است"],
  },
  doctorPicture: {
    type: String,
    trim: true,
  },
  DisableDays:{
    type:String,
    trim:true,
  },
  MessageWork:{
    type:String,
    trim:true,
  },
  doctorDocument: {
    type: String,
    trim: true,
  },
  panelSelected: {
    type: String,
    trim: true,
  },
  panelActiveDate: {
    type: Date,
  },
  panelStopDate: {
    type:Date,
  },
  varizMab:{
    type:String,
    trim:true
  },
  transactMab:{
    type:String,
    trim:true
  },
  
  panelIsActiveted:{
    type:Boolean,
    default:false,
  },
  panelNumber:{
    type:String,
    trim:true
  },
  panelNumberActive:{
    type:Boolean,
    default:false,
  },
  userEchoData: mongoose.Schema.Types.Mixed, // برای ذخیره JSON به صورت کامل
  userEchoConfig: mongoose.Schema.Types.Mixed,
  userEchoSelectWithRow:[{
    disc:{type:String},
    echoNumber: { type: Number, required: true }, // شماره اکو
    selectedRows: { type: [Number], required: true }}], // آرایه‌ای از شماره‌های ردیف‌های مرتبط
  crateDate: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({
  'FullName' : "text",
  'takhasos' : "text",
  'address'  : "text",
  'mobileId' : "text", 
  'codemilli': "text",
},{name:"UserDoctorSerach"}
)
//* validation in database level
userSchema.statics.userValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};


userSchema.pre("save", function (next) {
  let user = this;
  console.log("********************")
  console.log("pre saveing start..!")
  if (!user.isModified("PassWord")) return next();
  bcrypt.hash(user.PassWord, 10, (err, hash) => {
    if (err) return next(err);
    user.PassWord = hash;
    console.log("presaveing end****************")
    next();
  });
});
userSchema.pre("update", function (next) {
  let user = this;
  console.log("********************")
  console.log("pre saveing start..!")
  if (!user.isModified("PassWord")) return next();
  bcrypt.hash(user.PassWord, 10, (err, hash) => {
    if (err) return next(err);
    user.PassWord = hash;
    console.log("presaveing end****************")
    next();
  });
});

const updateUser = async (id,newInfo) => { 
  console.log(newInfo)
  try { 
      const updatedResult  =  
         await user.findByIdAndUpdate( 
          { _id: id }, 
          newInfo,
          { 
              new: true, 
              upsert: false, 
          } 
      ); 
  } catch (error) { 
      console.log(error); 
  } 
}; 

const saveUserConfig = async (id, newInfo) => { 
  try { 
      const updatedResult = await user.findByIdAndUpdate( 
          id,  // فقط id را ارسال کنید
          newInfo,
          { 
              new: true, 
              upsert: false 
          } 
      ); 

      // چاپ نتیجه به روزرسانی
      console.log(updatedResult);
      return updatedResult; // می‌توانید نتیجه را برگردانید
  } catch (error) { 
      console.log(error); 
      throw error; // در صورت نیاز می‌توانید خطا را دوباره پرتاب کنید
  } 
};

const user = mongoose.model("user", userSchema);
export { user as User ,updateUser, saveUserConfig  };
