import express from "express"
import mysql2 from "mysql2"
import cors from "cors"
import session from "express-session"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "appointment_scheduler_db",
})

app.get('/', (req, res) => {
    if (req.session.user) {
        return res.json({valid: true, user: req.session.user})
    } else {
        return res.json({valid: false})
    }
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`first_name`, `last_name`, `username`, `password`) VALUES (?)";
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.password,
    ]

    db.query(sql, [values], (err, result) => {
        if (err) return res.json({Message: "Error in Node"});
        return res.json(result)
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE username = ? and password = ?";
    db.query(sql, [req.body.username, req.body.password,], (err, result) => {
        if (err) return res.json({Message: "Wrong username/password!"});
        if (result.length > 0) {
            const user = result[0];
            req.session.user = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                created_at: user.created_at,
            };
            return res.json({Login: true, user: req.session.user});
        } else {
            return res.json({Login: false});
        }
    })
})

app.listen(8081, () => {
    console.log("Server started");
})
