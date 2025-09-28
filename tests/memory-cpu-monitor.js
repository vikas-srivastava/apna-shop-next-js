#!/usr/bin/env node

/**
 * Memory and CPU Performance Monitor
 * Monitors system resources during performance testing
 */

const os = require('os');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
    constructor(options = {}) {
        this.interval = options.interval || 1000; // 1 second
        this.duration = options.duration || 60000; // 1 minute
        this.outputDir = options.outputDir || './performance-results';
        this.pid = options.pid || process.pid;

        this.metrics = {
            timestamp: new Date().toISOString(),
            system: {
                platform: os.platform(),
                arch: os.arch(),
                cpus: os.cpus().length,
                totalMemory: os.totalmem(),
                hostname: os.hostname()
            },
            samples: [],
            summary: {}
        };

        this.isRunning = false;
        this.intervalId = null;

        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * Start monitoring
     */
    start() {
        console.log('📊 Starting performance monitoring...');
        console.log(`⏱️  Monitoring for ${this.duration / 1000} seconds at ${this.interval}ms intervals`);

        this.isRunning = true;
        let sampleCount = 0;
        const maxSamples = this.duration / this.interval;

        this.intervalId = setInterval(() => {
            if (!this.isRunning) return;

            const sample = this.takeSample();
            this.metrics.samples.push(sample);

            sampleCount++;
            const progress = (sampleCount / maxSamples) * 100;

            // Progress indicator
            if (sampleCount % 10 === 0) {
                console.log(`📈 Progress: ${progress.toFixed(1)}% (${sampleCount}/${maxSamples} samples)`);
            }

            if (sampleCount >= maxSamples) {
                this.stop();
            }
        }, this.interval);
    }

    /**
     * Stop monitoring
     */
    stop() {
        if (!this.isRunning) return;

        console.log('⏹️  Stopping performance monitoring...');
        this.isRunning = false;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.calculateSummary();
        this.generateReport();
        console.log('✅ Performance monitoring completed!');
    }

    /**
     * Take a performance sample
     */
    takeSample() {
        const timestamp = Date.now();
        const uptime = os.uptime();

        // System memory
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUsagePercent = (usedMemory / totalMemory) * 100;

        // Process memory (if available)
        let processMemory = null;
        try {
            const pidusage = require('pidusage');
            const stats = pidusage.sync({ pid: this.pid });
            processMemory = {
                rss: stats.memory,
                cpu: stats.cpu,
                ctime: stats.ctime,
                elapsed: stats.elapsed
            };
        } catch (error) {
            // pidusage not available, skip process monitoring
        }

        // CPU usage (approximate)
        const cpuUsage = this.calculateCpuUsage();

        // Load average
        const loadAverage = os.loadavg();

        // Network interfaces
        const networkInterfaces = os.networkInterfaces();

        // Disk usage (if available)
        let diskUsage = null;
        try {
            const diskusage = require('diskusage');
            const diskInfo = diskusage.checkSync('/');
            diskUsage = {
                available: diskInfo.available,
                free: diskInfo.free,
                total: diskInfo.total,
                used: diskInfo.total - diskInfo.free,
                usagePercent: ((diskInfo.total - diskInfo.free) / diskInfo.total) * 100
            };
        } catch (error) {
            // diskusage not available, skip disk monitoring
        }

        return {
            timestamp,
            uptime,
            memory: {
                total: totalMemory,
                used: usedMemory,
                free: freeMemory,
                usagePercent: memoryUsagePercent
            },
            process: processMemory,
            cpu: {
                usage: cpuUsage,
                loadAverage: loadAverage
            },
            network: {
                interfaces: Object.keys(networkInterfaces)
            },
            disk: diskUsage
        };
    }

    /**
     * Calculate CPU usage (approximate)
     */
    calculateCpuUsage() {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;

        cpus.forEach(cpu => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });

        return ((totalTick - totalIdle) / totalTick) * 100;
    }

    /**
     * Calculate summary statistics
     */
    calculateSummary() {
        if (this.metrics.samples.length === 0) return;

        const samples = this.metrics.samples;
        const memoryUsage = samples.map(s => s.memory.usagePercent);
        const cpuUsage = samples.map(s => s.cpu.usage);
        const processCpu = samples.map(s => s.process?.cpu).filter(Boolean);
        const processMemory = samples.map(s => s.process?.rss).filter(Boolean);

        this.metrics.summary = {
            duration: samples.length * this.interval,
            sampleCount: samples.length,
            memory: {
                min: Math.min(...memoryUsage),
                max: Math.max(...memoryUsage),
                average: memoryUsage.reduce((a, b) => a + b, 0) / memoryUsage.length,
                median: this.calculateMedian(memoryUsage),
                p95: this.calculatePercentile(memoryUsage, 95),
                p99: this.calculatePercentile(memoryUsage, 99)
            },
            cpu: {
                min: Math.min(...cpuUsage),
                max: Math.max(...cpuUsage),
                average: cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length,
                median: this.calculateMedian(cpuUsage),
                p95: this.calculatePercentile(cpuUsage, 95),
                p99: this.calculatePercentile(cpuUsage, 99)
            },
            process: {
                cpu: processCpu.length > 0 ? {
                    min: Math.min(...processCpu),
                    max: Math.max(...processCpu),
                    average: processCpu.reduce((a, b) => a + b, 0) / processCpu.length
                } : null,
                memory: processMemory.length > 0 ? {
                    min: Math.min(...processMemory),
                    max: Math.max(...processMemory),
                    average: processMemory.reduce((a, b) => a + b, 0) / processMemory.length
                } : null
            }
        };
    }

    /**
     * Calculate median value
     */
    calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    /**
     * Calculate percentile value
     */
    calculatePercentile(values, percentile) {
        const sorted = [...values].sort((a, b) => a - b);
        const index = (percentile / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index % 1;

        if (upper >= sorted.length) return sorted[sorted.length - 1];
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    /**
     * Generate performance report
     */
    generateReport() {
        const reportPath = path.join(this.outputDir, `performance-monitor-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(this.metrics, null, 2));

        const summaryPath = path.join(this.outputDir, 'performance-monitor-summary.txt');
        const summary = this.generateSummaryText();
        fs.writeFileSync(summaryPath, summary);

        console.log(`\n📋 Performance Monitor Report Generated:`);
        console.log(`  Full Report: ${reportPath}`);
        console.log(`  Summary: ${summaryPath}`);
    }

    /**
     * Generate human-readable summary
     */
    generateSummaryText() {
        const { system, summary } = this.metrics;

        return `
PERFORMANCE MONITORING SUMMARY
==============================
Generated: ${this.metrics.timestamp}

SYSTEM INFORMATION
------------------
Platform: ${system.platform}
Architecture: ${system.arch}
CPU Cores: ${system.cpus}
Total Memory: ${(system.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB
Hostname: ${system.hostname}

MONITORING RESULTS
------------------
Duration: ${summary.duration / 1000}s
Samples Collected: ${summary.sampleCount}

MEMORY USAGE (%)
----------------
Minimum: ${summary.memory.min.toFixed(2)}%
Maximum: ${summary.memory.max.toFixed(2)}%
Average: ${summary.memory.average.toFixed(2)}%
Median: ${summary.memory.median.toFixed(2)}%
95th Percentile: ${summary.memory.p95.toFixed(2)}%
99th Percentile: ${summary.memory.p99.toFixed(2)}%

CPU USAGE (%)
-------------
Minimum: ${summary.cpu.min.toFixed(2)}%
Maximum: ${summary.cpu.max.toFixed(2)}%
Average: ${summary.cpu.average.toFixed(2)}%
Median: ${summary.cpu.median.toFixed(2)}%
95th Percentile: ${summary.cpu.p95.toFixed(2)}%
99th Percentile: ${summary.cpu.p99.toFixed(2)}%

${summary.process?.cpu ? `
PROCESS CPU USAGE (%)
---------------------
Minimum: ${summary.process.cpu.min.toFixed(2)}%
Maximum: ${summary.process.cpu.max.toFixed(2)}%
Average: ${summary.process.cpu.average.toFixed(2)}%
` : ''}

${summary.process?.memory ? `
PROCESS MEMORY USAGE (bytes)
----------------------------
Minimum: ${(summary.process.memory.min / 1024 / 1024).toFixed(2)} MB
Maximum: ${(summary.process.memory.max / 1024 / 1024).toFixed(2)} MB
Average: ${(summary.process.memory.average / 1024 / 1024).toFixed(2)} MB
` : ''}

PERFORMANCE ANALYSIS
--------------------
${this.generateAnalysis()}
    `.trim();
    }

    /**
     * Generate performance analysis
     */
    generateAnalysis() {
        const analysis = [];
        const { memory, cpu, process } = this.metrics.summary;

        // Memory analysis
        if (memory.average > 80) {
            analysis.push('⚠️  HIGH MEMORY USAGE: Average memory usage is above 80%');
        } else if (memory.average > 60) {
            analysis.push('⚡ MODERATE MEMORY USAGE: Memory usage is between 60-80%');
        } else {
            analysis.push('✅ GOOD MEMORY USAGE: Memory usage is within acceptable limits');
        }

        // CPU analysis
        if (cpu.average > 80) {
            analysis.push('⚠️  HIGH CPU USAGE: Average CPU usage is above 80%');
        } else if (cpu.average > 60) {
            analysis.push('⚡ MODERATE CPU USAGE: CPU usage is between 60-80%');
        } else {
            analysis.push('✅ GOOD CPU USAGE: CPU usage is within acceptable limits');
        }

        // Peak analysis
        if (memory.max > 90) {
            analysis.push('🚨 MEMORY PRESSURE: Peak memory usage exceeded 90%');
        }
        if (cpu.max > 90) {
            analysis.push('🚨 CPU PRESSURE: Peak CPU usage exceeded 90%');
        }

        // Process analysis
        if (process?.cpu && process.cpu.average > 50) {
            analysis.push('⚠️  HIGH PROCESS CPU: Process CPU usage is elevated');
        }
        if (process?.memory && process.memory.average > 100 * 1024 * 1024) { // 100MB
            analysis.push('⚠️  HIGH PROCESS MEMORY: Process memory usage is elevated');
        }

        if (analysis.length === 0) {
            analysis.push('✅ All performance metrics are within acceptable ranges');
        }

        return analysis.join('\n');
    }

    /**
     * Export metrics to CSV for analysis
     */
    exportToCSV() {
        const csvPath = path.join(this.outputDir, `performance-metrics-${Date.now()}.csv`);
        const headers = ['timestamp', 'memory_usage_percent', 'cpu_usage_percent', 'process_cpu', 'process_memory_mb'];
        const csvData = [headers.join(',')];

        this.metrics.samples.forEach(sample => {
            const row = [
                new Date(sample.timestamp).toISOString(),
                sample.memory.usagePercent.toFixed(2),
                sample.cpu.usage.toFixed(2),
                sample.process?.cpu?.toFixed(2) || '',
                sample.process?.rss ? (sample.process.rss / 1024 / 1024).toFixed(2) : ''
            ];
            csvData.push(row.join(','));
        });

        fs.writeFileSync(csvPath, csvData.join('\n'));
        console.log(`📊 CSV export: ${csvPath}`);
    }
}

// CLI interface
function main() {
    const args = process.argv.slice(2);
    let options = {};

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--duration':
            case '-d':
                options.duration = parseInt(args[++i]) * 1000;
                break;
            case '--interval':
            case '-i':
                options.interval = parseInt(args[++i]);
                break;
            case '--pid':
            case '-p':
                options.pid = parseInt(args[++i]);
                break;
            case '--output-dir':
            case '-o':
                options.outputDir = args[++i];
                break;
            case '--csv':
                options.exportCSV = true;
                break;
            case '--help':
            case '-h':
                console.log(`
Performance Monitor Usage:
  node memory-cpu-monitor.js [options]

Options:
  -d, --duration <seconds>    Monitoring duration in seconds (default: 60)
  -i, --interval <ms>         Sampling interval in milliseconds (default: 1000)
  -p, --pid <pid>             Process ID to monitor (default: current process)
  -o, --output-dir <dir>      Output directory for reports (default: ./performance-results)
  --csv                       Export metrics to CSV file
  -h, --help                  Show this help message

Examples:
  node memory-cpu-monitor.js -d 300 -i 500
  node memory-cpu-monitor.js --pid 12345 --csv
        `);
                return;
        }
    }

    const monitor = new PerformanceMonitor(options);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n⏹️  Received SIGINT, stopping monitor...');
        monitor.stop();
        if (options.exportCSV) {
            monitor.exportToCSV();
        }
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n⏹️  Received SIGTERM, stopping monitor...');
        monitor.stop();
        if (options.exportCSV) {
            monitor.exportToCSV();
        }
        process.exit(0);
    });

    monitor.start();

    // Auto-stop after duration
    setTimeout(() => {
        monitor.stop();
        if (options.exportCSV) {
            monitor.exportToCSV();
        }
    }, options.duration || 60000);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = PerformanceMonitor;