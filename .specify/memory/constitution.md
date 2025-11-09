<!--
Sync Impact Report:
Version change: 1.0.0 → 1.0.0 (initial creation)
Modified principles: N/A (new constitution)
Added sections: Core Principles, Code Quality Standards, Testing Standards, User Experience Standards, Performance Requirements, Development Workflow, Governance
Removed sections: N/A
Templates requiring updates: ✅ plan-template.md (constitution check section), ✅ spec-template.md (no changes needed), ✅ tasks-template.md (no changes needed)
Follow-up TODOs: None
-->

# Bigcapital Constitution

## Core Principles

### I. Code Quality First (NON-NEGOTIABLE)
All code MUST meet minimum quality standards before merge. TypeScript strict mode enabled across all packages. ESLint rules enforced with zero warnings. Code reviews MUST verify readability, maintainability, and adherence to established patterns. Complex logic MUST be documented with clear comments explaining business rules and edge cases.

### II. Test-Driven Development
Test coverage MUST exceed 80% for business logic. Unit tests written BEFORE implementation for new features. Integration tests required for API endpoints and database operations. E2E tests mandatory for critical user journeys. All tests MUST be deterministic and runnable in CI/CD pipeline.

### III. User Experience Consistency
UI components MUST follow Blueprint.js design system patterns. Consistent error handling and loading states across all interfaces. Accessibility standards (WCAG 2.1 AA) mandatory for all user-facing features. Internationalization support required for all user-visible text.

### IV. Performance Requirements
Frontend bundle size MUST not exceed 2MB gzipped. API response times MUST be under 200ms for 95th percentile. Database queries MUST be optimized with proper indexing. Real-time features MUST handle 1000+ concurrent connections without degradation.

### V. Security & Data Integrity
All user data MUST be encrypted in transit and at rest. Authentication tokens MUST use secure, short-lived JWT with refresh mechanism. Input validation MUST prevent SQL injection and XSS attacks. Audit logging required for all financial transactions and user actions.

## Code Quality Standards

### TypeScript & Static Analysis
- Strict mode enabled with `noImplicitAny`, `strictNullChecks`
- ESLint configuration with TypeScript-specific rules
- Prettier formatting enforced across all packages
- Import organization and unused import detection

### Code Organization
- Monorepo structure with clear package boundaries
- Shared utilities in `@bigcapital/utils` package
- Component library in `@bigcapital/email-components` and `@bigcapital/pdf-templates`
- Clear separation between frontend (`webapp`) and backend (`server`) concerns

### Documentation Requirements
- JSDoc comments for all public APIs and complex functions
- README files for each package with setup and usage instructions
- Architecture decisions documented in ADR format
- API documentation generated from code annotations

## Testing Standards

### Unit Testing
- Jest framework for all unit tests
- Minimum 80% code coverage for business logic
- Mock external dependencies (database, APIs, file system)
- Test files co-located with source code (`*.test.ts`, `*.spec.ts`)

### Integration Testing
- API endpoint testing with supertest
- Database integration tests with test database
- Component integration tests with React Testing Library
- Cross-package integration tests for shared utilities

### End-to-End Testing
- Playwright for critical user journeys
- Test data setup and teardown automation
- Visual regression testing for UI components
- Performance testing for key workflows

## User Experience Standards

### Design System Compliance
- Blueprint.js components used consistently across application
- Custom components MUST extend Blueprint.js patterns
- Color palette and typography from established design tokens
- Responsive design for desktop and tablet viewports

### Accessibility Requirements
- WCAG 2.1 AA compliance for all user interfaces
- Keyboard navigation support for all interactive elements
- Screen reader compatibility with proper ARIA labels
- Color contrast ratios meeting accessibility standards

### Internationalization
- All user-facing text MUST use i18n framework
- Date, time, and currency formatting per user locale
- Right-to-left language support where applicable
- Translation keys organized by feature and context

## Performance Requirements

### Frontend Performance
- Initial bundle size under 2MB gzipped
- Code splitting for route-based lazy loading
- Image optimization and lazy loading
- Service worker for offline functionality

### Backend Performance
- API response times under 200ms (95th percentile)
- Database query optimization with proper indexing
- Caching strategy for frequently accessed data
- Connection pooling and resource management

### Scalability Targets
- Support 1000+ concurrent users
- Handle 10,000+ financial transactions per hour
- Real-time updates for 500+ simultaneous connections
- Horizontal scaling capability for high availability

## Development Workflow

### Git & Version Control
- Feature branches from `develop` branch
- Conventional commit messages enforced by commitlint
- Pull request reviews required for all changes
- Automated CI/CD pipeline with quality gates

### Code Review Process
- Minimum 2 approvals for production changes
- Security review for authentication and financial features
- Performance review for database and API changes
- UX review for user interface modifications

### Release Management
- Semantic versioning for all packages
- Automated changelog generation
- Staged deployment (dev → staging → production)
- Rollback capability for critical issues

## Governance

This constitution supersedes all other development practices and MUST be followed by all contributors. Amendments require:
1. Documentation of the proposed change with rationale
2. Review by core maintainers
3. Migration plan for existing code
4. Version bump following semantic versioning rules

All pull requests MUST verify compliance with constitution principles. Complexity beyond these standards MUST be justified with business requirements and approved by technical leads.

**Version**: 1.0.0 | **Ratified**: 2024-12-19 | **Last Amended**: 2024-12-19