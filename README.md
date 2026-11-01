# OSRS — Online Student Registration System

A simple vanilla HTML/CSS/JavaScript web application created for Software Testing Laboratory experiments.

## Run

No server or build process is required.

1. Extract the folder.
2. Open `index.html` in Chrome or Firefox.
3. For best Selenium testing, serve the folder locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Demo accounts

### Student
- Email: `student@example.com`
- Password: `Student@123`

### Administrator
- Email: `admin@example.com`
- Password: `Admin@123`

## Functionalities covered by Experiment 2

- TC01: Valid login
- TC02: Wrong password
- TC03: Blank login fields
- TC04: Valid registration
- TC05: Duplicate e-mail registration
- TC06: Password/confirm-password mismatch
- TC07: Search `Mathematics`
- TC08: Search `xyz123`
- TC09: Logout
- TC10: Browser Back after logout

## Notes for testing

The application uses `localStorage` for student accounts/registrations and `sessionStorage` for the active login session. This is intentionally a lightweight educational implementation, not a production authentication system.

To reset test data, open browser DevTools → Application/Storage and clear the site's local/session storage.
