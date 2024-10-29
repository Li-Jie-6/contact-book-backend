const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const config = {
    user: 'sa',
    password: 'Lj20040204',
    server: 'localhost',
    database: 'ContactManager',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

app.get('/getcontacts', async (req, res) => {

    var conn = new sql.ConnectionPool(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        req.query("SELECT * FROM Contacts", function (err, recordset) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                res.json(recordset.recordset);
                console.log(recordset.recordset);
            }
            conn.close();
        });
    });
});

app.post('/addcontacts', async (req, res) => {
    const { name, address, phone } = req.body;
    console.log(req.body)

    var conn = new sql.ConnectionPool(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        req.query(`
            INSERT INTO Contacts (Name, Address, Phone) VALUES ('${name}', '${address}','${phone}')
        `, function (err, recordset) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                res.status(201).json({ message: '联系人已添加' });
                console.log(recordset);
            }
            conn.close();
        });
    });
});

app.put('/updatecontacts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    console.log("put")
    console.log(req.params)
    console.log(req.body)
    var conn = new sql.ConnectionPool(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        req.query(`
            UPDATE Contacts SET Name = '${name}', Address = '${address}', Phone = '${phone}' WHERE ContactId = '${id}'
        `, function (err, recordset) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                res.json({ message: '联系人已更新' });
                console.log(recordset);
            }
            conn.close();
        });
    });
});

app.delete('/deletecontacts/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    var conn = new sql.ConnectionPool(config);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        req.query(`
            DELETE FROM Contacts WHERE ContactId = '${id}'
        `, function (err, recordset) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                res.json({ message: '联系人已删除' });
                console.log(recordset);
            }
            conn.close();
        });
    });
});

app.listen(port, () => {
    console.log(`服务器启动在 http://localhost:${port}`);
});