import express from "express";
import vController from "../../controllers/vController.js";
// import abstructController from "../../controllers/abstructController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
  const urlParts = req.url.split("/");
  req.objName2 = urlParts[1];
  router.get("/lista", vController.getLista);
  //router.get("/", vController.getLista);
  next();
});

export default router;

