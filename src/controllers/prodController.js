import { all } from "axios";
import db from "../db/db.js";

const getAll = async (req, res) => {
  try {
    const {
      stm,
      objid: objId,
      par1,
      par2,
      sl: lang = 'sr_cyr',  // Ako nema sl, default je 'sr_cyr'
      par3, par4, par5, par6, par7, par8, par9, par10
    } = req.query;

    let sqlRecenica = '';
    let item = null;

    // console.log(stm, "ULAZ xxxxxxxxxxx getAll xxxxxxxxxxxx", new Date().toLocaleString());


    // Proveri vrednost `stm` i izvrši odgovarajuću SQL upit
    switch (stm) {
      case "tic_eventprodaja_v":
        sqlRecenica = `
          SELECT aa.id , aa.site , aa.code , aa.text, aa.text textx, aa.begda, aa.endda, aa.begtm, aa.endtm, aa.status, aa.descript, aa.note, 
                aa.lang, aa.grammcase,
                aa.tp, tp.code ctp, tp.text ntp,
                aa.event, 
                aa.ctg, ctg.code cctg, ctg.text nctg,
                aa.loc, l.code cloc, l.text nloc,
                aa.mesto, l1.code cmesto, l1.text nmesto,
                aa.par, p.text npar, p.code cpar
          FROM tic_eventx_v aa 
          JOIN tic_eventtpx_v tp ON aa.tp = tp.id AND tp.lang = '${lang}'
          JOIN tic_eventctgx_v ctg ON aa.ctg = ctg.id AND ctg.lang = '${lang}'
          JOIN cmn_parx_v p ON aa.par = p.id AND p.lang = '${lang}'
          JOIN cmn_locx_v l ON aa.loc = l.id AND l.lang = '${lang}'
          JOIN cmn_locx_v l1 ON aa.mesto = l1.id AND l1.lang = '${lang}'  
          WHERE aa.lang = '${lang}'
        `;
        break;
      case "tic_docsuidprodaja_v":
        sqlRecenica = `
          select u.*, aa.id::text docsid, aa.doc, aa.tickettp, aa.delivery, a.text nartikal, aa.nart, aa.discount, aa.row, 
                aa.seat, aa.price, e.text nevent, aa.price, c.code ccurr, aa.event
          from	tic_docs aa
          join  tic_artx_v a on a.id = aa.art
          join  tic_arttp p on p.id = a.tp and p.code!='Н'
          join  tic_eventx_v e on aa.event = e.id
          join  cmn_curr c on aa.curr = c.id
          left  join  tic_docsuid u on aa.id = u.docs
          where aa.doc = ${objId}
        `;
        break;
      case "tic_doczbirniiznos_v":
        sqlRecenica = `
          SELECT sum(s.potrazuje) iznos
          FROM tic_docs s
          WHERE  s.doc = ${objId}
          `;
        break;
      case "cmn_par_v":
        sqlRecenica = `
          select l.id, l.site, l.code, l.text, l.short, l.address, l.place, l.postcode, l.tel, l.activity,
                l.pib, l.idnum, l.pdvnum, l.begda, l.endda,
                l.docid, l.country, l.email, l.countryid, l.countryid, l.birthday,
                l.lang, l.grammcase, l.text textx,
                l.tp, getValueById(l.tp, 'cmn_partpx_v', 'code', '${lang || 'en'}') ctp, getValueById(l.tp, 'cmn_partpx_v', 'text', '${lang || 'en'}') ntp
          from	cmn_parx_v l
          where l.lang = '${lang || 'en'}'
          `;
        break;
      case "tic_docactivuser_v":
        sqlRecenica = `
          select 	d.*
          from 	  tic_doc d
          where 	to_timestamp(d.endtm, 'YYYYMMDDHH24MISS') > now()
          and 		d.status = '0'
          and     d.usersys = ${objId}  
          `;
        break;
      case "cmn_objbytpcode_v":
        sqlRecenica = `
          select l.id, l.site, l.code, l.text , l.valid, l.lang, l.grammcase, l.text textx,
                l.tp, getValueById(l.tp, 'cmn_objtpx_v', 'code', '${lang || 'en'}') ctp, getValueById(l.tp, 'cmn_objtpx_v', 'text', '${lang || 'en'}') ntp
          from	cmn_objx_v l, cmn_objtp t
          where ${par1} = '${objId}'  
          and   t.id = l.tp
          and   l.lang = '${lang || 'en'}'
          `;
        break;
      case "cmn_paymenttp_p":
        sqlRecenica = `
            select p.*
            from	cmn_paymenttpx_v p
            where p.lang = '${lang || 'en'}'
            `;
        
        break;
      case "tic_docsdiscounttp_v":
        sqlRecenica = `
            select 	max(s.id) id, e.text nevent, a."text" natt, tp."text" nprivilige, min(s."condition") condition, s.minfee, s.text, s.value, 
                    tp.code cprivilege,
                    e.text ||', '|| a."text" ||', ' text1,
                    tp."text" ||'- val: '|| coalesce(min(s."condition"), ' ')||', '||coalesce(s.minfee::text, ' ') text
            from 	tic_eventx_v e
            join 	tic_eventatts s on s.event = e.id 
            join 	tic_eventattx_v a on a.id = s.att and a.code like '09.01%'
                  and a.lang = '${lang || 'sr_cyr'}'
            left join 	tic_privilegex_v tp on trim(s.value) = tp.id::text
                  and tp.lang = '${lang || 'sr_cyr'}'    
            join  tic_docs ss on 	e.id = ss.event
                  and 	ss.id = ${objId}
            where e.lang = '${lang || 'sr_cyr'}'
            group by e."text" , a."text" , tp."text", s.minfee, s.text, s.value, tp.code
            `;
        break
      case "tic_docsnaknade_v":
        sqlRecenica = `
    select aa.doc id, aa.tgp, aa.taxrate, aa.art, a.code cart, a.text nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa."potrazuje") "potrazuje" , sum(aa.rightcurr) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_artx_v a on aa.art = a.id and a.lang = 'sr_cyr'
    join tic_arttp t on t.id = a.tp and t.code = 'Н'
    join tic_eventx_v e on e.id = aa.event
    group by aa.doc, aa.tgp, aa.taxrate, aa.art, a.code, a.text, e.text	
    union
    select aa.doc id, aa.printtgp, aa.printtax, aa.printid, aa.printcode cart, aa.printtext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.printfee) "potrazuje" , sum(aa.printfee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.printid != -1
    group by aa.doc, aa.printtgp, aa.printtax, aa.printid, aa.printcode, aa.printtext, e.text
    union
    select aa.doc id, aa.onlinetgp, aa.onlinetax, aa.onlineid, aa.onlinecode cart, aa.onlinetext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.onlinefee) "potrazuje" , sum(aa.onlinefee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.onlineid != -1
    group by aa.doc, aa.onlinetgp, aa.onlinetax, aa.onlineid, aa.onlinecode, aa.onlinetext, e.text
    union
    select aa.doc id, aa.reztgp, aa.reztax, aa.rezid, aa.rezcode cart, aa.reztext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.rezfee) "potrazuje" , sum(aa.rezfee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.rezid != -1
    group by aa.doc, aa.reztgp, aa.reztax, aa.rezid, aa.rezcode, aa.reztext, e.text
    union
    select aa.doc id, aa.pmtgp, aa.pmtax, aa.pmid, aa.pmcode cart, aa.pmtext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.pmfee) "potrazuje" , sum(aa.pmfee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.pmid != -1
    group by aa.doc, aa.pmtgp, aa.pmtax, aa.pmid, aa.pmcode, aa.pmtext, e.text
            `;
        break;
      case "tic_eventatts11l_v":
        sqlRecenica = `
          select t.code, t.text, o.text nvalue, o.code cvalue
          from tic_eventatts s
          join tic_eventatt t on t.id = s.att and t.code like '11.%'
          join cmn_obj o on o.id::text = s.value 
          where s.event =  ${objId} 
            `;
        break;
      case "tic_docdiscountvalue_v":
        sqlRecenica = `
          SELECT sum(s.discount) iznos
          FROM tic_docs s
          WHERE  s.doc = ${objId}
            `;
        break;
      case "tic_docdelivery_v":
        sqlRecenica = `
          select aa.*
          from  tic_docdelivery aa
          where  ${par1} = ${objId}
            `;
        break;
      case "tic_docseventartcena_v":
        sqlRecenica = `
          select c.id, c.text || ' - ' ||trunc(a.value)||' '||v.code text, trunc(a.value) value
          from tic_docs aa
          join	tic_doc z on aa.doc = z.id
          join tic_eventart d on aa.event = d.event and aa.art = d.art
          join tic_eventartcena a on a.eventart = d.id and z."date" between a.begda and a.endda 
          join  tic_cenax_v c on c.id = a.cena and c.lang = '${lang || 'sr_cyr'}'
          join cmn_curr v on v.id = a.curr 
          and aa.id = ${objId}
            `;
        break;
      case "tic_docsartikli_v":
        sqlRecenica = `
          select aa.id, aa.loc, aa.art, aa.tgp, aa.taxrate, aa.price , aa."input", aa."output" , aa.curr , aa.currrate, aa.site, aa.doc, aa.seat, aa.row,
          aa."duguje" , aa."potrazuje" , aa.leftcurr , aa.rightcurr, aa.begtm , aa.endtm , aa.status , aa.fee , aa.par, aa.descript, aa.discount,
          aa.cena, aa.reztm, aa.storno, aa.nart, aa."row", aa."label", aa.vreme, aa.ticket, aa.services, aa.tickettp, aa.delivery,
          aa.ulaz, aa.sector, aa.barcode, aa.online, aa.print, aa.pm, aa.rez, aa.sysuser,
          aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
          aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc,
          aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart,
          0 del, aa.docstorno
          from tic_docs aa
          join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
          join tic_artx_v a on aa.art = a.id and a.lang = '${lang || 'sr_cyr'}'
          join tic_arttp t on t.id = a.tp and t.code != 'Н'
          and aa.doc = d.id
            `;
        break;
      case "tic_docsartiklistorno_v":
        sqlRecenica = `
            select aa.id, aa.loc, aa.art, aa.tgp, aa.taxrate, aa.price , aa."input", aa."output" , aa.curr , aa.currrate, aa.site, aa.doc, aa.seat, aa.row,
            aa."duguje" , aa."potrazuje" , aa.leftcurr , aa.rightcurr, aa.begtm , aa.endtm , aa.status , aa.fee , aa.par, aa.descript, aa.discount,
            aa.cena, aa.reztm, aa.storno, aa.nart, aa."row", aa."label", aa.vreme, aa.ticket, aa.services, aa.tickettp, aa.delivery,
            aa.ulaz, aa.sector, aa.barcode, aa.online, aa.print, aa.pm, aa.rez, aa.sysuser,
            aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
            aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc,
            aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart,
            0 del, aa.docstorno
            from tic_docs aa
            join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
            join tic_artx_v a on aa.art = a.id and a.lang = '${lang || 'sr_cyr'}'
            join tic_arttp t on t.id = a.tp and t.code != 'Н'
            and aa.doc = d.id
            and aa.docstorno != 1
              `;
        break;
      case "tic_docsdiscountl_v":
        sqlRecenica = `
          select 	d.*, s.event, s.price, s."output"
          from 	  tic_docsdiscount d
          join    tic_docs s on s.id = d.docs
          where 	d.docs = ${objId} 
          `;
        break;
      case "cmn_par":
        sqlRecenica = `
          SELECT a.*, coalesce(b.text, a.text) textx, b.lang  
          FROM cmn_par a 
          left JOIN ( SELECT * FROM cmn_parx where lang = '${lang || 'sr_cyr'}') b
          ON a.id = b.tableid   
          where a.id = ${objId}
            `;
        break;
      case "tic_doc":
        sqlRecenica = `
          SELECT a.*  
          from  tic_doc a
          where a.id = ${objId}
            `;
        break;
      case "tic_chpermiss_v":
        sqlRecenica = `
          select o.id, o.code, o."text"
          from cmn_objx_v o
          join (
            select distinct s.obj
            from adm_userpermiss p, adm_rollx_v r, adm_rollstr s, cmn_objx_v o, adm_user u
            where r.id = p.roll
            and r.strukturna = 'D'
            and r.xparam = 'X'
            and r.id = s.roll
            and s.obj = o.id
            and p.usr = u.id
            AND u.id = CASE WHEN ${par1} = 1 THEN u.id ELSE ${par1} END
            ) a on o.id = a.obj
          where o.lang = '${lang || 'sr_cyr'}'
            `;
        break;
      case "cmn_getparbyuserid_v":
        sqlRecenica = `
          select p.*
          from cmn_parx_v p
          join adm_paruser ap on ap.par = p.id and ap.usr = ${objId}   
          where 	p.lang = '${lang || 'en'}'
            `;
        break;
      case "tic_eventattstp_v":
        sqlRecenica = `
          select aa.id , aa.site , aa.event , aa.value, aa.valid, a2.ddlist, aa.text, aa.color, aa.icon,aa.condition, aa.link, aa.minfee,
                a2.inputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'code', '${lang || 'sr_cyr'}') cinputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'text', '${lang || 'sr_cyr'}') ninputtp,
                a2.tp, getValueById(a2.tp, 'tic_eventatttpx_v', 'code', '${lang || 'sr_cyr'}') cttp, getValueById(a2.tp, 'tic_eventatttpx_v', 'text', '${lang || 'sr_cyr'}') nttp,
                aa.att, a2.code ctp, a2.text ntp, a2.description
          from	tic_eventatts aa, tic_eventattx_v a2
          where aa.event = ${objId}
          and   case ${par1} when '-1' then a2.tp else ${par1} end = a2.tp
          and   aa.att = a2.id
          and   a2.lang = '${lang || 'sr_cyr'}'
          order by a2.code
            `;
        break;
      case "tic_eventattscodevaluel_v":
        sqlRecenica =
          `
          select aa.id, a2.code catt, a2.text natt, a2.code, aa.value val1, aa.text val2, aa.condition val3, aa.link val4, aa.minfee val5
          from	tic_eventatts aa 
          join tic_eventattx_v a2 on  aa.att = a2.id and a2.code = '${par1}'
          where aa.event = ${objId}
            `;
        break;
      case "tic_doceventkupacbrojkartil_v":
        sqlRecenica =
          `
            select s.event, d.id, p."text", p.id, p.email, p.birthday, p.idnum, count(*) broj, 1 kupac
            from tic_docs s 
            join tic_doc d on d.id = s.doc
            join cmn_par p on d.usr = p.id 
            join tic_docsuid u on u.docs = s.id and u.first is not null
            where s.event = ${objId}
            and trim(d.status) not in ('4', '0')
            group by s.event, d.id, p."text", p.id, p.email, p.birthday, p.idnum
            union
            select s.event, d.id, p."text", p.id, p.email, p.birthday, p.idnum, count(*) broj, 1 kupac
            from tic_docs s 
            join tic_doc d on d.id = s.doc
            join cmn_par p on d.usr = p.id 
            where s.event = ${objId}
            and trim(d.status) =  '0'
            and TO_TIMESTAMP(d.endtm, 'YYYYMMDDHH24MISS') > NOW()
            group by s.event, d.id, p."text", p.id, p.email, p.birthday, p.idnum
            union
            select s.event, d.id, u.first||' '||u."last" text, u.par, u.email, u.birthday, u.uid, count(*) broj, 0 kupac
            from tic_docs s 
            join tic_doc d on d.id = s.doc
            join tic_docsuid u on u.docs = s.id and u.first is not null
            where s.event = ${objId}
            and trim(d.status) not in ('4', '0')
            group by s.event, d.id, u.first||' '||u."last", u.par, u.email, u.birthday, u.uid
            union
            select s.event, d.id, u.first||' '||u."last" text, u.par, u.email, u.birthday, u.uid, count(*) broj, 0 kupac
            from tic_docs s 
            join tic_doc d on d.id = s.doc
            join tic_docsuid u on u.docs = s.id and u.first is not null
            where s.event = ${objId}
            and trim(d.status) =  '0'
            and TO_TIMESTAMP(d.endtm, 'YYYYMMDDHH24MISS') > NOW()
            group by s.event, d.id, u.first||' '||u."last", u.par, u.email, u.birthday, u.uid
            `;
        break;
      case "tic_doceventsl_v":
        sqlRecenica =
          `
            select aa.event
            from	tic_docs aa
            where aa.doc = ${objId}
              `;
        break;
      default:
        console.error("Pogrešan naziv za view");
        return res.status(400).json({ message: "Invalid 'stm' parameter" });
    }

    console.log(sqlRecenica, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");

    const result = await db.query(sqlRecenica);
    const rows = result.rows;
    // switch (stm) {   
    //   case "tic_doc":
    //   case "cmn_par":
    //     item = rows[0];
    //     break;
    //   default:
    if (Array.isArray(rows)) {
      item = rows;
    } else {
      throw new Error(`Greška pri dohvatanju slogova iz baze: ${rows}`);
    }
    // }
    // console.log(stm, "IZLAZ xxxxxxxxxxx getAll xxxxxxxxxxxx", new Date().toLocaleString());
    res.status(200).json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Došlo je do greške u getAll`, error: err.message });
  }
};

const getValue = async (req, res) => {
  try {
    const {
      stm,
      objid: objId,
      sl: lang = 'sr_cyr',
      par1, par2, par3, par4, par5, par6, par7, par8, par9, par10
    } = req.query;

    let sqlRecenica = '';

    // Proveri vrednost `stm` i izvrši odgovarajući SQL upit
    switch (stm) {
      case "tic_agenda_v":
        sqlRecenica = `
          SELECT l.id, l.site, l.loctp2, l.loc2, l.tp, l.loctp1, t.code cloctp1, t.text nloctp1, 
                COALESCE(l.color, lx.color) color, l.loc1, lx.code cloc1, lx.text nloc1, l.begda, 
                l.endda, l.val, l.hijerarhija, l.onoff
          FROM cmn_loclink l
          JOIN cmn_loctpx_v t ON l.loctp1 = t.id AND t.lang = '${lang}'
          JOIN cmn_locx_v lx ON l.loc1 = lx.id AND lx.lang = '${lang}'
          WHERE l.loc2 = ${objId}
        `;
        break;

      default:
        console.error("Pogrešan naziv za view");
        return res.status(400).json({ message: "Invalid 'stm' parameter" });
    }

    // console.log(sqlRecenica, "***********************getValue***********************");

    const result = await db.query(sqlRecenica);
    const item = result.rows[0];

    res.status(200).json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Došlo je do greške u getValue`, error: err.message });
  }
};
function createInvoiceData(json1, json2) {
  // Mapiranje iz json1 za stavke s 'Г' oznakom
  const itemsG = json1.map(item => ({
    name: item.nart,
    labels: ['Г'],
    totalAmount: item.potrazuje,
    unitPrice: item.price,
    quantity: item.output
  }));

  // Mapiranje iz json2 za stavke s 'Ђ' oznakom
  const itemsDj = json2.map(item => ({
    name: item.nart,
    labels: ['Ђ'],
    totalAmount: item.potrazuje,
    unitPrice: item.potrazuje,
    quantity: 1.000
  }));

  // Kombinacija svih stavki u jedinstveni niz
  const allItems = [...itemsG, ...itemsDj];
  // console.log(allItems, "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
  // Izračunavanje ukupne sume za payment
  const totalAmount = allItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);
  // console.log(totalAmount, "11-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")

  // Kreiranje finalnog JSON-a
  const invoiceRequest = {
    invoiceType: 'Training',
    transactionType: 'Sale',
    payment: [
      {
        amount: totalAmount,
        paymentType: 'WireTransfer'
      }
    ],
    items: allItems,
    cashier: 'Marko TEST',
    buyerId: '11:2505979710072'
  };

  return invoiceRequest;
}
const getDataFiskal = async (req, res) => {
  try {
    const {
      stm,
      objid: objId,
      sl: lang = 'sr_cyr',
      par1, par2, par3, par4, par5, par6, par7, par8, par9, par10
    } = req.query;

    let itemK = null;
    let itemN = null;
    // Proveri vrednost `stm` i izvrši odgovarajući SQL upit
    const sqlRecenicaK = `
    select aa.id, aa.loc, aa.art, aa.tgp, aa.taxrate, aa.price , aa."input", aa."output" , aa.curr , aa.currrate, aa.site, aa.doc, aa.seat, aa.row,
    aa."duguje" , aa."potrazuje" , aa.leftcurr , aa.rightcurr, aa.begtm , aa.endtm , aa.status , aa.fee , aa.par, aa.descript, aa.discount,
    aa.cena, aa.reztm, aa.storno, aa.nart, aa."row", aa."label", aa.vreme, aa.ticket, aa.services, aa.tickettp, aa.delivery,
    aa.ulaz, aa.sector, aa.barcode, aa.online, aa.print, aa.pm, aa.rez, aa.sysuser,
    aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
    aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc,
    aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart,
    0 del
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_artx_v a on aa.art = a.id and a.lang = '${lang || 'sr_cyr'}'
    join tic_arttp t on t.id = a.tp and t.code != 'Н'
    and aa.doc = d.id
      `;
    // console.log(sqlRecenica, "***********************getValue***********************");
    const resultK = await db.query(sqlRecenicaK);
    if (Array.isArray(resultK.rows)) {
      itemK = resultK.rows;
    } else {
      throw new Error(`Greška pri dohvatanju slogova iz baze: ${rows}`);
    }

    // Proveri vrednost `stm` i izvrši odgovarajući SQL upit
    const sqlRecenicaN = `
    select aa.doc id, aa.tgp, aa.taxrate, aa.art, a.code cart, a.text nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa."potrazuje") "potrazuje" , sum(aa.rightcurr) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_artx_v a on aa.art = a.id and a.lang = 'sr_cyr'
    join tic_arttp t on t.id = a.tp and t.code = 'Н'
    join tic_eventx_v e on e.id = aa.event
    group by aa.doc, aa.tgp, aa.taxrate, aa.art, a.code, a.text, e.text	
    union
    select aa.doc id, aa.printtgp, aa.printtax, aa.printid, aa.printcode cart, aa.printtext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.printfee) "potrazuje" , sum(aa.printfee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.printid != -1
    group by aa.doc, aa.printtgp, aa.printtax, aa.printid, aa.printcode, aa.printtext, e.text
    union
    select aa.doc id, aa.onlinetgp, aa.onlinetax, aa.onlineid, aa.onlinecode cart, aa.onlinetext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.onlinefee) "potrazuje" , sum(aa.onlinefee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.onlineid != -1
    group by aa.doc, aa.onlinetgp, aa.onlinetax, aa.onlineid, aa.onlinecode, aa.onlinetext, e.text
    union
    select aa.doc id, aa.reztgp, aa.reztax, aa.rezid, aa.rezcode cart, aa.reztext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.rezfee) "potrazuje" , sum(aa.rezfee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.rezid != -1
    group by aa.doc, aa.reztgp, aa.reztax, aa.rezid, aa.rezcode, aa.reztext, e.text
    union
    select aa.doc id, aa.pmtgp, aa.pmtax, aa.pmid, aa.pmcode cart, aa.pmtext nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa.pmfee) "potrazuje" , sum(aa.pmfee) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_eventx_v e on e.id = aa.event
    where aa.pmid != -1
    group by aa.doc, aa.pmtgp, aa.pmtax, aa.pmid, aa.pmcode, aa.pmtext, e.text
            `;
    // console.log(sqlRecenica, "***********************getValue***********************");
    const resultN = await db.query(sqlRecenicaN);
    if (Array.isArray(resultK.rows)) {
      itemN = resultN.rows;
    } else {
      throw new Error(`Greška pri dohvatanju slogova iz baze: ${rows}`);
    }
    // console.log(stm, "IZLAZ xxxxxxxxxxx getAll xxxxxxxxxxxx", new Date().toLocaleString());
    const item = createInvoiceData(itemK, itemN);
    res.status(200).json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Došlo je do greške u getValue`, error: err.message });
  }
};

export default {
  getAll,
  getValue,
  getDataFiskal,
  createInvoiceData
};
