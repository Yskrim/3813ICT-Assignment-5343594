import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../models';

@Injectable({ providedIn: 'root' })
export class SocketService {
	private socket = io('http://localhost:3000');

	send(message: Message): void {
		this.socket.emit('message', message);
	}

	getMessages(): Observable<Message> {
		return new Observable<Message>((observer) => {
			// one method for sub and unsub
            const messageHandler = (message: Message) => observer.next(message);
			
            // observable action
            this.socket.on('message', messageHandler);

            // cleanup method
			return () => this.socket.off('message', messageHandler);
		});
	}
}
