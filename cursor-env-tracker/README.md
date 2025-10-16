# Cursor Environmental Impact Tracker

A beautiful React application that tracks the environmental impact of your Cursor AI usage, calculating CO₂ emissions from token consumption and visualizing trees needed for carbon offset.

## Features

- 🌱 **Carbon Footprint Tracking**: Calculate CO₂ emissions from your Cursor AI usage
- 🌳 **Tree Visualization**: Animated visualization of trees needed to offset your carbon footprint
- 💚 **Charity Integration**: Direct links to tree-planting charities with cost calculations
- 🎨 **Beautiful Design**: Inspired by Mad River's aesthetic with custom green color palette
- 📊 **Detailed Analytics**: Model breakdown, energy consumption, and environmental equivalencies
- 🔒 **Privacy-First**: All processing happens in your browser - no data is stored or transmitted

## Design Inspiration

This application draws design inspiration from [Mad River](https://www.madriver.co.uk/), featuring:
- Clean, modern typography with Inter font
- Sophisticated green color palette
- Minimalist hero section with bold typography
- Card-based layout with subtle shadows and rounded corners

## Color Palette

The application uses a custom green color palette:

- **Timberwolf**: `#dad7cd` - Light neutral base
- **Sage**: `#a3b18a` - Soft green accent
- **Fern Green**: `#588157` - Primary green
- **Hunter Green**: `#3a5a40` - Dark green
- **Brunswick Green**: `#344e41` - Deep forest green

## Carbon Calculation Methodology

Based on research from ["We can use tokens to track AI's carbon emissions"](https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon):

- **Energy per token**: 0.000187 kWh (673.2 joules)
- **CO₂ per token**: 0.0859g (Korea grid at 0.459 kg CO₂/kWh)
- **Tree absorption**: 21 kg CO₂ per year per mature tree
- **Data center efficiency**: PUE of 1.1 (Google Cloud)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cursor Admin API key (optional - demo mode available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cursor-env-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Using with Real Data

1. Get your Cursor Admin API key from the Cursor dashboard
2. Enter the API key in the application
3. Select your desired time range (7, 30, or 90 days)
4. Click "Fetch Data" to load your actual usage data

### Demo Mode

If you don't have a Cursor API key or want to see the interface, you can:
1. Enter any text in the API key field
2. Click "Fetch Data" to see sample data and visualizations

## API Integration

The application includes utilities for integrating with the Cursor Admin API:

- `fetchCursorUsageData()` - Fetches usage data from Cursor API
- `validateApiKey()` - Validates API key format
- `calculateCarbonFootprint()` - Calculates emissions from token usage
- `calculateTreeOffset()` - Determines trees needed for offset

## Tree-Planting Charities

The application includes direct links to verified tree-planting organizations:

- **Arbor Day Foundation** - $1.00 per tree
- **One Tree Planted** - $1.00 per tree  
- **Trees for the Future** - $0.10 per tree
- **Eden Reforestation Projects** - $0.33 per tree

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with custom color palette
- **Lucide React** - Icon library
- **ES6+** - Modern JavaScript features

## Project Structure

```
src/
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
├── index.css            # Global styles and Tailwind imports
└── utils/
    └── cursorApi.js     # API integration and calculation utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Research methodology from [Anurag Sridharan's article](https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon)
- Design inspiration from [Mad River](https://www.madriver.co.uk/)
- Carbon calculation constants from Lacoste et al. research
- Tree-planting charity data from verified environmental organizations

## Security Notice

- API keys are processed locally in your browser
- No data is stored or transmitted to external servers
- We recommend creating temporary API keys for this service
- Delete API keys after use for security