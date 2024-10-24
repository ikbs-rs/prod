import fModel from "../models/fModel.js";

const saltRounds = 10;

const useFunction = async (stm, objName, objId, lang) => {
  try {
    console.log("*******Helper*********", stm);
    let result = {};
    switch (stm) {
      case "adm_isseller":
        result = await fModel.isSeller(objName, objId, lang);
        break;
      case "adm_getsaleschannel":
        result = await fModel.getSaleschannel(objName, objId, lang);
        break;
      default:
        console.error("vHelper: Pogresan naziv za funkcije");
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  useFunction,
};
