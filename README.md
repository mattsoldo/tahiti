# French Polynesia Christmas Adventure 2025

A beautiful static website showcasing your complete French Polynesia itinerary from December 25, 2025 to January 3, 2026.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Navigation**: Sticky navigation bar with smooth scrolling
- **Image Galleries**: Click to enlarge any image for a closer look
- **Countdown Timer**: Live countdown to your departure date
- **Print-Friendly**: Easy-to-print itinerary for offline reference
- **Scroll Animations**: Beautiful reveal animations as you scroll
- **Scroll to Top**: Quick navigation button to return to the top

## Itinerary Highlights

### Destinations
- **Tahiti** - Gateway and hiking adventures
- **Rangiroa** - World-class diving and the Blue Lagoon
- **Raiatea & Taha'a** - Sacred sites and sailing
- **Bora Bora** - Mount Otemanu climb and paradise beaches

### Key Activities
- Fautaua Waterfall hike
- Blue Lagoon excursion with pink sand beaches
- Snorkeling with dolphins at Tiputa Pass
- 3-day sailing adventure on Aldebaran trimaran
- Kiteboarding lessons with Captain Marie
- Mount Otemanu climbing expedition
- Marae Taputapuatea UNESCO World Heritage Site visit

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub, GitLab, or Bitbucket account
3. Click "Add New Project"
4. Import this repository
5. Vercel will automatically detect the configuration
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to the project directory
cd /Users/soldo/code/tahiti

# Deploy
vercel

# For production deployment
vercel --prod
```

### Option 3: Deploy via Git

1. Create a new repository on GitHub
2. Push this code to your repository:

```bash
cd /Users/soldo/code/tahiti
git init
git add .
git commit -m "Initial commit: French Polynesia itinerary site"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

3. Connect the repository to Vercel through the Vercel dashboard
4. Vercel will automatically deploy on every push to main

## Project Structure

```
tahiti/
├── index.html          # Main HTML file with complete itinerary
├── styles.css          # All styling and responsive design
├── script.js           # Interactive features and animations
├── vercel.json         # Vercel deployment configuration
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks, pure JS for interactivity
- **Google Fonts**: Playfair Display and Lato font families
- **Unsplash**: High-quality images via Unsplash API

## Customization

### Changing Images

Images are loaded from Unsplash. To use your own images:
1. Replace the image URLs in `index.html`
2. Use relative paths like `./images/photo.jpg`
3. Place your images in an `images/` folder

### Updating Content

- Edit `index.html` to modify itinerary details
- Update `styles.css` to change colors, fonts, or layout
- Modify `script.js` to adjust interactive features

### Color Scheme

The site uses CSS custom properties (variables) for easy color customization. Edit these in `styles.css`:

```css
:root {
    --primary-color: #0891b2;      /* Cyan/Turquoise */
    --secondary-color: #f59e0b;    /* Amber/Orange */
    --accent-color: #ec4899;       /* Pink */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images from Unsplash CDN
- Minimal JavaScript for fast loading
- CSS animations using GPU acceleration
- Lazy loading for better performance

## License

This is a personal project. Feel free to use and modify as needed.

---

**Bon Voyage & Joyeux Noël! 🌺🏝️**
# tahiti
