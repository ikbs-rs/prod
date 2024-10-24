import db from "../db/db.js";
import entities from "./entitis/entitis.js";
import { uniqueId } from "../middleware/utility.js";

const saltRounds = 10;


const isSeller = async (objName, objId, lang) => {
  const sqlRecenica =  
  `select aa.id , aa.site , aa.code , text, text textx, aa.begtm, aa.endtm, aa.valid, aa.lang, aa.grammcase,
        aa.tg, getValueById(aa.tg, 'tic_agendatpx_v', 'code', '${lang||'en'}') ctp, getValueById(aa.tg, 'tic_agendatpx_v', 'text', '${lang||'en'}') ntp
  from	tic_agendax_v aa
  where aa.lang = '${lang||'en'}'`    
    
  //const [rows] = await db.query(sqlRecenic);
  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return 0;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getSaleschannel = async (objName, objId, lang) => {
  const sqlRecenica =  
  `select aa.id , aa.site , aa.code , text, text textx, aa.begtm, aa.endtm, aa.valid, aa.lang, aa.grammcase,
        aa.tg, getValueById(aa.tg, 'tic_agendatpx_v', 'code', '${lang||'en'}') ctp, getValueById(aa.tg, 'tic_agendatpx_v', 'text', '${lang||'en'}') ntp
  from	tic_agendax_v aa
  where aa.lang = '${lang||'en'}'`    
    
  //const [rows] = await db.query(sqlRecenic);
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
  isSeller,
  getSaleschannel,
};
