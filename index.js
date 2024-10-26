import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './src/routes/indexRoute.js'
import fs from 'fs';
import http2 from 'http';
import https from 'https';


dotenv.config()
// Funkcija za kreiranje nove instance servera
function createServer(appInstance, port, useHttps = false, credentials = null) {
  if (useHttps && credentials) {
    const httpsServer = https.createServer(credentials, appInstance);
    httpsServer.listen(port, () => {
      console.log(`HTTPS Server pokrenut na portu ${port}`);
    });
  } else {
    const httpServer = http2.createServer(appInstance);
    httpServer.listen(port, () => {
      console.log(`HTTP Server pokrenut na portu ${port}`);
    });
  }
}

const httpPort = process.env.APP_PORT || 80; // HTTP port
const httpsPort = process.env.HTTPS_PORT || 443; // HTTPS port
const sslDir = process.env.SSL_DIR
const rootDir = process.env.ROOT_DIR
const webDomen = process.env.WEB_DOMEN

const privateKey = fs.readFileSync(`${sslDir}localhost.key`, 'utf8');
const certificate = fs.readFileSync(`${sslDir}localhost.crt`, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express()
app.use(cors());
app.use((req, res, next) => {
  console.log("Zahtev stigao!")
  next();
});
// app.use((req, res, next) => {
//   const allowedOrigins = [webDomen, '*.ems.local'];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   //res.setHeader('Access-Control-Allow-Origin', `${webDomen}`);
//   next();
// });
app.use(`/${rootDir}/`, router)


const httpServer = http2.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(httpPort, () => {
  console.log(`HTTP Server je pokrenut na adresi ${webDomen}  ${rootDir} : ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server je pokrenut na adresi ${webDomen}  ${rootDir} : ${httpsPort}`);
});

const app1 = express();  // Prva instanca aplikacije
const app2 = express();  // Druga instanca aplikacije
const app3 = express();

app1.use(cors());
app1.use((req, res, next) => {
  next();
});
// app1.use((req, res, next) => {
//   const allowedOrigins = [webDomen, '*.ems.local'];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   //res.setHeader('Access-Control-Allow-Origin', `${webDomen}`);
//   next();
// });
app1.use(`/${rootDir}1/`, router)

app2.use(cors());
app2.use((req, res, next) => {
  next();
});
// app2.use((req, res, next) => {
//   const allowedOrigins = [webDomen, '*.ems.local'];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   //res.setHeader('Access-Control-Allow-Origin', `${webDomen}`);
//   next();
// });
app2.use(`/${rootDir}2/`, router)

app3.use(cors());
app3.use((req, res, next) => {
  next();
});
// app3.use((req, res, next) => {
//   const allowedOrigins = [webDomen, '*.ems.local'];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   //res.setHeader('Access-Control-Allow-Origin', `${webDomen}`);
//   next();
// });
app3.use(`/${rootDir}3/`, router)

createServer(app1, 8307);  // HTTPS server za prvu aplikaciju
createServer(app2, 8308);  // HTTP server za drugu aplikaciju na portu 8307
createServer(app3, 8309);