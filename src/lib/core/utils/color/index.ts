import Color from 'color';

type ColorType = {
    [color: string]: Record<string, string>;
};

export function setCurrentColor(colorName: string, colors: ColorType): string {
    let variables = '';

    for (const [shade, hexColor] of Object.entries(colors[colorName] ?? {})) {
        const color = Color(hexColor);
        const [r, g, b] = color.rgb().array();
        const isDark = color.luminosity() < 0.4;
        const contrastColor = Color(isDark ? '#fff' : '#000')
            .rgb()
            .array()
            .join(' ');

        if (shade === 'DEFAULT') {
            variables += `--color: ${r} ${g} ${b};\n--color-contrast: ${contrastColor};\n`;
            continue;
        }

        variables += `--color-${shade}: ${r} ${g} ${b};\n`;
    }

    return variables;
}

export function generateColorVariables(colors: Record<string, Record<string, string>>) {
    let variables = '';

    for (const [name, shades] of Object.entries(colors)) {
        for (const shade of Object.keys(shades)) {
            const color = Color(shades[shade]);
            const rgbValue = color.rgb().array().join(' ');

            if (shade === 'DEFAULT') {
                const isDark = color.luminosity() < 0.4;
                const contrastColor = Color(isDark ? '#fff' : '#000')
                    .rgb()
                    .array()
                    .join(' ');

                variables += `--color-${name}: ${rgbValue};\n--color-${name}-contrast: ${contrastColor};\n`;

                continue;
            }

            variables += `--color-${name}-${shade}: ${rgbValue};\n`;
        }
    }
    return variables;
}
