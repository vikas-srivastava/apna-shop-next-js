#!/usr/bin/env node

/**
 * Next.js Bundle Analyzer
 * Analyzes build output for optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
    constructor() {
        this.buildDir = path.join(process.cwd(), '.next');
        this.results = {
            timestamp: new Date().toISOString(),
            summary: {},
            chunks: [],
            assets: [],
            pages: [],
            recommendations: []
        };
    }

    /**
     * Analyze the entire bundle
     */
    async analyze() {
        console.log('🔍 Analyzing Next.js bundle...');

        if (!fs.existsSync(this.buildDir)) {
            console.log('⚠️  No build directory found. Run "npm run build" first.');
            return;
        }

        await this.analyzeBuildStructure();
        await this.analyzeChunks();
        await this.analyzeAssets();
        await this.analyzePages();
        await this.analyzeDependencies();

        this.generateRecommendations();
        this.generateReport();

        console.log('✅ Bundle analysis completed!');
    }

    /**
     * Analyze overall build structure
     */
    async analyzeBuildStructure() {
        const buildStats = this.getDirectoryStats(this.buildDir);

        this.results.summary = {
            totalSize: buildStats.size,
            totalFiles: buildStats.fileCount,
            totalDirectories: buildStats.dirCount,
            largestFiles: buildStats.largestFiles.slice(0, 10)
        };

        console.log(`📊 Build size: ${(buildStats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📁 Total files: ${buildStats.fileCount}`);
    }

    /**
     * Analyze JavaScript chunks
     */
    async analyzeChunks() {
        const chunksDir = path.join(this.buildDir, 'static', 'chunks');
        if (!fs.existsSync(chunksDir)) {
            return;
        }

        const chunks = fs.readdirSync(chunksDir)
            .filter(file => file.endsWith('.js') || file.endsWith('.css'))
            .map(file => {
                const filePath = path.join(chunksDir, file);
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');

                return {
                    name: file,
                    size: stats.size,
                    sizeKB: (stats.size / 1024).toFixed(2),
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                    type: file.endsWith('.js') ? 'javascript' : 'css',
                    gzipSize: this.estimateGzipSize(content),
                    lines: content.split('\n').length,
                    isVendor: file.includes('vendor') || file.includes('commons'),
                    isPage: file.includes('pages'),
                    isComponent: file.includes('components')
                };
            })
            .sort((a, b) => b.size - a.size);

        this.results.chunks = chunks;

        console.log(`🔧 Found ${chunks.length} chunks`);
        console.log(`📦 Largest chunk: ${chunks[0]?.name} (${chunks[0]?.sizeKB} KB)`);
    }

    /**
     * Analyze static assets
     */
    async analyzeAssets() {
        const assetsDir = path.join(this.buildDir, 'static');
        if (!fs.existsSync(assetsDir)) {
            return;
        }

        const assets = this.getAllFiles(assetsDir)
            .filter(file => !file.includes('chunks'))
            .map(file => {
                const stats = fs.statSync(file);
                const content = fs.readFileSync(file, 'utf8');

                return {
                    name: path.basename(file),
                    path: file,
                    size: stats.size,
                    sizeKB: (stats.size / 1024).toFixed(2),
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                    type: this.getFileType(file),
                    gzipSize: this.estimateGzipSize(content)
                };
            })
            .sort((a, b) => b.size - a.size);

        this.results.assets = assets;

        console.log(`🖼️  Found ${assets.length} static assets`);
    }

    /**
     * Analyze page bundles
     */
    async analyzePages() {
        const pagesDir = path.join(this.buildDir, 'server', 'pages');
        if (!fs.existsSync(pagesDir)) {
            return;
        }

        const pages = fs.readdirSync(pagesDir)
            .filter(file => file.endsWith('.js') || file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(pagesDir, file);
                const stats = fs.statSync(filePath);

                return {
                    name: file.replace('.js', '').replace('.json', ''),
                    size: stats.size,
                    sizeKB: (stats.size / 1024).toFixed(2),
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                    type: file.endsWith('.js') ? 'server-side' : 'manifest'
                };
            })
            .sort((a, b) => b.size - a.size);

        this.results.pages = pages;

        console.log(`📄 Found ${pages.length} page bundles`);
    }

    /**
     * Analyze dependencies
     */
    async analyzeDependencies() {
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

            this.results.dependencies = {
                total: Object.keys(dependencies).length,
                production: Object.keys(packageJson.dependencies).length,
                development: Object.keys(packageJson.devDependencies).length,
                largest: Object.entries(dependencies)
                    .map(([name, version]) => ({ name, version, size: this.estimatePackageSize(name) }))
                    .sort((a, b) => b.size - a.size)
                    .slice(0, 20)
            };

            console.log(`📦 Total dependencies: ${Object.keys(dependencies).length}`);
        } catch (error) {
            console.warn('Could not analyze dependencies:', error.message);
        }
    }

    /**
     * Get directory statistics recursively
     */
    getDirectoryStats(dir) {
        let size = 0;
        let fileCount = 0;
        let dirCount = 0;
        const largestFiles = [];

        const scan = (currentDir) => {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const itemPath = path.join(currentDir, item);
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    dirCount++;
                    scan(itemPath);
                } else if (stats.isFile()) {
                    fileCount++;
                    size += stats.size;
                    largestFiles.push({
                        name: item,
                        path: itemPath,
                        size: stats.size
                    });
                }
            }
        };

        scan(dir);

        largestFiles.sort((a, b) => b.size - a.size);

        return { size, fileCount, dirCount, largestFiles };
    }

    /**
     * Get all files recursively
     */
    getAllFiles(dir) {
        const files = [];

        const scan = (currentDir) => {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const itemPath = path.join(currentDir, item);
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    scan(itemPath);
                } else if (stats.isFile()) {
                    files.push(itemPath);
                }
            }
        };

        scan(dir);
        return files;
    }

    /**
     * Get file type based on extension
     */
    getFileType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const typeMap = {
            '.js': 'javascript',
            '.css': 'stylesheet',
            '.json': 'json',
            '.html': 'html',
            '.png': 'image',
            '.jpg': 'image',
            '.jpeg': 'image',
            '.gif': 'image',
            '.svg': 'image',
            '.ico': 'image',
            '.woff': 'font',
            '.woff2': 'font',
            '.ttf': 'font',
            '.eot': 'font'
        };

        return typeMap[ext] || 'unknown';
    }

    /**
     * Estimate gzip compression size
     */
    estimateGzipSize(content) {
        // Simple estimation: gzip typically compresses to 20-30% of original size
        return Math.round(content.length * 0.25);
    }

    /**
     * Estimate package size (rough estimation)
     */
    estimatePackageSize(packageName) {
        // This is a rough estimation based on common package sizes
        const sizeMap = {
            'react': 50000,
            'next': 200000,
            'axios': 15000,
            'lodash': 50000,
            'moment': 100000,
            'jquery': 80000,
            'bootstrap': 150000,
            'd3': 200000,
            'three': 500000
        };

        return sizeMap[packageName] || 10000; // Default 10KB for unknown packages
    }

    /**
     * Generate optimization recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        // Bundle size recommendations
        const totalSizeMB = this.results.summary.totalSize / 1024 / 1024;
        if (totalSizeMB > 10) {
            recommendations.push({
                type: 'error',
                category: 'bundle-size',
                message: `Large bundle size (${totalSizeMB.toFixed(2)} MB). Consider code splitting and lazy loading.`,
                priority: 'high'
            });
        }

        // Large chunks
        const largeChunks = this.results.chunks.filter(chunk => chunk.size > 500000); // >500KB
        if (largeChunks.length > 0) {
            recommendations.push({
                type: 'warning',
                category: 'chunk-size',
                message: `${largeChunks.length} large chunks found. Consider splitting large components.`,
                priority: 'medium'
            });
        }

        // Unused dependencies
        const unusedDeps = this.identifyUnusedDependencies();
        if (unusedDeps.length > 0) {
            recommendations.push({
                type: 'info',
                category: 'dependencies',
                message: `${unusedDeps.length} potentially unused dependencies. Consider removing unused packages.`,
                priority: 'low'
            });
        }

        // Large assets
        const largeAssets = this.results.assets.filter(asset => asset.size > 1000000); // >1MB
        if (largeAssets.length > 0) {
            recommendations.push({
                type: 'warning',
                category: 'assets',
                message: `${largeAssets.length} large assets found. Consider optimizing images and assets.`,
                priority: 'medium'
            });
        }

        // Vendor chunk analysis
        const vendorChunks = this.results.chunks.filter(chunk => chunk.isVendor);
        if (vendorChunks.length > 0) {
            const vendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.size, 0);
            if (vendorSize > 1000000) { // >1MB
                recommendations.push({
                    type: 'info',
                    category: 'vendor',
                    message: `Large vendor bundle (${(vendorSize / 1024 / 1024).toFixed(2)} MB). Consider using externals or CDN.`,
                    priority: 'medium'
                });
            }
        }

        this.results.recommendations = recommendations;
    }

    /**
     * Identify potentially unused dependencies
     */
    identifyUnusedDependencies() {
        // This is a simplified analysis - in practice, you'd use tools like webpack-bundle-analyzer
        const usedPackages = new Set();

        // Scan source files for imports
        const scanSourceFiles = (dir) => {
            const files = this.getAllFiles(dir);
            for (const file of files) {
                if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
                    const content = fs.readFileSync(file, 'utf8');
                    const importMatches = content.match(/import.*from ['"]([^'"]+)['"]/g) || [];
                    const requireMatches = content.match(/require\(['"]([^'"]+)['"]\)/g) || [];

                    [...importMatches, ...requireMatches].forEach(match => {
                        const packageName = match.includes('from') ?
                            match.split('from')[1].replace(/['"]/g, '').split('/')[0] :
                            match.replace(/require\(['"]/g, '').replace(/['"]\)/g, '').split('/')[0];
                        usedPackages.add(packageName);
                    });
                }
            }
        };

        scanSourceFiles('../src');

        // Compare with package.json
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
            const unused = Object.keys(allDeps).filter(dep => !usedPackages.has(dep));

            return unused;
        } catch (error) {
            return [];
        }
    }

    /**
     * Generate analysis report
     */
    generateReport() {
        const reportPath = path.join(process.cwd(), 'bundle-analysis-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

        const summaryPath = path.join(process.cwd(), 'bundle-analysis-summary.txt');
        const summary = this.generateSummaryText();
        fs.writeFileSync(summaryPath, summary);

        console.log(`\n📋 Bundle Analysis Report Generated:`);
        console.log(`  Full Report: ${reportPath}`);
        console.log(`  Summary: ${summaryPath}`);
    }

    /**
     * Generate human-readable summary
     */
    generateSummaryText() {
        const { summary, chunks, assets, pages, dependencies, recommendations } = this.results;

        return `
BUNDLE ANALYSIS SUMMARY
=======================
Generated: ${this.results.timestamp}

BUILD OVERVIEW
--------------
Total Size: ${(summary.totalSize / 1024 / 1024).toFixed(2)} MB
Total Files: ${summary.fileCount}
Total Directories: ${summary.totalDirectories}

LARGEST FILES
-------------
${summary.largestFiles?.slice(0, 5).map((file, index) =>
            `${index + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
        ).join('\n') || 'No files found'}

JAVASCRIPT CHUNKS
-----------------
Total Chunks: ${chunks.length}
Largest Chunk: ${chunks[0]?.name || 'N/A'} (${chunks[0]?.sizeKB || 0} KB)
Vendor Chunks: ${chunks.filter(c => c.isVendor).length}
Total JS Size: ${(chunks.filter(c => c.type === 'javascript').reduce((sum, c) => sum + c.size, 0) / 1024 / 1024).toFixed(2)} MB

STATIC ASSETS
-------------
Total Assets: ${assets.length}
Largest Asset: ${assets[0]?.name || 'N/A'} (${assets[0]?.sizeKB || 0} KB)
Total Assets Size: ${(assets.reduce((sum, a) => sum + a.size, 0) / 1024 / 1024).toFixed(2)} MB

PAGE BUNDLES
------------
Total Pages: ${pages.length}
Largest Page: ${pages[0]?.name || 'N/A'} (${pages[0]?.sizeKB || 0} KB)

DEPENDENCIES
------------
Total Dependencies: ${dependencies?.total || 0}
Production: ${dependencies?.production || 0}
Development: ${dependencies?.development || 0}

RECOMMENDATIONS
---------------
${recommendations.map(rec =>
            `${rec.priority.toUpperCase()}: ${rec.message} (${rec.category})`
        ).join('\n')}

OPTIMIZATION OPPORTUNITIES
--------------------------
${this.generateOptimizationTips()}
    `.trim();
    }

    /**
     * Generate optimization tips
     */
    generateOptimizationTips() {
        const tips = [
            '• Use dynamic imports for route-based code splitting',
            '• Implement lazy loading for heavy components',
            '• Optimize images with proper sizing and formats',
            '• Use CDN for static assets',
            '• Remove unused dependencies',
            '• Implement tree shaking for unused code',
            '• Use compression (gzip/brotli) for assets',
            '• Consider using externals for large libraries',
            '• Implement proper caching headers',
            '• Use Next.js Image component for automatic optimization'
        ];

        return tips.map(tip => `  ${tip}`).join('\n');
    }
}

// CLI interface
async function main() {
    const analyzer = new BundleAnalyzer();
    await analyzer.analyze();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = BundleAnalyzer;