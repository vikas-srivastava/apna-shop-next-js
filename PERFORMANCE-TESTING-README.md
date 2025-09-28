# Performance Testing Suite

This comprehensive performance testing suite provides detailed analysis and optimization recommendations for your Next.js eCommerce application.

## 🚀 Quick Start

### Run All Performance Tests

```bash
npm run perf:all
```

### Run Quick Performance Tests

```bash
npm run perf:quick
```

### Run Individual Tests

```bash
# API Performance Testing
npm run perf:api

# Bundle Analysis
npm run perf:bundle

# Memory & CPU Monitoring
npm run perf:monitor

# Load Testing with Artillery
npm run perf:load

# Lighthouse Performance Audit
npm run perf:lighthouse
```

## 📊 Test Coverage

### 1. API Performance Testing

- **Response Time Analysis**: Measures response times for all API endpoints
- **Throughput Testing**: Tests requests per second under different loads
- **Error Rate Monitoring**: Tracks error rates and failure patterns
- **Concurrent User Simulation**: Tests performance with multiple simultaneous users

### 2. Bundle Analysis

- **Build Size Analysis**: Analyzes total bundle size and composition
- **Chunk Analysis**: Examines JavaScript chunks and their sizes
- **Asset Optimization**: Identifies opportunities for asset optimization
- **Dependency Analysis**: Reviews third-party library usage

### 3. System Performance Monitoring

- **Memory Usage Tracking**: Monitors memory consumption patterns
- **CPU Utilization**: Tracks CPU usage during operations
- **Process Monitoring**: Monitors Node.js process performance
- **Resource Analysis**: Identifies resource bottlenecks

### 4. Load Testing

- **Baseline Testing**: Single user performance baseline
- **Light Load**: 10 concurrent users
- **Medium Load**: 50 concurrent users
- **Heavy Load**: 100 concurrent users
- **Stress Testing**: 200+ concurrent users

### 5. Lighthouse Performance Audit

- **Core Web Vitals**: Measures LCP, FID, CLS
- **Performance Score**: Overall performance rating
- **Accessibility**: Accessibility compliance
- **Best Practices**: Code quality and optimization

## 📁 Test Results

All test results are saved in the `performance-results/` directory:

```
performance-results/
├── api-performance-report-1234567890.json
├── bundle-analysis-report.json
├── memory-cpu-report-1234567890.json
├── lighthouse-report.json
├── load-test-report.json
├── comprehensive-performance-report-1234567890.json
├── performance-summary.txt
└── performance-metrics-1234567890.csv
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_USE_MOCK=true
```

### Test Configuration

Edit the test scripts to customize:

- Test duration
- Concurrency levels
- API endpoints
- Performance thresholds

## 📈 Performance Metrics

### Key Metrics Measured

- **Response Time**: Min, max, average, percentiles (P50, P95, P99)
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Memory Usage**: Heap usage and garbage collection
- **CPU Utilization**: Process and system CPU usage
- **Bundle Size**: Total build size and composition
- **Cache Hit Rate**: Caching effectiveness

### Performance Thresholds

- **Response Time**: < 1000ms (good), < 2000ms (acceptable), > 2000ms (needs optimization)
- **Error Rate**: < 1% (excellent), < 5% (good), > 5% (needs attention)
- **Throughput**: > 50 req/sec (good), > 10 req/sec (acceptable)
- **Bundle Size**: < 2MB (good), < 5MB (acceptable), > 5MB (needs optimization)

## 🛠️ Tools Used

### Core Testing Tools

- **Artillery**: Load testing and performance measurement
- **Lighthouse CI**: Web performance auditing
- **Clinic.js**: Node.js performance profiling
- **Custom Scripts**: Specialized testing for eCommerce features

### Monitoring Tools

- **Memory/CPU Monitor**: Real-time system resource tracking
- **Bundle Analyzer**: Next.js build analysis
- **API Tester**: Comprehensive API performance testing

## 📋 Test Scenarios

### Load Testing Scenarios

1. **Product Browsing**: Simulates users browsing products and categories
2. **Authentication Flow**: Tests login, registration, and profile access
3. **Cart Operations**: Tests adding, updating, and removing cart items
4. **Search Operations**: Tests product search with various queries
5. **Checkout Flow**: Tests complete checkout process including payments

### Performance Testing Areas

1. **API Response Times**: All endpoints under different loads
2. **Database Performance**: Data retrieval and storage performance
3. **Memory Usage**: Memory consumption during operations
4. **CPU Usage**: CPU utilization during API calls
5. **Network Performance**: Bandwidth usage and connection efficiency
6. **Caching Effectiveness**: Cache hit rates and performance improvements
7. **Concurrent Users**: Performance under multiple simultaneous users
8. **Large Data Sets**: Performance with large product catalogs

## 🔍 Optimization Analysis

### Code Optimization

- Identifies bottlenecks in API routes and components
- Analyzes React component rendering performance
- Reviews state management efficiency

### Database Optimization

- Query performance analysis
- Index optimization recommendations
- Connection pooling configuration

### Caching Strategy

- Cache hit/miss ratio analysis
- Cache invalidation strategy review
- CDN implementation recommendations

### Bundle Analysis

- JavaScript bundle size optimization
- Code splitting opportunities
- Tree shaking effectiveness

## 📊 Reporting

### Comprehensive Reports

- **JSON Reports**: Detailed machine-readable results
- **Text Summaries**: Human-readable performance summaries
- **CSV Exports**: Data for further analysis
- **Visual Charts**: Performance trend visualization

### Report Contents

- Executive summary with key metrics
- Detailed performance analysis
- Optimization recommendations
- Scalability assessment
- Production readiness evaluation

## 🚨 Troubleshooting

### Common Issues

#### High Memory Usage

```bash
# Run memory profiling
npm run perf:monitor -- --duration 120

# Check for memory leaks
node -e "setInterval(() => console.log(process.memoryUsage()), 1000)"
```

#### Slow API Response Times

```bash
# Run detailed API testing
npm run perf:api -- --duration 60000 --concurrency 5

# Check database queries
npm run perf:api -- --verbose
```

#### Large Bundle Size

```bash
# Analyze bundle composition
npm run perf:bundle

# Check for unused dependencies
npm run build -- --analyze
```

#### High Error Rates

```bash
# Run error-focused testing
npm run perf:api -- --timeout 30000

# Check error logs
tail -f logs/error.log
```

## 🎯 Best Practices

### Performance Testing

1. **Baseline First**: Always establish baseline performance before optimization
2. **Realistic Scenarios**: Test with realistic user behavior patterns
3. **Monitor Resources**: Track system resources during testing
4. **Test Incrementally**: Start with small loads and increase gradually
5. **Document Changes**: Track performance changes after optimizations

### Optimization

1. **Profile Before Optimizing**: Identify actual bottlenecks before making changes
2. **Measure Impact**: Always measure performance impact of changes
3. **Consider Trade-offs**: Balance performance with functionality and maintainability
4. **Monitor Production**: Set up production performance monitoring
5. **Regular Testing**: Run performance tests regularly, not just before releases

## 📞 Support

For issues with the performance testing suite:

1. Check the troubleshooting section above
2. Review the generated reports for detailed error information
3. Run individual tests to isolate issues
4. Check system requirements and dependencies

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: Performance Tests
on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm run perf:quick
      - uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: performance-results/
```

### Automated Monitoring

Set up automated performance monitoring to track:

- Daily performance baselines
- Performance regression detection
- Resource usage trends
- Error rate monitoring

## 📈 Next Steps

1. **Run Initial Tests**: Execute the full test suite to establish baseline
2. **Review Results**: Analyze the generated reports and identify bottlenecks
3. **Implement Optimizations**: Apply recommended optimizations
4. **Re-test**: Run tests again to measure improvements
5. **Set Up Monitoring**: Implement continuous performance monitoring
6. **Regular Testing**: Schedule regular performance testing

---

**Note**: Performance testing requires the application to be running. Make sure to start the development server first:

```bash
npm run dev
```

Then run the performance tests in a separate terminal window.
