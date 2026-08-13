<!-- markdownlint-disable -->

# Hardening Report: FirebaseExtended--action-hosting-deploy/v0.11.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **FirebaseExtended--action-hosting-deploy/v0.11.0** was hardened automatically. 3 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

All five workflow files reference `actions/checkout@v5` using a mutable version tag instead of a full 40-character commit SHA. A tag can be moved to point at a different (potentially malicious) commit at any time, enabling supply-chain attacks. Each file should pin to a specific SHA, e.g. `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v5`.

Locations:

- `.github/workflows/check-build.yml:21`
- `.github/workflows/deploy-preview.yml:24`
- `.github/workflows/deploy-preview-with-version.yml:24`
- `.github/workflows/deploy-production.yml:10`
- `.github/workflows/test.yml:21`

### script-injection (severity: high)

Sub-rule (a): The 'Check outputs' step in deploy-preview.yml directly interpolates `${{steps.firebase_hosting_preview.outputs.url}}`, `${{steps.firebase_hosting_preview.outputs.expire_time}}`, and `${{steps.firebase_hosting_preview.outputs.details_url}}` inside a `run:` shell command. These `steps.*.outputs.*` values flow through YAML template substitution before the shell sees them, allowing an attacker who can influence the action's outputs to inject arbitrary shell commands. The values must be passed via `env:` variables and then double-quoted in the shell script.

Locations:

- `.github/workflows/deploy-preview.yml:35`
- `.github/workflows/deploy-preview.yml:36`
- `.github/workflows/deploy-preview.yml:37`

### missing-permissions (severity: medium)

Three workflow files have no top-level `permissions:` key and no job-level `permissions:` key on any of their jobs. Without an explicit permissions block, workflows inherit the repository's default token permissions (which may be `write-all`). A minimal explicit `permissions:` block (e.g. `contents: read`) should be added to each file to follow the principle of least privilege.

Locations:

- `.github/workflows/check-build.yml:1`
- `.github/workflows/deploy-production.yml:1`
- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, missing-permissions

**Notes:**

1. Pinned all five `actions/checkout@v5` references to SHA `fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09` with `# v5` comment in check-build.yml, deploy-preview.yml, deploy-preview-with-version.yml, deploy-production.yml, and test.yml. 2. Fixed script injection in deploy-preview.yml by moving the three `steps.firebase_hosting_preview.outputs.*` expressions into an `env:` block (PREVIEW_URL, EXPIRE_TIME, DETAILS_URL) and referencing them as double-quoted env vars in the shell script. 3. Added top-level `permissions: contents: read` to check-build.yml, deploy-production.yml, and test.yml (the three files that had no permissions block).

