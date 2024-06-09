const bcrypt = require("bcrypt");
const UserModel = require("../model/UserModel");
const { v4: uuidv4 } = require("uuid");
const ticketModel = require("../model/ticketModel");
const fs = require("fs");
const userTicketModel = require("../model/UserTicketModel");
const CommentCounterModel = require("../model/CounterModel");
const counterModel = require("../model/CounterModel");
const commentModel = require("../model/commentModel");
const SettingsModal = require("../model/SettingsModal");
const Profile = require("../model/profileImageModal");
var jwt = require("jsonwebtoken");
const logger = require("../logger");
const nodemailer = require("nodemailer");
const excel = require("exceljs");
const { replaceInString, setTransport } = require("../utils");
const { validate } = require("../validate");

require("dotenv").config({ path: "./config/secrets.env" });
const JWT_KEY = process.env.JWT_KEY;

//********************USER METHODS****************************** */
const register = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(403)
        .send({ message: "Authorization token not present." });
    } else if (token) {
      const token = req.headers.authorization.split(" ")[1];
      const userInfo = jwt.verify(token, JWT_KEY);
      if (userInfo.role == "admin") {
        const { name, email, password, role, employeeID } = req.body;
        if (!name || !email || !password || !role || !employeeID) {
          return res
            .status(400)
            .send({ message: "Missing required parameters" });
        } else {
          const existingUser = await UserModel.findOne({ employeeID });
          if (existingUser) {
            return res.status(400).send({
              message: "An account with this employee ID already exists",
            });
          } else {
            bcrypt.hash(password, 6, async function (err, hash) {
              if (err) {
                logger.error(
                  `Can not hash password ${password} ${err.message}`
                );
                return res.status(500).send({
                  message:
                    "Unable to create user account at this time. Please try again later.",
                });
              }
              const user = new UserModel({
                name,
                email: email.toLowerCase(),
                password: hash,
                role,
                employeeID,
                id: uuidv4(),
              });
              await user.save();
            });
            res.status(201).send({ message: "Sign up is successfull" });
            logger.info(
              `Sign up Successful ${req.body} by ${userInfo.role} ${userInfo.name}`
            );
          }
        }
      } else {
        return res
          .status(403)
          .send({ message: "You are not authorized to create new users." });
      }
    }
  } catch (error) {
    logger.error(`Error in creating user account ${error.message}`);
    res.status(500).send({
      message:
        "Unable to create user account at this time. Please try again later.",
    });
  }
};
const Settings = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(403)
        .send({ message: "Authorization token not present." });
    } else if (token) {
      const token = req.headers.authorization.split(" ")[1];
      const userInfo = jwt.verify(token, JWT_KEY);
      if (userInfo.role == "admin") {
        const { Host, port, email, password } = req.body;
        const existingUser = await SettingsModal.findOne({ email });
        if (existingUser) {
          return res.status(400).send({
            message: "An account with this employee ID already exists",
          });
        }
        const settings = new SettingsModal({
          Host,
          port,
          email,
          password,
        });
        const savedSettings = await settings.save();
        res.status(201).json(savedSettings);
      } else {
        return res.status(403).send({
          message: "You are not authorized to create mail transpoter.",
        });
      }
    }
  } catch (error) {
    logger.error(`Error in creating user account ${error.message}`);
    res.status(500).send({
      message:
        "Unable to create mail transporter at this time. Please try again later.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Missing required parameters" });
    }
    const errors = validate(req.body);

    if (Object.keys(errors).length !== 0) {
      return res.status(400).send({ message: "Validation errors", errors });
    }
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.error(`User ${user} is not a member of organization`);
      return res.status(401).send({ message: "Invalid credentials " });
    }
    const { id: userId, name, role, employeeID, password: Password } = user;
    const hash = Password;
    bcrypt.compare(password, hash, async (err, result) => {
      if (result) {
        const images = await Profile.find({ userId, role });
        const imageUrls = images.map((image) => image.profileImage);
        const tokenPayload = {
          email: email.toLowerCase(),
          userId,
          role,
          name,
          employeeID,
          password: Password,
          userImageURL: imageUrls ? imageUrls[0] : null,
        };
        var token = jwt.sign(tokenPayload, JWT_KEY);
        logger.info(`login success ${email}`);
        return res.status(201).send({ message: "login success", token: token });
      } else {
        logger.error(`Invalid credentials ${email}`);
        return res.status(401).send({ message: "Invalid credentials " });
      }
    });
  } catch (err) {
    logger.error(`Error in login: ${err}`);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const getuserDetails = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "user" });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
const getUserEmail = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the database to find the user by ID
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's email
    res.status(200).json({ email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
const getAllUserEmails = async (req, res) => {
  try {
    // Query the database to find all users
    const users = await UserModel.find({}, { email: 1 }); // Only retrieve the 'email' field

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Extract emails from the array of users
    const emails = users.map((user) => user.email);

    // Return the list of emails
    res.status(200).json({ emails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAdminEmail = async (req, res) => {
  try {
    const adminUsers = await UserModel.find({ role: "admin" }, { email: 1 });

    if (!adminUsers || adminUsers.length === 0) {
      return res.status(404).json({ message: "No admin users found" });
    }

    const emails = adminUsers.map((user) => user.email);

    res.status(200).json({ emails });
    logger.info("Getting admin emails");
  } catch (error) {
    logger.error(`Error while fetching admin emails: ${error.message}`);
    res.status(500).json({ message: "Error while fetching admin emails" });
  }
};
const getAdminEmailsForMail = async () => {
  try {
    const adminUsers = await UserModel.find({ role: "admin" }, { email: 1 });

    if (!adminUsers || adminUsers.length === 0) {
      return [];
    }

    return adminUsers.map((user) => user.email);
  } catch (error) {
    logger.error(`Error while fetching admin emails: ${error.message}`);
    return [];
  }
};
const getAdminNameForMail = async () => {
  try {
    const adminUsers = await UserModel.find({ role: "admin" }, { name: 1 });

    if (!adminUsers || adminUsers.length === 0) {
      return [];
    }

    return adminUsers.map((user) => user.name);
  } catch (error) {
    logger.error(`Error while fetching admin emails: ${error.message}`);
    return [];
  }
};

const getITEmailsForMail = async () => {
  try {
    const ITUsers = await UserModel.find({ role: "it" }, { email: 1 });

    if (!ITUsers || ITUsers.length === 0) {
      return [];
    }

    return ITUsers.map((user) => user.email);
  } catch (error) {
    logger.error(`Error while fetching admin emails: ${error.message}`);
    return [];
  }
};

const getITNameForMail = async () => {
  try {
    const ITUsers = await UserModel.find({ role: "it" }, { name: 1 });

    if (!ITUsers || ITUsers.length === 0) {
      return [];
    }

    return ITUsers.map((user) => user.name);
  } catch (error) {
    logger.error(`Error while fetching admin emails: ${error.message}`);
    return [];
  }
};

const getUserNameForMail = async () => {
  try {
    const Users = await UserModel.find({ role: "user" }, { name: 1 });

    if (!Users || Users.length === 0) {
      return [];
    }

    return Users.map((user) => user.name);
  } catch (error) {
    logger.error(`Error while fetching admin emails: ${error.message}`);
    return [];
  }
};
const getUserEmailsForMail = async () => {
  try {
    const Users = await UserModel.find({ role: "user" }, { email: 1 });

    if (!Users || Users.length === 0) {
      return [];
    }

    return Users.map((user) => user.email);
  } catch (error) {
    logger.error(`Error while fetching admin emails: ${error.message}`);
    return [];
  }
};

const getITEmail = async (req, res) => {
  try {
    const ITUsers = await UserModel.find({ role: "it" }, { email: 1 });

    if (!ITUsers || ITUsers.length === 0) {
      return res.status(404).json({ message: "No IT users found" });
    }

    const emails = ITUsers.map((user) => user.email);

    res.status(200).json({ emails });
    logger.info("Getting IT emails");
  } catch (error) {
    logger.error(`Error while fetching IT emails: ${error.message}`);
    res.status(500).json({ message: "Error while fetching IT emails" });
  }
};

const getUsersEmail = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "user" }, { email: 1 });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No  users email found" });
    }

    const emails = users.map((user) => user.email);

    res.status(200).json({ emails });
    logger.info("Getting user emails");
  } catch (error) {
    logger.error(`Error while fetching user emails: ${error.message}`);
    res.status(500).json({ message: "Error while fetching user emails" });
  }
};

const getUserCount = async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments({
      role: { $in: ["user", "admin", "it"] },
    });
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const Delete = async (req, res) => {
  try {
    if (res.locals.role === "admin") {
      let { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "id is required" });
      }
      id = id.trim();
      const users = await UserModel.findOneAndDelete({ _id: id });
      res
        .status(201)
        .send({ message: "user has successfully deleted", user: users });
      logger.warn(`Delete User Successful ${req.body}`);
    } else {
      res.status(401).send({ message: "Unauthorized" });
      logger.info(`User is unauthorised ${req.body}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const { image, role } = req.body;
    if (!image) {
      return res.status(400).json({ message: "image is required" });
    }
    const user = await Profile.findOneAndDelete({
      profileImage: image,
      role,
    });
    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }
    res.status(201).send({ message: `${role} has been deleted`, user });
    logger.warn(`Delete ${role} Successful ${req.body}`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const { email, old_password, new_password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    logger.warn(`User not found ${email}`);
    return res.send("Invalid email");
  }
  const hash = user.password;
  const userId = user._id;
  bcrypt.compare(old_password, hash, function (err, result) {
    if (result) {
      bcrypt.hash(new_password, 6, async function (err, hashNewPassword) {
        await UserModel.updateOne(
          { _id: userId },
          { password: hashNewPassword }
        );
        logger.info(`Password updated of ${email}`);
        res.send("updated");
      });
    } else {
      logger.warn(`Invalid Credentials ${req.body}`);
      return res.send("Invalid credentials ");
    }
  });
};

const itMember = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "it" });
    res.status(201).json(users);
    logger.info("Fetching IT members...");
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
const itMemberCount = async (req, res) => {
  try {
    const count = await UserModel.countDocuments({ role: "it" });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const singleUser = async (req, res) => {
  try {
    const { employeeID } = req.query;
    if (!employeeID) {
      return res.status(400).json({ message: "employeeID is required" });
    }
    const user = await UserModel.findOne({ employeeID: employeeID });
    res.status(201).json(user);
    logger.info(`Fetching user ${employeeID}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const editUser = async (req, res) => {
  try {
    if (res.locals.role === "admin") {
      const { employeeID, name, email, role } = req.body;
      if (!employeeID || !name || !email || !role) {
        return res.status(400).send({ message: "Missing required parameters" });
      }
      const user = await UserModel.findOneAndUpdate(
        { employeeID: employeeID },
        {
          role,
          name,
          email,
        },
        { new: true }
      );
      res.status(201).json({ user: user, message: "User Updated" });
      logger.info(`User Updated Successfully ${req.body}`);
    } else {
      res.status(401).json({ message: "Unauthorized" });
      logger.info(`User is unauthorised ${req.body}`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const editprofile = async (req, res) => {
  try {
    if (res.locals.role === "user" || res.locals.role === "it") {
      const { employeeID, name, email, role } = req.body;
      if (!employeeID || !name || !email || !role) {
        return res.status(400).send({ message: "Missing required parameters" });
      }
      const user = await UserModel.findOneAndUpdate(
        { employeeID: employeeID },
        {
          role,
          name,
          email,
        },
        { new: true }
      );
      res.status(201).json({ user: user, message: "User Updated" });
      logger.info(`User Updated Successfully ${req.body}`);
    } else {
      res.status(401).json({ message: "Unauthorized" });
      logger.info(`User is unauthorised ${req.body}`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
const Geteditprofile = async (req, res) => {
  try {
    if (
      res.locals.role === "user" ||
      res.locals.role === "it" ||
      res.locals.role === "admin"
    ) {
      const { employeeID } = req.query;
      if (!employeeID) {
        return res.status(400).send({ message: "Missing required parameters" });
      }
      const user = await UserModel.findOne({ employeeID });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ name: user.name });
      logger.info(`User Profile Retrieved Successfully: ${user.name}`);
    } else {
      res.status(401).json({ message: "Unauthorized" });
      logger.info(`User is unauthorized`);
    }
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const sendPasswordLink = async (req, res) => {
  try {
    const { email, url } = req.body;

    if (!email) {
      return res
        .status(401)
        .json({ message: "Enter your email address", status: 401 });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.error(`User ${user} is not a member of organization`);
      return res.status(401).send({ message: "Invalid Credentials " });
    }
    var token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: "1d" });
    const setUserToken = await UserModel.findByIdAndUpdate(
      { _id: user._id },
      { verifyToken: token },
      { new: true }
    );
    if (setUserToken) {
      let invoiceTemplate = await new Promise((resolve, reject) => {
        fs.readFile(
          process.cwd() + "/Template/sendforgetpasswordemail.html",
          "utf8",
          function (err, data) {
            if (err) throw err;
            resolve(data);
          }
        );
      });
      let htmlfile = invoiceTemplate.toString();
      const mailObject = {
        USERID: user.id,
        "SETUSERTOKEN.VERIFYTOKEN": setUserToken.verifyToken,
        Host: url,
      };
      const updatedHTML3 = replaceInString(htmlfile, mailObject);
      const settings = await getSettings();
      const mailOptions = {
        from: settings.email,
        to: email,
        subject: "Email for password reset",
        html: updatedHTML3,
      };
      const transporter = setTransport(settings);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(401).json({ message: "email not sent" });
        } else {
          res.status(201).json({ message: "Email sent successfully" });
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

const sendemailtoadminandit = async (req, res) => {
  try {
    if (res.locals.role === "user") {
      const {
        email,
        priority,
        description,
        title,
        ticketId,
        // itEmails,
        // adminemail,
        reporter,
        status,
        // adminEmails,
        // emailList,
      } = req.body;

      if (
        !email ||
        !priority ||
        !description ||
        !title ||
        !ticketId ||
        // !itEmails ||
        !reporter
        // !status ||
        // !adminEmails
        // !emailList
      ) {
        return res.status(400).send({ message: "Missing required parameters" });
      }
      const adminEmails = await getAdminEmailsForMail();
      const itEmails = await getITEmailsForMail();
      const user = await UserModel.findOne({ email });

      if (!user) {
        logger.error(
          `User with email ${email} is not a member of the organization`
        );
        return res.status(401).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: "1d" });

      const setUserToken = await UserModel.findByIdAndUpdate(
        { _id: user._id },
        { verifyToken: token },
        { new: true }
      );

      if (setUserToken) {
        let invoiceTemplate = await new Promise((resolve, reject) => {
          fs.readFile(
            process.cwd() + "/Template/adminemail.html",
            "utf8",
            function (err, data) {
              if (err) reject(err);
              resolve(data);
            }
          );
        });

        const mailObject = {
          USERNAME: user.name,
          TICKETID: ticketId,
          TITLE: title,
          DESCRIPTION: description,
          PRIORITY: priority,
        };

        const updatedHTML = replaceInString(invoiceTemplate, mailObject);

        const settings = await getSettings();
        const mailOptions = {
          from: settings.email,
          to: [adminEmails, ...itEmails],
          subject: `Ticket number ${ticketId}`,
          html: updatedHTML,
        };

        const transporter = setTransport(settings);

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            logger.error(`Error sending email: ${error}`);
            res.status(401).json({ message: "Email not sent", status: 401 });
          } else {
            res
              .status(201)
              .json({ message: "Email sent successfully", status: 201 });
          }
        });
      }
    } else {
      res.status(403).json({
        message: "You do not have permission to perform this action",
        status: 403,
      });
    }
  } catch (err) {
    logger.error(`Error in sendemailtoadminandit: ${err}`);
    logger.info(err + "gghy");
    console.log("hello error" + err);
    res.status(500).json({ message: err, status: 500 });
  }
};

const getSettings = async () => {
  try {
    return await SettingsModal.findOne();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
};

const sendemailtoadminanditaboutcomment = async (req, res) => {
  try {
    if (res.locals.role === "user") {
      const { email, ticketId } = req.body;
      if (!email || !ticketId) {
        return res.status(400).send({ message: "Missing required parameters" });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        logger.error(`User ${user} is not a member of organization`);
        return res.status(401).send({ message: "Invalid Credentials " });
      }
      const adminEmails = await getAdminEmailsForMail();
      const itEmails = await getITEmailsForMail();
      var token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: "1d" });
      const setUserToken = await UserModel.findByIdAndUpdate(
        { _id: user._id },
        { verifyToken: token },
        { new: true }
      );
      if (setUserToken) {
        let invoiceTemplate = await new Promise((resolve, reject) => {
          fs.readFile(
            process.cwd() + "/Template/commentdetailToAdminandIt.html",
            "utf8",
            function (err, data) {
              if (err) throw err;
              resolve(data);
            }
          );
        });
        let htmlfile = invoiceTemplate.toString();
        const mailObject = {
          USERNAME: user.name,
          TICKETID: ticketId,
        };
        const updatedHTML = replaceInString(htmlfile, mailObject);
        const settings = await getSettings();

        const mailOptions = {
          from: settings.email,
          to: [adminEmails, ...itEmails],
          subject: `Ticket number ${ticketId}`,
          html: updatedHTML,
        };

        const transporter = setTransport(settings);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(401).json({ message: "email not sent", status: 401 });
          } else {
            res
              .status(201)
              .json({ message: "Email sent successfully", status: 201 });
          }
        });
      }
    } else {
      res.status(403).json({
        message: "You do not have permission to perform this action",
        status: 403,
      });
    }
  } catch (err) {
    logger.error(`Error in sendemailtoadminandit: ${err}`);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

const sendemailtoitanduser = async (req, res) => {
  try {
    if (res.locals.role === "admin") {
      const {
        email,
        reporter,
        // emailList,
        // nameList,
        ticketId,
        // itName,
        // itemailList,
        assigneeeName,
      } = req.body;

      if (
        !email ||
        !reporter ||
        // !emailList ||
        // !nameList ||
        !ticketId ||
        // !itName ||
        // !itemailList ||
        !assigneeeName
      ) {
        return res.status(400).send({ message: "Missing required parameters" });
      }
      const itEmails = await getITEmailsForMail();
      const userEmails = await getUserEmailsForMail();
      const itNameList = await getITNameForMail();
      const userNameList = await getUserNameForMail();
      // console.log(userNameList)
      const user = await UserModel.findOne({ email });

      if (!user) {
        logger.error(`User ${user} is not a member of the organization`);
        return res
          .status(401)
          .json({ message: "Invalid credentials", status: 401 });
      }

      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: "1d" });
      await UserModel.findByIdAndUpdate(
        { _id: user._id },
        { verifyToken: token },
        { new: true }
      );

      const toReporterEmailList = userEmails.filter(
        (e, i) => userNameList[i] === reporter
      );
      const toITEmailList = itEmails.filter(
        (e, i) => itNameList[i] === assigneeeName
      );

      const invoiceTemplate = await new Promise((resolve, reject) => {
        fs.readFile(
          process.cwd() + "/Template/sendemailbyadmintouser.html",
          "utf8",
          function (err, data) {
            if (err) reject(err);
            resolve(data);
          }
        );
      });
      const mailObject = {
        USERNAME: user.name,
        REPORTER: user.name,
        TICKETID: ticketId,
      };

      const mailObjectIt = {
        USERNAME: user.name,
        REPORTER: assigneeeName,
        TICKETID: ticketId,
      };
      const updatedHTML = replaceInString(invoiceTemplate, mailObject);
      const updatedHTMLIt = replaceInString(invoiceTemplate, mailObjectIt);
      const settings = await getSettings();

      const mailOptionsReporter = {
        from: settings.email,
        to: toReporterEmailList,
        subject: `Ticket number ${ticketId}`,
        html: updatedHTML,
      };
      const mailOptionsIT = {
        from: settings.email,
        to: toITEmailList,
        subject: `Ticket number ${ticketId}`,
        html: updatedHTMLIt,
      };
      const transporter = setTransport(settings);

      const [reporterResponse, itResponse] = await Promise.all([
        transporter.sendMail(mailOptionsReporter),
        transporter.sendMail(mailOptionsIT),
      ]);

      if (
        reporterResponse.accepted.length > 0 &&
        itResponse.accepted.length > 0
      ) {
        return res
          .status(201)
          .json({ message: "Email sent successfully", status: 201 });
      } else {
        return res.status(401).json({ message: "Email not sent", status: 401 });
      }
    } else {
      res.status(403).json({
        message: "You do not have permission to perform this action",
        status: 403,
      });
    }
  } catch (err) {
    logger.error(`Error sending email: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 500 });
  }
};

const sendemailtouserandadmin = async (req, res) => {
  try {
    if (res.locals.role === "it") {
      const {
        email,
        reporter,
        ticketId,
        // adminEmails,
        // emailList,
        // nameList,
        // adminName,
      } = req.body;

      if (
        !email ||
        !reporter ||
        // !emailList ||
        // !nameList ||
        !ticketId
        // !adminEmails ||
        // !emailList ||
        // !nameList
      ) {
        return res.status(400).send({ message: "Missing required parameters" });
      }
      const adminEmails = await getAdminEmailsForMail();

      const emailList = await getUserEmailsForMail();

      const nameList = await getUserNameForMail();
      const adminName = await getAdminEmailsForMail();
      const user = await UserModel.findOne({ email });
      if (!user) {
        logger.error(`User ${user} is not a member of the organization`);
        return res
          .status(401)
          .json({ message: "Invalid credentials", status: 401 });
      }

      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: "1d" });
      await UserModel.findByIdAndUpdate(
        { _id: user._id },
        { verifyToken: token },
        { new: true }
      );
      const toReporterEmailList = emailList.filter(
        (e, i) => nameList[i] === reporter
      );
      const toadminEmailList = adminEmails;
      const invoiceTemplate = await new Promise((resolve, reject) => {
        fs.readFile(
          process.cwd() + "/Template/sendmailbyittouser.html",
          "utf8",
          function (err, data) {
            if (err) reject(err);
            resolve(data);
          }
        );
      });
      const mailObject = {
        REPORTER: reporter,
        TICKETID: ticketId,
      };
      for (let i = 0; i < adminName.length; i++) {
        const mailObjectAdmin = {
          REPORTER: adminName[i],
          TICKETID: ticketId,
        };
        const updatedHTMLAdmin = replaceInString(
          invoiceTemplate,
          mailObjectAdmin
        );
        const settings = await getSettings();
        const mailOptionsAdmin = {
          from: settings.email,
          to: toadminEmailList[i],
          subject: `Ticket number ${ticketId}`,
          html: updatedHTMLAdmin,
        };
        const transporter = setTransport(settings);
        const adminResponse = await transporter.sendMail(mailOptionsAdmin);

        if (adminResponse.accepted.length === 0) {
          return res
            .status(401)
            .json({ message: "Email not sent", status: 401 });
        }
      }
      const settings = await getSettings();
      const updatedHTML2 = replaceInString(invoiceTemplate, mailObject);
      const mailOptionsReporter = {
        from: settings.email,
        to: toReporterEmailList,
        subject: `Ticket number ${ticketId}`,
        html: updatedHTML2,
      };
      const transporter = setTransport(settings);
      const [reporterResponse, itResponse] = await Promise.all([
        transporter.sendMail(mailOptionsReporter),
      ]);

      if (reporterResponse.accepted.length > 0) {
        return res
          .status(201)
          .json({ message: "Email sent successfully", status: 201 });
      } else {
        return res.status(401).json({ message: "Email not sent", status: 401 });
      }
    } else {
      res.status(403).send({
        message: "You do not have permission to perform this action",
        status: 403,
      });
    }
  } catch (err) {
    logger.error(`Error sending email: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 500 });
  }
};

const forgotPasswordHandler = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user = await UserModel.findOne({ id: id, verifyToken: token });
    const varifytoken = jwt.verify(token, JWT_KEY);

    if (user && varifytoken._id) {
      res.status(201).json({ status: 201, message: "valid user" });
    } else if (!user) {
      logger.error(`User ${user} is not a member of organization`);
      return res.status(401).send({ message: "Invalid credentials " });
    }
  } catch (err) {
    console.log(err);
  }
};

const changePasswordHandler = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await UserModel.findOne({ id: id, verifyToken: token });
    const varifytoken = jwt.verify(token, JWT_KEY);
    if (user && varifytoken._id) {
      const hashNewPassword = await bcrypt.hash(password, 6);
      const setNewUserPass = await UserModel.findOneAndUpdate(
        { id: id },
        { password: hashNewPassword }
      );
      setNewUserPass.save();
      res.status(201).send(setNewUserPass);
    } else {
      res.status(400).json({ message: "Invalid credentials", status: 400 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
};

//******************************************************* */

//***********************TICKET METHODS************************** */

const create = async (req, res) => {
  const { description, title, priority } = req.body;
  const file = req.file;
  if (file) {
    const userTicket = userTicketModel({
      description,
      title,
      priority,
      images: {
        data: fs.readFileSync("upload/" + filename),
        contentType: "image/png",
      },
    });
    userTicket.save();
    res.send("Ticket created successfully");
    logger.info("Ticket created successfully");
  } else {
    const userTicket = userTicketModel({
      description,
      title,
      priority,
    });
    userTicket.save();
    res.send("Ticket created successfully");
    logger.info("Ticket created successfully");
  }
};

const postImage = async (req, res) => {
  try {
    const { role, userId } = req.body;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      const imageUrl = url + "/upload/" + req.file.filename;

      let profile;
      try {
        profile = await Profile.findOneAndUpdate(
          { userId, role },
          { profileImage: imageUrl },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
      }

      res.status(201).send({ message: "Data is saved", profile });
    } else {
      res.status(400).send({ message: "Upload an image" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getProfileImages = async (req, res) => {
  try {
    const { role, userId } = req.query;
    const images = await Profile.find({ userId, role });
    res.json({ imageUrls: images.map((image) => image.profileImage) });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getProfileImages_for_Avatar = async (req, res) => {
  try {
    const { role, userId } = req.query;
    const images = await Profile.find({ userId, role });
    res.json({ imageUrls: images.map((image) => image.profileImage) });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const postTicket = async (req, res) => {
  try {
    const {
      name,
      status,
      employeeID,
      description,
      title,
      priority,
      ticketId,
      id,
      comment,
      assignee,
      reporter,
      reporterId,
    } = req.body;
    //logger.info(req.body);
    // console.log(reporter)
    if (req.files) {
      if (assignee && !status) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              assignee: {
                name: assignee.name,
                employeeID: assignee.employeeID,
              },
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else if (status && !assignee) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              status,
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else if (assignee && status) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              assignee: {
                name: assignee.name,
                employeeID: assignee.employeeID,
              },
              status,
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else if (comment) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else {
        const reqFiles = [];
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          reqFiles.push(url + "/upload/" + req.files[i].filename);
        }
        counterModel.findOneAndUpdate(
          { id: "autoval" },
          { $inc: { seq: 1 } },
          { new: true },
          async (err, cd) => {
            let seqId;
            if (cd == null) {
              const newval = new counterModel({ id: "autoval", seq: 1 });
              newval.save();
              seqId = 1;
            } else {
              seqId = cd.seq;
            }
            const ticket = new ticketModel({
              ticketId: seqId,
              assignee: {
                name: assignee?.name,
                employeeID: assignee?.employeeID,
              },
              reporter: {
                name: reporter?.name,
                id: reporterId,
                // employeeID: reporter?.employeeID,
                employeeID: reporterId,
              },
              status,
              created_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
              ticketform: {
                reporter,
                reporterId,
                description,
                title,
                priority,
                files: reqFiles,
              },
            });
            await ticket.save();
            res.status(201).send({ message: "Data is saved" });
          }
        );
      }
    } else {
      if (assignee && !status) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              assignee: {
                name: assignee.name,
                assignee_employeeID: assignee.assignee_employeeID,
              },
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else if (status && !assignee) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              status,
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else if (assignee && status) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              assignee: {
                name: assignee.name,
                employeeID: assignee.employeeID,
              },
              status,
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else if (comment) {
        await ticketModel.findOneAndUpdate(
          { ticketId: ticketId },
          {
            $set: {
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
            },
          }
        );
      } else {
        counterModel.findOneAndUpdate(
          { id: "autoval" },
          { $inc: { seq: 1 } },
          { new: true },
          async (err, cd) => {
            let seqId;
            if (cd == null) {
              const newval = new counterModel({ id: "autoval", seq: 1 });
              newval.save();
              seqId = 1;
            } else {
              seqId = cd.seq;
            }

            const ticket = new ticketModel({
              ticketId: seqId,
              assignee: {
                name: assignee?.name,
                employeeID: assignee?.employeeID,
              },
              reporter: {
                name: reporter?.name,
                id: reporterId,
                // employeeID: reporter?.employeeID,
                employeeID: reporterId,
              },
              status,
              created_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
              updated_on: {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              },
              ticketform: {
                reporter,
                description,
                title,
                priority,
                reporterId,
              },
            });
            await ticket.save();
            res.status(201).send({ message: "Data is saved" });
          }
        );
      }
    }
  } catch (error) {
    logger.error(`Error in postTicket function: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};
const updateTicket = async (req, res) => {
  try {
    const { ticketId, status, assignee } = req.body;

    if (assignee && !status) {
      await ticketModel.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            "assignee.name": assignee.name,
            "assignee.employeeID": assignee.employeeID,
            "updated_on.time": new Date().toLocaleTimeString(),
            "updated_on.date": new Date().toLocaleDateString(),
          },
        }
      );
    } else if (status && !assignee) {
      await ticketModel.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            status,
            "updated_on.time": new Date().toLocaleTimeString(),
            "updated_on.date": new Date().toLocaleDateString(),
          },
        }
      );
    } else if (assignee && status) {
      await ticketModel.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            "assignee.name": assignee.name,
            "assignee.employeeID": assignee.employeeID,
            status,
            "updated_on.time": new Date().toLocaleTimeString(),
            "updated_on.date": new Date().toLocaleDateString(),
          },
        }
      );
    } else {
      res.status(400).send("Invalid request");
      return;
    }

    res.status(200).send({ message: "Data is updated" });
  } catch (error) {
    logger.error(`Error in putTicket function: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

// const getCount = async (req, res) => {
//   try {
//     const count = await ticketModel.countDocuments({
//       status: { $nin: ["Resolve", "Close", "In progress","Open"] },
//     });
//     console.log(count+"helloncount")
//     res.status(200).send({ message: "count", count: count });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const getCount = async (req, res) => {
  try {
    const count = await ticketModel.countDocuments({});
    console.log(count + " hello count");

    res.status(200).send({ message: "Total Ticket Count", count: count });
  } catch (error) {
    console.error("Error in getCount:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getCount_Basis_On_EmployeeID = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ message: "Missing employeeId parameter" });
    }

    const count = await ticketModel.countDocuments({
      "reporter.employeeID": employeeId,
    });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCount_Basis_On_status = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ message: "Missing employeeId parameter" });
    }
    const count = await ticketModel.countDocuments({
      "reporter.employeeID": employeeId,
      status: "Close",
    });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getUserTicketCountOnBasisOfResolve = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ message: "Missing employeeId parameter" });
    }
    const count = await ticketModel.countDocuments({
      "reporter.employeeID": employeeId,
      status: "Resolve",
    });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCount_Basis_On_status_Close = async (req, res) => {
  try {
    const count = await ticketModel.countDocuments({ status: "Close" });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCount_Basis_On_status_Resolve = async (req, res) => {
  try {
    const count = await ticketModel.countDocuments({ status: "Resolve" });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCount_Basis_On_status_Inprogress = async (req, res) => {
  try {
    const count = await ticketModel.countDocuments({ status: "In progress" });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCount_Basis_On_status_Open = async (req, res) => {
  try {
    const count = await ticketModel.countDocuments({
      // status: { $nin: ["Resolve", "Close", "In progress"] },
      status: "Open",
    });
    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCount_Basis_On_Status_notEqauls_Resolve = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ message: "Missing employeeId parameter" });
    }

    const count = await ticketModel.countDocuments({
      "reporter.employeeID": employeeId,
      status: { $ne: "Close" },
    });

    res.status(200).send({ message: "count", count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const getComment = async (req, res) => {
//   try {
//     const { ticketId, employeeId } = req.query;

//     if (!ticketId && !employeeId) {
//       return res
//         .status(400)
//         .json({ message: "Both ticketId and employeeId are required" });
//     }

//     const query = {};
//     if (ticketId) {
//       query.ticketId = ticketId;
//     }
//     if (employeeId) {
//       query.employeeId = employeeId;
//     }

//     // Use the constructed query to find comments and sort by comments.date in descending order
//     const data = await commentModel.find(query).sort({ "comments.date": -1 });

//     // Log a message
//     logger.info(`Getting comments for ticket ${ticketId}`);

//     // Return the comments in the response
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const getComment = async (req, res) => {
//   try {
//     const { ticketId, employeeId, page = 1, pageSize = 10 } = req.query;

//     if (!ticketId && !employeeId) {
//       return res
//         .status(400)
//         .json({ message: "Both ticketId and employeeId are required" });
//     }

//     const query = {};
//     if (ticketId) {
//       query.ticketId = ticketId;
//     }
//     if (employeeId) {
//       query.employeeId = employeeId;
//     }

//     const pageNumber = parseInt(page);
//     const pageSizeNumber = parseInt(pageSize);

//     // Calculate the number of documents to skip
//     const skip = (pageNumber - 1) * pageSizeNumber;

//     // Use the constructed query to find comments, sort by comments.date in descending order, and implement pagination
//     const data = await commentModel
//       .find(query)
//       .sort({ "comments.date": -1 })
//       .skip(skip)
//       .limit(pageSizeNumber);

//     // Log a message
//     logger.info(
//       `Getting comments for ticket ${ticketId}, page ${pageNumber}, pageSize ${pageSizeNumber}`
//     );

//     // Return the comments in the response
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const getComment = async (req, res) => {
  try {
    const { ticketId, employeeId } = req.query;

    if (!ticketId && !employeeId) {
      return res
        .status(400)
        .json({ message: "Both ticketId and employeeId are required" });
    }

    const query = {};
    if (ticketId) {
      query.ticketId = ticketId;
    }
    if (employeeId) {
      query.employeeId = employeeId;
    }

    // Use the constructed query to find comments
    const comments = await commentModel.find(query).lean();

    // Sort comments by date in descending order
    const sortedComments = comments.map((item) => ({
      ...item,
      comments: item.comments.sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return dateB - dateA;
      }),
    }));

    // Log a message
    logger.info(`Getting comments for ticket ${ticketId}`);

    // Return the sorted comments in the response
    return res.status(200).json(sortedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// const getComment = async (req, res) => {
//   try {
//     const { ticketId, employeeId } = req.query;

//     if (!ticketId && !employeeId) {
//       return res
//         .status(400)
//         .json({ message: "Both ticketId and employeeId are required" });
//     }

//     const query = {};
//     if (ticketId) {
//       query.ticketId = ticketId;
//     }
//     if (employeeId) {
//       query.employeeId = employeeId;
//     }

//     // Use the constructed query to find comments
//     const data = await commentModel.find(query);
//     //console.log(data+"this is data")
//     // Log a message
//     logger.info(`Getting comments for ticket ${ticketId}`);

//     // Return the comments in the response
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const getComment = async (req, res) => {
//   try {
//     const { ticketId, employeeId } = req.query;
//     if (!ticketId && !employeeId) {
//       return res
//         .status(400)
//         .json({ message: `ticketid and employeeId is required` });
//     }
//     const data = await commentModel.findOne({ ticketId: ticketId });
//     console.log(data +"hello this is data")
//     logger.info(`Getting comments for ticket ${ticketId}`);
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getTotalComments = async (req, res) => {
  try {
    const comments = await commentModel.find();
    logger.info("Getting all comments");
    let totalSum = 0;
    comments.forEach((comment) => {
      totalSum += comment.comments.length;
    });

    return res.status(200).json({ totalSum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalCommentsBasedOnEmployeeId = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ message: "Missing employeeId parameter" });
    }

    const employeeIdString = employeeId.toString();

    const comments = await commentModel.find({
      "reporter.employeeID": employeeIdString,
    });
    logger.info(`Getting all comments for employee ID: ${employeeIdString}`);

    let totalSum = 0;
    comments.forEach((comment) => {
      totalSum += comment.comments.length;
    });

    return res.status(200).json({ totalSum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getallDataofCommentsBasedOnEmployeeId = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ message: "Missing employeeId parameter" });
    }

    const employeeIdString = employeeId.toString();

    const comments = await commentModel.find({
      "reporter.employeeID": employeeIdString,
    });
    logger.info(`Getting all comments for employee ID: ${employeeIdString}`);

    const commentData = comments.map((comment) => ({
      comment: comment.comments,
      ticketId: comment.ticketId,
    }));
    return res.status(200).json({ commentData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getallDataofCommentsforItandAdmin = async (req, res) => {
  try {
    const comments = await commentModel.find({});
    logger.info("Getting all comments");

    const commentData = comments.map((comment) => ({
      comment: comment.comments,
      ticketId: comment.ticketId,
    }));

    return res.status(200).json({ commentData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalCountsofComments = async (req, res) => {
  try {
    const comments = await commentModel.find({});
    logger.info("Getting all comments");
    let totalCount = 0;
    comments.forEach((comment) => {
      totalCount += comment.comments.length;
    });

    return res.status(200).json({ totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userSingleTicket = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await ticketModel.findOne({ _id: id });
    if (!data) {
      return res.status(404).json({ message: `No id found for ticket ${id}` });
    }
    logger.info(`Getting user single ticket ${id}`);
    return res.status(201).send({ message: "data", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create an initial counter entry if it doesn't exist
// CommentCounterModel.findOne({ id: "commentId" }, (err, counter) => {
//   if (err) {
//     console.error("Error checking counter:", err);
//   } else if (!counter) {
//     CommentCounterModel.create(
//       { id: "commentId", seq: 0 },
//       (createErr, createdCounter) => {
//         if (createErr) {
//           console.error("Error creating counter:", createErr);
//         } else {
//           console.log("Initial counter created:", createdCounter);
//         }
//       }
//     );
//   } else {
//     console.log('Counter with id "commentId" already exists:', counter);
//   }
// });
const postComment = async (req, res) => {
  try {
    const { ticketId, comment, name, employeeId } = req.body;

    if (!ticketId || !comment || !name || !employeeId) {
      return res.status(400).json({ message: "Missing required parameter(s)" });
    }

    const ticketExists = await ticketModel.findOne({ ticketId: ticketId });
    if (!ticketExists) {
      return res
        .status(404)
        .json({ message: `Ticket number ${ticketId} is not present` });
    }

    // Find and increment the counter for comments
    const counter = await CommentCounterModel.findOneAndUpdate(
      { id: "commentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const commentData = {
      commentId: counter.seq,
      commentedBy: name,
      comment,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };

    await commentModel.findOneAndUpdate(
      { ticketId: ticketId },
      { $push: { comments: commentData }, $set: { employeeId: employeeId } },
      { upsert: true }
    );

    logger.info(`Saved/updated comment on ticket ${ticketId}`);
    return res.status(201).json({ message: "saved/updated" });
  } catch (error) {
    logger.error(`Error in postComment function: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const postComment = async (req, res) => {
//   try {
//     const { ticketId, comment, name, employeeId } = req.body;
//     if (!ticketId || !comment || !name || !employeeId) {
//       return res.status(400).json({ message: "Missing required parameter(s)" });
//     }
//     const ticketExists = await ticketModel.findOne({ ticketId: ticketId });
//     if (!ticketExists) {
//       return res
//         .status(404)
//         .json({ message: `Ticket number ${ticketId} is not present` });
//     }
//     const commentData = {
//       comment,
//       time: new Date().toLocaleTimeString(),
//       date: new Date().toLocaleDateString(),
//       commentedBy: name,
//     };
//     await commentModel.findOneAndUpdate(
//       { ticketId: ticketId },
//       { $push: { comments: commentData }, employeeId },
//       { upsert: true }
//     );
//     logger.info(`Saved/updated comment on ticket ${ticketId}`);
//     return res.status(201).json({ message: "commented successfully" });
//   } catch (error) {
//     logger.error(`Error in postComment function: ${error}`);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// const postCommentOnTicket = async (req, res) => {
//   try {
//     const { ticketId, comment, name, employeeId } = req.body;
//     if (!ticketId || !comment || !name || !employeeId) {
//       return res.status(400).json({ message: "Missing required parameter(s)" });
//     }
//     const ticketExists = await ticketModel.findOne({ ticketId: ticketId });
//     if (!ticketExists) {
//       return res
//         .status(404)
//         .json({ message: `Ticket number ${ticketId} is not present` });
//     }
//     const commentData = {
//       comment,
//       time: new Date().toLocaleTimeString(),
//       date: new Date().toLocaleDateString(),
//       commentedBy: name,
//     };
//     await commentModel.findOneAndUpdate(
//       { ticketId: ticketId },
//       { $push: { comments: commentData }, $set: { employeeId: employeeId } },
//       { upsert: true }
//     );
//     logger.info(`Saved/updated comment on ticket ${ticketId}`);
//     return res.status(201).json({ message: "saved/updated" });
//   } catch (error) {
//     logger.error(`Error in postCommentOnTicket function: ${error}`);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// API for deleting comment

const deleteComment = async (req, res) => {
  try {
    const { ticketId, commentId } = req.query;
    if (!ticketId || !commentId) {
      return res
        .status(400)
        .json({ message: "Both ticketId and commentId are required" });
    }

    const updatedComment = await commentModel.findOneAndUpdate(
      { ticketId: parseInt(ticketId) },
      {
        $pull: {
          comments: { commentId: parseInt(commentId) },
        },
      },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(201).json({
      message: "Comment has been successfully deleted",
      comment: updatedComment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const postCommentOnTicket = async (req, res) => {
  try {
    const { ticketId, comment, name, employeeId } = req.body;

    if (!ticketId || !comment || !name || !employeeId) {
      return res.status(400).json({ message: "Missing required parameter(s)" });
    }

    const ticketExists = await ticketModel.findOne({ ticketId: ticketId });
    if (!ticketExists) {
      return res
        .status(404)
        .json({ message: `Ticket number ${ticketId} is not present` });
    }

    // Find and increment the counter
    const counter = await counterModel.findByIdAndUpdate(
      { id: "commentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const commentData = {
      commentId: counter.seq,
      commentedBy: name,
      comment,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };

    await commentModel.findOneAndUpdate(
      { ticketId: ticketId },
      { $push: { comments: commentData }, $set: { employeeId: employeeId } },
      { upsert: true }
    );

    logger.info(`Saved/updated comment on ticket ${ticketId}`);
    return res.status(201).json({ message: "saved/updated" });
  } catch (error) {
    logger.error(`Error in postCommentOnTicket function: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCommentOnTicket = async (req, res) => {
  try {
    const { ticketId, commentId } = req.params;

    if (!ticketId || !commentId) {
      return res.status(400).json({ message: "Missing required parameter(s)" });
    }

    const ticketExists = await ticketModel.findOne({ ticketId: ticketId });
    if (!ticketExists) {
      return res
        .status(404)
        .json({ message: `Ticket number ${ticketId} is not present` });
    }

    await commentModel.findOneAndUpdate(
      { ticketId: ticketId },
      { $pull: { comments: { commentId: parseInt(commentId) } } },
      { multi: true }
    );

    logger.info(`Deleted comment with ID ${commentId} on ticket ${ticketId}`);
    return res.status(200).json({ message: "deleted" });
  } catch (error) {
    logger.error(`Error in deleteCommentOnTicket function: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// const postCommentOnTicket = async (req, res) => {
//   try {
//     const { ticketId, comment, name, employeeId } = req.body;
//     if (!ticketId || !comment || !name || !employeeId) {
//       return res.status(400).json({ message: "Missing required parameter(s)" });
//     }
//     const ticketExists = await ticketModel.findOne({ ticketId: ticketId });
//     if (!ticketExists) {
//       return res
//         .status(404)
//         .json({ message: `Ticket number ${ticketId} is not present` });
//     }
//     const commentData = {
//       comment,
//       time: new Date().toLocaleTimeString(),
//       date: new Date().toLocaleDateString(),
//       commentedBy: name,
//     };
//     await commentModel.findOneAndUpdate(
//       { ticketId: ticketId },
//       { $push: { comments: commentData }, employeeId },
//       { upsert: true }
//     );
//     logger.info(`Saved/updated comment on ticket ${ticketId}`);
//     return res.status(201).json({ message: "saved/updated" });
//   } catch (error) {
//     logger.error(`Error in postComment function: ${error}`);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const getTicket = async (req, res) => {
  try {
    const tickets = await ticketModel.find().sort({ ticketId: -1 });
    res.status(200).json(tickets);
    logger.info("Getting ticket lists");
  } catch (error) {
    logger.error(`Error while fetching tickets: ${error.message}`);
    res.status(500).send({ message: "Error while fetching tickets" });
  }
};
const getUserTicket = async (req, res) => {
  try {
    const { employeeID } = req.query;
    if (!employeeID) {
      return res.status(400).json({ message: "employeeID is required" });
    }

    console.log("In get user ticket function: " + employeeID);

    const tickets = await ticketModel
      .find({
        "reporter.employeeID": employeeID,
      })
      .sort({ ticketId: -1 });

    res.status(200).json(tickets);
    logger.info(`Getting user tickets ${employeeID}`);
  } catch (error) {
    logger.error(`Error getting user tickets ${employeeID}: ${error}`);
    res.status(500).json("Internal server error");
  }
};
const getUserTicketResolve = async (req, res) => {
  try {
    const { employeeID } = req.query;
    if (!employeeID) {
      return res.status(400).json({ message: "employeeID is required" });
    }

    const tickets = await ticketModel
      .find({
        "reporter.employeeID": employeeID,
        status: "Resolve",
      })
      .sort({ ticketId: -1 });
    res.status(200).json(tickets);
    logger.info(`Getting user tickets ${employeeID}`);
  } catch (error) {
    const { employeeID } = req.query;
    logger.error(`Error getting user tickets ${employeeID}: ${error}`);
    res.status(500).json("Internal server error");
  }
};
const getUserTicketClose = async (req, res) => {
  try {
    const { employeeID } = req.query;
    if (!employeeID) {
      return res.status(400).json({ message: "employeeID is required" });
    }

    const tickets = await ticketModel
      .find({
        "reporter.employeeID": employeeID,
        status: "Close",
      })
      .sort({ ticketId: -1 });
    res.status(200).json(tickets);
    logger.info(`Getting user tickets ${employeeID}`);
  } catch (error) {
    const { employeeID } = req.query;
    logger.error(`Error getting user tickets ${employeeID}: ${error}`);
    res.status(500).json("Internal server error");
  }
};

const getUserInprogressTicket = async (req, res) => {
  try {
    const { employeeID } = req.query;
    if (!employeeID) {
      return res.status(400).json({ message: "employeeID is required" });
    }

    console.log("In get user ticket function: " + employeeID);

    const tickets = await ticketModel
      .find({
        "reporter.employeeID": employeeID,
        status: { $ne: "Close" },
      })
      .sort({ ticketId: -1 })
      .limit(30);

    console.log(tickets.length + " tickets are here");

    res.status(200).json(tickets);
    logger.info(`Getting user tickets ${employeeID}`);
  } catch (error) {
    logger.error(`Error getting user tickets ${employeeID}: ${error}`);
    res.status(500).json("Internal server error");
  }
};
// const getUserInprogressTicket = async (req, res) => {
//   try {
//     const { employeeID } = req.query;
//     if (!employeeID) {
//       return res.status(400).json({ message: "employeeID is required" });
//     }

//     console.log("In get user ticket function: " + employeeID);

//     const tickets = await ticketModel
//       .find({
//         "reporter.employeeID": employeeID,
//         status:"In progress" ,
//       })
//       .sort({ ticketId: -1 })
//       .limit(30);

//     console.log(tickets.length + " tickets are here");

//     res.status(200).json(tickets);
//     logger.info(`Getting user tickets ${employeeID}`);
//   } catch (error) {
//     logger.error(`Error getting user tickets ${employeeID}: ${error}`);
//     res.status(500).json("Internal server error");
//   }
// };

const getSingleTicket = async (req, res) => {
  try {
    const { ticketId } = req.query;
    if (!ticketId) {
      return res.status(400).json({ message: `ticketid is required` });
    }
    const ticket = await ticketModel.find({ ticketId }).sort({ ticketId: -1 });
    res.status(200).json(ticket);
    logger.info(`Getting single ticket ${ticketId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getImages = async (req, res) => {
  try {
    const { ticketId } = req.query;
    if (!ticketId) {
      return res.status(400).json({ message: `ticketid is required` });
    }
    const ticket = await ticketModel.find({ ticketId });
    let image = ticket[0].ticketform.files;
    res.status(200).json(image);
    logger.info(`Getting images for ${ticketId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting images");
  }
};
const getTicketClose = async (req, res) => {
  try {
    const tickets = await ticketModel
      .find({
        status: "Close",
      })
      .sort({ ticketId: -1 });
    res.status(200).json(tickets);
    logger.info("Getting ticket lists with ticket status close");
  } catch (error) {
    logger.error(`Error while fetching tickets: ${error.message}`);
    res.status(500).send({ message: "Error while fetching tickets" });
  }
};
const getTicketResolve = async (req, res) => {
  try {
    const tickets = await ticketModel
      .find({
        status: "Resolve",
      })
      .sort({ ticketId: -1 });
    res.status(200).json(tickets);
    logger.info("Getting ticket lists with ticket status close");
  } catch (error) {
    logger.error(`Error while fetching tickets: ${error.message}`);
    res.status(500).send({ message: "Error while fetching tickets" });
  }
};
const getTicketOpen = async (req, res) => {
  try {
    const tickets = await ticketModel
      .find({
        status: "Open",
      })
      .sort({ ticketId: -1 });
    res.status(200).json(tickets);
    logger.info("Getting ticket lists with ticket status close");
  } catch (error) {
    logger.error(`Error while fetching tickets: ${error.message}`);
    res.status(500).send({ message: "Error while fetching tickets" });
  }
};
const getTicketInProgress = async (req, res) => {
  try {
    const tickets = await ticketModel
      .find({
        status: "In progress",
      })
      .sort({ ticketId: -1 });
    res.status(200).json(tickets);
    logger.info("Getting ticket lists with ticket status close");
  } catch (error) {
    logger.error(`Error while fetching tickets: ${error.message}`);
    res.status(500).send({ message: "Error while fetching tickets" });
  }
};
// const getUserTicketClose = async (req, res) => {
//   try {
//     const { employeeID } = req.query;
//     if (!employeeID) {
//       return res.status(400).json({ message: "employeeID is required" });
//     }
//     const tickets = await ticketModel.find({
//       "reporter.employeeID": employeeID,
//       status: "Close",
//     });
//     res.status(200).json(tickets);
//     logger.info(`Getting user tickets ${employeeID}`);
//   } catch (error) {
//     logger.error(`Error getting user tickets ${employeeID}: ${error}`);
//     res.status(500).json("Internal server error");
//   }
// };

// API for exporting tickets data
const exportTicketsToExcel = async (req, res) => {
  try {
    // Fetch all tickets from the database
    const tickets = await ticketModel.find().sort({ ticketId: -1 });

    // Create a new workbook and add a worksheet
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Tickets");

    // Define worksheet columns
    worksheet.columns = [
      { header: "Ticket ID", key: "ticketId", width: 10 },
      { header: "Status", key: "status", width: 15 },
      { header: "Reporter ID", key: "ticketform.reporterId", width: 15 },
      { header: "Reporter Name", key: "ticketform.reporter", width: 20 },
      { header: "Description", key: "ticketform.description", width: 30 },
      { header: "Title", key: "ticketform.title", width: 30 },
      { header: "Priority", key: "ticketform.priority", width: 15 },
      { header: "Created Time", key: "created_on.time", width: 15 },
      { header: "Created Date", key: "created_on.date", width: 15 },
      { header: "Updated Time", key: "updated_on.time", width: 15 },
      { header: "Updated Date", key: "updated_on.date", width: 15 },
    ];

    // Add ticket data to the worksheet
    tickets.forEach((ticket) => {
      worksheet.addRow(ticket.toObject());
    });

    // Generate Excel file
    // const excelFile = "ticket_data.xlsx";
    const excelFile = `${__dirname}/ticket_data.xlsx`;
    workbook.xlsx.writeFile(excelFile).then(() => {
      res.attachment("ticket_data.xlsx");
      // Send the Excel file as a response
      res.sendFile(excelFile, () => {
        // Remove the temporary file after sending
        fs.unlinkSync(excelFile);
      });
    });

    logger.info("Exported ticket data to Excel");
  } catch (error) {
    logger.error(`Error while exporting tickets to Excel: ${error.message}`);
    res.status(500).send({ message: "Error while exporting tickets to Excel" });
  }
};

// Helper function to flatten nested properties
const flattenTicket = (ticket) => {
  return {
    ticketId: ticket.ticketId,
    status: ticket.status,
    "ticketform.reporterId": ticket.ticketform.reporterId,
    "ticketform.reporter": ticket.ticketform.reporter,
    "ticketform.description": ticket.ticketform.description,
    "ticketform.title": ticket.ticketform.title,
    "ticketform.priority": ticket.ticketform.priority,
    "created_on.time": ticket.created_on.time,
    "created_on.date": ticket.created_on.date,
    "updated_on.time": ticket.updated_on.time,
    "updated_on.date": ticket.updated_on.date,
  };
};

const downloadExcel = async (req, res) => {
  try {
    // Fetch all tickets from the database
    const tickets = await ticketModel.find().sort({ ticketId: -1 });

    // Create a new workbook and add a worksheet
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Tickets");

    // Define worksheet columns
    worksheet.columns = [
      { header: "Ticket ID", key: "ticketId", width: 10 },
      { header: "Status", key: "status", width: 15 },
      { header: "Reporter ID", key: "ticketform.reporterId", width: 15 },
      { header: "Reporter Name", key: "ticketform.reporter", width: 20 },
      { header: "Description", key: "ticketform.description", width: 30 },
      { header: "Title", key: "ticketform.title", width: 30 },
      { header: "Priority", key: "ticketform.priority", width: 30 },
      { header: "Created Time", key: "created_on.time", width: 30 },
      { header: "Created Date", key: "created_on.date", width: 30 },
      { header: "Updated Time", key: "updated_on.time", width: 30 },
      { header: "Updated Date", key: "updated_on.date", width: 30 },
    ];

    // Add ticket data to the worksheet
    tickets.forEach((ticket) => {
      // Flatten the nested properties before adding to the worksheet
      const flattenedTicket = flattenTicket(ticket.toObject());
      worksheet.addRow(flattenedTicket);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ticket_data.xlsx"
    );

    // Send the Excel file as a response
    workbook.xlsx.write(res).then(() => res.end());
    logger.info("Exported ticket data to Excel and initiated download");
  } catch (error) {
    logger.error(`Error while exporting tickets to Excel: ${error.message}`);
    res.status(500).send({ message: "Error while exporting tickets to Excel" });
  }
};

//***************************************************************** */

module.exports = {
  changePassword,
  register,
  Settings,
  Delete,
  itMember,
  singleUser,
  editUser,
  login,
  create,
  sendPasswordLink,
  forgotPasswordHandler,
  changePasswordHandler,
  postTicket,
  getComment,
  userSingleTicket,
  postComment,
  postCommentOnTicket,
  getTicket,
  getUserTicket,
  getSingleTicket,
  getImages,
  sendemailtoadminandit,
  sendemailtoadminanditaboutcomment,
  sendemailtoitanduser,
  sendemailtouserandadmin,
  getuserDetails,
  getCount,
  postImage,
  getProfileImages,
  deleteProfileImage,
  updateTicket,
  getCount_Basis_On_EmployeeID,
  getCount_Basis_On_status,
  getCount_Basis_On_Status_notEqauls_Resolve,
  getTotalComments,
  getTotalCommentsBasedOnEmployeeId,
  getallDataofCommentsBasedOnEmployeeId,
  getUserCount,
  getCount_Basis_On_status_Open,
  getCount_Basis_On_status_Close,
  getCount_Basis_On_status_Resolve,
  getCount_Basis_On_status_Inprogress,
  itMemberCount,
  getUserTicketClose,
  getUserInprogressTicket,
  getTicketClose,
  getTicketResolve,
  getTicketInProgress,
  getTicketOpen,
  editprofile,
  Geteditprofile,
  getProfileImages_for_Avatar,
  getallDataofCommentsforItandAdmin,
  getTotalCountsofComments,
  getUserEmail,
  getAllUserEmails,
  getAdminEmail,
  getITEmail,
  getUsersEmail,
  getAdminEmailsForMail,
  getITEmailsForMail,
  getUserEmailsForMail,
  getITNameForMail,
  getUserNameForMail,
  getAdminNameForMail,
  exportTicketsToExcel,
  downloadExcel,
  deleteComment,
  deleteCommentOnTicket,
  getUserTicketResolve,
  getUserTicketCountOnBasisOfResolve,
};
