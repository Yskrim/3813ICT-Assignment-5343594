// test setup ---
// Node 22+ has own global localStorage, without --localstorage-file it is undefined
// and hides jsdom one -> give tests simple in-memory storage instead
class MemoryStorage implements Storage {
	private data = new Map<string, string>();
	get length() {
		return this.data.size;
	}
	clear() {
		this.data.clear();
	}
	getItem(key: string) {
		return this.data.get(key) ?? null;
	}
	key(i: number) {
		return [...this.data.keys()][i] ?? null;
	}
	removeItem(key: string) {
		this.data.delete(key);
	}
	setItem(key: string, value: string) {
		this.data.set(key, String(value));
	}
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
	if (!globalThis[name]) {
		Object.defineProperty(globalThis, name, { value: new MemoryStorage(), configurable: true });
	}
}
