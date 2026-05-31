# Rubik's Cube Game

A fully interactive 3D Rubik's cube game built with Three.js and TypeScript. Experience the classic puzzle in a modern web environment with smooth animations and intuitive controls.

![Rubik's Cube](https://img.shields.io/badge/Three.js-135-black) ![TypeScript](https://img.shields.io/badge/TypeScript-4.5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Interactive 3D Gameplay**: Manipulate the cube with intuitive mouse and touch controls
- **Customizable Difficulty**: Support for cube orders from 2x2 to 10x10
- **Smooth Animations**: Fluid rotation animations and particle effects
- **Responsive Design**: Optimized for both desktop and mobile devices
- **State Persistence**: Automatically saves your progress to local storage
- **Modern UI**: Clean, professional navigation bar with real-time status updates

## Technology Stack

- **Three.js**: 3D graphics rendering engine
- **TypeScript**: Type-safe JavaScript development
- **WebGL**: Hardware-accelerated 3D graphics
- **Rollup**: Module bundler for production builds
- **Web Dev Server**: Development server with hot reload

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rubiks-cube-main
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode

Start the development server with hot reload:

```bash
npm run start
```

The application will be available at `http://localhost:8000`

### Production Build

Build the project for production:

```bash
npm run build
```

## How to Play

1. **Rotate the Cube**: Click and drag on any face of the cube to rotate it
2. **Change Order**: Use the dropdown menu to select cube difficulty (2-10)
3. **Restore**: Click the "Restore" button to reset the cube to its solved state
4. **Status**: Monitor your progress in the status bar

## Controls

- **Mouse**: Click and drag to rotate cube faces
- **Touch**: Swipe gestures for mobile devices
- **Scroll**: Zoom in/out (if supported)

## Project Structure

```
rubiks-cube-main/
├── src/
│   ├── rubiks/
│   │   ├── components/    # Camera, scene, renderer setup
│   │   ├── core/          # Cube logic, controls, state management
│   │   └── util/          # Math utilities, transformations
│   └── index.ts           # Main entry point
├── index.html             # HTML template
├── package.json           # Project configuration
└── tsconfig.json          # TypeScript configuration
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author

**Shubham Mohite**

## License

This project is licensed under the MIT License.
