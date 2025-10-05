# Aether GTM
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/aether-gtm)
Aether GTM is a groundbreaking, AI-native system designed to autonomously execute an entire Go-To-Market (GTM) lifecycle. At its core is a central Orchestration Agent that manages a team of specialized subordinate agents, each responsible for a specific function: Sales Development, Engagement, Deal Desk, FinOps, and Expansion.
The system operates on a 'default autonomous' principle, where AI agents handle 100% of GTM operations. Human intervention is reserved for oversight and exception handling, facilitated through a brutalist 'Mission Control' web UI. Humans initiate a mission by providing a high-level payload (goals, budget, brand voice) and then monitor progress, adjust global constraints, and approve or deny escalations triggered by a predefined policy engine.
## Key Features
-   **Autonomous GTM Execution:** An AI-powered Orchestration Agent manages the entire GTM lifecycle from prospecting to expansion.
-   **Specialized AI Agents:** A team of subordinate agents for Sales, Engagement, Deals, FinOps, and Expansion, each an expert in their domain.
-   **Mission Control UI:** A stark, functional, oversight-only dashboard for human monitoring, constraint control, and exception handling.
-   **Policy-Driven Escalation:** A robust policy engine determines when human-in-the-loop (HITL) intervention is required for high-stakes decisions.
-   **Real-time Monitoring:** Live event feeds and analytics provide complete transparency into agent operations and mission performance.
-   **Built on Cloudflare:** Leverages the power and scalability of Cloudflare Workers and Durable Objects for stateful, persistent agents.
## Technology Stack
-   **Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
-   **Backend:** Hono on Cloudflare Workers
-   **State Management:** Cloudflare Durable Objects, Zustand
-   **Language:** TypeScript
-   **Tooling:** Bun, Vite
## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.
### Installation & Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/aether_gtm.git
    cd aether_gtm
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
3.  **Configure Environment Variables:**
    Create a `.dev.vars` file in the root of the project for local development. This file is used by Wrangler to inject secrets into your worker.
    ```ini
    # .dev.vars
    # This is a placeholder. The Aether GTM demo does not require a live AI gateway
    # as it runs a simulation. However, the variable must be present.
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/ACCOUNT_ID/GATEWAY/openai"
    CF_AI_API_KEY="not_required_for_demo"
    ```
    Replace `ACCOUNT_ID` and `GATEWAY` with your Cloudflare details.
### Running the Development Server
To start the development server, which includes both the Vite frontend and the Cloudflare Worker backend, run:
```bash
bun dev
```
This will:
-   Start the Vite development server for the React frontend, typically on `http://localhost:3000`.
-   Start a local Wrangler server for the Hono backend, which the frontend will proxy API requests to.
## Usage
Once the application is running, you can access the Mission Control UI in your browser. The dashboard provides an overview of the GTM mission, including:
-   **Metrics Display:** Key performance indicators like budget, CAC, and pipeline value.
-   **Mission Parameters:** The core goals and constraints of the current mission.
-   **Escalation Queue:** A list of pending decisions that require human approval.
-   **Live Event Feed:** A real-time stream of actions being taken by the AI agents.
The UI is designed for oversight. Your primary interactions will be to monitor progress and handle escalations as they appear.
## Deployment
This project is designed to be deployed seamlessly to the Cloudflare global network.
1.  **Build the application:**
    ```bash
    bun build
    ```
2.  **Deploy to Cloudflare:**
    ```bash
    bun deploy
    ```
    This command will build the application, then deploy the worker and static assets to your Cloudflare account. Wrangler will guide you through the process if it's your first time deploying.
    Alternatively, deploy directly from your GitHub repository:
    [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/aether-gtm)
## Project Structure
-   `src/`: Contains the React frontend application code.
    -   `components/`: Reusable UI components, including layout and dashboard elements.
    -   `pages/`: Top-level view components for each page/route.
    -   `lib/`: Utility functions and API services.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `orchestration-agent.ts`: The core `OrchestrationAgent` Durable Object class.
    -   `userRoutes.ts`: Hono API route definitions.
    -   `types.ts`: Shared TypeScript types for frontend and backend.
-   `wrangler.jsonc`: Configuration file for the Cloudflare Worker, including bindings and build settings.
-   `tailwind.config.js`: Configuration for Tailwind CSS.
## Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request.
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
## License
This project is licensed under the MIT License.