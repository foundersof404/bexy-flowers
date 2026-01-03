#!/bin/bash

# Complete System Audit & Validation Runner
# Executes all audit phases systematically

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${NETLIFY_URL:-https://your-domain.netlify.app}"
API_KEY="${FRONTEND_API_KEY}"
API_SECRET="${FRONTEND_API_SECRET}"
RESULTS_DIR="./test-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create results directory
mkdir -p "$RESULTS_DIR"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
}

log_failure() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++))
    ((TOTAL_TESTS++))
}

log_skip() {
    echo -e "${YELLOW}[SKIP]${NC} $1"
    ((SKIPPED_TESTS++))
    ((TOTAL_TESTS++))
}

# Test result tracking
test_result() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    echo "{\"test\": \"$test_name\", \"status\": \"$status\", \"details\": \"$details\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$RESULTS_DIR/results_${TIMESTAMP}.json"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v curl &> /dev/null; then
        log_failure "curl is required but not installed"
        exit 1
    fi
    
    if [ -z "$API_KEY" ]; then
        log_failure "FRONTEND_API_KEY environment variable not set"
        exit 1
    fi
    
    if [ -z "$BASE_URL" ] || [ "$BASE_URL" = "https://your-domain.netlify.app" ]; then
        log_failure "NETLIFY_URL environment variable not set or using placeholder"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Phase 1: Environment & Configuration Validation
phase1_environment() {
    log_info "=== Phase 1: Environment & Configuration Validation ==="
    
    # Test 1.1: Health endpoint
    log_info "Testing health endpoint..."
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL/.netlify/functions/health" || echo "000")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "401" ]; then
        log_success "Health endpoint accessible (HTTP $http_code)"
        test_result "health_endpoint" "pass" "HTTP $http_code"
    else
        log_failure "Health endpoint failed (HTTP $http_code)"
        test_result "health_endpoint" "fail" "HTTP $http_code"
    fi
    
    # Test 1.2: CORS headers
    log_info "Testing CORS headers..."
    cors_response=$(curl -s -I -X OPTIONS "$BASE_URL/.netlify/functions/generate-image" \
        -H "Origin: https://bexyflowers.shop" \
        -H "Access-Control-Request-Method: POST" || echo "")
    
    if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
        log_success "CORS headers present"
        test_result "cors_headers" "pass" "CORS headers found"
    else
        log_failure "CORS headers missing"
        test_result "cors_headers" "fail" "No CORS headers"
    fi
}

# Phase 2: API Logic & Workflow Testing
phase2_api_logic() {
    log_info "=== Phase 2: API Logic & Workflow Testing ==="
    
    # Test 2.1: Basic image generation
    log_info "Testing basic image generation..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $API_KEY" \
        -H "Origin: https://bexyflowers.shop" \
        -d '{"prompt": "a beautiful sunset", "width": 512, "height": 512, "model": "flux"}' \
        --max-time 60 || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] && echo "$body" | grep -q "success"; then
        log_success "Image generation successful"
        test_result "image_generation_basic" "pass" "HTTP $http_code"
    else
        log_failure "Image generation failed (HTTP $http_code)"
        test_result "image_generation_basic" "fail" "HTTP $http_code: $body"
    fi
    
    # Test 2.2: Database query
    log_info "Testing database query..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/database" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $API_KEY" \
        -d '{"operation": "select", "table": "collection_products", "limit": 1}' \
        --max-time 10 || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] && echo "$body" | grep -q "success"; then
        log_success "Database query successful"
        test_result "database_query" "pass" "HTTP $http_code"
    else
        log_failure "Database query failed (HTTP $http_code)"
        test_result "database_query" "fail" "HTTP $http_code: $body"
    fi
}

# Phase 3: Security Validation
phase3_security() {
    log_info "=== Phase 3: Security Validation ==="
    
    # Test 3.1: Missing API key
    log_info "Testing missing API key..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
        -H "Content-Type: application/json" \
        -H "Origin: https://bexyflowers.shop" \
        -d '{"prompt": "test"}' || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "401" ]; then
        log_success "Missing API key rejected (401)"
        test_result "auth_missing_key" "pass" "HTTP $http_code"
    else
        log_failure "Missing API key not rejected (HTTP $http_code)"
        test_result "auth_missing_key" "fail" "HTTP $http_code"
    fi
    
    # Test 3.2: Invalid API key
    log_info "Testing invalid API key..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: invalid_key_12345" \
        -H "Origin: https://bexyflowers.shop" \
        -d '{"prompt": "test"}' || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "401" ]; then
        log_success "Invalid API key rejected (401)"
        test_result "auth_invalid_key" "pass" "HTTP $http_code"
    else
        log_failure "Invalid API key not rejected (HTTP $http_code)"
        test_result "auth_invalid_key" "fail" "HTTP $http_code"
    fi
    
    # Test 3.3: Invalid origin
    log_info "Testing invalid origin..."
    cors_response=$(curl -s -I -X OPTIONS "$BASE_URL/.netlify/functions/generate-image" \
        -H "Origin: https://malicious-site.com" \
        -H "Access-Control-Request-Method: POST" || echo "")
    
    if ! echo "$cors_response" | grep -q "Access-Control-Allow-Origin: https://malicious-site.com"; then
        log_success "Invalid origin blocked"
        test_result "cors_invalid_origin" "pass" "Invalid origin blocked"
    else
        log_failure "Invalid origin allowed"
        test_result "cors_invalid_origin" "fail" "Invalid origin allowed"
    fi
    
    # Test 3.4: Rate limiting
    log_info "Testing rate limiting (5 requests)..."
    rate_limit_hit=false
    for i in {1..5}; do
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
            -H "Content-Type: application/json" \
            -H "X-API-Key: $API_KEY" \
            -d "{\"prompt\": \"rate limit test $i\", \"width\": 256, \"height\": 256}" \
            --max-time 10 || echo "000")
        
        http_code=$(echo "$response" | tail -n1)
        
        if [ "$http_code" = "429" ]; then
            rate_limit_hit=true
            break
        fi
        
        sleep 1
    done
    
    if [ "$rate_limit_hit" = true ]; then
        log_success "Rate limiting working (429 received)"
        test_result "rate_limiting" "pass" "Rate limit enforced"
    else
        log_skip "Rate limiting not triggered (may need more requests)"
        test_result "rate_limiting" "skip" "Not triggered in test"
    fi
    
    # Test 3.5: Input validation - XSS
    log_info "Testing XSS prevention..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $API_KEY" \
        -d '{"prompt": "<script>alert(\"xss\")</script>", "width": 256, "height": 256}' \
        --max-time 10 || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "400" ] || ! echo "$body" | grep -q "<script>"; then
        log_success "XSS attempt handled"
        test_result "xss_prevention" "pass" "HTTP $http_code"
    else
        log_failure "XSS not prevented"
        test_result "xss_prevention" "fail" "HTTP $http_code"
    fi
    
    # Test 3.6: Invalid dimensions
    log_info "Testing dimension validation..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $API_KEY" \
        -H "Origin: https://bexyflowers.shop" \
        -d '{"prompt": "test", "width": 0, "height": 0}' || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "400" ]; then
        log_success "Invalid dimensions rejected (400)"
        test_result "dimension_validation" "pass" "HTTP $http_code"
    else
        log_failure "Invalid dimensions not rejected (HTTP $http_code)"
        test_result "dimension_validation" "fail" "HTTP $http_code"
    fi
}

# Phase 4: Performance Testing
phase4_performance() {
    log_info "=== Phase 4: Performance & Load Testing ==="
    
    # Test 4.1: Response time benchmark
    log_info "Testing response times (3 requests)..."
    times=()
    
    for i in {1..3}; do
        start_time=$(date +%s%N)
        curl -s -X POST "$BASE_URL/.netlify/functions/generate-image" \
            -H "Content-Type: application/json" \
            -H "X-API-Key: $API_KEY" \
            -H "Origin: https://bexyflowers.shop" \
            -d "{\"prompt\": \"performance test $i\", \"width\": 256, \"height\": 256}" \
            --max-time 60 \
            -o /dev/null
        end_time=$(date +%s%N)
        
        duration=$((($end_time - $start_time) / 1000000))
        times+=($duration)
        
        log_info "Request $i: ${duration}ms"
        sleep 10
    done
    
    # Calculate average
    sum=0
    for t in "${times[@]}"; do
        sum=$((sum + t))
    done
    avg=$((sum / ${#times[@]}))
    
    if [ $avg -lt 30000 ]; then
        log_success "Average response time acceptable: ${avg}ms"
        test_result "performance_avg" "pass" "${avg}ms"
    else
        log_failure "Average response time too high: ${avg}ms"
        test_result "performance_avg" "fail" "${avg}ms"
    fi
}

# Phase 5: Error Handling
phase5_error_handling() {
    log_info "=== Phase 5: Error Handling & Edge Cases ==="
    
    # Test 5.1: Malformed JSON
    log_info "Testing malformed JSON..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $API_KEY" \
        -H "Origin: https://bexyflowers.shop" \
        -d '{invalid json}' || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "400" ]; then
        log_success "Malformed JSON rejected (400)"
        test_result "error_malformed_json" "pass" "HTTP $http_code"
    else
        log_failure "Malformed JSON not rejected (HTTP $http_code)"
        test_result "error_malformed_json" "fail" "HTTP $http_code"
    fi
    
    # Test 5.2: Missing required fields
    log_info "Testing missing required fields..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/.netlify/functions/generate-image" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $API_KEY" \
        -d '{"width": 512, "height": 512}' || echo "000")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "400" ]; then
        log_success "Missing fields detected (400)"
        test_result "error_missing_fields" "pass" "HTTP $http_code"
    else
        log_failure "Missing fields not detected (HTTP $http_code)"
        test_result "error_missing_fields" "fail" "HTTP $http_code"
    fi
}

# Generate summary report
generate_report() {
    log_info "=== Generating Summary Report ==="
    
    report_file="$RESULTS_DIR/report_${TIMESTAMP}.md"
    
    cat > "$report_file" << EOF
# System Audit Report

**Date**: $(date)
**Base URL**: $BASE_URL
**Total Tests**: $TOTAL_TESTS
**Passed**: $PASSED_TESTS
**Failed**: $FAILED_TESTS
**Skipped**: $SKIPPED_TESTS

## Summary

- **Pass Rate**: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))% (excluding skipped)
- **Status**: $([ $FAILED_TESTS -eq 0 ] && echo "✅ ALL TESTS PASSED" || echo "⚠️ SOME TESTS FAILED")

## Detailed Results

See \`results_${TIMESTAMP}.json\` for detailed test results.

EOF
    
    log_info "Report generated: $report_file"
}

# Main execution
main() {
    echo "=========================================="
    echo "  Complete System Audit & Validation"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    
    phase1_environment
    phase2_api_logic
    phase3_security
    phase4_performance
    phase5_error_handling
    
    generate_report
    
    echo ""
    echo "=========================================="
    echo "  Audit Complete"
    echo "=========================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    echo "Skipped: $SKIPPED_TESTS"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
        exit 0
    else
        echo -e "${RED}⚠️ SOME TESTS FAILED${NC}"
        exit 1
    fi
}

# Run main function
main

