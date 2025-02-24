# Catenary Calculator Web Application

A web application for performing catenary calculations for mooring lines. This application provides both numerical results and interactive visualization of catenary curves.

## Project Structure

```
/
├── client/                 # React front-end application
│   ├── src/
│   │   ├── components/    # React components (InputForm, Results, etc.)
│   │   ├── utils/        # Calculation engine and helper modules
│   │   ├── data/         # Static data and component defaults
│   │   └── views/        # Full page views (Auth, Dashboard, etc.)
│   └── public/           # Static assets
│
└── server/               # Node.js/Express back-end
    └── server.js        # Main server file
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

### Development

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm start
   ```

The application will be available at `http://localhost:3000`

## Features

- Catenary calculations based on industry standards
- Interactive visualization
- Export functionality (PDF, CSV, Excel)
- User authentication and saved calculations
- QA view for detailed calculation steps
- Help guide and documentation
