import rollAct from "../../helpers/RollActHelper.js";
import { checkUserPermissions } from "../../helpers/userpermissHelper.js";
import abstructHelper from "../../helpers/abstructHelper.js";

// funkcija za proveru dozvola korisnika
const proveraDozvola = async (userId, objName, par1, par2, callback) => {
  console.log("roll.proveraDozvola=======================================*****03.1**", par1, userId)
    try {
      let OK = false;
      let role = [];

      //Provera da li postoji akcija, ako ne inertuje se u tabelu
      const action = await rollAct.checkAction(objName);

      // Postoji samo jedan admin user za koga se ne proveravaju prava, on sluzi za inicijalizaciju
      const admin = await abstructHelper.getItem('adm_user', 'admin', userId)
      console.log("roll.proveraDozvola=======================================*****03.2**", par1, userId, objName, admin)
      //*****************!!!!!!!! OVO VRATITI 
      if (admin.admin==1) return true      
      
      // Dohvatam prvo sve role dodeljene toj akciji i tim pravima CRUDX
      const rollPermission = await rollAct.getRollPermissions(objName, par1, par2);
      if (rollPermission) {
        OK = true;
        role = rollPermission;
      }
      console.log("roll.proveraDozvola=======================================****03.3**", rollPermission, role, objName, par1)

      if (OK) { 
        // Ako postoji rola onda se proverava da li je data trenutnom korisniku
        const userPermission = await checkUserPermissions(userId, role);
        console.log("roll.proveraDozvola=======================================****03.4**", userPermission, role)
        if (userPermission) {
          // if (callback) {
          //   callback(null, true);
          //   next()
          // }
          console.log("roll.proveraDozvola=======================================****03.5**", userPermission)
          return true;
        } else {
          // if (callback) {
          //   callback(null, false);
          //   next()
          // }
          console.log("roll.proveraDozvola==================NO=====================****03.5**", userPermission)
          return false;
        }
      } else {
        // if (callback) {
        //   callback(null, false);
        //   next()
        // }
        return false;
      }
    } catch (error) {
      throw new Error(`Sistemska greska prilikom provere dozvola -roll: ${error.message}`);
    }
  };

export default {
  proveraDozvola,
}
