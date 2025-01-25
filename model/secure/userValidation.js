import Yup from 'yup';
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
        PassWord: Yup.string()
        .min(4, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
        .max(255, "کلمه عبور نباید بیشتر از 255 کاراکتر باشد")
        .required("کلمه عبور الزامی می باشد"),
    ConfirmPassword: Yup.string()
        .required("تکرار کلمه عبور الزامی می باشد")
        .oneOf([Yup.ref("PassWord"), null],"کلمه های عبور یکسان نیستند"),
    codemilli: Yup.string() 
        .transform(value => value.trim()) // حذف فاصله‌های اضافی
        .required("کد ملی الزامی می باشد")
        .matches(/^\d+$/, "کد ملی وارد شده اشتباه است"), // بررسی عددی بودن   
});
  
export  {schema} 