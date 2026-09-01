const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);

const PORT = 3000;

// cors setup 
// allows other ports access this server
const allowedOrigins = ["http://localhost:4200", "http://127.0.0.1:4200"]; // trusted origins

const corsOptions = {
    origin(origin, callback) {
        // allow server-to-server / curl / postman (no Origin header)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked origin: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // all methods
    allowedHeaders: ["Content-Type", "Authorization"], // other discarded 
};

// sockets setup
const io = require("socket.io")(http, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

function listen(http) {
    http.listen(PORT, () => {
        console.log(`Server is running on http://loaclhost:${PORT}`); // init listening
    }).on("error", (err) => {
        console.log("Server failed to start");
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${PORT} is already in use.`);
        }
    });
}

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", require("./routes")); // attach /api to routes defined under /api.

listen(http)
