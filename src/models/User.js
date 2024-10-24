import db from "../db/db.js";

//find Menu function
const findByUsername = async (mail) => {
  const rows = await db.query(
    "SELECT * FROM adm_user WHERE mail = $1",
    [mail]
  );
  return rows.rows[0];
};

const findUserChanel = async (objId) => {
  console.log(objId, "*0******************findUserChanel********************")
  const  sqlString = `
    select rs.obj as id, o.text 
    from adm_rollstr rs, adm_userpermiss up, cmn_objtp ot, cmn_objx_v o
    where	ot.code = 'XPK'
    and rs.objtp = ot.id
    and rs.obj = o.id
    and	rs.roll = up.roll
    and up.usr = ${objId}`
    console.log(sqlString, "*1*****************rows.rows*********************")
  const result = await db.query(sqlString);
  console.log(result.rows, "*2*****************rows.rows*********************")
  return result.rows;
};

export default {
  findByUsername,
  findUserChanel,
};


