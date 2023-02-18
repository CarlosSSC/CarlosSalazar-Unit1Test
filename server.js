const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const cors = require("cors");
const env = require("dotenv");
const bcrypt = require("bcrypt");


env.config({
    path : "./config.env"
})

app.use(cors());
app.use(bodyparser.json({
    limit : "100mb"
}));

app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH")
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next()
});

const arrayDB = [
    {
        student : 'Mario',
        password: 'Oiram12345'
    },
    {
        student : 'Link',
        password: 'zld123'
    },
    {
        student : 'Samus',
        password: 'aran'
    },
    {
        student : 'CaptainF',
        password: 'Alcon'
    },
    {
        student : 'Wolf',
        password: 'HateFoxes'
    }

];

// add unhashed password
app.post('/addStudent', function(req, res){
    let student = req.body;
    arrayDB.push(student);
    res.send(arrayDB);
});

// hashed password
app.post('/Register', async function(req, res){
    const {student, password } = req.body; 
    const hash = await bcrypt.hash(password, 10);
    const hashed = { student, password: hash }; 
    arrayDB.push(hashed);
    res.send(arrayDB);
});

// Login account
app.post('/login', async function(req, res){
    const {student, password} = req.body;
    const user = arrayDB.find(st => st.student == student);
    console.log(user);
    const successfulllogin = await bcrypt.compare(password, user.password) 
    // , arrayDB.recordset[5].password
        if (successfulllogin == true){
            return res.send("password is correct");
        }
        else {
            return res.send("password is incorrect");
        }

});


// removes by index from the arrayDB
app.delete('/removeStudent', function(req, res){
    arrayDB.splice(5, 1);
    res.send(arrayDB);
});

// updates by index from the arrayDB
app.patch('/updateStudent', function(req, res){
    arrayDB.splice(0, 1,
    {"student" : 'Dr Mario',
    "password": 'MarioDR'});
    res.send(arrayDB);
});

// get all students
app.get('/getStudents', (req, res) =>{
    res.send(arrayDB)
});

// get a single student by index from the arrayDB
app.get('/getStudent', (req, res) =>{  
    specific = arrayDB.at(1,1)
    res.send(specific)
});

const port = process.env.PORT||3000;
app.listen(port, () => {
    console.log('app is running on port 3000')
});