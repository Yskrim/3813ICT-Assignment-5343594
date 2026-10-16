const history = {}; // keeps only 5 recent messages

function connect(io) {
	io.on('connection', (socket) => {
		// connection
		console.log('Connected: ', socket.id);

		// enter room
		socket.on('join', (channelId) => {
			socket.join(channelId);
			socket.emit('history', history[channelId] ?? []); // send last 5 to new user
		});

		// leave room
		socket.on('leave', (channelId) => {
			socket.leave(channelId);
		});

		// message
		socket.on('message', (msgText) => {
            const messages = history[msgText.chatId] ?? [];
            
            // update to most recent 5 messages locally
            history[msgText.chatId] = [ ...messages, msgText].slice(-5);
            
            // only to channel room
            io.to(msgText.chatId).emit('message', msgText);
        });

		// disconnect
		socket.on('disconnect', () => console.log('Disconnected:', socket.id));
	});
}

module.exports={ connect };