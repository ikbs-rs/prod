import axios from "axios";
//import https from 'https';

// funkcija za proveru ispravnosti JWT tokena za postojeci modul CMD.
export const checkJwt = async (req, res, next) => {
  try {
    const jwtServer = process.env.JWT_URL;
    const token = req.headers.authorization?.replace("Bearer ", "");
    //const agent = new https.Agent({ rejectUnauthorized: false });
    // console.log("*-*-*-*-*-Eve me*-*-*-*-**-*", jwtServer)

    if (!jwtServer) {
      throw new Error(
        "Adresa udaljenog servera nije definisana u .env datoteci."
      );
    } else {
        const checkJwtUrl = `${jwtServer}/checkJwt`;
        // console.log("*-*-*-*-*-checkJwtUrl*-*-*-*-*3333*-*", checkJwtUrl)
        const response = await axios.post(`${checkJwtUrl}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 25500 // vreme za koje se očekuje odgovor od udaljenog servera (u milisekundama)
        });
        // provera statusa odgovora
        // console.log(response.status, "*-*-*-*-*-response*-*-*-*-**-*", response.data.success)
        if (response.status === 200 && response.data.success) {
          // ako je JWT token ispravan, prelazimo na sledeći middleware
          req.userId = response.data.userId
          req.decodeJwt = response.data.decodeJwt
          // console.log("*-*-*-*-*-Kuku*-*-*-*-**-*")
          next();
        } else {
          // ako nije ispravan, vraćamo poruku o grešci
          return res
            .status(401)
            .json({ message: "Niste autorizovani za pristup ovom resursu." });
        }
    }
  } catch (error) {
    console.log(error.message , "*-*-*-*-*-checkJwt error*-*-*-*-**-*")
    // u slučaju greške, vraćamo objekat sa informacijama o grešci
    return res.status(error.response?.status || 500).json({
      message: error.message || "Internal Server Error",
      data: error.response?.data || {},
    });
  }
};

// Middleware funkcija za proveru prava, sa default parametrima
export const checkPermissions = (par1 = "1", par2 = "1") => {
  return async (req, res, next) => {
    try {
      // Dohvatam objekat i korisnika i prosledjujem dalje
      //const agent = new https.Agent({ rejectUnauthorized: false });
      const objName = req.objName;
      const userId = req.userId;
      const jwtServer = process.env.JWT_URL
      console.log(objName, userId, "######", jwtServer)

        // Prosleđujem zahtev udaljenom serveru
        const token = req.headers.authorization?.replace("Bearer ", "");
        const checkPermissionsUrl = `${jwtServer}/checkPermissions`;
        const response = await axios.post(checkPermissionsUrl, 
          {
            userId: req.userId,
            objName: objName,
            par1: par1,
            par2: par2
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );        
        if (response.status === 200 && response.data.allowed) {
          next();
        } else {
          return res
            .status(401)
            .json({ message: "Nemate pravo pristupa ovom resursu - roll." });
        }
    } catch (error) {
      console.log(error.message, "*-*-*-*-*-checkPermissions error*-*-*-*-**-*")
      // u slučaju greške, vraćamo objekat sa informacijama o grešci
      return res.status(error.response?.status || 500).json({
        message: error.message || "Internal  Server Error - roll",
        data: error.response?.data || {},
      });
    }
  };
};

