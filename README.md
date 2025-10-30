# JSON Tree Visualizer

An interactive web application built with React and React Flow that visualizes JSON data as a hierarchical tree structure with advanced search and highlighting capabilities.

## Features

### Core Features (Mandatory)

#### JSON Input & Parsing
- Text area for pasting or typing JSON data
- Real-time JSON validation with detailed error messages
- "Generate Tree" button to visualize the JSON structure
- Pre-loaded sample JSON for quick demonstration

#### Tree Visualization with React Flow
- Hierarchical tree structure using React Flow library
- Three distinct node types with color-coded visualization:
  - **Object nodes** (Purple/Blue): Display object keys with `{}` notation
  - **Array nodes** (Green): Display array indices with `[]` notation
  - **Primitive nodes** (Orange): Display key-value pairs for strings, numbers, booleans, and null
- Smooth animated edges connecting parent-child relationships
- Clean, modern design with proper spacing

#### Search Functionality
- Search bar supporting JSON path notation
- Supported formats:
  - Object paths: `$.user.address.city`
  - Array paths: `$.products[0].name`
  - Nested paths: `$.user.hobbies[1]`
- Real-time search with visual feedback
- Matched nodes are highlighted with golden glow effect
- Auto-pan and center matched nodes with smooth animation
- "Match found" or "No match found" status messages

#### Interactive Features
- **Zoom Controls**: Zoom In, Zoom Out, and Fit View buttons
- **Pan**: Click and drag the canvas to navigate
- **MiniMap**: Overview map for easy navigation of large JSON structures
- **Interactive Background**: Grid pattern for better orientation

### Bonus Features (All Implemented)

#### Dark/Light Mode Toggle
- Switch between light and dark themes
- Smooth transitions between themes
- Persistent color schemes across all UI elements
- Accessible theme toggle button in the header

#### Clear/Reset Functionality
- **Clear All**: Removes all input and visualization
- **Reset to Sample**: Loads the default sample JSON
- Quick action buttons for better user experience

#### Copy JSON Path on Node Click
- Click any node to copy its JSON path to clipboard
- Visual feedback showing the copied path
- Automatic notification that disappears after 2 seconds

#### Additional Enhancements
- Fully responsive design for mobile, tablet, and desktop
- Smooth animations and transitions throughout
- Node hover effects for better interactivity
- Professional gradient backgrounds
- Clean, modern UI with proper spacing

## Technology Stack

- **React** 19.1.1
- **Vite** 7.1.7 (Build tool)
- **React Flow** (@xyflow/react) 12.9.1
- **CSS3** (Custom styling with responsive design)
- **JavaScript** (ES6+)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Yarn package manager

### Steps to Run Locally

1. Clone the repository:
```bash
git clone <repository-url>
cd apiwiz
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```
(Or the port shown in your terminal)

### Build for Production

```bash
yarn build
```

The optimized build will be in the `dist` folder.

### Preview Production Build

```bash
yarn preview
```

## Usage Guide

### Basic Usage

1. **Enter JSON Data**:
   - Paste your JSON in the text area
   - Or modify the pre-loaded sample JSON
   - Or click "Reset to Sample" to load the default example

2. **Generate Visualization**:
   - Click the "Generate Tree" button
   - The JSON structure will be displayed as an interactive tree

3. **Navigate the Tree**:
   - Use mouse wheel or zoom controls to zoom in/out
   - Click and drag to pan around the tree
   - Click "Fit View" to center the entire tree

### Search Feature

1. **Search by Path**:
   - Enter a JSON path in the search box (e.g., `$.user.name`)
   - Press Enter or click "Search"
   - The matching node will be highlighted and centered

2. **Search Examples**:
   ```
   $.user                    // Find the user object
   $.user.address.city       // Find nested property
   $.products[0]             // Find first array element
   $.products[1].name        // Find property in array element
   $.user.hobbies            // Find array property
   ```

### Interactive Features

- **Copy Path**: Click any node to copy its JSON path
- **Theme Toggle**: Click the theme button (top-right) to switch modes
- **Clear/Reset**: Use the buttons to clear or reset the input

## Project Structure

```
apiwiz/
├── src/
│   ├── components/
│   │   ├── home.jsx         # Main component with all logic
│   │   └── home.css         # Component-specific styles
│   ├── App.jsx              # Root component
│   ├── App.css              # App-level styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md               # This file
```

## Features Breakdown

### Mandatory Requirements
- [x] JSON input textarea with validation
- [x] "Generate Tree" button
- [x] Sample JSON placeholder
- [x] React Flow tree visualization
- [x] Color-coded node types (Objects, Arrays, Primitives)
- [x] Parent-child connections with lines
- [x] Search by JSON path
- [x] Highlight matching nodes
- [x] Pan to matched nodes
- [x] "Match found/No match found" messages
- [x] Zoom controls (In/Out/Fit View)
- [x] Pan functionality
- [x] Node information display



## Development

### Code Quality
- Clean, modular component structure
- Separation of concerns
- Reusable functions
- Proper error handling
- Responsive CSS with mobile-first approach

### Performance
- Efficient tree layout algorithm
- Optimized rendering with React Flow
- Memoized callbacks to prevent unnecessary re-renders
- Smooth animations without performance impact




---

Built with React + Vite + React Flow
