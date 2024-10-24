import express from "express";
import userpermissControlerr from "../../controllers/userpermissControlerr.js";
import { checkPermissions } from '../../security/interceptors.js'

const router = express.Router();

router.use("/", (req, res, next) => {
    //console.log(req.url, "*/*/*/*/*/*/*/*/*")
  const urlParts = req.url.split("/");
  req.objName2 = urlParts[1];
  //console.log("ADM abstructRoute", req.objName2, req.objName2=="services", req.objName2==="services")
  if (req.objName2=="services") {
    router.use(`/${req.objName2}`, (req, res, next) => {
      return res.status(403).send({ error: "Forbidden!!" });
    });
  } else {
    if (req.path.startsWith("/_v")) {
      router.use("/_v", abstructRouteV);
    }  else {
      router.get("/", userpermissControlerr.getAll);
      router.get("/:id", userpermissControlerr.getById);
      router.post("/", checkPermissions("CREATE"), userpermissControlerr.add);
      router.put("/", checkPermissions("UPDATE"), userpermissControlerr.update);
      router.delete("/:id", checkPermissions("DELETE"), userpermissControlerr.remove);

      req.objItem = urlParts[2];
      router.get(`/get/${req.objItem}/:id`, userpermissControlerr.getItem);
      router.get(`/getid/${req.objItem}/:value`, userpermissControlerr.getIdByItem);
      router.get(`/getall/${req.objItem}/:value`, userpermissControlerr.getAllByItem);
      router.get(`/getallouter/${req.objItem}/:value`, userpermissControlerr.getAllOuterByItem);
      //Mora se proslediti sledeci json za SETOVANJE *********** {"id": 1627113837566496768, "value": 1} *******    
      router.put(`/set/${req.objItem}`, checkPermissions("UPDATE"), userpermissControlerr.setItem);
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
