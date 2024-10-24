import abstractModel from "../models/Abstruct.js";
import { uniqueId } from "../middleware/utility.js";
import abstructQuery from "../middleware/model/abstructQuery.js";
import { getToken } from "../security/jwt/tokenJWT.js";
import bcrypt from "bcryptjs";
import DateFunction from "../middleware/dataFunction.js"

const saltRounds = 10

const add = async (objName, objData) => {
  try {

    if (!objData.id || objData.id !== null) {
        objData.id = await uniqueId();
    }
    // Mozda mi ovo ne treba jer dolazi sa fronta !!!
    if (objName === "adm_user") {
      const hashedPassword = await bcrypt.hash(objData.password, saltRounds);
      objData.password = hashedPassword;
    }
    const sqlQuery = await abstructQuery.getInsertQuery(objName, objData);
    const result = await abstractModel.add(sqlQuery);
    return objData.id; //result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAll = async (sqlQuery) => {
  try {
    const result = await abstractModel.find(sqlQuery);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getById = async (objName, id) => {
  try {
    const result = await abstractModel.findById(objName, id);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getByStext = async (objName, value) => {
  try {
    const result = await abstractModel.findByStext(objName, value);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (objName, objData) => {
  try {
    const sqlQuery = await abstructQuery.getUpdateQuery(objName, objData);

    console.log(sqlQuery, "-*-*-*-*******************-----------------------------------************", objData, objName)
    const result = await abstractModel.update(sqlQuery);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const remove = async (objName, id) => {
  try {
    const result = await abstractModel.remove(objName, id);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
    //throw err;
  }
};
//******************************* */
const getItem = async (objName, item, objId) => {
  try {
    const result = await abstractModel.findItem(objName, item, objId);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getIdByItem = async (objName, item, itemValue) => {
  try {
    const result = await abstractModel.findIdbyItem(objName, item, itemValue);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllByItem = async (objName, item, itemValue) => {
  try {
    const result = await abstractModel.findAllbyItem(objName, item, itemValue);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllOuterByItem = async (objName, lang, item, itemValue, outer, outerKey) => {
  try {
    const result = await abstractModel.findAllOuterByItem(objName, lang, item, itemValue, outer, outerKey);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllOuter1ByItem = async (objName, lang, item, itemValue, outer, outerKey, outer1, outerKey1) => {
  try {
    const result = await abstractModel.findAllOuter1ByItem(objName, lang, item, itemValue, outer, outerKey, outer1, outerKey1);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const setItem = async (objName, item, items) => {
  try {
    const result = await abstractModel.setItem(objName, item, items);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//************************** */

const signup = async (objName, objData, countryId, lang) => {
  try {
    //console.log("**0**********************abstructHelper.signup****************************")
    objData.id = await uniqueId();
    const token = await getToken(objData.id, objData.username)
    const item = {
      id: objData.id,
      username: objData.username,
      token: token,
    };
    //const user = await add(objName, objData);
    //const user = await signup(objName, objData);
// Izmene za automatski unos sloga u cmn_par
    // Mozda mi ovo ne treba jer dolazi sa fronta !!!
    const hashedPassword = await bcrypt.hash(objData.password, saltRounds);
    objData.password = hashedPassword;
    const sqlQuery = await abstructQuery.getInsertQuery(objName, objData);
    //console.log(objName, "**1**********************abstructHelper.signup****************************", sqlQuery)
    const objName2 = "cmn_par"
    let objData2 = {}

    objData2.id = await uniqueId();
    objData2.site = null
    objData2.code = objData.username
    objData2.text = `${objData.firstname} ${objData.lastname}`
    objData2.tp = 2 // 1 - Pravno lice, 2 - Fizicko lice ovo ubaciti u DB_PARAMETRE
    objData2.countryid = countryId
    objData2.email = objData.mail
    objData2.begda =  DateFunction.currDate()
    objData2.endda = "99991231"
    console.log("**1.1**********************abstructHelper.signup****************************")
    const sqlQuery2 = await abstructQuery.getInsertQuery(objName2, objData2);
    console.log("**2**********************abstructHelper.signup****************************")

    const objName3 = "adm_paruser"
    let objData3 = {}

    objData3.id = await uniqueId();
    objData3.site = null
    objData3.par = objData2.id
    objData3.usr = objData.id
    objData3.begda =  DateFunction.currDate()
    objData3.endda = "99991231"

    const sqlQuery3 = await abstructQuery.getInsertQuery(objName3, objData3);
    console.log("**3**********************abstructHelper.signup****************************")

    let objName4 = `${objName2}x`    
    let objData4 = {}
    objData4.id = await uniqueId();
    objData4.site = null
    objData4.tableid = objData2.id
    objData4.lang = lang ||'en'
    objData4.grammcase = 1
    objData4.text = objData2.text
    
    const sqlQuery4 = await abstructQuery.getInsertQuery(objName4, objData4);
    console.log("**4**********************abstructHelper.signup****************************")

    const result = await abstractModel.add4(sqlQuery, sqlQuery2, sqlQuery3, sqlQuery4);

// Izmene za automatski unos sloga u cmn_par
    return item;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getLista = async (objName, stm, objId, lang) => {
  try {
    let result = {};
    switch (stm) {
      case "adm_paruser_v":
        result = await abstractModel.getAdmParV(objName, objId, lang);
        break;
        case "adm_usereventdd_v":
          result = await abstractModel.getAdmUserEventDDV(objName, lang);
          break;        
      default:
        console.error(`Pogresan naziv za view 00 ${stm}`);
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  add,
  getAll,
  getById,
  getByStext,
  update,
  remove,
  getItem,
  getIdByItem,
  getAllByItem,
  getAllOuterByItem,
  getAllOuter1ByItem,
  setItem,
  signup,
  getLista
};
