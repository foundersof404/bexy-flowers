# Database API Tests
# Tests the database proxy endpoint

param(
    [string]$BaseUrl = $env:NETLIFY_URL,
    [string]$ApiKey = $env:FRONTEND_API_KEY
)

# Configuration
if ([string]::IsNullOrEmpty($BaseUrl) -or $BaseUrl -eq "https://your-domain.netlify.app") {
    Write-Host "ERROR: NETLIFY_URL environment variable not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:NETLIFY_URL='https://your-domain.netlify.app'" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Yellow
    Write-Host "Common options:" -ForegroundColor Yellow
    Write-Host "  - Netlify default: https://bexyflowers.netlify.app" -ForegroundColor Yellow
    Write-Host "  - Custom domain: https://bexyflowers.shop (if configured)" -ForegroundColor Yellow
    exit 1
}

# Test domain resolution
Write-Host "Testing domain: $BaseUrl" -ForegroundColor Gray
try {
    $uri = [System.Uri]$BaseUrl
    $hostname = $uri.Host
    $dnsResult = [System.Net.Dns]::GetHostAddresses($hostname)
    if ($dnsResult.Count -eq 0) {
        Write-Host "WARNING: Domain '$hostname' does not resolve. Tests may fail." -ForegroundColor Yellow
        Write-Host "Check your DNS settings or use Netlify default domain." -ForegroundColor Yellow
    }
} catch {
    Write-Host "WARNING: Cannot resolve domain. Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Try using Netlify default domain: https://bexyflowers.netlify.app" -ForegroundColor Yellow
}

if ([string]::IsNullOrEmpty($ApiKey)) {
    Write-Host "ERROR: FRONTEND_API_KEY environment variable not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:FRONTEND_API_KEY='your-key'" -ForegroundColor Yellow
    exit 1
}

$Origin = "https://bexyflowers.shop"
$TestResults = @()

function Test-DatabaseAPI {
    param(
        [string]$TestName,
        [hashtable]$Headers,
        [string]$Body,
        [int]$ExpectedStatus,
        [string]$Description
    )
    
    Write-Host "`n[TEST] $TestName" -ForegroundColor Cyan
    Write-Host "  Description: $Description" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/.netlify/functions/database" `
            -Method POST `
            -Headers $Headers `
            -Body $Body `
            -UseBasicParsing `
            -ErrorAction Stop
        
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  [PASS] Status: $statusCode (expected $ExpectedStatus)" -ForegroundColor Green
            $script:TestResults += @{
                Test = $TestName
                Status = "PASS"
                Expected = $ExpectedStatus
                Actual = $statusCode
            }
            return $true
        } else {
            Write-Host "  [FAIL] Status: $statusCode (expected $ExpectedStatus)" -ForegroundColor Red
            $script:TestResults += @{
                Test = $TestName
                Status = "FAIL"
                Expected = $ExpectedStatus
                Actual = $statusCode
            }
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  [PASS] Status: $statusCode (expected $ExpectedStatus)" -ForegroundColor Green
            $script:TestResults += @{
                Test = $TestName
                Status = "PASS"
                Expected = $ExpectedStatus
                Actual = $statusCode
            }
            return $true
        } else {
            Write-Host "  [FAIL] Status: $statusCode (expected $ExpectedStatus)" -ForegroundColor Red
            Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
            $script:TestResults += @{
                Test = $TestName
                Status = "FAIL"
                Expected = $ExpectedStatus
                Actual = $statusCode
                Error = $_.Exception.Message
            }
            return $false
        }
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Database API Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

# Test 1: Missing API Key
$headers1 = @{
    "Content-Type" = "application/json"
    "Origin" = $Origin
}
$body1 = '{"operation": "select", "table": "test"}'
Test-DatabaseAPI -TestName "Missing API Key" `
    -Headers $headers1 `
    -Body $body1 `
    -ExpectedStatus 401 `
    -Description "Should reject requests without API key"

# Test 2: Invalid API Key
$headers2 = @{
    "Content-Type" = "application/json"
    "X-API-Key" = "invalid_key_12345"
    "Origin" = $Origin
}
$body2 = '{"operation": "select", "table": "test"}'
Test-DatabaseAPI -TestName "Invalid API Key" `
    -Headers $headers2 `
    -Body $body2 `
    -ExpectedStatus 401 `
    -Description "Should reject requests with invalid API key"

# Test 3: Invalid Origin
$headers3 = @{
    "Content-Type" = "application/json"
    "X-API-Key" = $ApiKey
    "Origin" = "https://malicious-site.com"
}
$body3 = '{"operation": "select", "table": "test"}'
Test-DatabaseAPI -TestName "Invalid Origin" `
    -Headers $headers3 `
    -Body $body3 `
    -ExpectedStatus 403 `
    -Description "Should reject requests from unauthorized origins"

# Test 4: Missing Required Fields
$headers4 = @{
    "Content-Type" = "application/json"
    "X-API-Key" = $ApiKey
    "Origin" = $Origin
}
$body4 = '{"operation": "select"}'
Test-DatabaseAPI -TestName "Missing Required Fields" `
    -Headers $headers4 `
    -Body $body4 `
    -ExpectedStatus 400 `
    -Description "Should reject requests missing required fields (table)"

# Test 5: Invalid Operation
$headers5 = @{
    "Content-Type" = "application/json"
    "X-API-Key" = $ApiKey
    "Origin" = $Origin
}
$body5 = '{"operation": "invalid_operation", "table": "test"}'
Test-DatabaseAPI -TestName "Invalid Operation" `
    -Headers $headers5 `
    -Body $body5 `
    -ExpectedStatus 400 `
    -Description "Should reject invalid operation types"

# Test 6: SQL Injection in Table Name
$headers6 = @{
    "Content-Type" = "application/json"
    "X-API-Key" = $ApiKey
    "Origin" = $Origin
}
$body6 = '{"operation": "select", "table": "users; DROP TABLE users; --"}'
Test-DatabaseAPI -TestName "SQL Injection in Table Name" `
    -Headers $headers6 `
    -Body $body6 `
    -ExpectedStatus 400 `
    -Description "Should reject SQL injection attempts in table name"

# Test 7: Valid Request (if you have a test table)
# Uncomment and modify if you have a test table
<#
$headers7 = @{
    "Content-Type" = "application/json"
    "X-API-Key" = $ApiKey
    "Origin" = $Origin
}
$body7 = '{"operation": "select", "table": "your_test_table", "filters": {}}'
Test-DatabaseAPI -TestName "Valid Query Request" `
    -Headers $headers7 `
    -Body $body7 `
    -ExpectedStatus 200 `
    -Description "Should accept valid query requests"
#>

# Summary
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$passed = ($TestResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($TestResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $TestResults.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "`nFailed Tests:" -ForegroundColor Red
    $TestResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Test): Expected $($_.Expected), Got $($_.Actual)" -ForegroundColor Red
    }
    exit 1
}

