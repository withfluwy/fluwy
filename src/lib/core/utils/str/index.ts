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

    slugCase() {
        const specialChars = /[^\w\s]/gi;
        return new Str(`${this.text}`.replace(specialChars, '')).words().join('-').toLowerCase();
    }

    initials({ onlyFirstAndLast = false }: { onlyFirstAndLast?: boolean } = {}) {
        return new Str(`${this.text}`)
            .words()
            .map((w, i) => (onlyFirstAndLast && i !== 0 && i !== this.words().length - 1 ? '' : w.charAt(0)))
            .join('')
            .toUpperCase();
    }
}

export function str(text: string) {
    return new Str(text);
}
