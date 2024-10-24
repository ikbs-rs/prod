import express, { request, response } from "express";
import vRoute from './vRoute.js'
import userController from "../../controllers/userController.js";
import abstructController from "../../controllers/abstructController.js";
import { checkPermissions } from '../../security/interceptors.js'

const router = express.Router();

router.use("/", (req, res, next) => {
    //console.log("********************userRouter************************")
    const urlParts = req.url.split("/");
    req.objName2 = urlParts[1];
    if (req.path.startsWith("/_v")) {
        console.log("ADM _v************************", req.path)
        router.use("/_v", vRoute);
    } else {
        router.post("/up", userController.signup);
        router.post("/in", userController.signin);
        router.post('/out', userController.signout);

        router.get("/", abstructController.getAll);
        router.get("/:id", abstructController.getById);
        //router.post("/", checkPermissions("CREATE"), userController.signup);
        router.post("/", userController.signup);
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
    next();
});

export default router;