# CodeRep Chrome Extension

A Chrome extension for adding LeetCode problems to your CodeRep spaced repetition list with one click.

## Features

- **One-Click Add**: Button injected directly on LeetCode problem pages
- **Today's Reviews**: See your problems due for review in the popup
- **Submission Detection**: Automatically detects when you submit a solution
- **Rating Prompt**: Rate your performance (Fail/Hard/Good) right after solving
- **Smart Scheduling**: Your next review is automatically calculated

## Installation

### Step 1: Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select this `CodeRep-Extension` folder

### Step 2: Generate Icons

The extension requires PNG icons. You can:

**Option A: Use online converter**

- Open each `.svg` file in the `icons/` folder in a browser
- Take a screenshot or use an online SVG to PNG converter
- Save as `icon16.png`, `icon48.png`, `icon128.png`

**Option B: Use ImageMagick (if installed)**

```bash
cd icons
magick icon16.svg icon16.png
magick icon48.svg icon48.png
magick icon128.svg icon128.png
```

**Option C: Create simple icons**

- Create 16x16, 48x48, and 128x128 PNG images with "CR" text on blue background

### Step 3: Get Your API Token

1. Go to your CodeRep dashboard at `http://localhost:3000/dashboard/settings`
2. Click **Generate API Token**
3. Copy the token

### Step 4: Connect the Extension

1. Click the CodeRep extension icon in Chrome toolbar
2. Paste your API token
3. Click **Connect Account**

## Usage

### Adding Problems

1. Navigate to any LeetCode problem (e.g., `leetcode.com/problems/two-sum/`)
2. Click the **"Add to CodeRep"** button next to the problem title
3. Problem is added to your revision list!

### Reviewing Problems

1. Click the extension icon in your toolbar
2. See your problems due for review today
3. Click **Open** to navigate to any problem
4. After submitting your solution, rate your performance

### Rating After Submission

When you successfully submit a solution to a tracked problem:

- A rating prompt will appear
- Choose **Failed**, **Hard**, or **Good**
- Your next review date is automatically scheduled

## Files

```
CodeRep-Extension/
├── manifest.json      # Extension configuration
├── background.js      # Service worker
├── content.js         # Runs on LeetCode pages
├── content.css        # Styles for injected elements
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
├── popup.css          # Popup styles
├── icons/
│   ├── icon16.svg     # 16x16 icon (convert to PNG)
│   ├── icon48.svg     # 48x48 icon (convert to PNG)
│   └── icon128.svg    # 128x128 icon (convert to PNG)
└── README.md          # This file
```

## API Endpoints Used

- `POST /api/problems` - Add a new problem
- `GET /api/problems/today` - Get today's review problems
- `GET /api/problems/check` - Check if problem exists
- `GET /api/problems/find` - Find problem by URL
- `PATCH /api/problems/[id]` - Update problem (rating)
- `POST /api/user/token` - Generate API token

## Development

### Updating the Extension

After making changes:

1. Go to `chrome://extensions/`
2. Click the refresh icon on the CodeRep extension card

### Debugging

- Right-click extension icon → **Inspect popup** for popup console
- Go to LeetCode → F12 → Console for content script logs
- Go to `chrome://extensions/` → **Service worker** for background logs

**Test submission detection manually:**

- Open a LeetCode problem page
- Open browser console (F12)
- Type `CodeRepTest()` and press Enter
- This will manually trigger the rating prompt if the problem is tracked

**Submission detection not working?**

- Check the console for "[CodeRep]" logs
- Make sure the problem is added to your CodeRep list
- Make sure the problem is being tracked (not archived)
- After submitting on LeetCode, check console for submission detection logs
- If still not working, use `CodeRepTest()` to verify the prompt works

## Troubleshooting

**Button not appearing on LeetCode?**

- Refresh the page
- Make sure you're on a problem page (URL contains `/problems/`)
- Check console for errors

**"Unauthorized" error?**

- Your token may have expired
- Go to Settings and generate a new token
- Reconnect in the extension

**Problems not loading in popup?**

- Check your API URL (default: `http://localhost:3000`)
- Make sure your Next.js server is running
- Verify your token is valid

**CORS Errors / "Failed to fetch"?**

- Make sure your Next.js dev server is running (`npm run dev`)
- Restart the dev server after updating `middleware.ts`
- Check that `middleware.ts` has CORS headers configured
- If still failing, the extension will show errors in console

**Extension context invalidated error?**

- This happens when you reload/update the extension while the page is open
- Simply refresh the LeetCode page to fix it
- The extension will reinitialize automatically

**CodeRepTest() not working?**

- Make sure you're on a LeetCode problem page
- Open DevTools console (F12)
- Type `CodeRepTest()` and press Enter
- If it says "not defined", refresh the page and try again
