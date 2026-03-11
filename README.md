# RupeeWise - Global Currency to INR Calculator

RupeeWise is a feature-rich web-based currency calculator designed to convert any world currency into Indian Rupees (INR) with precision and ease.

## Features

- **Searchable Currency List**: Select from over 150 global currencies with country flags.
- **Dual Input Modes**: Enter amounts numerically or using English text (e.g., "twelve thousand").
- **Real-time Rates**: Fetches the latest exchange rates dynamically.
- **Indian Numbering System**: Displays results in standard format (₹12,50,000) and Indian words ("Twelve Lakh Fifty Thousand Rupees").
- **Modern UI**: Clean, responsive design with Dark and Light mode support.
- **Utility Tools**: Swap currencies, copy results to clipboard, and refresh rates instantly.

## Tech Stack

- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Motion** (for animations)
- **Lucide React** (for icons)
- **Fawazahmed0 Currency API** (for exchange rates)

## Running Locally

To run this application on your local machine, follow these steps:

1. **Clone the repository** (or download the source code).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Open your browser** and navigate to `http://localhost:3000`.

## Building for Production

To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` directory.
