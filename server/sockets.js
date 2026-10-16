const { randomUUID } = require('crypto');
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
		socket.on('message', (draft) => {
            if(!isValidDraft(draft)) return;
            const msg = buildMessage(draft);
            
            // update to most recent 5 messages locally
            const messages = history[msg.channelId] ?? [];
            history[msg.channelId] = [ ...messages, msg].slice(-5); 
            
            // only to channel room
            io.to(msg.channelId).emit('message', msg);
        });

		// disconnect
		socket.on('disconnect', () => console.log('Disconnected:', socket.id));
	});
}

function buildMessage(draft){
    return {
        id: randomUUID(), // unique across all clients, not just one tab
        channelId: draft.channelId,
        senderId: draft.senderId,
        text: draft.text.trim(),
        createdAt: new Date().toISOString(), // server time, same for everyone
        isEdited: false,
    }
}

function isValidDraft(draft) {
    return (
        draft &&
        typeof draft.channelId === 'string' && draft.channelId !== '' &&
        typeof draft.senderId === 'string' && draft.senderId !== '' &&
        typeof draft.text === 'string' && draft.text.trim() !== '' &&
        draft.text.length <= 1000
    );
}


module.exports={ connect };