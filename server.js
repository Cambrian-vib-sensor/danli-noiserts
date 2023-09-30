const express = require("express");
const cors = require("cors");
const { application } = require("express");
const routes = require("./app/routes/vibrationmonitoring.routes");

const app = express()

const options = {
    origin: "*"
};

app.use(cors(options));

app.use(express.json());

app.use(express.urlencoded({extended:true}));

routes(app);

const db = require("./app/models");
db.sequelize.sync();

app.get('/', (req,res) => {
    res.json({status:200, message:"Welcome"})
}); 

const PORT = 8500;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})