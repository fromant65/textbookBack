const PasswordRequest = require("../model/PasswordRequest");
const User = require("../model/User");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  port: 587, // port for secure SMTP
  secureConnection: false,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "textbook.back@hotmail.com",
    pass: "Admin.-1234",
  },
});

const sendMail = async (req, res) => {
  const frontEndLink = req.get("host");
  const username = req.body.username;
  const token = uuidv4();
  try {
    const user = await User.findOne({ username: username }).exec();
    if (!user) return res.json({ message: "Username not found" });

    const mailOptions = {
      from: "textbook.back@hotmail.com", // sender address
      to: user.email, // list of receivers
      subject: "Recuperar contraseña de Textbook",
      text: "",
      html: `<h2>Recupera tu contraseña de TextBook.</h2>
         <p>Haz click en <a href="${frontEndLink}/restore-password" target='_blank'>este link</a> para recuperar tu contraseña. 
         Dentro de el tendrás que ingresar el siguiente código de verificación: <br>${token}<br> 
         y luego tu nueva contraseña</p>`,
    };
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        res
          .status(500)
          .json({ message: `Hubo un error al enviar el mail: ${err}` });
      } else {
        const passReq = await PasswordRequest.create({
          username: username,
          token: token,
        });
        res.status(200).json({ success: "email sent" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  const code = req.body.code;
  const newPass = req.body.password;
  try {
    const passReq = await PasswordRequest.findOne({ code: code }).exec();
    if (!passReq) res.status(400).json({ message: "The code is not correct" });
    const hashedPwd = await bcrypt.hash(newPass, 10);
    //Update password
    const result = await User.findOneAndUpdate(
      { username: passReq.username },
      { password: hashedPwd }
    );
    PasswordRequest.findOneAndDelete({ code: code }, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Password Request : ", docs);
      }
    });
    res.status(201).json({ success: `Password has been updated` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendMail,
  update,
};
