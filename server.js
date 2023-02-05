const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
// Essential inquirer
const inquirer = require('inquirer');
//Essential Console.Table Cleaner table in console log detach index.
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Attach to database
const connection = mysql.createConnection(
    {
        host: '127.0.0.1',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password 
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`),
);