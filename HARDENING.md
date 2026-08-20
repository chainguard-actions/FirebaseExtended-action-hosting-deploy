<!-- markdownlint-disable -->

# Hardening Report: FirebaseExtended--action-hosting-deploy/v0.10.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **FirebaseExtended--action-hosting-deploy/v0.10.0** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

All five workflow files reference `actions/checkout@v5` using a mutable version tag instead of a pinned 40-character commit SHA. This exposes the workflows to supply-chain attacks if the tag is moved to a malicious commit. All occurrences: check-build.yml (line 22), deploy-preview.yml (line 24), deploy-preview-with-version.yml (line 24), deploy-production.yml (line 9), test.yml (line 22).

Locations:

- `.github/workflows/check-build.yml:22`
- `.github/workflows/deploy-preview.yml:24`
- `.github/workflows/deploy-preview-with-version.yml:24`
- `.github/workflows/deploy-production.yml:9`
- `.github/workflows/test.yml:22`

### script-injection (severity: high)

Rule (a) violation: The 'Check outputs' run: block in deploy-preview.yml directly interpolates GitHub Actions expressions inside shell commands: `echo urls ${{steps.firebase_hosting_preview.outputs.url}}`, `echo expire_time ${{steps.firebase_hosting_preview.outputs.expire_time}}`, and `echo details_url ${{steps.firebase_hosting_preview.outputs.details_url}}`. The `steps.*.outputs.*` context is workflow-controllable and flows through YAML template substitution before the shell sees it, enabling command injection. These values should be passed via env: variables and double-quoted in the shell.

Locations:

- `.github/workflows/deploy-preview.yml:35`
- `.github/workflows/deploy-preview.yml:36`
- `.github/workflows/deploy-preview.yml:37`

### missing-permissions (severity: medium)

Three workflow files have no top-level `permissions:` key and no job-level `permissions:` key on any of their jobs. Without explicit permissions, workflows inherit the default repository token permissions (which may be broad). Each should declare minimal required permissions: check-build.yml, deploy-production.yml, and test.yml.

Locations:

- `.github/workflows/check-build.yml:1`
- `.github/workflows/deploy-production.yml:1`
- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, missing-permissions

**Notes:**

1. unpinned-uses: Replaced `actions/checkout@v5` with pinned SHA `fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09 # v5` in all 5 workflow files (check-build.yml, deploy-preview.yml, deploy-preview-with-version.yml, deploy-production.yml, test.yml). 2. script-injection: Fixed deploy-preview.yml 'Check outputs' step by moving the three steps.*.outputs.* expressions into an env: block (PREVIEW_URL, EXPIRE_TIME, DETAILS_URL) and referencing them as double-quoted env vars in the shell. 3. missing-permissions: Added `permissions: {}` top-level block to check-build.yml, deploy-production.yml, and test.yml (the other two workflows already had job-level permissions: checks: write).

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed script injection in hardened/action/.github/workflows/deploy-preview.yml. The 'Check outputs' step's run script now double-quotes the $PREVIEW_URL, $EXPIRE_TIME, and $DETAILS_URL variables in the echo commands (e.g., echo "urls \"$PREVIEW_URL\""). The variables were already correctly moved to the step's env: block (not expanded inline from ${{ }} expressions), but the unquoted shell expansions still allowed shell metacharacters in the output values to be interpreted. Adding double quotes around each variable prevents this injection.

