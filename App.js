import bodyParser from "body-parser";
import  express  from "express";
import dotEnv from 'dotenv'
import { rootPrj } from "./utils/path.js";
import expressEjsLayouts from "express-ejs-layouts";
import  path  from "path";
import { dashboardRouter } from "./routers/dashboardRouter.js";
import { connectDb } from "./config/db.js";
import  session from 'express-session';
import passport from "passport"; 
import flash from 'connect-flash';
import  MongoStore from "connect-mongo"
import { mongoose } from 'mongoose';
import fileUpload from 'express-fileupload'


import { usersRouter } from "./routers/users.js";
import { getError404 } from "./controllers/errorController.js";




//* load config
dotEnv.config({path:"./config/config.env"});
//* connecting to database
connectDb();
//* Passport Configuration
import ("./config/passport.js");
//* applay exprees framework
const app=express();

//? view engine & custom midlware
app.use(expressEjsLayouts);
app.set('view engine','ejs');
app.set('layout','./layouts/mainLayout.ejs')
app.set('views','views');
//? body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//* File Upload Middleware
app.use(fileUpload());


//* Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        unset:"destroy",
        store: new MongoStore(
            {client: mongoose.connection.getClient(),
            dbName: process.env.MONGO_DB_NAME,
            collectionName: "sessions",
            stringify: false,
            autoRemove: "interval",
            autoRemoveInterval: 1}
        ),
    })
);
//* Passport
app.use(passport.initialize());
app.use(passport.session());
//* Flash
app.use(flash()); //req.flash
// * new hassan
// Middleware برای دسترسی به پیام‌ها در هر درخواست
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash(); // اینجا پیام‌ها به flashMessages اضافه می‌شوند
    next();
});
//? statics paths
app.use(express.static(path.join(rootPrj,"public")));
//? routers
app.use("/dashboard",dashboardRouter); //* first page
app.use("/users",usersRouter);
app.use(getError404)

const port =process.env.port;
const mode=process.env.NODE_ENV;
app.listen(port,()=>console.log(`server is running on ${port} in ${mode} mode`))