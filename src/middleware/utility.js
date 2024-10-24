import { Snowflake as snowflake } from "node-snowflake";

import { hostname } from "os";
import { createHash } from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Host ili virtuelni hostname
const virtualHost = hostname();
// Tekuci proces
const processId = process.pid.toString();
let timestamp
let data;
// Ip address db servera
const dataCentar = process.env.DATA_CENTAR;
let workerId;

// Generisanje novog Id na osnovu lokalnog okruzenje
export const uniqueId = async () => {
  timestamp = Date.now().toString();
  data = virtualHost + processId + timestamp;
  workerId = createHash("sha256").update(data).digest("hex");
  snowflake.init({
    worker_id: 1,
    data_center_id: dataCentar,
    sequence: processId,
  });

  return snowflake.nextId();
};

// Formira hijerarhijsku strukturu menija DFS, BFS ide po sirini i moze imati problema sa velikom kolicinom podataka
//
export const unflatten = (items) => {
  const rootItems = []
  const lookup = {}
  const stack = []

  // add all items to a lookup table indexed by id
  items.forEach(item => {
    const newItem = { ...item, childrenItems: [] }
    lookup[item.id] = newItem
  })

  // link each item to its parent
  items.forEach(item => {
    const parent = lookup[item.parentid]
    if (parent) {
      parent.childrenItems.push(lookup[item.id])
    } else {
      rootItems.push(lookup[item.id])
    }
  })

  // traverse the tree in DFS order and remove children from nodes that have only one child
  const visitNode = (node) => {
    stack.push(node)
    while (stack.length > 0) {
      const current = stack.pop()
      if (current.childrenItems.length === 1) {
        current.childrenItems = current.childrenItems[0].childrenItems
      } else {
        current.childrenItems.forEach(child => stack.push(child))
      }
    }
  }
    
  rootItems.forEach(visitNode)
    
  return rootItems
}

export const proveriJMBG = async (uJMBG) => {
  let A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13;
  let pKontrolniBroj, pIzlaz = 0;
  let pYY;

  if (uJMBG.charAt(4) === '0') {
      pYY = '20';
  } else {
      pYY = '1' + uJMBG.charAt(4);
  }

  if (uJMBG.length === 13) {
      // Validacija datuma (DDMMYYYY)
      let datum = uJMBG.substring(0, 4) + pYY + uJMBG.substring(5, 7);
      if (isValidDate(datum, 'DDMMYYYY')) {
          A1 = parseInt(uJMBG.charAt(0));
          A2 = parseInt(uJMBG.charAt(1));
          A3 = parseInt(uJMBG.charAt(2));
          A4 = parseInt(uJMBG.charAt(3));
          A5 = parseInt(uJMBG.charAt(4));
          A6 = parseInt(uJMBG.charAt(5));
          A7 = parseInt(uJMBG.charAt(6));
          A8 = parseInt(uJMBG.charAt(7));
          A9 = parseInt(uJMBG.charAt(8));
          A10 = parseInt(uJMBG.charAt(9));
          A11 = parseInt(uJMBG.charAt(10));
          A12 = parseInt(uJMBG.charAt(11));
          A13 = parseInt(uJMBG.charAt(12));

          pKontrolniBroj = (A1 * 7 + A2 * 6 + A3 * 5 + A4 * 4 + A5 * 3 + A6 * 2 +
                            A7 * 7 + A8 * 6 + A9 * 5 + A10 * 4 + A11 * 3 + A12 * 2) % 11;

          if (pKontrolniBroj > 1) {
              if (11 - pKontrolniBroj === A13) {
                  pIzlaz = 1;
              }
          } else {
              if (pKontrolniBroj === A13) {
                  pIzlaz = 1;
              }
          }
      }
  }

  return pIzlaz;
}

// Pomoćna funkcija za validaciju datuma
function isValidDate(date, format) {
  const day = parseInt(date.substring(0, 2));
  const month = parseInt(date.substring(2, 4));
  const year = parseInt(date.substring(4, 8));

  // Provera datuma (osnovna provera bez dodatnih biblioteka)
  const dateObj = new Date(year, month - 1, day);
  return dateObj && (dateObj.getMonth() + 1) === month && dateObj.getDate() === day;
}

export { virtualHost, processId };

