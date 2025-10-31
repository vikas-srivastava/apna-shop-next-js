var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) { return r + r + g + g + b + b; });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "".concat(parseInt(result[1], 16), ", ").concat(parseInt(result[2], 16), ", ").concat(parseInt(result[3], 16)) : null;
}
function generateThemeCss(themeConfig) {
    var _a, _b;
    if (!themeConfig || !themeConfig.themes)
        return '';
    var cssLines = [];
    // Add :root variables for default light theme
    var lightTheme = Object.values(themeConfig.themes).find(function (t) { return t.type === 'light'; });
    if (lightTheme) {
        cssLines.push(':root {');
        Object.entries(lightTheme.colors || {}).forEach(function (_a) {
            var colorName = _a[0], shades = _a[1];
            if (typeof shades === 'object' && shades !== null) {
                Object.entries(shades).forEach(function (_a) {
                    var shade = _a[0], value = _a[1];
                    var rgb = hexToRgb(String(value));
                    if (rgb) {
                        cssLines.push("    --color-".concat(colorName, "-").concat(shade, ": ").concat(rgb, ";"));
                    }
                });
            }
        });
        if ((_a = lightTheme.colors) === null || _a === void 0 ? void 0 : _a.text) {
            Object.entries(lightTheme.colors.text).forEach(function (_a) {
                var key = _a[0], val = _a[1];
                var rgb = hexToRgb(String(val));
                if (rgb) {
                    cssLines.push("    --text-".concat(key, ": ").concat(rgb, ";"));
                }
            });
        }
        cssLines.push('}');
    }
    for (var themeName in themeConfig.themes) {
        var themeData = themeConfig.themes[themeName];
        cssLines.push("[data-theme='".concat(themeName, "'] {"));
        Object.entries(themeData.colors || {}).forEach(function (_a) {
            var colorName = _a[0], shades = _a[1];
            if (typeof shades === 'object' && shades !== null) {
                Object.entries(shades).forEach(function (_a) {
                    var shade = _a[0], value = _a[1];
                    var rgb = hexToRgb(String(value));
                    if (rgb) {
                        cssLines.push("    --color-".concat(colorName, "-").concat(shade, ": ").concat(rgb, ";"));
                    }
                });
            }
        });
        if ((_b = themeData.colors) === null || _b === void 0 ? void 0 : _b.text) {
            Object.entries(themeData.colors.text).forEach(function (_a) {
                var key = _a[0], val = _a[1];
                var rgb = hexToRgb(String(val));
                if (rgb) {
                    cssLines.push("    --text-".concat(key, ": ").concat(rgb, ";"));
                }
            });
        }
        cssLines.push('}');
    }
    return cssLines.join('\n');
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var themeFilePath, themeFile, themeConfig, cssContent, outputPath, outputDir;
        return __generator(this, function (_a) {
            try {
                themeFilePath = path.join(process.cwd(), 'public/theme.yml');
                themeFile = fs.readFileSync(themeFilePath, 'utf8');
                themeConfig = yaml.load(themeFile);
                cssContent = generateThemeCss(themeConfig);
                outputPath = path.join(__dirname, '../src/styles/themes.css');
                outputDir = path.dirname(outputPath);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                fs.writeFileSync(outputPath, cssContent, 'utf8');
                console.log("Generated theme CSS to ".concat(outputPath));
            }
            catch (error) {
                console.error('Error generating theme CSS:', error);
                process.exit(1);
            }
            return [2 /*return*/];
        });
    });
}
main();
