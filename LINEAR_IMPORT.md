## Importing the FlashTalk backlog into Linear

Follow these steps to create team and projects, then import the CSV:

1. Create team "FlashTalk"
   - In Linear, go to Settings → Teams → Create team
   - Team name: FlashTalk
   - Key: FT (or preferred)

2. Create projects
   - Project "API"
   - Project "UX/UI"

3. Add labels (optional but recommended)
   - security, authentication, backend, realtime, messaging, performance, search, files, observability, validation, data-lifecycle, research, pwa, accessibility, notifications, integrations, safety, compliance, privacy, ci, infrastructure, devops

4. Import the CSV
   - Open the team "FlashTalk"
   - Click Import → CSV
   - Select file: `linear_backlog.csv`
   - Map columns:
     - Title → Title
     - Description → Description
     - Team → Team (or preselect team FlashTalk if prompted)
     - Project → Project (ensure projects API and UX/UI exist)
     - Priority → Priority (P0 highest → P3 lowest)
     - Labels → Labels (comma separated)

5. Review after import
   - Spot-check a few issues to ensure Team and Project mapped correctly
   - Create views for API and UX/UI projects, filter by Priority P0/P1 to start
   - Assign owners and add estimates if you track them

Notes
- You can re-import safely; Linear will create new issues. For updates, prefer editing in Linear.
- If your workspace uses different priority scales or custom fields, adjust the CSV or mapping during import.
