/**
 * @param {string} line
 * @returns {string[]}
 */
export function extractTailwindOnYaml(line) {
	const regex = /[a-zA-Z0-9_-]+: (.*)$/g;
	const match = line.match(regex) || [];

	if (!match.length) return [];

	const classes = match
		.map((m) =>
			m
				.split(' ')
				.filter((s) => !s.endsWith(':'))
				.flat()
		)
		.flat();

	return classes;
}
