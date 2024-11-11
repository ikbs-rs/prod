import express from "express";
import prodController from "../controllers/prodController.js";
import { checkJwt } from "../security/interceptors.js";

const router = express.Router();
router.use(express.json());

// router.use(async (req, res, next) => {
//   try {
//     console.log("00 Prvo token pa sve ostalo", req.url, req.objName, req.body);
//     await checkJwt(req, res, next);
//   } catch (error) {
//     console.log("01.1 Greška u proveri tokena");
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// });

router.get("/prodaja/fiskaldata", prodController.getDataFiskal);
router.get("/prodaja", prodController.getAll); 


router.use("/", (req, res, next) => {
  console.log("03 Greska!!! ");
  next();
  return res.status(403).send({ error: `Forbidden!! ${req.url}` });
});

export default router;
