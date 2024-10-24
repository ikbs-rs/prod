import fHelper from "../helpers/fHelper.js";


const useFunction = async (req, res) => {
  try {
    const item = await fHelper.useFunction( req.query.stm, req.query.objname, req.query.objid, req.query.sl||'en');
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getLista sController ${req.query.objname}`, error: err.message });
  }
};


export default {
  useFunction,
};
