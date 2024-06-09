const nodemailer = require("nodemailer");
require("dotenv").config();

const replaceInString = (str, replaceObject) => {
  var keys = Object.keys(replaceObject);
  var replaceStr = str;
  for (var i = 0; i < keys.length; i++) {
    var regex = new RegExp("__" + keys[i] + "__", "g");
    replaceStr = replaceStr.replace(regex, replaceObject[keys[i]]);
  }
  return replaceStr;
};

const setTransport = (settings) => {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "shubhamtalreja2@gmail.com",
      pass: "",
    },
  });
};

const mailOptions = {
  from: {
    name: "IT Management",
    address: "shubhamtalreja2@gmail.com",
  },
  to: ["shubhamtalreja2@gmail.com"],
  subject: "Hello, this is a subject",
  text: "Hello, this is a test text",
  html: "<p>This is a paragraph</p>",
};

const transporter = setTransport();

const sendMail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email has been sent successfully");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { replaceInString, setTransport };
// sendMail(transporter, mailOptions);
