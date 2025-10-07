#!/bin/bash

# Wedding App Setup Script
clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Wedding App Interactive Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse command line arguments
SKIP_INSTALL=false
AUTO_START=false
SKIP_SEED=false
QUICK_START=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-install)
      SKIP_INSTALL=true
      shift
      ;;
    --auto-start)
      AUTO_START=true
      shift
      ;;
    --skip-seed)
      SKIP_SEED=true
      shift
      ;;
    --quick-start)
      QUICK_START=true
      AUTO_START=true
      SKIP_INSTALL=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--skip-install] [--auto-start] [--skip-seed] [--quick-start]"
      exit 1
      ;;
  esac
done

# Step 1: Check prerequisites
echo "📋 Step 1: Checking prerequisites..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✅ Node.js detected:${NC} $(node --version)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm detected:${NC} $(npm --version)"
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Firebase CLI is not installed${NC}"
    echo ""
    read -p "Would you like to install it globally? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Firebase CLI..."
        npm install -g firebase-tools || { echo -e "${RED}❌ Failed to install Firebase CLI${NC}"; exit 1; }
        echo -e "${GREEN}✅ Firebase CLI installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Continuing without Firebase CLI (you'll need it later)${NC}"
    fi
else
    echo -e "${GREEN}✅ Firebase CLI detected${NC}"
fi

echo ""

# Step 2: Install dependencies
if [ "$SKIP_INSTALL" = false ]; then
    echo "📦 Step 2: Installing dependencies..."
    echo ""

    echo "Installing root dependencies..."
    npm install || { echo -e "${RED}❌ Failed to install root dependencies${NC}"; exit 1; }
    echo -e "${GREEN}✅ Root dependencies installed${NC}"
    echo ""

    echo "Installing functions dependencies..."
    cd functions && npm install && cd .. || { echo -e "${RED}❌ Failed to install functions dependencies${NC}"; exit 1; }
    echo -e "${GREEN}✅ Functions dependencies installed${NC}"
    echo ""
else
    echo "⏭️  Skipping dependency installation"
    echo ""
fi

# Step 3: Configure environment files
if [ "$QUICK_START" = false ]; then
    echo "🔧 Step 3: Configuring environment variables..."
    echo ""

    # Function to prompt for env variable
    prompt_env_var() {
        local var_name=$1
        local prompt_text=$2
        local default_value=$3
        local env_file=${4:-.env}
        local current_value=$(grep "^${var_name}=" "$env_file" 2>/dev/null | cut -d '=' -f2- | tr -d '"')

        if [ -n "$current_value" ] && [ "$current_value" != "" ]; then
            echo -e "${GREEN}✅ ${var_name} already set${NC}"
            return
        fi

        if [ -n "$default_value" ]; then
            read -p "$prompt_text [$default_value]: " value
            value=${value:-$default_value}
        else
            read -p "$prompt_text: " value
        fi

        # Escape special characters for sed
        escaped_value=$(echo "$value" | sed 's/[&/\]/\\&/g')
        sed -i '' "s|^${var_name}=.*|${var_name}=\"${escaped_value}\"|" "$env_file"
    }

    # Configure root .env
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cp .env.sample .env
        echo -e "${YELLOW}📝 Let's configure your Firebase settings${NC}"
        echo ""
        echo "You can find these values in your Firebase Console:"
        echo "https://console.firebase.google.com/ → Project Settings → Your Apps"
        echo ""

        read -p "Do you want to configure Firebase now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            prompt_env_var "VITE_REACT_APP_FIREBASE_API_KEY" "Firebase API Key" "" ".env"
            prompt_env_var "VITE_REACT_APP_FIREBASE_AUTH_DOMAIN" "Firebase Auth Domain" "your-project.firebaseapp.com" ".env"
            prompt_env_var "VITE_REACT_APP_FIREBASE_PROJECT_ID" "Firebase Project ID" "" ".env"
            prompt_env_var "VITE_REACT_APP_FIREBASE_STORAGE_BUCKET" "Firebase Storage Bucket" "your-project.appspot.com" ".env"
            prompt_env_var "VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID" "Firebase Messaging Sender ID" "" ".env"
            prompt_env_var "VITE_REACT_APP_FIREBASE_APP_ID" "Firebase App ID" "" ".env"
            echo ""
            echo -e "${GREEN}✅ Firebase configuration saved${NC}"
        else
            echo -e "${YELLOW}⚠️  You'll need to manually update .env later${NC}"
        fi
    else
        echo -e "${GREEN}✅ .env already exists${NC}"
    fi

    echo ""

    # Configure functions/.env
    if [ -f functions/.env.sample ]; then
        if [ ! -f functions/.env ]; then
            echo "Creating functions/.env file..."
            cp functions/.env.sample functions/.env
            echo -e "${YELLOW}📝 Let's configure your functions environment${NC}"
            echo ""

            read -p "Do you want to configure SMTP settings now? (y/n) " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                prompt_env_var "AUTH_PASSWORD" "Auth Password for admin functions" "" "functions/.env"
                prompt_env_var "SMTP_HOST" "SMTP Host" "smtp.gmail.com" "functions/.env"
                prompt_env_var "SMTP_PORT" "SMTP Port" "587" "functions/.env"
                prompt_env_var "SMTP_USER" "SMTP User/Email" "" "functions/.env"
                prompt_env_var "SMTP_PASS" "SMTP Password/App Password" "" "functions/.env"
                echo ""
                echo -e "${GREEN}✅ Functions configuration saved${NC}"
            else
                echo -e "${YELLOW}⚠️  You can configure SMTP later in functions/.env${NC}"
            fi
        else
            echo -e "${GREEN}✅ functions/.env already exists${NC}"
        fi
    fi

    echo ""
else
    # Quick start mode - just check if env files exist, create from samples if not
    echo "🔧 Step 3: Checking environment files..."
    echo ""

    if [ ! -f .env ]; then
        echo "Creating .env from .env.sample..."
        cp .env.sample .env
        echo -e "${YELLOW}⚠️  Remember to configure .env with your Firebase settings${NC}"
    else
        echo -e "${GREEN}✅ .env exists${NC}"
    fi

    if [ -f functions/.env.sample ] && [ ! -f functions/.env ]; then
        echo "Creating functions/.env from functions/.env.sample..."
        cp functions/.env.sample functions/.env
        echo -e "${YELLOW}⚠️  Remember to configure functions/.env with SMTP settings${NC}"
    elif [ -f functions/.env ]; then
        echo -e "${GREEN}✅ functions/.env exists${NC}"
    fi

    echo ""
fi

# Step 4: Ask about starting emulators
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Step 4: Start Development Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

START_ENV=false
if [ "$AUTO_START" = true ]; then
    START_ENV=true
else
    read -p "Would you like to start the development environment now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        START_ENV=true
    fi
fi

if [ "$START_ENV" = true ]; then
    echo ""
    echo "🔥 Starting Firebase emulators..."
    echo ""

    # Detect the terminal type and open a new window/tab
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript <<EOF
tell application "Terminal"
    do script "cd \"$PWD\" && npm run emulators"
    activate
end tell
EOF
        echo -e "${GREEN}✅ Firebase emulators started in new Terminal window${NC}"
    elif [[ "$TERM_PROGRAM" == "vscode" ]]; then
        # VS Code integrated terminal
        echo -e "${YELLOW}⚠️  Detected VS Code terminal${NC}"
        echo "   Please manually run: npm run emulators (in a separate terminal)"
    else
        # Other Unix-like systems
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $PWD && npm run emulators; exec bash"
            echo -e "${GREEN}✅ Firebase emulators started in new terminal${NC}"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $PWD && npm run emulators" &
            echo -e "${GREEN}✅ Firebase emulators started in new terminal${NC}"
        else
            echo -e "${YELLOW}⚠️  Could not detect terminal emulator${NC}"
            echo "   Please manually run: npm run emulators (in a separate terminal)"
        fi
    fi

    # Wait for emulators to start
    echo ""
    echo "⏳ Waiting for emulators to start (this may take 10-15 seconds)..."
    sleep 15

    # Check if emulators are running
    if curl -s http://localhost:4000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Emulators are running${NC}"

        # Step 5: Seed data
        if [ "$SKIP_SEED" = false ]; then
            echo ""
            echo "🌱 Step 5: Seeding test data..."
            echo ""

            SHOULD_SEED=false
            if [ "$QUICK_START" = true ]; then
                SHOULD_SEED=true
            else
                read -p "Would you like to seed the database with test data? (y/n) " -n 1 -r
                echo ""
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    SHOULD_SEED=true
                fi
            fi

            if [ "$SHOULD_SEED" = true ]; then
                cd functions
                node seed.firebase.js
                cd ..
                echo ""
                echo -e "${GREEN}✅ Test data seeded successfully!${NC}"
                echo ""
                echo -e "${BLUE}📝 Test invite codes you can use:${NC}"
                echo "   • TEST-0001 - Single person, no brunch"
                echo "   • TEST-0002 - Couple with brunch access"
                echo "   • TEST-0003 - Mixed guest setup"
                echo "   • ADMN-TEST - Admin test account"
            fi
        fi

        echo ""
        echo "🌐 Starting development server..."
        sleep 2

        # Start dev server
        if [[ "$OSTYPE" == "darwin"* ]]; then
            osascript <<EOF
tell application "Terminal"
    do script "cd \"$PWD\" && npm run dev"
end tell
EOF
            echo -e "${GREEN}✅ Dev server started in new Terminal window${NC}"
        else
            if command -v gnome-terminal &> /dev/null; then
                gnome-terminal -- bash -c "cd $PWD && npm run dev; exec bash"
            elif command -v xterm &> /dev/null; then
                xterm -e "cd $PWD && npm run dev" &
            else
                echo -e "${YELLOW}⚠️  Please manually run: npm run dev (in a separate terminal)${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  Emulators may still be starting...${NC}"
        echo "   Check the emulator terminal window for status"
        echo "   Once ready, run: npm run dev (in a separate terminal)"
    fi
fi

# Final summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$START_ENV" = true ]; then
    echo -e "${GREEN}🎉 Your development environment is running!${NC}"
    echo ""
    echo "Emulator UI:  http://localhost:4000"
    echo "Dev Server:   http://localhost:5173 (check terminal for actual port)"
    echo ""
    echo "To stop: Close the terminal windows or press Ctrl+C in each"
else
    echo "To start development:"
    echo "  1. Terminal 1: npm run emulators"
    echo "  2. Terminal 2: npm run dev"
    echo "  3. (Optional) Seed data: npm run seed"
    echo ""
    echo "Quick start (already setup): npm run start"
fi

echo ""
echo "Other useful commands:"
echo "  • npm run seed            - Seed test data (emulators must be running)"
echo "  • npm run deploy          - Build & deploy everything"
echo "  • npm run deploy:hosting  - Deploy hosting only"
echo "  • npm run deploy:functions - Deploy functions only"
echo "  • npm run build:all       - Build everything locally"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
