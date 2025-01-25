import Yup from 'yup';
const schema = Yup.object().shape({
    FullName: Yup.string()
        .required("نام و نام خانوادگی الزامی می باشد")
        .min(4, "نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد")
        .max(255, "نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد"),
    mobileId: Yup.string()
        .required("شماره موبایل الزامی می باشد")
        .min(11, "شماره موبایل وارد شده معتبر نمی باشد"), 
    takhasos: Yup.string()
        .required("تخصص ثبت نشده است")
        .min(4, "اطلاعات تخصص به درستی ثبت  نشده است"), 
    
  });
  
 export  {schema} 