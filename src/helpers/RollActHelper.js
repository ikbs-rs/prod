import { getRolls, checkActions } from "../models/RollAct.js"

const getRollPermissions = async (objName, par1, par2) => {
    try {
        const rollPermission = await getRolls(objName, par1, par2);
        return rollPermission;
    } catch (err) {
        throw new Error(`Greška prilikom provere prava uH_singin: ${err.message}`);
    }
};

const checkAction = async (objName) => {
    try {
        const OK = await checkActions(objName);
        return OK;
    } catch (err) {
        throw new Error(`Greška prilikom provere prava uH_singin: ${err.message}`);
    }
};

export default {
    getRollPermissions,
    checkAction,
};