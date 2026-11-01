# Experiment 2 — Suggested Actual Results / Status

Use the following actions on the OSRS application.

| ID | Action | Expected | Typical Actual | Status |
|---|---|---|---|---|
| TC01 | Login with `student@example.com` / `Student@123` | Dashboard appears | Dashboard appears with "Welcome, Demo Student" | Pass |
| TC02 | Login with valid username and wrong password | Error message | "Invalid username or password." | Pass |
| TC03 | Leave both login fields blank and click Login | Required-field validation | Browser required-field validation prevents submission | Pass |
| TC04 | Register with a new email and matching passwords | Account created | "Account created successfully." and login page appears | Pass |
| TC05 | Register using `student@example.com` | Duplicate email error | "Error: e-mail already registered." | Pass |
| TC06 | Enter different password and confirmation | Password mismatch error | "Error: passwords do not match." | Pass |
| TC07 | Search `Mathematics` | Matching course listed | `MA201 - Mathematics` is listed | Pass |
| TC08 | Search `xyz123` | No results message | "No results found" | Pass |
| TC09 | Login, then click Logout | Session ends and login/home page appears | Home page appears and session is removed | Pass |
| TC10 | Login, logout, then press browser Back | Protected page not shown | Protected dashboard is blocked and login page is shown | Pass |

For a formal lab submission, replace "Typical Actual" with the result observed during your own execution and record Pass/Fail accordingly.
