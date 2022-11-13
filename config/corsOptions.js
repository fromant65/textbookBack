const whitelist = require("./whitelist");
const corsOptions = {
  origin: (origin, callback) => {
    //console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      //si el dominio está en la whitelist
      callback(null, true);
      //el primer argumento es un error, en este caso null
      //el segundo argumento determina si el origen del request está permitido o no
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = corsOptions;
