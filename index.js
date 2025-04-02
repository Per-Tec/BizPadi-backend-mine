const app = require("./src/app");
const db = require("./src/configs/db");

require("dotenv").config();

const { PORT }= process.env;

app.listen(PORT, () =>{
     console.log(`server is running on port ${PORT}`);

    })

