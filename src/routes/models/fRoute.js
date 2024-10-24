import express from "express";
//import vController from "../../controllers/vController.js";
import fController from "../../controllers/fController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
  const urlParts = req.url.split("/");
  req.objName2 = urlParts[1];
  router.get("/function", fController.useFunction);
  //router.get("/", vController.getLista);
  next();
});

export default router;

