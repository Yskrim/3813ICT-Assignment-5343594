const { randomUUID } = require('crypto');
const history = {}; // keeps only 5 recent messages

function connect(io) {
    // room became empty (last socket left or disconnected) -> forget its history
    io.of('/').adapter.on('delete-room', (room) => {
        delete history[room];
    });

	io.on('connection', (socket) => {
		// connection
		console.log('Connected: ', socket.id);

		// enter room
		socket.on('join', ({channelId, username} = {}) => {
            if(typeof channelId !=='string' || !channelId) return;

            socket.data.username = 
                typeof username === 'string' && username ? username : 'Someone';
            
			socket.join(channelId);
			socket.emit('history', history[channelId] ?? []); // send last 5 to new user
			socket.to(channelId).emit('notice', `${socket.data.username} joined the channel`);
		});
        
		// leave room
		socket.on('leave', (channelId) => {
            socket.to(channelId).emit('notice',`${socket.data.username} left the channel`);
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
        socket.on('disconnecting', () => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.to(room).emit('notice', `${socket.data.username} disconnected`);
                }
            }
        });
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

// remove deleted user's messages from every channel history
function removeUserMessages(userId) {
    for (const channelId of Object.keys(history)) {
        history[channelId] = history[channelId].filter((m) => m.senderId !== userId);
    }
}


module.exports={ connect, removeUserMessages };