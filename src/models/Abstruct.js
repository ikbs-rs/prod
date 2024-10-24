import db from "../db/db.js";
import entities from "./entitis/entitis.js";

const saltRounds = 10;

//# add function
const add = async (sqlQuery) => {
  console.log("************************Abstract.add****************************")
  const result = await db.query(sqlQuery);
  return result.rowCount;
};

const add2 = async (sqlQuery1, sqlQuery2) => {
  console.log("************************Abstract.add2****************************")
  try {
    await db.query("BEGIN");
    const result1 = await db.query(sqlQuery1);
    const rowCount1 = result1.rowCount;

    if (rowCount1 === 0) {
      throw new Error("Prvi upit nije uspeo");
    }

    const result2 = await db.query(sqlQuery2);
    const rowCount2 = result2.rowCount;

    if (rowCount2 === 0) {
      throw new Error("Drugi upit nije uspeo");
    }

    await db.query("COMMIT"); // Potvrda transakcije

    
    return result1.rowCount;
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Otkazivanje transakcije u slučaju greške
    }
    throw error;
  } 

};

const add4 = async (sqlQuery1, sqlQuery2, sqlQuery3, sqlQuery4) => {
  console.log(sqlQuery1, "************************Abstract.add3****************************", sqlQuery2, sqlQuery3, sqlQuery4)
  try {
    await db.query("BEGIN");
    const result1 = await db.query(sqlQuery1);
    const rowCount1 = result1.rowCount;

    if (rowCount1 === 0) {
      throw new Error("Prvi upit nije uspeo");
    }

    const result2 = await db.query(sqlQuery2);
    const rowCount2 = result2.rowCount;

    if (rowCount2 === 0) {
      throw new Error("Drugi upit nije uspeo");
    }

    const result3 = await db.query(sqlQuery3);
    const rowCount3 = result3.rowCount;

    if (rowCount3 === 0) {
      throw new Error("Treci upit nije uspeo");
    }

    const result4 = await db.query(sqlQuery4);
    const rowCount4 = result4.rowCount;

    if (rowCount4 === 0) {
      throw new Error("Cetvrti upit nije uspeo");
    }
    await db.query("COMMIT"); // Potvrda transakcije

    
    return result1.rowCount;
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Otkazivanje transakcije u slučaju greške
    }
    throw error;
  } 

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
  console.log("Abstruct.findItem=============================================03.1.1**", sqlString)
  const result = await db.query(sqlString);
  return result.rows[0];
};

//find id by Item function
const findIdbyItem = async (objName, item, itemValue) => {
  console.log("00", objName, item, itemValue)
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  console.log("01")
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  console.log("02")
  const sqlString = `SELECT id FROM ${objName} WHERE ${item} = ${value}`;
  console.log(sqlString, "## BMV ############################################################################## BMV ##")
  const {rows} = await db.query(sqlString);
  return rows[0];
};

//find id by Item function
const findAllbyItem = async (objName, item, itemValue) => {
  const _objName = objName.replace(/_v.*/, "");
  const attributeType = entities.entitiesInfo[_objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = `SELECT * FROM ${objName} WHERE ${item} = ${value}`;
 
  const result = await db.query(sqlString);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(`Greška pri dohvatanju slogova iz baze - abs find: ${rows}`);
  }
};

const findAllOuterByItem = async (objName, lang, item, itemValue, outer, outerKey) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = 
        `select 	a.*, c.*
        from	${objName} a 
        join ( 
          SELECT o.id oid, o.code ocode, o.valid ovalid, coalesce(b.text, o.text) otext, b.lang olang   
            FROM ${outer} o 
            left JOIN ( 
                SELECT *
                FROM  ${outer}x ar 
                where lang = '${lang}'
                ) b
            ON o.id = b.tableid 
            ) c
        on a.${outerKey} = c.oid
        where ${item} = ${value}`;
console.log(sqlString, "*****************findAllOuterByItem***************");
  const result = await db.query(sqlString);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(`Greška pri dohvatanju slogova iz baze - abs find: ${rows}`);
  }
};


const findAllOuter1ByItem = async (objName, lang, item, itemValue, outer, outerKey, outer1, outerKey1) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = 
        `select 	a.*, c.*, d.*
        from	${objName} a 
        join ( 
          SELECT o.id oid, o.code ocode, o.valid ovalid, coalesce(b.text, o.text) otext, b.lang olang   
            FROM ${outer} o 
            left JOIN ( 
                SELECT *
                FROM  ${outer}x ar 
                where lang = '${lang}'
                ) b
            ON o.id = b.tableid 
            ) c
        on a.${outerKey} = c.oid
        join (
          SELECT o.id o1id, o.code o1code, o.valid o1valid, coalesce(b.text, o.text) o1text, b.lang o1lang   
            FROM ${outer1} o 
            left JOIN ( 
                SELECT *
                FROM  ${outer1}x ar 
                where lang = '${lang}'
                ) b
            ON o.id = b.tableid 
        ) d
        on a.${outerKey1} = d.o1id
        where ${item} = ${value}`;
console.log(sqlString, "***************findAllOuter1ByItem*****************");
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

const getAdmParV = async (objName, objId, lang) => {
  const sqlRecenica =  
  `select aa.id , aa.site , aa.usr, aa.par, aa.begda, aa.endda, b.code cpar, b.text npar,  b.text textx 
  from	adm_paruser aa, cmn_parx_v b
  where	aa.usr = ${objId}     
  and 	b.lang = '${lang||'en'}'
  and 	aa.par = b.id`      
 console.log(sqlRecenica, "****************************/////////")
  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getAdmUserEventDDV = async (objName, objId, lang) => {
  const sqlRecenica =  
  `
  select id, username code, firstname||' '||coalesce(lastname, '.') text, firstname||' '||coalesce(lastname, '.') textx 
  from adm_user u
  `      
 console.log(sqlRecenica, "****************************/////////")
  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

export default {
  find,
  findById,
  add,
  add2,
  add4,
  update,
  remove,
  findItem,
  findIdbyItem,
  findAllbyItem,
  findAllOuterByItem,
  findAllOuter1ByItem,
  setItem,
  getAdmParV,
  getAdmUserEventDDV,
};
