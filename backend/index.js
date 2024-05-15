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
    ];

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error in signup:", err);
            return res.status(500).json({ message: "Error in signup" });
        }

        // Assuming signup was successful
        // Retrieve the inserted user's data from the database
        const insertedUserId = result.insertId;
        const getUserSql = "SELECT * FROM users WHERE id = ?";
        db.query(getUserSql, [insertedUserId], (err, userResult) => {
            if (err) {
                console.error("Error retrieving user data after signup:", err);
                return res.status(500).json({ message: "Error in signup" });
            }

            // Assuming user data was successfully retrieved
            const newUser = userResult[0];

            // Create a session for the newly signed up user
            req.session.user = {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                username: newUser.username,
                created_at: newUser.created_at,
            };

            return res.status(200).json({ message: "Signup successful", user: req.session.user });
        });
    });
});

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

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error occurred during logout" });
        }
        res.clearCookie('session_id'); // Clear the session cookie
        return res.status(200).json({ message: "Logged out successfully" });
    });
});


app.post('/update-profile', (req, res) => {
    const { id, first_name, last_name, username } = req.body;

    // Assuming you have a database connection setup

    const sql = "UPDATE users SET first_name = ?, last_name = ?, username = ? WHERE id = ?";
    db.query(sql, [first_name, last_name, username, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to update profile" });
        }
        // Assuming the update was successful
        return res.status(200).json({ message: "Profile updated successfully" });
    });
});


app.post('/delete-user', (req, res) => {
    const { id } = req.body;

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to delete user" });
        }

        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "Failed to delete user" });
            }

            return res.status(200).json({ message: "User deleted successfully" });
        });
    });
});


app.listen(8081, () => {
    console.log("Server started");
})
