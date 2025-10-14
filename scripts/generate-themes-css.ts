import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ThemeConfig {
  themes?: Record<string, {
    name: string;
    type: string;
    colors?: Record<string, Record<string, string>> & { text?: Record<string, string> };
  }>;
}

function hexToRgb(hex: string): string | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

function generateThemeCss(themeConfig: ThemeConfig): string {
  if (!themeConfig || !themeConfig.themes) return '';

  const cssLines: string[] = [];

  // Add :root variables for default light theme
  const lightTheme = Object.values(themeConfig.themes).find((t: any) => t.type === 'light');
  if (lightTheme) {
    cssLines.push(':root {');
    Object.entries(lightTheme.colors || {}).forEach(([colorName, shades]) => {
      if (typeof shades === 'object' && shades !== null) {
        Object.entries(shades).forEach(([shade, value]) => {
          const rgb = hexToRgb(String(value));
          if (rgb) {
            cssLines.push(`    --color-${colorName}-${shade}: ${rgb};`);
          }
        });
      }
    });
    if (lightTheme.colors?.text) {
      Object.entries(lightTheme.colors.text).forEach(([key, val]) => {
        const rgb = hexToRgb(String(val));
        if (rgb) {
          cssLines.push(`    --text-${key}: ${rgb};`);
        }
      });
    }
    cssLines.push('}');
  }


  for (const themeName in themeConfig.themes) {
    const themeData = themeConfig.themes[themeName];
    cssLines.push(`[data-theme='${themeName}'] {`);

    Object.entries(themeData.colors || {}).forEach(([colorName, shades]) => {
      if (typeof shades === 'object' && shades !== null) {
        Object.entries(shades).forEach(([shade, value]) => {
          const rgb = hexToRgb(String(value));
          if (rgb) {
            cssLines.push(`    --color-${colorName}-${shade}: ${rgb};`);
          }
        });
      }
    });
    if (themeData.colors?.text) {
      Object.entries(themeData.colors.text).forEach(([key, val]) => {
        const rgb = hexToRgb(String(val));
        if (rgb) {
          cssLines.push(`    --text-${key}: ${rgb};`);
        }
      });
    }
    cssLines.push('}');
  }

  return cssLines.join('\n');
}

async function main() {
  try {
    const themeFilePath = path.join(process.cwd(), 'public/theme.yml');
    const themeFile = fs.readFileSync(themeFilePath, 'utf8');
    const themeConfig = yaml.load(themeFile) as ThemeConfig;

    const cssContent = generateThemeCss(themeConfig);
    const outputPath = path.join(__dirname, '../src/styles/themes.css');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, cssContent, 'utf8');
    console.log(`Generated theme CSS to ${outputPath}`);
  } catch (error) {
    console.error('Error generating theme CSS:', error);
    process.exit(1);
  }
}

main();
