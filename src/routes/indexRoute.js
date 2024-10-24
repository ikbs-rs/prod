import express from "express";

import abstruct from "./models/abstructRoute.js";
import abstructX from "./models/abstructXRoute.js";
import userpermissRoute from "./models/userpermissRoute.js";
import user from "./models/userRoute.js";
import servicesRoute from "./services/servicesRoute.js";
import {
  checkJwt,
  checkPermissions,
  checkPermissionsEx,
} from "../security/interceptors.js";

const router = express.Router();

//router.use(checkJwt); // provera JWT tokena na svakom zahtevu
router.use(express.json());


router.use("/", (req, res, next) => {
  const urlParts = req.url.split("/");
  // Dohvatam iz URL-a, koju tabelu obradjujen i setuje --- req.objName ****** TABELU
  // Ovde je to .../adm/menu/... adm je modul a menu je tabela
  if (!(urlParts[2] === "services")||!(urlParts[2] === "x")) {
    req.objName = urlParts[1] + "_" + urlParts[2];
  } 
  if (urlParts[2] === "x") { // za tebele koje imaju visejezicku podrsku
    req.objName = urlParts[1] + "_" + urlParts[3];
  }
  next();
});

router.use(async (req, res, next) => {
  if (req.path.startsWith("/adm/services/sign")) {
    // Preskacem prilikom logovanja i kreiranja korisnika proceduru provere Tokena
    return next();
  }
  try {
    console.log("00 ///////////////////////Prvo token pa sve ostalo//////////////////", req.url, req.objName, req.body)
    await checkJwt(req, res, next);
    console.log("01 /////////////////////// Prosao proveru tokena  //////////////////")
    // Ovde možete nastaviti sa izvršavanjem koda nakon što je checkJwt završen
  } catch (error) {
    // Obrada grešaka koje se desila u checkJwt
    console.log("01.1 /////////////////////// Greska proveru tokena  //////////////////")
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.use((req, res, next) => {
  console.log("02 /////////////////////// Otisao ka ruterima  //////////////////")
  next();
});

  router.use("/adm/x/action", checkPermissions(), abstructX);
  router.use("/adm/x/roll", checkPermissions(), abstructX);
  router.use("/adm/x/usergrp", checkPermissions(), abstructX);
  //router.use(/^\/adm\/.*_v.*$/, checkPermissions(), abstruct);

  router.use("/adm/services/sign", user);

  // Moze da se svede na jedan ruter ali volim da vidim sta je sve implementirano!!!
  router.use(`/adm/action`, checkPermissions(), abstruct);
  router.use(`/adm/dbmserr`, checkPermissions(), abstruct);
  router.use("/adm/dbparameter", checkPermissions(), abstruct);
  router.use("/adm/message", checkPermissions(), abstruct);
  router.use("/adm/paruser", checkPermissions(), abstruct);
  router.use("/adm/roll", checkPermissions(), abstruct);
  router.use("/adm/rollact", checkPermissions(), abstruct);
  router.use("/adm/rolllink", checkPermissions(), abstruct);
  router.use("/adm/rollstr", checkPermissions(), abstruct);
  router.use("/adm/table", checkPermissions(), abstruct);
  router.use("/adm/user", checkPermissions(), user);
  router.use("/adm/user_v", checkPermissions(), abstruct);
  router.use("/adm/userf", checkPermissions(), abstruct);
  router.use("/adm/usergrp", checkPermissions(), abstruct);
  router.use("/adm/userlink", checkPermissions(), abstruct);
  router.use("/adm/userlinkpremiss", checkPermissions(), abstruct);
  router.use("/adm/userloc", checkPermissions(), abstruct);
  
  router.use("/adm/userpermiss_vr", checkPermissions(), abstruct);
  router.use("/adm/userpermiss_vu", checkPermissions(), abstruct);
  router.use("/adm/blacklist_token", checkPermissions(), abstruct);

  router.use("/adm/userpermiss", checkPermissions(), userpermissRoute);
  router.use("/adm/services", servicesRoute);

router.use("/", (req, res, next) => {
  console.log("03 /////////////////////// Greska!!!  //////////////////")
  next();
  return res.status(403).send({ error: "Forbidden!! " + req.url });
});

export default router;
