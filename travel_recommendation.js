// JavaScript for travel recommendation app

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-btn');
  const resetButton = document.getElementById('reset-btn');
  const searchBar = document.getElementById('search-bar');
  const resultsContainer = document.getElementById('results');

  // Function to fetch and display recommendations
  async function fetchRecommendations(keyword) {
    try {
      const response = await fetch('travel_recommendation_api.json');
      const data = await response.json();

      const matches = [];
      const lowerKeyword = keyword.toLowerCase();

      // Search for beaches
      if (lowerKeyword.includes('beach')) {
        matches.push(...data.beaches);
      }

      // Search for temples
      if (lowerKeyword.includes('temple')) {
        matches.push(...data.temples);
      }

      // Search for countries
      for (const country of data.countries) {
        if (lowerKeyword.includes(country.name.toLowerCase())) {
          matches.push(...country.cities);
        }
      }

      displayResults(matches);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }

  // Function to display results
  function displayResults(matches) {
    resultsContainer.innerHTML = ''; // Clear previous results

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<p>No recommendations found.</p>';
      return;
    }

    matches.forEach((match) => {
      const card = document.createElement('div');
      card.classList.add('result-card');

      card.innerHTML = `
                <img src="${match.imageUrl}" alt="${match.name}">
                <h3>${match.name}</h3>
                <p>${match.description}</p>
            `;

      resultsContainer.appendChild(card);
    });
  }

  // Event listeners
  searchButton.addEventListener('click', () => {
    const keyword = searchBar.value;
    if (keyword.trim() !== '') {
      fetchRecommendations(keyword);
    }
  });

  resetButton.addEventListener('click', () => {
    searchBar.value = '';
    resultsContainer.innerHTML = '';
  });
});
// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsContainer = document.getElementById('resultsContainer');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const categoryBtns = document.querySelectorAll('.category-btn');

// Global variables
let travelData = null;

// Initialize
async function initialize() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        travelData = await response.json();
    } catch (error) {
        console.error('Error loading travel data:', error);
        resultsContainer.innerHTML = '<p>Error loading travel recommendations. Please try again.</p>';
    }
}

// Page Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page') + 'Page';
        pages.forEach(page => {
            page.style.display = page.id === pageId ? 'block' : 'none';
        });
    });
});

// Category Buttons
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        displayCategoryResults(category);
    });
});

// Search Functionality
searchBtn.addEventListener('click', handleSearch);
resetBtn.addEventListener('click', handleReset);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) return;

    if (!travelData) await initialize();

    let results = [];

    // Search in countries and cities
    travelData.countries.forEach(country => {
        if (country.name.toLowerCase().includes(searchTerm)) {
            country.cities.forEach(city => {
                results.push({
                    ...city,
                    category: 'country',
                    country: country.name
                });
            });
        }
        
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(searchTerm)) {
                results.push({
                    ...city,
                    category: 'country',
                    country: country.name
                });
            }
        });
    });

    // Search in temples
    travelData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(searchTerm)) {
            results.push({
                ...temple,
                category: 'temple'
            });
        }
    });

    // Search in beaches
    travelData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(searchTerm)) {
            results.push({
                ...beach,
                category: 'beach'
            });
        }
    });

    displayResults(results);
}

function displayCategoryResults(category) {
    if (!travelData) return;

    let results = [];
    switch (category) {
        case 'countries':
            travelData.countries.forEach(country => {
                country.cities.forEach(city => {
                    results.push({
                        ...city,
                        category: 'country',
                        country: country.name
                    });
                });
            });
            break;
        case 'temples':
            results = travelData.temples.map(temple => ({
                ...temple,
                category: 'temple'
            }));
            break;
        case 'beaches':
            results = travelData.beaches.map(beach => ({
                ...beach,
                category: 'beach'
            }));
            break;
    }

    displayResults(results);
}

function displayResults(results) {
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Try a different search term.</p>';
        return;
    }

    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        let categoryLabel = '';
        switch (result.category) {
            case 'country':
                categoryLabel = `<span class="category-label">📍 ${result.country}</span>`;
                break;
            case 'temple':
                categoryLabel = '<span class="category-label">🏛️ Temple</span>';
                break;
            case 'beach':
                categoryLabel = '<span class="category-label">🏖️ Beach</span>';
                break;
        }

        // Using a placeholder image if imageUrl contains "enter_your_image"
        const imageUrl = result.imageUrl.includes('enter_your_image') 
            ? '/api/placeholder/400/300'
            : result.imageUrl;

        card.innerHTML = `
            <img src="${imageUrl}" alt="${result.name}">
            <div class="result-card-content">
                ${categoryLabel}
                <h3>${result.name}</h3>
                <p>${result.description}</p>
            </div>
        `;
        
        resultsContainer.appendChild(card);
    });
}

function handleReset() {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initialize);