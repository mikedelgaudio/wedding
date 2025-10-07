# Getting Started

To start the Firebase emulators for Firestore, Auth, Functions, and Hosting, use the following command:

```bash
firebase emulators:start --only firestore,auth,functions,hosting
```

Run locally with:

```bash
npm run dev
```

# Deploy

Ensure to run the build command in the root directory and the `functions` directory before deploying:

```bash
npm run build
```

Then deploy with:

```bash
firebase deploy --only hosting,functions
```