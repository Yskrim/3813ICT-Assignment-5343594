const express = require('express');
const cors = require('cors');
const app = express();
const { createServer } = require('http');
const PORT = 3000;

// create server ------------------------------------------------------------------------------------------------------
const httpServer = createServer(app);

// cors setup ------------------------------------------------------------------------------------------------------
// allows other ports access this server from trusted origins
const allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
const corsOptions = {
	origin(origin, callback) {
		// allow server-to-server / curl / postman (no Origin header)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error(`CORS blocked origin: ${origin}`));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // all methods
	allowedHeaders: ['Content-Type', 'Authorization'], // other discarded
};

// sockets setup ------------------------------------------------------------------------------------------------------
const { Server } = require('socket.io');
const io = new Server(httpServer, { cors: { origin: allowedOrigins, credentials: true } });


io.on('connection', (socket) => {
    // connection
    console.log('Connected: ', socket.id);

    // message
    socket.on('message', (msgText) => io.emit('message', msgText) );

    // disconnect
    socket.on('disconnect', () => console.log('Disconnected:', socket.id) );
});


// middleware ------------------------------------------------------------------------------------------------------
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', require('./routes')); // attach /api to routes defined under /api.

// start server ------------------------------------------------------------------------------------------------------
httpServer
	.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	})
	.on('error', (err) => {
		console.log('Server failed to start');
		if (err.code === 'EADDRINUSE') console.log(`Port ${PORT} is already in use.`);
	});
