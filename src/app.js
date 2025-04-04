const express = require("express")
const app = express()
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")

require("dotenv").config();

const { API_VERSION } = process.env;

//Routers
const authRouter = require("./routes/auth.route");

const { swaggerUi, specs } = require("./configs/swagger");

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Welcome to BizPadi API");
}); 

app.use(`/api/v${API_VERSION}/auth/`, authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// app.use('**', (req, res) => {
//     res.status(404).json({
//         success: false,
//          message: "Route Not Found"
//         });
// })

module.exports = app