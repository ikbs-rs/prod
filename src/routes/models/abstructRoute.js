import express from "express";
import abstructController from "../../controllers/abstructController.js";
import vRoute from './vRoute.js'
import fRoute from './fRoute.js'
import { checkPermissions } from '../../security/interceptors.js'

const router = express.Router();

router.use("/", (req, res, next) => {
  //console.log("ADM abstructRoute************************", req.path)
  const urlParts = req.url.split("/");
  req.objName2 = urlParts[1];
  if (req.objName2=="services") {
    router.use(`/${req.objName2}`, (req, res, next) => {
      return res.status(403).send({ error: "Forbidden!!" });
    });
  } else {
    if (req.path.startsWith("/_v")) {
      router.use("/_v", vRoute);
    } else if (req.path.startsWith("/_f")) {
      router.use("/_f", fRoute);
    }  else {
      router.get("/", abstructController.getAll);
      router.get("/:id", abstructController.getById);
      router.post("/", checkPermissions("CREATE"), abstructController.add);
      router.put("/", checkPermissions("UPDATE"), abstructController.update);
      router.delete("/:id", checkPermissions("DELETE"), abstructController.remove);

      req.objItem = urlParts[2];
      router.get(`/get/${req.objItem}/:id`, abstructController.getItem);
      router.get(`/getid/${req.objItem}/:value`, abstructController.getIdByItem);
      router.get(`/getall/${req.objItem}/:value`, abstructController.getAllByItem);
      router.get(`/getallouter/${req.objItem}/:value`, abstructController.getAllOuterByItem);
      router.get(`/getallouter1/${req.objItem}/:value`, abstructController.getAllOuter1ByItem);
      //Mora se proslediti sledeci json za SETOVANJE *********** {"id": 1627113837566496768, "value": 1} *******    
      router.put(`/set/${req.objItem}`, checkPermissions("UPDATE"), abstructController.setItem);
  }
  }
  next();
});

export default router;

/**  Da ne zaboravi kada kocu da se igram u samom ruteru, a da mi controler ne vraca RES
 * 
 router.get("/", async (req, res) => {
  const urlParts = req.url.split("/");
  const menu = urlParts[2];
  try {
    const items = await menuController.getAll(menu);
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

 * 
 */
