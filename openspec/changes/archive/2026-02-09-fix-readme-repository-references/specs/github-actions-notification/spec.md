## MODIFIED Requirements

### Requirement: Reusable Workflow Repository Reference
The reusable workflow SHALL use the correct GitHub repository path `HagiCode-org/haginotifier` for all usage examples and documentation.

#### Scenario: User copies usage example from README
- **WHEN** user copies the YAML configuration from README.md
- **THEN** the workflow reference `uses: HagiCode-org/haginotifier/.github/workflows/notify.yml@main` points to a valid repository

#### Scenario: User references specific version
- **WHEN** user pins to a specific version using `@v1.0.0`
- **THEN** the repository reference `HagiCode-org/haginotifier` is correctly specified

#### Scenario: User follows centralized configuration guide
- **WHEN** user follows the setup instructions in the "Option 1: Centralized Configuration" section
- **THEN** all example workflow references use `HagiCode-org/haginotifier`
