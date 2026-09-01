const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);

const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

const io = require("socket.io")(http, {
    cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', require('./routes'));

require('./listen').server(http);