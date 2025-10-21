// Image Search & Customization Feature
// Uses Google Custom Search API for web image search

const GOOGLE_API_KEY = 'AIzaSyCk981Xntwf3juglsbvFTJDhXA8bnBDWXM'; // Users can add their own Google API key
const GOOGLE_CX = '36d709b9956e14cad'; // Custom Search Engine ID
const STORAGE_KEY = 'tahiti-custom-images';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

class ImageSearchManager {
    constructor() {
        this.editMode = false;
        this.customImages = this.loadCustomImages();
        this.currentLocation = null;
        this.searchResults = [];
        this.selectedImages = [];
        this.searchMode = 'web'; // 'web' or 'url'

        this.init();
    }

    init() {
        this.createModal();
        this.setupEditModeToggle();
        this.setupCarouselEditButtons();
        this.applyCustomImages();
    }

    loadCustomImages() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error loading custom images:', e);
            return {};
        }
    }

    saveCustomImages() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customImages));
        } catch (e) {
            console.error('Error saving custom images:', e);
        }
    }

    setupEditModeToggle() {
        const toggleBtn = document.getElementById('editModeToggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            this.editMode = !this.editMode;
            toggleBtn.classList.toggle('active', this.editMode);

            // Show/hide edit buttons on carousels
            document.querySelectorAll('.carousel-edit-btn').forEach(btn => {
                btn.style.display = this.editMode ? 'block' : 'none';
            });
        });
    }

    setupCarouselEditButtons() {
        document.querySelectorAll('.carousel-container').forEach(container => {
            const location = container.getAttribute('data-location');
            if (!location) return;

            // Create edit button if it doesn't exist
            let editBtn = container.querySelector('.carousel-edit-btn');
            if (!editBtn) {
                editBtn = document.createElement('button');
                editBtn.className = 'carousel-edit-btn';
                editBtn.innerHTML = '🔍 Search Images';
                editBtn.style.display = 'none';
                container.appendChild(editBtn);
            }

            editBtn.addEventListener('click', () => {
                this.openSearchModal(location, container);
            });
        });
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'imageSearchModal';
        modal.className = 'image-search-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Search Images</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="search-mode-tabs">
                        <button class="search-mode-tab active" data-mode="web">Web Search</button>
                        <button class="search-mode-tab" data-mode="url">URL Scraper</button>
                    </div>
                    <div class="search-bar" id="webSearchBar">
                        <input type="text" id="imageSearchInput" placeholder="Search the web for images (e.g., 'Tahiti resort pool')">
                        <button id="searchButton">Search Web</button>
                    </div>
                    <div class="search-bar" id="urlSearchBar" style="display: none;">
                        <input type="url" id="urlInput" placeholder="Enter webpage URL (e.g., https://example.com)">
                        <button id="scrapeButton">Scrape Images</button>
                    </div>
                    <div class="search-info">
                        <p id="webSearchInfo">💡 <strong>Tip:</strong> Search the entire web for images. Be specific with your search terms!</p>
                        <p id="urlSearchInfo" style="display: none;">💡 <strong>Tip:</strong> Enter a webpage URL to extract all images larger than 640x480 pixels.</p>
                        <p class="api-notice" id="apiNotice">Using demo mode with limited results. Add your own <a href="https://developers.google.com/custom-search/v1/overview" target="_blank">Google Custom Search API key</a> for full access.</p>
                    </div>
                    <div id="searchResults" class="search-results">
                        <p class="search-placeholder">Enter a search term or URL to find images</p>
                    </div>
                    <div class="selected-images">
                        <h3>Selected Images (<span id="selectedCount">0</span>/6)</h3>
                        <div id="selectedImagesContainer" class="selected-images-grid"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="cancelButton" class="btn-secondary">Cancel</button>
                    <button id="saveImagesButton" class="btn-primary">Save Images</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Setup modal event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.querySelector('#cancelButton').addEventListener('click', () => this.closeModal());
        modal.querySelector('#searchButton').addEventListener('click', () => this.performSearch());
        modal.querySelector('#scrapeButton').addEventListener('click', () => this.scrapeUrl());
        modal.querySelector('#imageSearchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        modal.querySelector('#urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.scrapeUrl();
        });
        modal.querySelector('#saveImagesButton').addEventListener('click', () => this.saveSelectedImages());

        // Search mode tabs
        modal.querySelectorAll('.search-mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.target.getAttribute('data-mode');
                this.switchSearchMode(mode);
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    switchSearchMode(mode) {
        this.searchMode = mode;

        // Update tab active state
        document.querySelectorAll('.search-mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-mode') === mode);
        });

        // Toggle search bars
        if (mode === 'web') {
            document.getElementById('webSearchBar').style.display = 'flex';
            document.getElementById('urlSearchBar').style.display = 'none';
            document.getElementById('webSearchInfo').style.display = 'block';
            document.getElementById('urlSearchInfo').style.display = 'none';
            document.getElementById('apiNotice').style.display = 'block';

            // Restore search term when switching back to web search
            if (this.currentSearchTerm) {
                document.getElementById('imageSearchInput').value = this.currentSearchTerm;
            }
        } else {
            document.getElementById('webSearchBar').style.display = 'none';
            document.getElementById('urlSearchBar').style.display = 'flex';
            document.getElementById('webSearchInfo').style.display = 'none';
            document.getElementById('urlSearchInfo').style.display = 'block';
            document.getElementById('apiNotice').style.display = 'none';
        }

        // Clear results
        document.getElementById('searchResults').innerHTML = '<p class="search-placeholder">Enter a search term or URL to find images</p>';
    }

    openSearchModal(location, container) {
        this.currentLocation = location;
        this.currentContainer = container;
        this.selectedImages = [];

        const modal = document.getElementById('imageSearchModal');
        modal.style.display = 'flex';

        // Clear previous results
        document.getElementById('searchResults').innerHTML = '<p class="search-placeholder">Enter a search term or URL to find images</p>';
        document.getElementById('selectedImagesContainer').innerHTML = '';
        document.getElementById('selectedCount').textContent = '0';

        // Set suggested search term based on location
        const searchTerm = this.getSuggestedSearchTerm(location);
        this.currentSearchTerm = searchTerm; // Store for later use
        document.getElementById('imageSearchInput').value = searchTerm;
        document.getElementById('imageSearchInput').focus();
    }

    closeModal() {
        const modal = document.getElementById('imageSearchModal');
        modal.style.display = 'none';
        this.currentLocation = null;
        this.selectedImages = [];
    }

    getSuggestedSearchTerm(location) {
        const suggestions = {
            'hilton-tahiti': 'Tahiti resort pool ocean',
            'fautaua-waterfall': 'Tahiti waterfall tropical jungle',
            'rangiroa-accommodation': 'Rangiroa atoll beach bungalow',
            'blue-lagoon': 'Rangiroa blue lagoon pink sand',
            'tiputa-pass': 'dolphins underwater coral reef',
            'trimaran-sailing': 'sailing catamaran tropical lagoon',
            'kiteboarding': 'kitesurfing turquoise lagoon',
            'mount-otemanu': 'Bora Bora mountain peak hiking',
            'marae-taputapuatea': 'ancient Polynesian temple stones'
        };
        return suggestions[location] || location.replace(/-/g, ' ');
    }

    async performSearch() {
        const searchTerm = document.getElementById('imageSearchInput').value.trim();
        if (!searchTerm) return;

        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '<div class="loading">Searching...</div>';

        try {
            // Use Unsplash API if key is available, otherwise use demo images
            const images = await this.searchImages(searchTerm);
            this.displaySearchResults(images);
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<p class="error">Error searching images. Please try again.</p>';
        }
    }

    async searchImages(searchTerm) {
        // Check if user has added their own Google API key
        if (GOOGLE_API_KEY !== 'YOUR_KEY_HERE' && GOOGLE_CX !== 'YOUR_CX_HERE') {
            const response = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(searchTerm)}&searchType=image&num=10&imgSize=large`
            );

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                return [];
            }

            return data.items.map(item => ({
                id: item.link,
                url: item.link,
                thumb: item.image.thumbnailLink,
                author: item.displayLink,
                authorUrl: item.image.contextLink
            }));
        } else {
            // Demo mode: Use DuckDuckGo-style search with placeholder images
            return this.getDemoImages(searchTerm);
        }
    }

    getDemoImages(searchTerm) {
        // Demo mode with placeholder images from multiple sources
        const images = [];
        const keywords = encodeURIComponent(searchTerm);

        for (let i = 0; i < 12; i++) {
            // Use various image placeholder services for demo
            const width = 1200;
            const height = 800;
            const thumbWidth = 400;
            const thumbHeight = 300;

            images.push({
                id: `demo-${i}-${Date.now()}`,
                url: `https://source.unsplash.com/${width}x${height}/?${keywords}&sig=${i}`,
                thumb: `https://source.unsplash.com/${thumbWidth}x${thumbHeight}/?${keywords}&sig=${i}`,
                author: 'Demo Image',
                authorUrl: '#'
            });
        }

        return images;
    }

    async scrapeUrl() {
        const urlInput = document.getElementById('urlInput').value.trim();
        if (!urlInput) {
            alert('Please enter a URL');
            return;
        }

        // Validate URL
        try {
            new URL(urlInput);
        } catch (e) {
            alert('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '<div class="loading">Scraping images from URL...</div>';

        try {
            const images = await this.extractImagesFromUrl(urlInput);
            if (images.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No images found or unable to access the page. Try a different URL.</p>';
            } else {
                this.displaySearchResults(images);
            }
        } catch (error) {
            console.error('URL scraping error:', error);
            resultsContainer.innerHTML = '<p class="error">Error accessing URL. The site may block scraping or require authentication.</p>';
        }
    }

    async extractImagesFromUrl(url) {
        try {
            // Fetch the webpage through CORS proxy
            const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) throw new Error('Failed to fetch URL');

            const html = await response.text();

            // Parse HTML to extract image URLs
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const imgElements = doc.querySelectorAll('img');

            const images = [];
            const seenUrls = new Set();

            for (const img of imgElements) {
                let imgUrl = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');

                if (!imgUrl) continue;

                // Convert relative URLs to absolute
                if (imgUrl.startsWith('//')) {
                    imgUrl = 'https:' + imgUrl;
                } else if (imgUrl.startsWith('/')) {
                    const baseUrl = new URL(url);
                    imgUrl = baseUrl.origin + imgUrl;
                } else if (!imgUrl.startsWith('http')) {
                    const baseUrl = new URL(url);
                    imgUrl = new URL(imgUrl, baseUrl.origin).href;
                }

                // Skip duplicates and data URLs
                if (seenUrls.has(imgUrl) || imgUrl.startsWith('data:')) continue;
                seenUrls.add(imgUrl);

                // Check image dimensions (if available in HTML)
                const width = parseInt(img.width || img.getAttribute('width') || 0);
                const height = parseInt(img.height || img.getAttribute('height') || 0);

                // If dimensions are specified, filter by minimum size
                if (width > 0 && height > 0) {
                    if (width < 640 || height < 480) continue;
                }

                images.push({
                    id: imgUrl,
                    url: imgUrl,
                    thumb: imgUrl,
                    author: new URL(url).hostname,
                    authorUrl: url
                });

                // Limit to 20 images
                if (images.length >= 20) break;
            }

            return images;
        } catch (error) {
            console.error('Error extracting images:', error);
            throw error;
        }
    }

    displaySearchResults(images) {
        const resultsContainer = document.getElementById('searchResults');

        if (images.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No images found. Try different search terms.</p>';
            return;
        }

        resultsContainer.innerHTML = images.map(image => `
            <div class="search-result-item" data-image-id="${image.id}">
                <img src="${image.thumb}" alt="Search result">
                <div class="image-overlay">
                    <button class="select-image-btn">Select</button>
                </div>
            </div>
        `).join('');

        // Add click handlers
        resultsContainer.querySelectorAll('.select-image-btn').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectImage(images[index]);
            });
        });
    }

    selectImage(image) {
        if (this.selectedImages.length >= 6) {
            alert('You can select up to 6 images. Remove one to select another.');
            return;
        }

        if (this.selectedImages.find(img => img.id === image.id)) {
            return; // Already selected
        }

        this.selectedImages.push(image);
        this.updateSelectedImagesDisplay();
    }

    updateSelectedImagesDisplay() {
        const container = document.getElementById('selectedImagesContainer');
        const count = document.getElementById('selectedCount');

        count.textContent = this.selectedImages.length;

        container.innerHTML = this.selectedImages.map((image, index) => `
            <div class="selected-image-item">
                <img src="${image.thumb}" alt="Selected ${index + 1}">
                <button class="remove-image-btn" data-index="${index}">&times;</button>
            </div>
        `).join('');

        // Add remove handlers
        container.querySelectorAll('.remove-image-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                this.selectedImages.splice(index, 1);
                this.updateSelectedImagesDisplay();
            });
        });
    }

    saveSelectedImages() {
        if (this.selectedImages.length === 0) {
            alert('Please select at least one image.');
            return;
        }

        // Save to storage
        this.customImages[this.currentLocation] = this.selectedImages.map(img => img.url);
        this.saveCustomImages();

        // Update the carousel
        this.updateCarousel(this.currentLocation, this.currentContainer);

        this.closeModal();

        // Show success message
        this.showNotification('Images updated successfully!');
    }

    updateCarousel(location, container) {
        const carousel = container.querySelector('.carousel');
        const dotsContainer = container.querySelector('.carousel-dots');
        const images = this.customImages[location];

        if (!images || images.length === 0) return;

        console.log(`Updating carousel for ${location} with ${images.length} images`);

        // Clean up old instance first
        if (container._carouselInstance) {
            const oldInstance = container._carouselInstance;
            if (oldInstance.autoplayInterval) {
                clearInterval(oldInstance.autoplayInterval);
            }
            container._carouselInstance = null;
        }

        // Clear existing slides and dots
        carousel.innerHTML = '';
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
        }

        // Add new slides
        images.forEach((url, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide${index === 0 ? ' active' : ''}`;
            slide.innerHTML = `<img src="${url}" alt="${location} image ${index + 1}">`;
            carousel.appendChild(slide);
        });

        console.log(`Added ${carousel.querySelectorAll('.carousel-slide').length} slides to carousel`);

        // Force DOM reflow before reinitializing
        void carousel.offsetHeight;

        // Reinitialize carousel for this container
        if (window.Carousel) {
            // Use setTimeout to ensure DOM is fully updated
            setTimeout(() => {
                container._carouselInstance = new window.Carousel(container);
                console.log(`Carousel reinitialized with ${container._carouselInstance.slides.length} slides`);
            }, 10);
        }
    }

    applyCustomImages() {
        // Apply all saved custom images on page load
        Object.keys(this.customImages).forEach(location => {
            const container = document.querySelector(`.carousel-container[data-location="${location}"]`);
            if (container) {
                this.updateCarousel(location, container);
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.imageSearchManager = new ImageSearchManager();
});
