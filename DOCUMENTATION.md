# YUNOPS | Technical Documentation

## Architecture Overview

YUNOPS operates as a full-stack Node.js application.

### 1. Data Collection (`server.ts`)
The backend uses the `systeminformation` (SI) library to probe the host operating system. SI acts as a bridge, allowing the same code to work across Linux (Cloud Run), macOS, and Windows.

**Collected Primitives:**
-   **CPU Usage**: Percentage across all logical cores.
-   **Memory**: Active vs. Available RAM.
-   **Network**: Dynamic RX/TX (Inbound/Outbound) byte rates.
-   **OS Info**: Distributions, Kernels, and Hostnames.

### 2. Live Telemetry Flow
-   **Polling**: The frontend polls the `/api/metrics` endpoint every **1000ms**.
-   **Persistence**: The backend maintains a rolling history of the last 20 data points to render smooth Recharts area diagrams.

### 3. Components
-   **Overview**: Summary cards for quick health checks.
-   **Monitoring**: Deep-dive charts for CPU/Memory/Network.
-   **Security**: Table view of detected vulnerabilities.
-   **Deployments**: Mock container orchestration view.

### 4. Styling Conventions
-   **Color Palette**: Zinc/Slate dark theme with neon accent colors (Green for success, Red for risk, Blue for info).
-   **Glassmorphism**: Components use `backdrop-blur-md` and `bg-white/5` for a modern, depth-focused UI.

### 5. Running in Production
When deployed to Cloud Run or a Linux server, the app automatically scales to the host environment metrics.
