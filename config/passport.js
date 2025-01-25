import passport from "passport";
import { Strategy } from "passport-local";
import  bcrypt  from 'bcryptjs';
import {User} from '../model/doctorsInfo.js'

passport.use(new Strategy ({usernameField:"mobileId", passwordField:"PassWord"},async (mobileId,PassWord,done)=>{
    try {
       const user = await User.findOne({mobileId});
        if (!user){
            return done(null,false,{message:"کاربر با این موبایل ثبت نشده است "})
         } 
         const isMatch = await bcrypt.compare(PassWord,user.PassWord);
             
          if (isMatch){
              return done (null,user);//Now,we have  info'user in req.user
          } else {
            return done(null,false,{message:" نام کاربری یا کلمه عبور اشتباه است"})
          }


    } catch (error) {
      console.log(error)
      
    }
})
)

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user);
  } catch (error) {
    console.log(error)
  }

  });