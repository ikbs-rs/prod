import db from "../db/db.js";
import { uniqueId } from "../middleware/utility.js";
import entities from "./entitis/entitis.js";

const saltRounds = 10;


const getUserChannelV = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    select distinct o.id, o.code, o.text 
    from adm_userpermiss p, adm_rollx_v r, adm_rollstr s, cmn_objx_v o
    where r.id = p.roll
    and r.strukturna = 'D'
    and r.xparam = 'X'
    and r.id = s.roll
    and s.obj = o.id
    AND p.usr  = CASE WHEN ${objId} = 1 THEN p.usr ELSE ${objId} end
    `

  const result = await db.query(sqlRecenica);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getCmnLoclinkV = async (objName, objId, lang) => {
  const sqlRecenica =
    `select  l.id, l.site, l.loctp2, l.loc2, l.tp,
            l.loctp1, getValueById(l.loctp1, 'cmn_loctpx_v', 'code', '${lang || 'en'}') cloctp1, getValueById(l.loctp1, 'cmn_loctpx_v', 'text', '${lang || 'en'}') nloctp1,
            l.loc1, getValueById(l.loc1, 'cmn_locx_v', 'code', '${lang || 'en'}') cloc1, getValueById(l.loc1, 'cmn_locx_v', 'text', '${lang || 'en'}') nloc1,   		 
            l.begda, l.endda, l.val, l.hijerarhija, l.onoff
    from    cmn_loclink l
    where 	l.loc2  = ${objId}`
  console.log(sqlRecenica, "***********************getCmnLoclinkV***********************")
  const result = await db.query(sqlRecenica);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getCmnLoclinkLLV = async (objName, objId, item, lang) => {
  const sqlRecenica =
    `select  l.id, l.site, l.loctp2, l.loc2, l.tp,
            l.loctp1, t.code cloctp1, t.text nloctp1, coalesce(l.color, lx.color) color,
            l.loc1, lx.code cloc1, lx.text nloc1,   		 
            l.begda, l.endda, l.val, l.hijerarhija, l.onoff
    from    cmn_loclink l, cmn_loctpx_v t, cmn_locx_v lx
    where 	l.loc2  = ${objId}
    and l.loc1 = lx.id
    and t.code = (CASE WHEN '${item}' = '-1' then t.code else '${item}' end)
    and t.lang = '${lang || 'en'}'
    and lx.lang = '${lang || 'en'}'
    and l.loctp1 = t.id
    `
  console.log(sqlRecenica, "***********************getCmnLoclinkLLV***********************")
  const result = await db.query(sqlRecenica);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

export default {
  
  getUserChannelV,
  getCmnLoclinkV,
  getCmnLoclinkLLV,
};
