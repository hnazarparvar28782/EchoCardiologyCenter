import Yup from 'yup';
const schemaUpload = Yup.object().shape({
  doctorPicture: Yup.object().shape({
      name: Yup.string().required("مدرکی جهت آپلود انتخاب نشده است"),
      size: Yup.number().max(1000000, "سند انتخاب شده نباید بیشتر از یک مگابایت باشد"),
      mimetype: Yup.mixed().oneOf(
          ["image/jpeg", "image/png"],
          "تنها پسوندهای png و jpeg پشتیبانی می شوند"
      ),
  }),
});
const schemaUploadMardarek = Yup.object().shape({
  uploadfiledoctor: Yup.object().shape({
        name: Yup.string().required("مدرکی جهت آپلود انتخاب نشده است"),
        size: Yup.number().max(1000000, "سند انتخاب شده نباید بیشتر از یک مگابایت باشد"),
        mimetype: Yup.mixed().oneOf(
            ["image/jpeg", "image/png"],
            "تنها پسوندهای png و jpeg پشتیبانی می شوند"
        ),
    }),
});

const SchemaHandDoctrorImage = Yup.object().shape({
    HandDoctrorImage: Yup.object().shape({
          name: Yup.string().required("فایلی جهت ذخیره ارسال نشده است"),
          size: Yup.number().max(1000000, "سند انتخاب شده نباید بیشتر از یک مگابایت باشد"),
          mimetype: Yup.mixed().oneOf(
              ["image/jpeg", "image/png"],
              "تنها پسوندهای png و jpeg پشتیبانی می شوند"
          ),
      }),
  });


const schemaCreateNonbat  = Yup.object().shape({
    aztarekh: Yup.string()
    .required("تاریخ شروع مشخص نمی باشد"),
    tatarekh: Yup.string()
    .required("تاریخ خاتمه نوبت  مشخص نمی باشد"),
    azsaat: Yup.string()
    .required("ساعت نوبت مشخص نمی باشد"),
    tasaat: Yup.string()
    .required("فاصله زمانی ساعت  مشخص نمی باشد"),
    interval: Yup.string()
    .required("فاصله مشخص نمی باشد"),
    monday: Yup.string()
 });
const SchemaSingUpSick = Yup.object().shape({
    FullName: Yup.string()
        .required("نام و نام خانوادگی الزامی می باشد")
        .min(6,"نام ونام  خانوادگی  اشتباه")
        .max(255, " اطلاعات نام و نام خانوادگی اشتباه است"),
    codemilli: Yup.string()
        .required("کد ملی الزامی است")
        .min(10, "کد ملی اشتباه است")
        .max(10, "کد ملی اشتباه است"),
    Email: Yup.string().email("آدرس ایمیل اشتباه است")
        .required("ایمیل الزامی است"),    
    mobileId: Yup.string()
        .required("شماره موبایل الزامی می باشد")
        .min(11, "شماره موبایل وارد شده معتبر نمی باشد"), 
    PassWord: Yup.string()
        .min(4, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
        .max(255, "کلمه عبور نباید بیشتر از 255 کاراکتر باشد")
        .required("کلمه عبور الزامی می باشد"),
    RepassWord: Yup.string()
        .required("تکرار کلمه عبور الزامی می باشد")
        .oneOf([Yup.ref("PassWord"), null],"کلمه های عبور یکسان نیستند"),
  });
const SchemaNazarat = Yup.object().shape({
    NazarKarbar: Yup.string()
        .required("نظری وارد  نشده است")
        .min(6,"متن را بدرستی وارد کنید")
        .max(255, "متن صحیح  وارد نشده است"),
   
  });

 export  {schemaUpload,schemaUploadMardarek,schemaCreateNonbat,SchemaSingUpSick,SchemaNazarat,SchemaHandDoctrorImage} 