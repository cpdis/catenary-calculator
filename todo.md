# TODO.md

This document outlines all tasks required to build the catenary calculation application. The project is split into front-end (React) and back-end (Node.js/Express) parts and is designed to be built iteratively. Each section corresponds to a functional module or development prompt from the high-level blueprint.

---

## Overview

- **Project Description:**  
  Build a web application for performing catenary calculations. The app includes a calculation engine, interactive visualization, export functionality, user authentication, a saved calculations dashboard, and additional settings and QA views.

- **Technologies & Libraries:**  
  - Front-end: React, D3.js/Chart.js, React Router  
  - Back-end: Node.js, Express  
  - Export: jsPDF (PDF), SheetJS (Excel), CSV utilities  
  - Additional: Concurrent process handling, logging utilities, local storage for settings

---

## A. Project Setup

### 1. Repository & Directory Structure
- [x] **Initialize Repository:**
  - Create a new repository with two main directories: `/client` and `/server`.

- [x] **Client Setup:**
  - In `/client`, initialize a new React application (e.g., using Create React App).
  - Create the following directory structure within `/client/src`:
    - `components/` – for React components (InputForm, ResultsDisplay, CatenaryVisualization, ExportResults, etc.)
    - `utils/` – for helper modules (calculation engine, logger)
    - `data/` – for static datasets (component defaults)
    - `views/` – for full-page views (Authentication screens, Dashboard, HelpGuide, QAView, UserSettings)

- [x] **Server Setup:**
  - In `/server`, set up a basic Node.js/Express server.
  - Create initial configuration files such as `package.json` and a minimal `server.js` to later handle API endpoints for authentication, saving calculations, and logging.

- [x] **Concurrent Running:**
  - Configure the project so that both client and server run concurrently (e.g., using the `concurrently` package or proxy configuration in the React app).

---

## B. Core Functional Modules

### 1. Calculation Engine
- [x] **Create Module:**
  - File: `/client/src/utils/catenaryCalculator.js`
  - [x] Export one or more functions to perform catenary calculations.
  - [x] Accept inputs (fairlead tension, water depth, component details).
  - [x] Return outputs: fairlead angle, grounded length, anchor distance, anchor angle, anchor tension.
  - [x] Use dummy or simplified formulas as placeholders.
  - [x] Add inline comments to note where industry-standard formulas will be integrated later.

### 2. Embedded Component Dataset
- [x] **Create Dataset File:**
  - File: `/client/src/data/componentDefaults.js`
  - [x] Define and export a JavaScript object/array containing default values for various component types.
  - [x] Each entry should include:
    - Component Type (string)
    - Component Size (numeric)
    - Component Length (numeric)
    - Component Weight (numeric)
    - Component Stiffness (E) (numeric)
    - Component MBL (numeric)
  - [x] Provide several sample entries for testing and default value displays.

### 3. User Input & Validation (Input Form)
- [x] **Build InputForm Component:**
  - File: `/client/src/components/InputForm.js`
  - [x] Design a form to collect:
    - Fairlead Tension (numeric)
    - Water Depth (numeric)
    - Component Details: Type, Length, Size, Weight, Stiffness, MBL (using selects and numeric/text inputs)
  - [x] Implement inline validation:
    - Required fields
    - Positive numeric values
  - [x] Display inline error messages next to each field.
  - [x] Include a summary error notification area.
  - [x] Add a “Calculate” button that will trigger the calculation process.

### 4. Visualization Component
- [x] **Build CatenaryVisualization Component:**
  - File: `/client/src/components/CatenaryVisualization.js`
  - [x] Use a visualization library (D3.js or Chart.js) to render an interactive catenary curve.
  - [x] Enable features such as zoom, pan, and tooltips.
  - [x] Ensure responsiveness (side-by-side on desktop; stacked on smaller screens).

### 5. Calculation Trigger & Results Display
- [x] **Wire “Calculate” Button:**
  - [x] In `InputForm.js`, create an event handler for the “Calculate” button.
  - [x] On click, call the function(s) from `catenaryCalculator.js` with the input values.
  - [x] Handle input errors before processing.
  - [x] Pass the returned numerical results to a parent component or dedicated results component.

- [x] **Build ResultsDisplay Component:**
  - File: `/client/src/components/ResultsDisplay.js`
  - [x] Accept numerical results as props.
  - [x] Format and display outputs (fairlead angle, grounded length, anchor distance, anchor angle, anchor tension).
  - [x] If no data is available, show a default “no data” message.

### 6. Export and Save Functionality
- [x] **Build ExportResults Component:**
  - File: `/client/src/components/ExportResults.js`
  - [x] Implement functions to export current results to:
    - PDF (using jsPDF)
    - CSV (convert data to CSV string and trigger download)
    - Excel (using SheetJS or similar)
  - [x] Add export buttons for each format.
  - [x] Integrate with the current calculation state (inputs, outputs, metadata).

### 7. User Authentication & Dashboard
- [x] **Authentication Screens:**
  - Files:  
    - `/client/src/views/Login.js`
    - `/client/src/views/Register.js`
    - `/client/src/views/PasswordRecovery.js`
  - [x] Create forms for each with appropriate fields (email, password, etc.).
  - [x] Implement client-side validation.
  - [x] Set up API calls for authentication actions (to be implemented on the server).

- [x] **Saved Calculations Dashboard:**
  - File: `/client/src/views/Dashboard.js`
  - [x] List saved calculations along with metadata (Company, Rig Name, Field Name, Date).
  - [x] Implement CRUD operations:
    - **Create:** Save current calculation with metadata.
    - **Read:** Display a list of saved calculations.
    - **Update:** Edit metadata or re-run a saved calculation.
    - **Delete:** Remove a saved calculation.
  - [x] Ensure the dashboard is accessible only when authenticated.

### 8. Additional Views & Logging
- [x] **QA View:**
  - File: `/client/src/views/QAView.js`
  - [x] Build a hidden view that shows detailed calculation steps and formulas.
  - [x] Toggle visibility from the main app.

- [x] **Help Guide:**
  - File: `/client/src/views/HelpGuide.js`
  - [x] Provide user instructions, field explanations, calculation process details, and export options.

- [x] **Logging Module:**
  - File: `/client/src/utils/logger.js`
  - [x] Implement functions to:
    - Count total calculations
    - Record processing time for each calculation
  - [x] Integrate logger into the calculation engine without affecting UI performance.

- [x] **User Settings/Preferences:**
  - File: `/client/src/views/UserSettings.js`
  - [x] Allow users to set default measurement units (e.g., ft, lbs, m, kg).
  - [x] Enable adjustment of the visualization scale.
  - [x] Persist changes via local storage or backend storage.
  - [x] Wire settings to affect all related components.

---

## C. Iterative Development Approach (Prompt-by-Prompt)

### Prompt 1: Project Scaffolding
- [x] Initialize repository with `/client` and `/server` directories.
- [x] Create initial configuration files:
  - `/client/package.json`
  - `/server/package.json`
  - Minimal `/server/server.js` for Express.
  - Basic `/client/src/App.js` for React.
- [x] Configure client-server communication (via concurrently or proxy).

### Prompt 2: Develop the Calculation Engine Module
- [x] In `/client/src/utils/catenaryCalculator.js`, implement dummy calculation formulas.
- [x] Document the placeholder functions with comments for future integration.

### Prompt 3: Create the Embedded Component Dataset
- [x] In `/client/src/data/componentDefaults.js`, define default component values.
- [x] Provide several sample entries.

### Prompt 4: Develop the Input Form Component
- [x] In `/client/src/components/InputForm.js`, create the form to collect inputs.
- [x] Implement inline validation and error messaging.
- [x] Include a “Calculate” button to trigger the calculation.

### Prompt 5: Add the "Calculate" Button Functionality
- [x] Wire the “Calculate” button in `InputForm.js` to:
  - Validate input data.
  - Call the calculation engine.
  - Update state with numerical results.
  - Pass results to parent or dedicated component.

### Prompt 6: Build a Results Display Component
- [x] In `/client/src/components/ResultsDisplay.js`, create a component to show:
  - Fairlead angle, grounded length, anchor distance, anchor angle, anchor tension.
- [x] Handle no-data state appropriately.

### Prompt 7: Create the Catenary Visualization Component
- [x] In `/client/src/components/CatenaryVisualization.js`, build an interactive diagram:
  - Render the catenary curve using D3.js/Chart.js.
  - Support zoom, pan, and tooltips.
  - Ensure responsiveness and dynamic updates.

### Prompt 8: Assemble the Main App Component
- [x] In `/client/src/App.js` (or a dedicated container), integrate:
  - `InputForm`
  - `ResultsDisplay`
  - `CatenaryVisualization`
- [x] Ensure state flows correctly:
  - InputForm triggers calculation.
  - ResultsDisplay shows outputs.
  - Visualization renders the catenary curve.
- [x] Implement responsive layout (side-by-side on desktop, stacked on mobile).

### Prompt 9: Add Export Functionality for Results
- [x] In `/client/src/components/ExportResults.js`, implement:
  - PDF export (using jsPDF)
  - CSV export (data conversion and download)
  - Excel export (using SheetJS)
- [x] Integrate export buttons and ensure they access the current calculation state.

### Prompt 10: Develop User Authentication Screens
- [x] In `/client/src/views/`, create:
  - `Login.js`
  - `Register.js`
  - `PasswordRecovery.js`
- [x] Build forms with client-side validation.
- [x] Set up API call placeholders for authentication actions.
- [x] Integrate authentication views using React Router.

### Prompt 11: Create the Saved Calculations Dashboard
- [x] In `/client/src/views/Dashboard.js`, build the dashboard:
  - List saved calculations with metadata.
  - Implement CRUD functionality (Create, Read, Update, Delete).
- [x] Connect dashboard to backend API endpoints (to be developed).

### Prompt 12: Build the QA View and Help Guide
- [x] In `/client/src/views/`, create:
  - `QAView.js` for detailed intermediate steps (hidden by default, toggleable).
  - `HelpGuide.js` for user instructions.
- [x] Ensure seamless navigation between the calculator and these views.

### Prompt 13: Create a Logging Module
- [x] In `/client/src/utils/logger.js`, develop functions to:
  - Track calculation count.
  - Measure processing times.
- [x] Integrate logging into the calculation engine so that each calculation logs its start and end times.
- [x] Prepare the logs for future backend submission.

### Prompt 14: Develop the User Settings/Preferences Component
- [x] In `/client/src/views/UserSettings.js`, build a settings page:
  - Allow selection of default measurement units.
  - Enable adjustment of the visualization scale.
- [x] Use React state or context to ensure these settings affect all relevant components.
- [x] Persist settings (using local storage or via the backend).

### Prompt 15: Final Integration and Routing
- [x] Configure React Router (or your routing solution) in `App.js` or a dedicated router file:
  - Set up routes for the Calculator page, Dashboard, Authentication pages, User Settings, Help Guide, and QA View.
  - Secure routes so only authenticated users can access restricted pages.
- [x] Finalize responsive design:
  - Desktop: side-by-side layout.
  - Mobile: stacked layout.
- [x] Prepare deployment configuration:
  - Set environment variables.
  - Configure build scripts.
  - Establish proxy settings between client and server.

---

## Additional Notes

- **Documentation:**  
  Include inline documentation in every component and module to ensure clarity for future development.

- **State Management:**  
  Ensure smooth data flow from input collection (InputForm) to results (ResultsDisplay and Visualization).

- **Responsiveness:**  
  Test and adjust the layout for multiple screen sizes to guarantee a desktop-first responsive design.

- **Third-Party Libraries:**  
  Integrate libraries (D3.js, jsPDF, SheetJS, etc.) carefully and document their usage within the code.

- **API & Server Integration:**  
  As the back-end evolves, update API endpoints for authentication, saved calculations, and logging accordingly.

- **Testing:**  
  After each development prompt, test the module/component before proceeding to ensure full integration.
