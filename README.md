# FixMyCity

FixMyCity is a browser-based civic issue reporting site. Residents can submit and track local issues, while workers and administrators can manage assigned reports. It is built with plain HTML, CSS, and JavaScript; it does not need a build step or package installation.

## Features

- City dashboard with report statistics and category summaries
- Sign-up, sign-in, profile, and role-based pages
- Issue reports with descriptions, locations, and optional photos
- Complaint tracking and worker status updates
- Admin tools for managing worker roles
- Browser theme preference

## Requirements

- A current web browser with JavaScript, IndexedDB, and local storage enabled
- A local web server to serve the site. This is needed for dashboard data loading and browser APIs such as geolocation.

There are no JavaScript packages to install and no build command.

## Run the application

### Using Visual Studio Code and Live Server

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open `index.html` in the project root.
4. Right-click the file and choose **Open with Live Server**.
5. The site opens in your browser and redirects to the dashboard.

### Using Python's built-in web server

1. Open a terminal in the project root.
2. Start the server:

   ```powershell
   py -m http.server 5500
   ```

3. Open [http://localhost:5500](http://localhost:5500) in your browser.
4. The root page redirects to the dashboard. Keep the terminal open while using the site; press `Ctrl+C` to stop the server.

To use the current-location feature, allow location access when the browser asks. Browsers normally allow geolocation on `localhost` and secure HTTPS sites.

## Project folders

```text
FixMyCity/
├── index.html                 # Entry page
├── pages/                      # Page HTML
├── css/                        # Page and shared styles
├── js/                         # Page behavior and shared scripts
│   └── helpers/                # Reusable browser/data helpers
│       └── database.js         # IndexedDB setup and data operations
├── data/                       # Dashboard JSON data
├── assets/                     # Logo and image assets
├── .gitignore
├── LICENSE
└── README.md
```

The page-specific JavaScript files are in `js/` (for example, `dashboard.js`, `report.js`, and `worker.js`).

## Storage and limitations

User accounts and complaints are stored in the browser with IndexedDB. Session and theme preferences use local storage. This means data stays in the current browser profile and is not shared between devices or users. The app is a frontend project and does not provide production-grade authentication or a shared server database.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).
