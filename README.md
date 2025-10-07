# Getting Started

## Setup

Run the initial setup:

```bash
npm run setup
```

## Local Development

Start the Firebase emulators:

```bash
npm run emulators
```

Run the development server:

```bash
npm run dev
```

Seed the database (optional):

```bash
npm run seed
```

# Deploy

Deploy everything (builds and deploys hosting + functions):

```bash
npm run deploy
```

Or deploy individually:

```bash
npm run deploy:hosting    # Deploy hosting only
npm run deploy:functions   # Deploy functions only
```

# Build Commands

```bash
npm run build              # Build the app
npm run build:functions    # Build functions
npm run build:all          # Build both app and functions
```

# Cleanup

Remove all build artifacts and dependencies:

```bash
npm run clean
```