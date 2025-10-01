#!/bin/bash

# Wedding Invitation System - Verification Script
# Run this to verify all files are in place and project is ready

echo "🎉 Wedding Invitation System - Verification"
echo "==========================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    echo "  Node.js version: $(node -v)"
else
    echo "  ❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    echo "  npm version: $(npm -v)"
else
    echo "  ❌ npm not found. Please install npm"
    exit 1
fi

# Check dependencies
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✓ node_modules exists"
else
    echo "  ❌ node_modules not found. Run: npm install"
    exit 1
fi

# Check required files
echo ""
echo "✓ Checking project files..."

FILES=(
    "package.json:Package configuration"
    "vite.config.js:Vite configuration"
    "tailwind.config.js:Tailwind configuration"
    "index.html:HTML entry point"
    "src/main.js:Application entry"
    "src/App.vue:Root component"
    "src/router/index.js:Router configuration"
    "src/i18n/index.js:Translations"
    ".env:Environment variables"
)

for item in "${FILES[@]}"; do
    FILE="${item%%:*}"
    DESC="${item##*:}"
    if [ -f "$FILE" ]; then
        echo "  ✓ $FILE - $DESC"
    else
        echo "  ❌ $FILE missing - $DESC"
    fi
done

# Check components
echo ""
echo "✓ Checking components..."

COMPONENTS=(
    "src/components/TypingGreeting.vue"
    "src/components/RotatingPortraits.vue"
    "src/components/Countdown.vue"
    "src/components/RsvpPrimary.vue"
    "src/components/QuestionsModal.vue"
    "src/components/FooterLinks.vue"
    "src/components/AddressReveal.vue"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "  ✓ ${component##*/}"
    else
        echo "  ❌ ${component##*/} missing"
    fi
done

# Check views
echo ""
echo "✓ Checking views..."

VIEWS=(
    "src/views/InvitePage.vue"
    "src/views/AdminDashboard.vue"
)

for view in "${VIEWS[@]}"; do
    if [ -f "$view" ]; then
        echo "  ✓ ${view##*/}"
    else
        echo "  ❌ ${view##*/} missing"
    fi
done

# Check services
echo ""
echo "✓ Checking services..."

SERVICES=(
    "src/services/api.js"
    "src/services/supabase.js"
    "src/services/tracker.js"
)

for service in "${SERVICES[@]}"; do
    if [ -f "$service" ]; then
        echo "  ✓ ${service##*/}"
    else
        echo "  ❌ ${service##*/} missing"
    fi
done

# Check database files
echo ""
echo "✓ Checking database files..."

DB_FILES=(
    "database/schema.sql:Database schema"
    "database/seeds.sql:Seed data"
    "database/setup.md:Setup guide"
)

for item in "${DB_FILES[@]}"; do
    FILE="${item%%:*}"
    DESC="${item##*:}"
    if [ -f "$FILE" ]; then
        echo "  ✓ $FILE - $DESC"
    else
        echo "  ❌ $FILE missing - $DESC"
    fi
done

# Check documentation
echo ""
echo "✓ Checking documentation..."

DOCS=(
    "README.md:Main documentation"
    "QUICKSTART.md:Quick start guide"
    "DEPLOYMENT.md:Deployment guide"
    "CUSTOMIZATION.md:Customization checklist"
    "PROJECT_SUMMARY.md:Project summary"
)

for item in "${DOCS[@]}"; do
    FILE="${item%%:*}"
    DESC="${item##*:}"
    if [ -f "$FILE" ]; then
        echo "  ✓ $FILE - $DESC"
    else
        echo "  ❌ $FILE missing - $DESC"
    fi
done

# Check assets
echo ""
echo "✓ Checking assets..."

if [ -f "public/assets/hero-background-watercolor.png" ]; then
    echo "  ✓ Hero background image"
else
    echo "  ❌ Hero background image missing"
fi

# Check environment variables
echo ""
echo "✓ Checking environment variables..."

if [ -f ".env" ]; then
    if grep -q "VITE_SUPABASE_URL" .env; then
        echo "  ✓ VITE_SUPABASE_URL configured"
    else
        echo "  ⚠️  VITE_SUPABASE_URL not found in .env"
    fi

    if grep -q "VITE_SUPABASE_SUPABASE_ANON_KEY" .env; then
        echo "  ✓ VITE_SUPABASE_SUPABASE_ANON_KEY configured"
    else
        echo "  ⚠️  VITE_SUPABASE_SUPABASE_ANON_KEY not found in .env"
    fi
else
    echo "  ❌ .env file missing"
fi

# Check build
echo ""
echo "✓ Checking build..."

if [ -d "dist" ]; then
    echo "  ✓ Build directory exists"
    if [ -f "dist/index.html" ]; then
        echo "  ✓ Built successfully"
    else
        echo "  ⚠️  Build may be incomplete. Run: npm run build"
    fi
else
    echo "  ⚠️  No build found. Run: npm run build"
fi

# Summary
echo ""
echo "==========================================="
echo "📋 Next Steps:"
echo ""
echo "1. Database Setup:"
echo "   - Go to Supabase Dashboard → SQL Editor"
echo "   - Run database/schema.sql"
echo "   - Run database/seeds.sql"
echo ""
echo "2. Customize Content:"
echo "   - Follow CUSTOMIZATION.md checklist"
echo "   - Update wedding date, venue, guest list"
echo "   - Upload real portrait images"
echo ""
echo "3. Test Locally:"
echo "   - Run: npm run dev"
echo "   - Visit: http://localhost:5173/invite/{test-guid}"
echo "   - Test complete RSVP flow"
echo ""
echo "4. Deploy:"
echo "   - Follow DEPLOYMENT.md guide"
echo "   - Recommended: Vercel (run: vercel)"
echo ""
echo "📚 Documentation:"
echo "   - QUICKSTART.md - Fast setup"
echo "   - README.md - Full docs"
echo "   - CUSTOMIZATION.md - Customization"
echo "   - DEPLOYMENT.md - Hosting"
echo ""
echo "✨ Ready to create beautiful wedding invitations!"
echo "==========================================="
