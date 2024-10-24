import userpermissModel from "../models/Userpermiss.js";
import { uniqueId } from "../middleware/utility.js";
import abstructQuery from "../middleware/model/abstructQuery.js";
//import { getToken } from "../security/jwt/tokenJWT.js";
import bcrypt from "bcryptjs";

// U petlji vrtim prosledjeni slog i proveravam da li je dodeljen korisniku
export const checkUserPermissions = async (userId, roles) => {
    try {
      console.log("UserpermissHelper.checkUserPermissions=======================================*****03.3.0**", roles, roles.length)
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i].roll;
        const userPermission = await userpermissModel.getUserPermission(userId, role);
        if (userPermission) {
          return true; // korisnik ima dozvole za dati set uloga
        }
      }
      return false; // korisnik nema dozvole za dati set uloga
    } catch (error) {
      throw new Error(`Greška pri provjeri korisničkih dozvola: ${error.message}`);
    }
  };

const saltRounds = 10

const add = async (objName, objData, lang) => {
  try {

    if (!objData.id || objData.id !== null) {
        objData.id = await uniqueId();
    }
    const sqlQuery = await abstructQuery.getInsertQuery(objName, objData);
    const result = await userpermissModel.add(sqlQuery);
    return objData.id; //result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAll = async (objName, lang) => {
  try {  
    const result = await userpermissModel.find(objName, lang);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getById = async (objName, lang, id) => {
  try {
    const result = await userpermissModel.findById(objName, lang, id);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getByStext = async (objName, lang, value) => {
  try {
    const result = await userpermissModel.findByStext(objName, lang, value);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (objName, objData, lang) => {
  try {
    const sqlQuery = await abstructQuery.getUpdateQueryX(objName, objData);
    const result = await userpermissModel.update(sqlQuery, objName,  objData, lang);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const remove = async (objName, lang, id) => {
  try {
    const result = await userpermissModel.remove(objName, lang, id);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
    //throw err;
  }
};
//******************************* */
const getItem = async (objName, lang, item, objId) => {
  try {
    const result = await userpermissModel.findItem(objName, lang, item, objId);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getIdByItem = async (objName, lang, item, itemValue) => {
  try {
    const result = await userpermissModel.findIdbyItem(objName, lang, item, itemValue);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllByItem = async (objName, lang, item, itemValue) => {
  try {
    const result = await userpermissModel.findAllbyItem(objName, lang, item, itemValue);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllOuterByItem = async (objName, lang, item, itemValue, outer) => {
  try {
    const result = await userpermissModel.findAllOuterByItem(objName, lang, item, itemValue, outer);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const setItem = async (objName, lang, item, items) => {
  try {
    const result = await userpermissModel.setItem(objName, lang, item, items);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//************************** */

// const signup = async (objName, objData) => {
//   try {
//     objData.id = await uniqueId();
//     const token = await getToken(objData.id, objData.username)
//     const item = {
//       id: objData.id,
//       username: objData.username,
//       token: token,
//     };
//     const user = await add(objName, objData);
//     return item;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

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
  setItem,
  // signup,
};
