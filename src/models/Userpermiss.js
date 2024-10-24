// importujemo pool iz fajla za konekciju sa bazom
import db from '../db/db.js';
import entities from "./entitis/entitis.js";

const saltRounds = 10;
// funkcija koja vraća slog iz tabele userpermiss - za dati userId i roleId

const getUserPermission = async (userId, role) => {
  try {
    const query = 'SELECT * FROM adm_userpermiss WHERE usr=$1 AND roll=$2';
    const params = [userId, role];
    
    const { rows } = await db.query(query, params);
    console.log("Userpermiss.getUserPermission=======================================*****03.3.1***", query, params, role, rows)
    return rows[0];
  } catch (error) {
    throw new Error(`Greška pri dohvatanju sloga iz baze: ${error.message}`);
  }
};

//# add function
const add = async (sqlQuery) => {
  const result = await db.query(sqlQuery);
  return result.rowCount;
};

//# find function
const find = async (objName) => {
  const sqlRecenic = `SELECT * FROM ${objName}`;
  //const [rows] = await db.query(sqlRecenic);
  const result = await db.query(sqlRecenic);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(`Greška pri dohvatanju slogova iz baze - abs find: ${rows}`);
  }
};

//# find by id function
const findById = async (objName, id) => {
  //const result = await db.query(`SELECT * FROM ${objName} WHERE id = ?`, [id]);
  const result = await db.query(`SELECT * FROM ${objName} WHERE id = ${id}`);
  return result.rows[0];
};

//# update function
const update = async (sqlQuery) => {
  const result = await db.query(sqlQuery);
  return result.rowCount;
};

//# delete function
const remove = async (objName, id) => {
  try {
    const result = await db.query(`DELETE FROM ${objName} WHERE id = ${id}`);
    return result.rowCount;
  } catch (err) {
    throw new Error(err);
  }
};

//# find Item by id function
const findItem = async (objName, item, id) => {
  const sqlString = `SELECT ${item} FROM ${objName} WHERE id = ${id}`;
  const result = await db.query(sqlString);
  return result.rows[0];
};

//find id by Item function
const findIdbyItem = async (objName, item, itemValue) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = `SELECT id FROM ${objName} WHERE ${item} = ${value}`;
  const {rows} = await db.query(sqlString);
  return rows[0];
};

//find id by Item function
const findAllbyItem = async (objName, lang, item, itemValue) => {
  const _objName = objName.replace(/_v.*/, "");
  const attributeType = entities.entitiesInfo[_objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = `SELECT a.*, 
                    FROM ${objName} a
                    on (
                      select *
                      from 
                    ) 
                    WHERE ${item} = ${value}`;
  const result = await db.query(sqlString);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(`Greška pri dohvatanju slogova iz baze - abs find: ${rows}`);
  }
};

const findAllOuterByItem = async (objName, lang, item, itemValue, outer1) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = 
        `select 	au.*, c.*
        from	${objName} au 
        join ( 
          SELECT a.id rid, a.code rcode, a.valid, a.valid rvalid, coalesce(b.text, a.text) rtext, b.lang  
            FROM ${outer1} a 
            left JOIN ( 
                SELECT * FROM 
                ${outer1}x ar 
                where lang = '${lang}'
                ) b
            ON a.id = b.tableid 
            ) c
        on au.roll = c.rid
        where ${item} = ${value}`;
  const result = await db.query(sqlString);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(`Greška pri dohvatanju slogova iz baze - abs find: ${rows}`);
  }
};

//# set Item by id and value
const setItem = async (objName, item, items) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${items.value}'` : items.value;
  const sqlString = `UPDATE ${objName} set ${item} = ${value}  WHERE id = ${items.id}`;
  const result = await db.query(sqlString);
  return result.rowCount;
};

export default {
  find,
  findById,
  add,
  update,
  remove,
  findItem,
  findIdbyItem,
  findAllbyItem,
  setItem,
  getUserPermission,
  findAllOuterByItem,  
};