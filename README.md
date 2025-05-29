# Maxwell Blackstone - UK Criminal Defence AI Assistant

This repository contains the code for Maxwell Blackstone, a web application that serves as an AI legal assistant specializing in UK criminal defence law.

## Features

- **Case Management**: Create and manage criminal defence cases
- **Evidence Management**: Upload, organize, and analyze evidence
- **Contradiction Detection**: Automatically identify inconsistencies in evidence
- **Defence Strategy Generation**: AI-powered defence strategy recommendations
- **Legal Reference**: Comprehensive UK criminal law reference database
- **Offline Functionality**: Full functionality without internet connection
- **Privacy-First Design**: All sensitive data remains on your device

## Technology Stack

- **Frontend**: Vue.js 3 with Vuetify 3
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **Local Storage**: IndexedDB for offline data storage
- **API**: Serverless functions for legal reference data
- **Deployment**: Vercel for hosting and serverless functions

## Project Structure

```
maxwell-blackstone/
├── api/                  # Serverless API functions
│   ├── legal-reference/  # Legal reference data endpoints
│   ├── knowledge-base/   # Knowledge base endpoints
│   └── analyze/          # Analysis endpoints
├── public/               # Public assets
├── src/                  # Frontend source code
│   ├── assets/           # Static assets
│   ├── components/       # Vue components
│   ├── views/            # Vue views/pages
│   ├── router/           # Vue Router configuration
│   ├── store/            # Vuex store
│   ├── services/         # Service modules
│   ├── utils/            # Utility functions
│   ├── App.vue           # Root component
│   └── main.js           # Application entry point
├── package.json          # Project dependencies
├── vue.config.js         # Vue CLI configuration
└── vercel.json           # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run serve
   ```

### Building for Production

```
npm run build
```

### Deployment

This application is configured for deployment on Vercel. See the deployment guide for detailed instructions.

## Privacy and Security

Maxwell Blackstone is designed with privacy as the core principle:

- All case data is stored exclusively on your device
- No case information is ever transmitted to servers
- All processing happens locally on your device
- Only anonymous performance metrics are collected (which can be disabled)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
