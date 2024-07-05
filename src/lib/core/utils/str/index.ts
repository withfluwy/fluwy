export class Str extends String {
	constructor(private text: string) {
		super(text);
	}

	toString(): string {
		return this.text;
	}

	words(): string[] {
		return `${this.text}`
			.replace(/([A-Z])/g, ' $1')
			.trim()
			.split(' ')
			.map((w) => w.trim())
			.filter((w) => w.length > 0);
	}

	snakeCase() {
		return new Str(`${this.text}`).words().join('_').toLowerCase();
	}

	kebabCase() {
		return new Str(`${this.text}`).words().join('-').toLowerCase();
	}

	titleCase() {
		return new Str(`${this.text}`)
			.words()
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(' ');
	}
}

export function str(text: string) {
	return new Str(text);
}
