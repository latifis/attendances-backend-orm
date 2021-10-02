import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";

import publicRoutes from "./src/routes/public";
import adminRoutes from "./src/routes/admin";
import userRoutes from "./src/routes/user";
import apiMiddleware from "./src/middleware/apiAuth";
import adminMiddleware from "./src/middleware/adminAuth";
import errorHandler from "./src/middleware/errorHandler";


dotenv.config();
require("./src/config/sequelize");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



app.use(cors());
app.use(bodyParser.json());

app.use("/pub", publicRoutes);
app.use("/api/admin", apiMiddleware, adminMiddleware, adminRoutes);
// app.use('/api/user', apiMiddleware, userRoutes);
app.use("/api/user", userRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// app.post('/send', (req, res) => { 
//   async function sendMail() {
//     try {
//       const accessToken = await oAuth2Client.getAccessToken()
      
//       const transport = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//           type: 'OAuth2',
//           user: 'testingalvi@gmail.com',
//           clientId: CLIENT_ID,
//           clientSecret: CLIENT_SECRET,
//           refreshToken: REFRESH_TOKEN,
//           accessToken: accessToken,
//         }
//       })
  
//       const mailOptions = {
//         from: 'TESTINGALVI 🗿 <testingalvi@gmail.com>',
//         to: 'alvigeovan29@gmail.com', 
//         subject: 'Hello from gmail using API',
//         text: 'Hello from gmail email using API',
//         html: '<h1>Hello from gmail email using API</h1>'
//       };
  
//       const result = await transport.sendMail(mailOptions) 
//       return result
  
//     } catch (error) {
//       return error
//     }
//   }
//   sendMail().then(result => console.log("Email sent...", result))
//   .catch(error => console.log(error.message))
// });


module.exports = app;
