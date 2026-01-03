# Complete System Audit & Validation

Automated test suite for comprehensive backend API validation.

## Quick Start

### Prerequisites

1. Set environment variables:
   ```bash
   export NETLIFY_URL="https://your-domain.netlify.app"
   export FRONTEND_API_KEY="your-api-key"
   export FRONTEND_API_SECRET="your-api-secret"  # Optional
   ```

2. Install dependencies:
   - `curl` (for bash script)
   - PowerShell (for PowerShell script)

### Running Tests

#### Linux/Mac (Bash):
```bash
chmod +x tests/audit-runner.sh
./tests/audit-runner.sh
```

#### Windows (PowerShell):
```powershell
.\tests\audit-runner.ps1
```

## Test Phases

### Phase 1: Environment & Configuration
- Health endpoint accessibility
- CORS headers validation
- Environment variable checks

### Phase 2: API Logic & Workflow
- Image generation (basic)
- Database operations (CRUD)
- Request/response validation

### Phase 3: Security Validation
- Authentication (API key)
- CORS protection
- Rate limiting
- Input validation (XSS, SQL injection)
- Dimension validation

### Phase 4: Performance Testing
- Response time benchmarks
- Load testing
- Cold start performance

### Phase 5: Error Handling
- Malformed JSON handling
- Missing required fields
- Invalid data types

## Results

Test results are saved in `test-results/`:
- `report_TIMESTAMP.md` - Human-readable report
- `results_TIMESTAMP.json` - Machine-readable results

## Manual Testing

For detailed manual testing, see `AUDIT_PLAN.md` in the root directory.

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Security Audit
  run: |
    export NETLIFY_URL="${{ secrets.NETLIFY_URL }}"
    export FRONTEND_API_KEY="${{ secrets.FRONTEND_API_KEY }}"
    ./tests/audit-runner.sh
```

