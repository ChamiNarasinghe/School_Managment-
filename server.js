const express = require('express');
const bodyParser = require('body-parser'); 
const mysql = require('mysql');
const server = express();

// Initialize body-parser to parse incoming request bodies
server.use(bodyParser.json()); 
server.use(bodyParser.urlencoded({ extended: true })); 

// Establish DataBase Connection
const db = mysql.createConnection({
   host: "localhost",
   user: "chami",
   password: "2002",
   database: "db_school"
});

db.connect(function(error){
    if (error) {
        console.log("Error connecting to DB.");
    } else {
        console.log("Successfully connected to the DB.");
    }
});

// Establish the Port
server.listen(8081, function check(error) {
    if (error) {
        console.log("Error!");
    } else {
        console.log("Server started on port 8081!");
    }
});

// API Route to Create a Student
server.post("/api/students", (req, res) => {
    let details = {
        st_name: req.body.st_name,
        course: req.body.course,
        fee: req.body.fee,
    };
    
    let sql = "INSERT INTO student SET ?";
    db.query(sql, details, (error) => {
        if (error) {
            res.send({ status: false, message: "Student creation failed." });
        } else {
            res.send({ status: true, message: "Student created successfully." });
        }
    });

});

// API Route to Get All Students (GET request)
server.get("/api/students", (req, res) => {
    let sql = "SELECT * FROM student";
    db.query(sql, (error, results) => {
        if (error) {
            res.send({ status: false, message: "Error fetching student details." });
        } else {
            res.send({ status: true, data: results });
        }
    });
});

// API Route to Get Student Details by ID (GET request)
server.get("/api/students/:id", (req, res) => {
    let studentId = req.params.id; 
    let sql = "SELECT * FROM student WHERE id = ?"; 

    db.query(sql, [studentId], (error, results) => {
        if (error) {
            res.send({ status: false, message: "Error fetching student details." });
        } else {
            if (results.length > 0) {
                res.send({ status: true, data: results });
            } else {
                res.send({ status: false, message: "No student found with the given ID." });
            }
        }
    });
});


// API Route to Update Student Details by ID (PUT request)
server.put("/api/students/:id", (req, res) => {
    let studentId = req.params.id; 
    let updatedDetails = {
        st_name: req.body.st_name,
        course: req.body.course,
        fee: req.body.fee
    };
    
    let sql = "UPDATE student SET ? WHERE id = ?";
    
    db.query(sql, [updatedDetails, studentId], (error, results) => {
        if (error) {
            res.send({ status: false, message: "Error updating student details." });
        } else {
            if (results.affectedRows > 0) {
                res.send({ status: true, message: "Student details updated successfully." });
            } else {
                res.send({ status: false, message: "No student found with the given ID." });
            }
        }
    });
});

// API Route to Delete Student by ID (DELETE request)
server.delete("/api/students/:id", (req, res) => {
    let studentId = req.params.id; 
    
    let sql = "DELETE FROM student WHERE id = ?";
    
    db.query(sql, [studentId], (error, results) => {
        if (error) {
            res.send({ status: false, message: "Error deleting student." });
        } else {
            if (results.affectedRows > 0) {
                res.send({ status: true, message: "Student deleted successfully." });
            } else {
                res.send({ status: false, message: "No student found with the given ID." });
            }
        }
    });
});

