ESTHER'S SINCHON NEST  -  build & deploy guide
================================================

WHAT THIS IS
A little housing app for Esther. The places she sees come from the
SEED_LISTINGS list near the top of  src/App.jsx . Her favorites, notes,
and prices you confirm are saved automatically in her browser.

TO PERSONALIZE THE LOVE NOTE
Open  src/App.jsx  and edit the two lines near the top:
  const LOVE_NOTE = "...your message..."
  const SIGNATURE = "-- always, your favorite person"


----------------------------------------------------------------
OPTION A (RECOMMENDED, NO PROGRAMS TO INSTALL): GITHUB + VERCEL
----------------------------------------------------------------
You do everything in your web browser. Vercel builds the app for you.

1. Make a free account at github.com
2. Click the + (top right) -> "New repository"
   - Name it: esther-housing
   - Keep it Public or Private (your choice) -> "Create repository"
3. On the new repo page click "uploading an existing file"
   - Open the extracted project folder on your PC
   - Select ALL the items inside it (index.html, package.json,
     vite.config.js, .gitignore, and the src folder) and drag them
     into the GitHub upload box
   - Click "Commit changes"
4. Make a free account at vercel.com  ->  "Continue with GitHub"
5. Click "Add New..." -> "Project" -> import your esther-housing repo
6. Leave all settings as-is (Vercel detects Vite automatically) -> "Deploy"
7. After ~1 minute you get a live link like  esther-housing.vercel.app
   Text that link to Esther. Done!

TO ADD A LISTING LATER (she'll see it):
   - On github.com open  src/App.jsx  -> click the pencil (Edit)
   - Copy one of the existing { ... } blocks in SEED_LISTINGS,
     paste it, change the details, give it a unique "id"
   - Click "Commit changes"  ->  Vercel rebuilds in ~30 seconds
   - She refreshes the page and sees it


----------------------------------------------------------------
OPTION B (PREVIEW ON YOUR OWN PC FIRST): needs Node.js
----------------------------------------------------------------
1. Install Node.js LTS from nodejs.org (just click through the installer)
2. Open the folder, type "cmd" in the address bar, press Enter
   (this opens a command prompt already in the folder)
3. Run:   npm install
4. Run:   npm run dev
5. Open the http://localhost:5173 link it prints
   (Press Ctrl + C in the window to stop it)
