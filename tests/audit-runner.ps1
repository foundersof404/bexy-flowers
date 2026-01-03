# Complete System Audit & Validation Runner (PowerShell)
# Executes all audit phases systematically

param(
    [string]$BaseUrl = $env:NETLIFY_URL,
    [string]$ApiKey = $env:FRONTEND_API_KEY,
    [string]$ApiSecret = $env:FRONTEND_API_SECRET
)

# Configuration
if ([string]::IsNullOrEmpty($BaseUrl) -or $BaseUrl -eq "https://your-domain.netlify.app") {
    Write-Host "ERROR: NETLIFY_URL environment variable not set" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrEmpty($ApiKey)) {
    Write-Host "ERROR: FRONTEND_API_KEY environment variable not set" -ForegroundColor Red
    exit 1
}

$ResultsDir = ".\test-results"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Create results directory
if (-not (Test-Path $ResultsDir)) {
    New-Item -ItemType Directory -Path $ResultsDir | Out-Null
}

# Test counters
$script:TotalTests = 0
$script:PassedTests = 0
$script:FailedTests = 0
$script:SkippedTests = 0
$script:Results = @()

# Logging functions
function Log-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Log-Success {
    param([string]$Message)
    Write-Host "[PASS] $Message" -ForegroundColor Green
    $script:TotalTests++
    $script:PassedTests++
}

function Log-Failure {
    param([string]$Message)
    Write-Host "[FAIL] $Message" -ForegroundColor Red
    $script:TotalTests++
    $script:FailedTests++
}

function Log-Skip {
    param([string]$Message)
    Write-Host "[SKIP] $Message" -ForegroundColor Yellow
    $script:TotalTests++
    $script:SkippedTests++
}

function Test-Result {
    param(
        [string]$TestName,
        [string]$Status,
        [string]$Details
    )
    
    $result = @{
        test = $TestName
        status = $Status
        details = $Details
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    }
    
    $script:Results += $result
}

# Phase 1: Environment & Configuration Validation
function Phase1-Environment {
    Write-Host "=== Phase 1: Environment & Configuration Validation ===" -ForegroundColor Cyan
    
    # Test 1.1: Health endpoint
    Log-Info "Testing health endpoint..."
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/health" -Method GET -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 401) {
            Log-Success "Health endpoint accessible (HTTP $($response.StatusCode))"
            Test-Result "health_endpoint" "pass" "HTTP $($response.StatusCode)"
        } else {
            Log-Failure "Health endpoint failed (HTTP $($response.StatusCode))"
            Test-Result "health_endpoint" "fail" "HTTP $($response.StatusCode)"
        }
    } catch {
        Log-Failure "Health endpoint error: $($_.Exception.Message)"
        Test-Result "health_endpoint" "fail" $_.Exception.Message
    }
    
    # Test 1.2: CORS headers
    Log-Info "Testing CORS headers..."
    try {
        $headers = @{
            "Origin" = "https://bexyflowers.shop"
            "Access-Control-Request-Method" = "POST"
        }
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/generate-image" -Method OPTIONS -Headers $headers -UseBasicParsing -ErrorAction Stop
        
        if ($response.Headers["Access-Control-Allow-Origin"]) {
            Log-Success "CORS headers present"
            Test-Result "cors_headers" "pass" "CORS headers found"
        } else {
            Log-Failure "CORS headers missing"
            Test-Result "cors_headers" "fail" "No CORS headers"
        }
    } catch {
        Log-Failure "CORS test error: $($_.Exception.Message)"
        Test-Result "cors_headers" "fail" $_.Exception.Message
    }
}

# Phase 2: API Logic & Workflow Testing
function Phase2-ApiLogic {
    Write-Host "=== Phase 2: API Logic & Workflow Testing ===" -ForegroundColor Cyan
    
    # Test 2.1: Basic image generation
    Log-Info "Testing basic image generation..."
    try {
        $body = @{
            prompt = "a beautiful sunset"
            width = 512
            height = 512
            model = "flux"
        } | ConvertTo-Json
        
        $headers = @{
            "Content-Type" = "application/json"
            "X-API-Key" = $ApiKey
            "Origin" = "https://bexyflowers.shop"
        }
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/generate-image" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -UseBasicParsing `
            -TimeoutSec 60 `
            -ErrorAction Stop
        
        $responseBody = $response.Content | ConvertFrom-Json
        
        if ($response.StatusCode -eq 200 -and $responseBody.success) {
            Log-Success "Image generation successful"
            Test-Result "image_generation_basic" "pass" "HTTP $($response.StatusCode)"
        } else {
            Log-Failure "Image generation failed (HTTP $($response.StatusCode))"
            Test-Result "image_generation_basic" "fail" "HTTP $($response.StatusCode)"
        }
    } catch {
        Log-Failure "Image generation error: $($_.Exception.Message)"
        Test-Result "image_generation_basic" "fail" $_.Exception.Message
    }
}

# Phase 3: Security Validation
function Phase3-Security {
    Write-Host "=== Phase 3: Security Validation ===" -ForegroundColor Cyan
    
    # Test 3.1: Missing API key
    Log-Info "Testing missing API key..."
    try {
        $body = @{ prompt = "test" } | ConvertTo-Json
        $headers = @{
            "Content-Type" = "application/json"
            "Origin" = "https://bexyflowers.shop"
        }
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/generate-image" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -UseBasicParsing `
            -ErrorAction Stop
        
        Log-Failure "Missing API key not rejected (HTTP $($response.StatusCode))"
        Test-Result "auth_missing_key" "fail" "HTTP $($response.StatusCode)"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Log-Success "Missing API key rejected (401)"
            Test-Result "auth_missing_key" "pass" "HTTP 401"
        } else {
            Log-Failure "Unexpected error: $($_.Exception.Message)"
            Test-Result "auth_missing_key" "fail" $_.Exception.Message
        }
    }
    
    # Test 3.2: Invalid API key
    Log-Info "Testing invalid API key..."
    try {
        $body = @{ prompt = "test" } | ConvertTo-Json
        $headers = @{
            "Content-Type" = "application/json"
            "X-API-Key" = "invalid_key_12345"
            "Origin" = "https://bexyflowers.shop"
        }
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/generate-image" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -UseBasicParsing `
            -ErrorAction Stop
        
        Log-Failure "Invalid API key not rejected (HTTP $($response.StatusCode))"
        Test-Result "auth_invalid_key" "fail" "HTTP $($response.StatusCode)"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Log-Success "Invalid API key rejected (401)"
            Test-Result "auth_invalid_key" "pass" "HTTP 401"
        } else {
            Log-Failure "Unexpected error: $($_.Exception.Message)"
            Test-Result "auth_invalid_key" "fail" $_.Exception.Message
        }
    }
    
    # Test 3.3: Invalid dimensions
    Log-Info "Testing dimension validation..."
    try {
        $body = @{
            prompt = "test"
            width = 0
            height = 0
        } | ConvertTo-Json
        
        $headers = @{
            "Content-Type" = "application/json"
            "X-API-Key" = $ApiKey
            "Origin" = "https://bexyflowers.shop"
        }
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/generate-image" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -UseBasicParsing `
            -ErrorAction Stop
        
        Log-Failure "Invalid dimensions not rejected (HTTP $($response.StatusCode))"
        Test-Result "dimension_validation" "fail" "HTTP $($response.StatusCode)"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Log-Success "Invalid dimensions rejected (400)"
            Test-Result "dimension_validation" "pass" "HTTP 400"
        } else {
            Log-Failure "Unexpected error: $($_.Exception.Message)"
            Test-Result "dimension_validation" "fail" $_.Exception.Message
        }
    }
}

# Phase 4: Performance Testing
function Phase4-Performance {
    Write-Host "=== Phase 4: Performance & Load Testing ===" -ForegroundColor Cyan
    
    # Test 4.1: Response time benchmark
    Log-Info "Testing response times (3 requests)..."
    $times = @()
    
    for ($i = 1; $i -le 3; $i++) {
        $body = @{
            prompt = "performance test $i"
            width = 256
            height = 256
        } | ConvertTo-Json
        
        $headers = @{
            "Content-Type" = "application/json"
            "X-API-Key" = $ApiKey
            "Origin" = "https://bexyflowers.shop"
        }
        
        $startTime = Get-Date
        try {
            $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/generate-image" `
                -Method POST `
                -Headers $headers `
                -Body $body `
                -UseBasicParsing `
                -TimeoutSec 60 `
                -ErrorAction Stop
            
            $endTime = Get-Date
            $duration = ($endTime - $startTime).TotalMilliseconds
            $times += $duration
            
            Log-Info "Request $i : $([math]::Round($duration))ms"
        } catch {
            Log-Failure "Request $i failed: $($_.Exception.Message)"
        }
        
        Start-Sleep -Seconds 10
    }
    
    if ($times.Count -gt 0) {
        $avg = ($times | Measure-Object -Average).Average
        
        if ($avg -lt 30000) {
            Log-Success "Average response time acceptable: $([math]::Round($avg))ms"
            Test-Result "performance_avg" "pass" "$([math]::Round($avg))ms"
        } else {
            Log-Failure "Average response time too high: $([math]::Round($avg))ms"
            Test-Result "performance_avg" "fail" "$([math]::Round($avg))ms"
        }
    }
}

# Phase 5: Error Handling
function Phase5-ErrorHandling {
    Write-Host "=== Phase 5: Error Handling & Edge Cases ===" -ForegroundColor Cyan
    
    # Test 5.1: Malformed JSON
    Log-Info "Testing malformed JSON..."
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "X-API-Key" = $ApiKey
            "Origin" = "https://bexyflowers.shop"
        }
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/generate-image" `
            -Method POST `
            -Headers $headers `
            -Body "{invalid json}" `
            -UseBasicParsing `
            -ErrorAction Stop
        
        Log-Failure "Malformed JSON not rejected (HTTP $($response.StatusCode))"
        Test-Result "error_malformed_json" "fail" "HTTP $($response.StatusCode)"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Log-Success "Malformed JSON rejected (400)"
            Test-Result "error_malformed_json" "pass" "HTTP 400"
        } else {
            Log-Failure "Unexpected error: $($_.Exception.Message)"
            Test-Result "error_malformed_json" "fail" $_.Exception.Message
        }
    }
}

# Generate summary report
function Generate-Report {
    Log-Info "=== Generating Summary Report ==="
    
    $reportFile = "$ResultsDir\report_$Timestamp.md"
    $passRate = if ($script:TotalTests -gt 0) { [math]::Round(($script:PassedTests * 100) / ($script:TotalTests - $script:SkippedTests)) } else { 0 }
    $status = if ($script:FailedTests -eq 0) { "✅ ALL TESTS PASSED" } else { "⚠️ SOME TESTS FAILED" }
    
    $report = @"
# System Audit Report

**Date**: $(Get-Date)
**Base URL**: $BaseUrl
**Total Tests**: $script:TotalTests
**Passed**: $script:PassedTests
**Failed**: $script:FailedTests
**Skipped**: $script:SkippedTests

## Summary

- **Pass Rate**: $passRate% (excluding skipped)
- **Status**: $status

## Detailed Results

See `results_$Timestamp.json` for detailed test results.
"@
    
    $report | Out-File -FilePath $reportFile -Encoding UTF8
    
    # Save JSON results
    $jsonFile = "$ResultsDir\results_$Timestamp.json"
    $script:Results | ConvertTo-Json -Depth 10 | Out-File -FilePath $jsonFile -Encoding UTF8
    
    Log-Info "Report generated: $reportFile"
}

# Main execution
function Main {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  Complete System Audit & Validation" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Phase1-Environment
    Phase2-ApiLogic
    Phase3-Security
    Phase4-Performance
    Phase5-ErrorHandling
    
    Generate-Report
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  Audit Complete" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Total Tests: $script:TotalTests"
    Write-Host "Passed: $script:PassedTests" -ForegroundColor Green
    Write-Host "Failed: $script:FailedTests" -ForegroundColor $(if ($script:FailedTests -eq 0) { "Green" } else { "Red" })
    Write-Host "Skipped: $script:SkippedTests" -ForegroundColor Yellow
    Write-Host ""
    
    if ($script:FailedTests -eq 0) {
        Write-Host "✅ ALL TESTS PASSED" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "⚠️ SOME TESTS FAILED" -ForegroundColor Red
        exit 1
    }
}

# Run main function
Main

