/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                     Medical Echo Application                         ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║                                                                      ║
 * ║     This application is developed using Node.js and Bootstrap.       ║
 * ║                                                                      ║
 * ║     Features:                                                        ║
 * ║       - Manage and display echo-related information                  ║
 * ║       - User sessions                                                ║
 * ║       - File uploads                                                 ║
 * ║       - Responsive design                                            ║
 * ║                                                                      ║
 * ║     Technologies Used:                                               ║
 * ║       - EJS for templating                                           ║
 * ║       - MongoDB for data storage                                     ║
 * ║                                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

// Import necessary modules
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import express from "express"; // Web framework for Node.js
import dotEnv from 'dotenv'; // Module to load environment variables from a .env file
import { rootPrj } from "./utils/path.js"; // Custom utility to get the project root path
import expressEjsLayouts from "express-ejs-layouts"; // Middleware for EJS layouts
import path from "path"; // Utility for working with file and directory paths
import { dashboardRouter } from "./routers/dashboardRouter.js"; // Router for dashboard-related routes
import { connectDb } from "./config/db.js"; // Function to connect to the database
import session from 'express-session'; // Middleware for session management
// import passport from "passport"; // Uncomment for authentication
import flash from 'connect-flash'; // Middleware for flash messages
import MongoStore from "connect-mongo"; // MongoDB session store for express-session
import { mongoose } from 'mongoose'; // Mongoose ODM for MongoDB
import fileUpload from 'express-fileupload'; // Middleware for handling file uploads

import { getError404 } from "./controllers/errorController.js"; // Controller for handling 404 errors

//* Load environment variables from config.env file
dotEnv.config({ path: "./config/config.env" });

//* Connect to the database
connectDb();

//* Express application setup
const app = express(); // Create an instance of the Express application

//? View engine and custom middleware setup
app.use(expressEjsLayouts); // Use EJS layouts for rendering views
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('layout', './layouts/mainLayout.ejs'); // Set the main layout file
app.set('views', 'views'); // Set the directory for views

//? Body parser middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

//* File Upload Middleware
app.use(fileUpload()); // Enable file upload handling

//* Session middleware setup
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Secret for signing session ID cookies
        resave: false, // Do not save session if unmodified
        saveUninitialized: false, // Do not save uninitialized sessions
        unset: "destroy", // Remove session when it is uninitialized
        store: new MongoStore({
            client: mongoose.connection.getClient(), // MongoDB client
            dbName: process.env.MONGO_DB_NAME, // Database name
            collectionName: "sessions", // Collection to store sessions
            stringify: false, // Don't stringify the session data
            autoRemove: "interval", // Automatically remove sessions after a certain interval
            autoRemoveInterval: 1 // Interval for auto removal (in minutes)
        }),
    })
);

//* Passport middleware setup
// app.use(passport.initialize()); // Uncomment to initialize Passport
// app.use(passport.session()); // Uncomment to use Passport sessions

//* Flash middleware setup
app.use(flash()); // Enable flash messages (req.flash)

// Middleware to access flash messages in every request
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash(); // Add flash messages to response locals
    next(); // Proceed to the next middleware
});

//? Static files setup
app.use(express.static(path.join(rootPrj, "public"))); // Serve static files from the public directory

//? Router setup
app.use("/dashboard", dashboardRouter); // Use dashboardRouter for routes prefixed with /dashboard
app.use(getError404); // Handle 404 errors

// Start the server
const port = process.env.port; // Get the port from environment variables
const mode = process.env.NODE_ENV; // Get the environment mode (development/production)
app.listen(port, () => console.log(`Server is running on ${port} in ${mode} mode`)); // Start listening on the specified port