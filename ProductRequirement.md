Product Requirement Document (PRD) for Carbonly.ai
1. Product Overview Carbonly.ai is a SaaS platform designed to calculate and report Scope 1 and Scope 2 carbon emissions, with future plans to incorporate Scope 3 emissions. The platform enables businesses to track their ESG (Environmental, Social, and Governance) data efficiently by leveraging AI-driven automation.
2. Objectives
	•	Provide automated carbon emission calculations based on uploaded reports
	•	Ensure compliance with ESG regulations
	•	Facilitate integration with third-party financial and operational tools
	•	Deliver AI-powered governance insights
	•	Store audit-ready data for regulatory and corporate use
	•	Enable mobile accessibility through a dedicated mobile app
	•	Provide external reporting capabilities via API data extraction
3. Key Features
3.1 Business Units & Projects
	•	A Business Unit is a virtual folder that can have multiple Projects within it.
	•	Business Units help separate and organize different projects under one entity.
	•	Users are invited to specific Business Units or Projects based on their roles.
	•	A Business Unit Admin can manage all associated projects and users within that unit.
	•	Joint Ventures allow multiple organizations to collaborate on a single project.
	•	Joint Venture setup includes percentage-based ownership (e.g., 60%/40% partnership).
	•	Each organization carries its own license, and either organization can pay for additional licenses if required.
	•	License management ensures correct billing and access for all participating entities.
	•	Users can set up integrations at the Business Unit or Project level to pull data from external sources.
3.2 File Processing Automation
	•	Users upload carbon-related reports (e.g., fuel consumption logs, invoices)
	•	AI scans and extracts relevant data
	•	Summarized emissions data is displayed per project or Business Unit.
	•	Users from different organizations can be invited to participate in Joint Ventures.
	•	Joint Venture setups require a percentage-based ownership model.
	•	License management ensures each organization carries its own license, with an option for one party to cover licensing costs if needed.
	•	Manual Data Entry: Users can manually input emission-related data for better accuracy and completeness.
	•	Data Import from Integrations:
	◦	Users can integrate with OneDrive, Google Drive, Xero, MYOB, JotForm, Microsoft Forms, APIs, and other platforms.
	◦	The system will fetch data on demand and provide an AI-powered preview before import.
	◦	AI will process the data offline where possible and attempt to map it to the Material Library.
	◦	Each material has configured Units of Measurement (UoM) and an Emission Factor to ensure accurate data mapping.
	◦	Users can modify data before final import.
	◦	Once imported, users can track the source of the data in Emission Data.
3.3 Material Library
	•	Users can import and manage materials and store them for future use.
	•	Emission data entries will be linked to specific materials for tracking.
	•	AI can suggest material emissions factors based on historical data and industry standards.
	•	Each material will be linked to Emission Categories and Sub-Categories, which will be constants in the database.
	•	Emission Categories define the classification of emissions (e.g., Energy, Transportation, Waste), while Sub-Categories refine the type of emission within each category.
3.4 API Engine & Mobile App
	•	A dedicated API engine will power integrations and enable seamless data exchange.
	•	The system will provide an external data extraction API for reporting and integration with third-party tools.
	•	A mobile app will be developed to provide users with access to emissions tracking, reporting, and incident logging on the go.
	•	The mobile app will support real-time data synchronization with the web platform.
3.5 Automated Folder Organization
	•	Successful files are moved to a ‘Processed’ folder
	•	Files with errors are moved to an ‘Error’ folder with diagnostics
3.6 Email Ingestion
	•	Each project has a unique email ID for direct file submission
	•	AI processes attachments and updates project data automatically
3.7 Third-Party Integrations
	•	Users can set up integrations at the Business Unit or Project level.
	•	Data ingestion from:
	◦	Xero, MYOB, Pronto, SAP (for procurement details)
	◦	Google Drive, OneDrive, SharePoint (for document storage)
	◦	HR systems (future integration for workforce-related carbon data)
	◦	JotForm, Microsoft Forms, API-based connections
3.8 Governance AI
	•	Social media scanning for governance risk insights
	•	AI-driven regulatory compliance checks
3.9 Environmental Incidents Tracking
	•	Users log environmental incidents such as spills, excess emissions
	•	AI categorizes incidents and provides impact assessments
3.10 Audit-Ready Data Storage
	•	Retain all processed data for auditor access
	•	Generate compliance reports on demand
3.11 AI Assistance Chat
	•	A floating AI chat button will be available on all pages.
	•	Users can ask natural language questions about their data.
	•	AI will provide real-time insights based on available emissions, reports, and incidents.
3.12 Modules & UI Structure
	•	Dashboard:
	◦	Recent Activities
	◦	Key Metrics
	◦	Emission Overview
	◦	Recently Accessed Projects
	◦	Scope 1 Dashboard
	◦	Scope 2 Dashboard
	◦	Scope 3 Dashboard
	•	Business Unit & Projects: Two tabs – Business Units and Projects – to manage emissions data at different levels.
	•	Material Library: Centralized database of materials linked to emissions, organized by Emission Categories and Sub-Categories.
	•	Emission Data: Displays processed and manually entered emission records.
	•	Incidents: Tracks and manages environmental incidents and reports.
	•	Reports: Allows users to generate compliance and analytical reports.
	•	Settings: Manages user roles, subscriptions, organization preferences, and integrations.
4. User Roles & Access
	•	SuperAdmin: Full control over the platform, including system-wide settings, user management, and security configurations.
	•	Org Admin: Manages organization-level settings, subscriptions, user management, and Single Sign-On (SSO) setup.
	•	Business Unit Admin: Manages projects, invites users, and configures settings within a specific Business Unit.
	•	Project Manager: Creates and manages projects, oversees reports.
	•	Contributor: Uploads files, views reports.
	•	Auditor: Access read-only data for compliance review.
5. Technical Requirements
	•	Cloud-hosted infrastructure with scalable architecture
	•	AI engine for document processing and data extraction
	•	Secure user authentication (SSO, OAuth support)
	•	Role-based access control
	•	API integrations for third-party data sources
	•	Dedicated API engine for mobile app and data extraction
6. Compliance & Security
	•	GDPR and ISO 27001 compliance
	•	Data encryption (at-rest and in-transit)
	•	Regular security audits and penetration testing
7. Roadmap
	•	MVP Launch (Q3 2025)
	◦	Core file processing and emissions calculations
	◦	Folder organisation and email ingestion
	◦	Incident tracking module
	◦	Initial third-party integrations
	•	Phase 2 (Q4 2025 - Q1 2026)
	◦	Governance AI and ESG risk analysis
	◦	Expanded third-party integrations (SAP, HR systems)
	◦	Mobile App Development
	•	Future Enhancements (2026+)
	◦	AI-driven regulatory reporting
	◦	Scope 3 emissions calculations
	◦	Custom dashboards and advanced analytics
8. Success Metrics
	•	User adoption rate
	•	Accuracy of AI-based data extraction
	•	Reduction in manual ESG reporting efforts
	•	Number of successful integrations with third-party tools

