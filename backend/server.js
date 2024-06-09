const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser");
const connection = require("./config/Db")
const userController = require("./Routes/UserRoute")
const ticketController=require("./Routes/TicketRoute")
const authentication = require("./middlewares/Authentication")
const app = express();
const logger = require('./logger');
const cookieParser=require('cookie-parser');

app.use(cookieParser());

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.get("/", (req, res) => {
    res.send("home page")
})
app.use("/user", userController)
app.use("/ticket",ticketController)
app.use('/upload',express.static(__dirname + '/upload'));
app.listen(8000, async () => {
    try{
        await connection
        logger.info("Database connection established");
    }
    catch(err){
        console.log(err)
        logger.error(`Error connecting to database: ${err.message}`);
    }
})

