## High-Level Blueprint Overview

**A. Project Setup**  
1. **Scaffolding:**  
   - Create a repository with separate directories (for example, a `/client` for the React single-page application and a `/server` for the back-end API).  
   - Use a tool like Create React App (or your framework of choice) to quickly bootstrap the front-end.  
   - Set up a simple Node.js/Express server (or use a service like Firebase) for user authentication, saving calculations, and logging.

2. **Directory Structure:**  
   - **/client/src**  
     - `components/` – React components for InputForm, Results, Visualization, etc.  
     - `utils/` – Calculation engine and helper modules.  
     - `data/` – Embedded dataset for component defaults.  
     - `views/` – Pages for Authentication, Dashboard, Help Guide, QA View, and Settings.  
   - **/server/**  
     - API endpoints for authentication, saved calculations, and logging.

---

**B. Core Functional Modules**

1. **Calculation Engine:**  
   - A module that accepts inputs (fairlead tension, water depth, component details) and returns outputs (fairlead angle, grounded length, etc.) using industry-standard formulas (to be researched and integrated).

2. **Embedded Component Dataset:**  
   - A static data file containing default values for different component types and specifications.

3. **User Input & Validation:**  
   - A form that gathers all necessary inputs, validates them (both inline and on-submit), and handles errors.

4. **Visualization:**  
   - An interactive diagram (using D3.js or Chart.js) to render the catenary curve with features like zoom, pan, and tooltips.
   - Responsive layout: side-by-side on desktop; stacked on narrower screens.

5. **Calculation Trigger & Results Display:**  
   - A dedicated “Calculate” button that triggers the calculation engine.
   - A results area to show numerical outputs alongside the visualization.

6. **Export and Save:**  
   - Functionality to export the complete result (including a snapshot of the diagram) to PDF, CSV, and Excel.
   - A mechanism to save results with metadata (Company, Rig Name, Field Name, Date).

7. **User Authentication & Dashboard:**  
   - Registration, login, and password recovery screens.
   - A dashboard for saved calculations with filtering, editing, and deleting capabilities.

8. **Additional Views & Logging:**  
   - A hidden QA view for detailed intermediate steps.
   - An accessible Help Guide.
   - Custom logging for counting calculations and measuring processing time.
   - A user settings page for default measurement units and visualization scale.

---

**C. Iterative Development Approach**

Each development chunk will be designed to build on the previous work. The steps below are organized so that every code-generation prompt produces self-contained code that then “wires together” with earlier components:

1. **Step 1:** Project scaffolding and initial React app setup.  
2. **Step 2:** Create the calculation engine module.  
3. **Step 3:** Set up the embedded static dataset.  
4. **Step 4:** Build the input form component with inline validation.  
5. **Step 5:** Implement the “Calculate” button that integrates with the calculation engine.  
6. **Step 6:** Build a results display component for numerical outputs.  
7. **Step 7:** Develop the visualization component (using D3.js/Chart.js) for the catenary curve.  
8. **Step 8:** Wire Input Form, Calculation Engine, Results Display, and Visualization into the main App component.  
9. **Step 9:** Implement export functionality (PDF, CSV, Excel) integrated with the current results.  
10. **Step 10:** Create user authentication screens (registration, login, password recovery).  
11. **Step 11:** Build the saved calculations dashboard with CRUD operations.  
12. **Step 12:** Develop additional views: QA view and Help Guide.  
13. **Step 13:** Add logging and analytics into the calculation flow.  
14. **Step 14:** Create a user settings component for measurement units and visualization scale.  
15. **Step 15:** Final integration, responsive design adjustments, routing, and deployment configuration.

---

## Iterative Code-Generation Prompts

Each prompt below is intended to be used one at a time with your code-generation LLM. They build incrementally on each other:

---

**Prompt 1: Create the project scaffolding.**

1. Initialize a new repository with two main directories: `/client` and `/server`.
2. In `/client`, set up a new React application (using Create React App or your preferred method).
3. Create the following directory structure within `/client/src`:
   - `components/` (to hold React components)
   - `utils/` (for helper modules and the calculation engine)
   - `data/` (for the embedded component dataset)
   - `views/` (for full pages like Authentication, Dashboard, Help, etc.)
4. In `/server`, set up a basic Node.js Express server that will later serve as the API backend for authentication and saving calculations.
5. Ensure that both the client and server can run concurrently (for example, by using concurrently or setting up proxy configuration in the React app).

Please output the basic configuration files (e.g., package.json for both client and server, a minimal Express server file, and a basic App.js file in React) so that the project is bootstrapped and the client and server can communicate.

**Prompt 2: Develop the Calculation Engine module.**

1. In `/client/src/utils/`, create a file named `catenaryCalculator.js`.
2. Write a JavaScript module that exports a function (or multiple functions) to perform catenary calculations. The function should accept inputs such as:
   - Fairlead Tension
   - Water Depth
   - Component Type, Length, Size, Weight, Stiffness (E), MBL, etc.
3. For now, implement dummy formulas (or simplified versions of the industry-standard formulas) that return placeholder output values:
   - Fairlead Angle
   - Grounded Length
   - Anchor Distance
   - Anchor Angle
   - Anchor Tension
4. Document the function(s) with comments indicating where to integrate the real formulas later.

Ensure the module is exportable so it can be imported and used in

**Prompt 3: Create the Embedded Component Dataset.**

1. In `/client/src/data/`, create a file named `componentDefaults.js`.
2. Define and export a JavaScript object or array that contains default values for various component types. Each component should include:
   - Component Type (as a string)
   - Component Size (numeric)
   - Component Length (numeric)
   - Component Weight (numeric)
   - Component Stiffness (E) (numeric)
   - Component MBL (Maximum Breaking Load) (numeric)
3. Provide a few sample entries so that later the application can show default values when the user does not specify one.

The dataset should be easily importable into form components or calculation modules.

**Prompt 4: Develop the Input Form component.**

1. In `/client/src/components/`, create a React component file named `InputForm.js`.
2. Design a form that collects the following inputs:
   - Fairlead Tension (numeric input)
   - Water Depth (numeric input)
   - Component Details (using a combination of select/dropdown and text/number inputs for: Type, Length, Size, Weight, Stiffness, MBL)
3. Implement inline validation for each field (e.g., required fields, positive numeric values).
4. Display inline error messages beside each field and include a summary error notification when the user clicks the “Calculate” button (error messages can be shown in a temporary notification area).
5. Use React state to manage form input values and validation states.

End the component by including a “Calculate” button that will later be wired to trigger the calculation.

**Prompt 5: Add the "Calculate" button functionality.**

1. Within the `InputForm` component created in Prompt 4, ensure the “Calculate” button triggers an event handler.
2. In the event handler, call the function from the `catenaryCalculator.js` module (created in Prompt 2) using the values from the form.
3. Capture the returned numerical results and update the component’s state accordingly.
4. Make sure to handle errors (such as missing or invalid inputs) before calling the calculation function.
5. Wire the event so that once the calculation completes, the numerical results are passed to a parent component or a dedicated results display component (to be built in the next prompt).

Document the code clearly so that later prompts can integrate the results.

**Prompt 6: Build a Results Display component.**

1. In `/client/src/components/`, create a new file named `ResultsDisplay.js`.
2. Develop a React component that accepts numerical results (fairlead angle, grounded length, anchor distance, anchor angle, anchor tension) as props.
3. Format and display these values in a clean, user-friendly layout.
4. Ensure that if no data is available (e.g., before any calculation), the component either remains hidden or shows a default “no data” message.
5. Include brief inline documentation so that the parent component can easily pass down the results.

This component should be designed to later integrate into the main App component with the input form and visualization.

**Prompt 7: Create the Catenary Visualization component.**

1. In `/client/src/components/`, create a file named `CatenaryVisualization.js`.
2. Using a visualization library such as D3.js (or Chart.js if preferred), develop a component that:
   - Accepts calculation output (or the necessary parameters to compute a catenary curve).
   - Renders an interactive diagram of the catenary mooring line.
   - Supports basic interactivity: zoom, pan, and tooltips on key points of the curve.
3. Structure the component so that it updates dynamically when new data is passed in.
4. Ensure the component is responsive (adapts to screen size) and can be easily embedded alongside the numerical results.

Document the component’s props and basic wiring instructions.

**Prompt 8: Assemble the Main App Component.**

1. In `/client/src/`, modify the main `App.js` (or create a new container component) to wire together the following components:
   - `InputForm` (from Prompt 4 and 5)
   - `ResultsDisplay` (from Prompt 6)
   - `CatenaryVisualization` (from Prompt 7)
2. Ensure that the state flows from the InputForm to the ResultsDisplay and Visualization:
   - When the user enters data and clicks “Calculate,” the calculation engine is invoked.
   - The numerical results update the ResultsDisplay.
   - The visualization component receives the necessary data to render the catenary curve.
3. Incorporate responsive layout:
   - For desktop, display the numerical results on one side and the visualization on the other.
   - For narrower screens, stack the numerical results above the visualization.
4. Add any necessary styling and container divs to maintain a consistent layout.

Wire everything together so that there are no orphaned or hanging components.

**Prompt 9: Add Export Functionality for Results.**

1. In `/client/src/components/`, create a new component named `ExportResults.js`.
2. Implement functions to export the current calculation results (including numerical outputs and a snapshot of the visualization) to:
   - PDF (using a library like jsPDF)
   - CSV (by converting the data into a CSV string and triggering a download)
   - Excel (using a library such as SheetJS or a similar tool)
3. Add buttons for each export option in the component.
4. Integrate the export component into the main App so that it can use the latest calculation data.
5. Ensure that all export functions are wired to the current state (i.e., they export the complete set of inputs, outputs, and metadata).

Document each export function and its integration into the overall workflow.

**Prompt 10: Develop User Authentication Screens.**

1. In `/client/src/views/`, create React components for:
   - `Login.js`
   - `Register.js`
   - `PasswordRecovery.js`
2. Each component should include forms for the necessary inputs (email, password, etc.) and basic client-side validation.
3. Set up API calls (to be implemented on the server side later) for registration, login, and password recovery.
4. Use React state management to handle authentication state (e.g., whether the user is logged in).
5. Ensure that the authentication views are wired into the overall application (for example, by using React Router to navigate between pages).

Make sure that the authentication process is modular so that later you can integrate the saved calculations dashboard.

**Prompt 11: Create the Saved Calculations Dashboard.**

1. In `/client/src/views/`, create a component named `Dashboard.js`.
2. This dashboard should list saved calculations along with metadata (Company, Rig Name, Field Name, Date).
3. Implement basic CRUD functionality:
   - **Create:** Allow users to save the current calculation (include an input for metadata).
   - **Read:** Display a list of saved calculations.
   - **Update:** Provide an option to edit metadata or re-run a saved calculation.
   - **Delete:** Allow users to remove a saved calculation.
4. Wire the dashboard to a back-end API (to be implemented in the server) that handles saving and retrieving calculations.
5. Ensure the dashboard is accessible only when the user is authenticated.

Document how this component interacts with the API and the rest of the app.

**Prompt 12: Build the QA View and Help Guide.**

1. In `/client/src/views/`, create:
   - A `QAView.js` component that, when toggled, displays detailed intermediate calculation steps and the formulas used. This view should be hidden by default and can be activated via a toggle button in the main app.
   - A `HelpGuide.js` component that provides instructions on how to use the application, including an explanation of the input fields, calculation process, and export options.
2. Wire these views so that:
   - The QA view can be opened from within the main calculator page.
   - The Help Guide is easily accessible (for example, via a modal or a dedicated help page).
3. Ensure that both views are styled consistently and integrated into the overall navigation of the app.

Document the integration points so that users can switch between the calculator and these additional views seamlessly.

**Prompt 13: Create a Logging Module.**

1. In `/client/src/utils/`, create a file named `logger.js`.
2. Implement functions to:
   - Track the total number of calculations performed.
   - Record the processing time for each calculation.
3. Integrate logging into the calculation engine (from Prompt 2) so that every time a calculation is triggered, the start time and end time are recorded and logged.
4. Ensure that these logs can later be sent to the back-end API (to be implemented in `/server`) for centralized logging and analytics.

Wire the logger so that it does not interfere with the user interface but logs all necessary events.

**Prompt 14: Develop the User Settings/Preferences Component.**

1. In `/client/src/views/`, create a component named `UserSettings.js`.
2. This component should allow the user to:
   - Select their default measurement units (e.g., ft, lbs, m, kg).
   - Adjust the visualization scale (to affect the diagram’s appearance).
3. Use React state (or a context provider) so that the settings apply across the entire application.
4. Ensure that changes in settings are persisted (for example, by storing them in local storage or sending them to the back-end).
5. Wire this component into the main navigation so that users can easily access and modify their settings.

Document the integration with the app’s state so that all components (InputForm, Visualization, etc.) use these settings.

**Prompt 15: Assemble Final Integration and Configure Routing.**

1. In the main `App.js` (or a dedicated router file), set up React Router (or your routing solution) to enable navigation between:
   - The Calculator page (with InputForm, ResultsDisplay, and CatenaryVisualization)
   - The Dashboard (saved calculations)
   - The Authentication pages (Login, Register, PasswordRecovery)
   - The User Settings page
   - The Help Guide and QA View (which can be modals or separate pages)
2. Ensure that all components developed in the previous prompts are integrated into a single cohesive, responsive application.
3. Wire the authentication state so that only authenticated users can access the Dashboard and User Settings.
4. Include final styling adjustments for a desktop-first responsive design:
   - Side-by-side layout on larger screens.
   - Stacked layout on smaller devices.
5. Prepare the configuration for deployment (for example, configuring environment variables, build scripts, and any necessary proxy settings between client and server).

Document the final wiring and any steps needed to deploy the application securely.

