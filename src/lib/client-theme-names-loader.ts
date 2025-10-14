import * as yaml from 'js-yaml';

interface ThemeConfig {
  themes?: Record<string, any>;
}

export async function loadThemeNames(): Promise<string[]> {
  try {
    const response = await fetch('/theme.yml');
    if (!response.ok) {
      throw new Error('Failed to load theme.yml');
    }

    const yamlContent = await response.text();

    const themeConfig = yaml.load(yamlContent) as ThemeConfig;


    if (themeConfig && themeConfig.themes) {
      const themeNames = Object.keys(themeConfig.themes);
      console.log("Extracted Theme Names:", themeNames);
      return themeNames;
    }
    return [];
  } catch (error) {
    console.error('Error loading theme names:', error);
    return [];
  }
}
