# Running YunOps Locally on Windows

To see your own computer's real-time health and network traffic, follow these steps:

### Prerequisites:
1.  **Install Node.js**: Download from [nodejs.org](https://nodejs.org/).
2.  **Export Source**: In AI Studio, click **Settings (Gear Icon) -> Export to ZIP**.

### Installation:
1.  Extract the ZIP file to a folder on your computer.
2.  Double-click the **`start-windows.bat`** file.
    *   This will automatically install dependencies and start the app.
    *   It might take 1-2 minutes the first time.

### How it works:
-   The app uses the `systeminformation` library to talk directly to your Windows hardware.
-   **CPU Load**: Real usage from your processor cores.
-   **Memory**: Real usage of your local RAM.
-   **Network**: Real-time upload/download speeds of your primary network card.
-   **Security**: Scans the local node environment for compliance.

### Troubleshooting:
-   If `start-windows.bat` closes immediately, open a terminal (type `cmd` in the folder address bar) and run `node -v` to ensure Node.js is installed correctly.
