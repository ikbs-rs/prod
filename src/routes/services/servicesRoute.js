import express, { request, response } from "express";
import { checkPermissionsEx } from '../../security/interceptors.js'
import { decodeJWT } from '../../security/jwt/tokenJWT.js'

const router = express.Router();

router.post('/checkPermissions', async (req, res, next) => {
  console.log("11.0 serviceRoute.checkPermissions====================req.body===================****01.0**", req.body)
  const result = await checkPermissionsEx(req, res, next);
  console.log("11.0 serviceRoute.checkPermissions====================req.body===================****01.0**", req.body)
  return result;
}); 

router.post('/checkJwt', async (req, res, next) => {
  console.log("1xxx1.1 serviceRoute.checkPermissions============================", { success: true, userId: req.decodeJwt.userId, username: req.decodeJwt.username, message: "OK", decodeJwt: req.decodeJwt})
  const result =  res.status(200).json({ success: true, userId: req.decodeJwt.userId, username: req.decodeJwt.username, message: "OK"});
  return result;
});

router.post('/decodeJwt', async (req, res, next) => {
  console.log("11.2 *******checkJwtRout********", { success: true, userId: req.decodeJwt.userId, username: req.decodeJwt.username, message: "OK", decodeJwt: req.decodeJwt})
  return decodeJWT(req, res, next);
}); 

export default router;  