## ADDED Requirements

### Requirement: Composite Action Definition

The system SHALL provide a GitHub Action defined in `action.yml` using the composite action type.

#### Scenario: Action metadata is valid

- **WHEN** a user references the action with `uses: HagiCode-org/haginotifier@v1`
- **THEN** the action metadata is correctly loaded by GitHub Actions
- **AND** all defined inputs and outputs are available

#### Scenario: Action has proper branding

- **WHEN** the action appears in the GitHub Marketplace or workflow UI
- **THEN** the action displays with configured icon and color

### Requirement: Action Inputs

The action SHALL accept `message`, `msg_type`, and `title` as input parameters.

#### Scenario: Required message input

- **WHEN** a user invokes the action
- **THEN** the `message` parameter is required
- **AND** validation fails if `message` is not provided

#### Scenario: Optional msg_type with default

- **WHEN** a user invokes the action without specifying `msg_type`
- **THEN** the default value `"text"` is used
- **AND** the action executes without requiring this parameter

#### Scenario: Optional title parameter

- **WHEN** a user invokes the action without specifying `title`
- **THEN** the action executes successfully
- **AND** the notification is sent without a title

### Requirement: Action Outputs

The action SHALL provide `status`, `timestamp`, and `response` as output parameters.

#### Scenario: Success status on successful delivery

- **WHEN** the notification is successfully delivered to Feishu
- **THEN** the `status` output is set to `"success"`
- **AND** subsequent workflow steps can access this value

#### Scenario: Failure status on delivery error

- **WHEN** the notification delivery fails (network error, invalid webhook, etc.)
- **THEN** the `status` output is set to `"failure"`
- **AND** the `response` output contains error details

#### Scenario: Timestamp is always set

- **WHEN** the action completes execution
- **THEN** the `timestamp` output contains an ISO 8601 formatted timestamp
- **AND** the timestamp reflects when the notification attempt was made

#### Scenario: Response contains API response

- **WHEN** the Feishu API returns a response
- **THEN** the `response` output contains the raw API response
- **AND** the response is available for debugging and logging

### Requirement: Pre-compiled Execution

The action SHALL execute pre-compiled JavaScript from `dist/index.js` without requiring runtime TypeScript compilation.

#### Scenario: No tsx dependency at runtime

- **WHEN** the action executes in a workflow
- **THEN** `tsx` is not installed or required
- **AND** the action uses only Node.js runtime

#### Scenario: Compiled code is present

- **WHEN** a release tag is created
- **THEN** the `dist/index.js` file is present in the repository
- **AND** the compiled code is executable by Node.js 18+

### Requirement: Versioned Releases

The action SHALL support semantic versioning through Git tags.

#### Scenario: Version pinning by tag

- **WHEN** a user references `HagiCode-org/haginotifier@v1.0.0`
- **THEN** the exact code from that tagged release is executed
- **AND** changes to main branch do not affect the pinned version

#### Scenario: Major version alias

- **WHEN** a user references `HagiCode-org/haginotifier@v1`
- **THEN** the latest v1.x release is used
- **AND** breaking v2 changes do not affect v1 users
