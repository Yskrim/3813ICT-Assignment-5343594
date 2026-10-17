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
		return this.listen<Message>('message');
	}

	join(channelId: string, username: string): void {
		this.socket.emit('join', {channelId, username});
	}

	leave(channelId: string): void {
		this.socket.emit('leave', channelId);
	}

	getHistory(): Observable<Message[]> {
		return this.listen<Message[]>('history');
	}

    getNotices(): Observable<string> {
        return this.listen<string>('notice');
    }

	private listen<T>(event: string): Observable<T> {
		return new Observable<T>((observer) => {
			// one method for sub and unsub
			const handler = (data: T) => observer.next(data);

			// observable action
			this.socket.on(event, handler);

			// cleanup method
			return () => this.socket.off(event, handler);
		});
	}
}
