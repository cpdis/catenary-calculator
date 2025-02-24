# Catenary Calculator and Visualization Specification

## 1. Project Overview

**Purpose:**  
Develop a single page web application that performs catenary calculations for mooring lines. It computes outputs based on inputs such as fairlead tension, water depth, and various component specifications, and provides both numerical results and an interactive visualization.

**Audience:**  
Mooring engineers and offshore personnel involved in mooring or drilling operations.

---

## 2. Core Functionality

### A. Calculation Engine

- **Inputs:**  
  - Fairlead Tension  
  - Water Depth  
  - Component Type  
  - Component Length  
  - Component Size  
  - Component Maximum Breaking Load (MBL)

- **Additional Component Details (Editable by User):**  
  - Component Type (free text)  
  - Component Size, Length, Weight, Stiffness (E), MBL (all positive numeric values)

- **Calculations:**  
  - Utilize standard catenary equations along with integration of API, DNV, and ISO rules.
  - The developer will research and implement the appropriate industry-standard formulas.

- **Output Numerical Values:**  
  - Fairlead Angle  
  - Grounded Length  
  - Anchor Distance  
  - Anchor Angle  
  - Anchor Tension

### B. Embedded Database of Values

- Maintain a static, embedded dataset with default values for component data.
- When a value isn’t available, calculate defaults based on industry standards or codes.

### C. Visualization

- **Interactive Diagram:**  
  - Displays the calculated catenary mooring line.
  - Simple interactivity such as zooming, panning, and tooltips.

- **Layout Options:**  
  - **Desktop:** Split-screen view with numerical values on the left and interactive diagram on the right.
  - **Narrow screens:** Numerical values on top with the diagram below.

### D. Calculation Trigger

- Use a dedicated **"Calculate"** button to initiate computations and update outputs.

### E. Error Handling

- **Validation:**  
  - Inline error messages beside each field for immediate feedback.
  - A summary notification after clicking **"Calculate"** for any invalid or missing inputs.

### F. Export & Save

- **Export Options:**  
  - Export complete results (inputs, calculated values, diagram snapshot, and metadata) to PDF, CSV, and Excel.

- **Saved Results:**  
  - Users can save calculations with metadata:
    - Company
    - Rig Name
    - Field Name
    - Date

### G. User Authentication

- **Method:**  
  - Email and password registration and login.
  - Include password recovery functionality.

- **Saved Calculations Dashboard:**  
  - Manage saved calculations with key fields: Company, Rig Name, Field Name, and Date.
  - Ability to filter (e.g., by date or project name) and manage entries (edit/delete).

### H. Additional Views

- **QA View:**  
  - A hidden, toggleable detailed view displaying the calculation process, intermediate values, and formulas for quality assurance.

- **Help Guide:**  
  - An easily accessible guide that explains the calculation process and usage of the app.

### I. Logging & Analytics

- **Custom Logging:**  
  - Track the total number of calculations performed.
  - Record the time taken for each calculation.

### J. User Settings/Preferences

- Allow users to configure:
  - Default measurement units (e.g., ft, lbs, kips, m, kg, mT)
  - Visualization scale (affecting the diagram’s appearance)

---

## 3. Technical Stack & Considerations

- **Front-end:**  
  - Use a modern front-end framework (React, Angular, or Vue) based on simplicity and functionality.
  - Integrate a visualization library such as D3.js or Chart.js.

- **Back-end:**  
  - Developer chooses the simplest solution based on ease of use and scalability (e.g., SQL like PostgreSQL/MySQL or NoSQL like MongoDB).
  - Implement a custom logging solution for performance analytics.

- **Design & Branding:**  
  - Primary color: `#f04c23`  
  - Secondary color: `rgb(2,3,129)`  
  - Desktop-first design approach with responsive adjustments for narrower viewports.

- **Deployment:**  
  - Single page application architecture.
  - Standard secure user authentication and session management best practices.

---

## 4. User Interactions & Workflow

### User Flow

1. **Authentication:**  
   - User signs up/logs in via email and password.
   
2. **Input & Calculation:**  
   - User enters parameters (with the ability to switch units).  
   - User selects/edits component details from the embedded database.  
   - User clicks the dedicated **"Calculate"** button.

3. **Results Display:**  
   - Numerical results are shown in a dedicated section.
   - An interactive visualization displays the catenary shape.
   - Error messages appear inline and as a summary if there are issues.

4. **Saving & Exporting:**  
   - User can save calculations (including metadata: Company, Rig Name, Field Name, Date).  
   - User can export results to PDF, CSV, or Excel.

5. **Additional Features:**  
   - A hidden QA view shows detailed intermediate calculation steps and formulas.  
   - An accessible help guide provides user instructions.

6. **Logging:**  
   - Custom logging tracks the number of calculations performed and the processing time.

7. **User Preferences:**  
   - Users can adjust default measurement units and the visualization scale.

---

This specification provides a comprehensive guide for developing the catenary calculator and visualization tool. It covers core functionalities, user interactions, technical considerations, and design details.  
