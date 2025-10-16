
// ============================================
// TUTORIAL 6: LOAD REAL DATA
// From static data to async data loading
// ============================================

// Global variable to store loaded restaurant data
let restaurants = [];

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tutorial 6: Async data loading ready!');
    
    // Get UI elements
    const loadButton = document.querySelector('#load-data-button');
    const statusDisplay = document.querySelector('#loading-status');
    const statusMessage = statusDisplay.querySelector('.status-message');
    
    // Get the method buttons (start disabled)
    const displayButton = document.querySelector('#display-button');
    const filterButton = document.querySelector('#filter-button');
    const mapButton = document.querySelector('#map-button');
    const errorButton = document.querySelector('#error-button');
    
    // ============================================
    // MAIN DATA LOADING FUNCTION
    // ============================================
    
    // This is the key new skill - loading data asynchronously
    loadButton.addEventListener('click', async function() {
        
        // Step 1: Show loading state
        // Hint: Change statusDisplay classes and statusMessage text
        // Hint: Disable the load button while loading
        
        // YOUR CODE HERE:
        updateStatus('loading', 'Loading restaurant data…');
        loadButton.disabled = true;
        
        
        try {
            // Step 2: Use fetch() to load data
            // Hint: const response = await fetch('restaurants.json');
            // Hint: Check if response.ok before continuing
            const response = await fetch('restaurants.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Step 3: Convert response to JSON
            // Hint: const data = await response.json();
            const data = await response.json();
            
            // Step 4: Store data in global variable
            // Hint: restaurants = data;
            // YOUR CODE HERE:
            restaurants = Array.isArray(data) ? data : [];
            if (restaurants.length === 0) {
                throw new Error('Unexpected data format (expected a non-empty array)');
            }
            
            // Step 5: Show success state and enable buttons
            // Hint: Update statusDisplay classes and message
            // Hint: Enable all the method buttons
            
            // YOUR CODE HERE:
            updateStatus('success', `Loaded ${restaurants.length} restaurants`);
            toggleMethodButtons(true);
            
        } catch (error) {
            // Step 6: Handle errors gracefully
            // Hint: Show error state with user-friendly message
            // Hint: Log the actual error for debugging
            
            // YOUR CODE HERE:
            console.error('Load failed:', error);
            updateStatus('error', 'Failed to load data. Please try again.');
            } finally {
                loadButton.disabled = false;
            }
    });
    
    // ============================================
    // ARRAY METHOD FUNCTIONS - Same as Tutorial 5
    // ============================================
    
    // Display all restaurants (same as Tutorial 5, but using loaded data)
    displayButton.addEventListener('click', function() {
        const restaurantList = document.querySelector('#restaurant-list');
        
        // Check if we have data first
        if (restaurants.length === 0) {
            restaurantList.innerHTML = '<p class="placeholder">No data loaded yet</p>';
            return;
        }
        
        // Step 7: Use the same forEach logic from Tutorial 5
        // Hint: restaurants.forEach(function(restaurant) { })
        
        // YOUR CODE HERE:
        restaurantList.innerHTML = '';

        restaurants.forEach(function (r) {
            const div = document.createElement('div');
            div.className = 'restaurant-item';
            div.innerHTML = `
                <div class="restaurant-name">${r.name ?? 'Unknown'}</div>
                <div class="restaurant-cuisine">${r.cuisine ?? '—'}</div>
                <div>
                    <span class="restaurant-rating">${r.rating ?? 'N/A'} ★</span>
                    &nbsp;•&nbsp;
                    <span class="restaurant-price">${r.priceRange ?? '?'}</span>
                    &nbsp;•&nbsp;
                    <span>${r.neighborhood ?? ''}</span>
                </div>
                `;
                restaurantList.appendChild(div);
            });
        
        
    });
    
    // Filter cheap restaurants (same logic, loaded data)
    filterButton.addEventListener('click', function() {
        const filteredList = document.querySelector('#filtered-list');
        
        if (restaurants.length === 0) {
            filteredList.innerHTML = '<p class="placeholder">No data loaded yet</p>';
            return;
        }
        
        // Step 8: Use the same filter logic from Tutorial 5
        // Hint: const cheapRestaurants = restaurants.filter(function(restaurant) { })
        
        // YOUR CODE HERE:
        const cheapRestaurants = restaurants.filter(function (r) {
            return r.priceRange === '$' || r.priceRange === '$$';
        });

        filteredList.innerHTML = '';
        if (cheapRestaurants.length === 0) {
            filteredList.innerHTML = '<p class="placeholder">No cheap restaurants found</p>';
        } else {
            cheapRestaurants.forEach(function (r) {
                const div = document.createElement('div');
                div.className = 'restaurant-item';
                div.innerHTML = `
                    <div class="restaurant-name">${r.name}</div>
                    <div class="restaurant-cuisine">${r.cuisine}</div>
                    <div>
                        <span class="restaurant-rating">${r.rating} ★</span>
                        &nbsp;•&nbsp;
                        <span class="restaurant-price">${r.priceRange}</span>
                    </div>
                    `;
                    filteredList.appendChild(div);
                });
            }
    });
    
    // Show restaurant names (same logic, loaded data)
    mapButton.addEventListener('click', function() {
        const mappedList = document.querySelector('#mapped-list');
        
        if (restaurants.length === 0) {
            mappedList.innerHTML = '<p class="placeholder">No data loaded yet</p>';
            return;
        }
        
        // Step 9: Use the same map logic from Tutorial 5
        // Hint: const names = restaurants.map(function(restaurant) { })
        
        // YOUR CODE HERE:
        const names = restaurants.map(function (r) {
            return r.name;
        });

        mappedList.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'name-list';

        names.forEach(function (name) {
            const li = document.createElement('li');
            li.textContent = name;
            ul.appendChild(li);
        });

        mappedList.appendChild(ul);
        
    });
    
    // ============================================
    // ERROR HANDLING DEMO
    // ============================================
    
    // This demonstrates what happens when fetch() fails
    errorButton.addEventListener('click', async function() {
        const errorDisplay = document.querySelector('#error-display');
        
        errorDisplay.innerHTML = '<div class="status-display loading"><p class="status-message">Trying to load from bad URL...</p></div>';
        
        try {
            // This will fail because the URL doesn't exist
            const response = await fetch('nonexistent-file.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            errorDisplay.innerHTML = '<p class="placeholder">This should not appear</p>';
            
        } catch (error) {
            // Step 10: Show user-friendly error message
            // Hint: Create error message div with helpful text
            
            // YOUR CODE HERE:
            const friendly = document.createElement('div');
            friendly.className = 'error-message';
            friendly.textContent = 'Oops! Could not load sample data from the server. This is expected for the demo. Please check your connection or try again.';
            errorDisplay.innerHTML = '';
            errorDisplay.appendChild(friendly);
            
            
            console.error('Demonstrated error:', error);
        }
    });
    
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Helper function to enable/disable method buttons
function toggleMethodButtons(enabled) {
    const buttons = [
        document.querySelector('#display-button'),
        document.querySelector('#filter-button'),
        document.querySelector('#map-button')
    ];
    
    buttons.forEach(button => {
        button.disabled = !enabled;
    });
}

// Helper function to update status display
function updateStatus(state, message) {
    const statusDisplay = document.querySelector('#loading-status');
    const statusMessage = statusDisplay.querySelector('.status-message');
    
    // Remove all state classes
    statusDisplay.classList.remove('loading', 'success', 'error');
    
    // Add new state class
    if (state !== 'ready') {
        statusDisplay.classList.add(state);
    }
    
    statusMessage.textContent = message;
}

// ============================================
// DEBUGGING FUNCTIONS
// ============================================

// Check if data is loaded
function checkDataStatus() {
    console.log('=== Data Status ===');
    console.log('Restaurants loaded:', restaurants.length);
    if (restaurants.length > 0) {
        console.log('First restaurant:', restaurants[0].name);
        console.log('All restaurant names:', restaurants.map(r => r.name));
    }
    console.log('==================');
}

// Manually load data (for testing)
async function manualLoadData() {
    try {
        const response = await fetch('restaurants.json');
        if (!response.ok) throw new Error('Load failed');
        const data = await response.json();
        restaurants = data;
        console.log(`Manually loaded ${restaurants.length} restaurants`);
        toggleMethodButtons(true);
        updateStatus('success', `Successfully loaded ${restaurants.length} restaurants`);
    } catch (error) {
        console.error('Manual load failed:', error);
        updateStatus('error', 'Failed to load data');
    }
}

// Reset everything
function resetTutorial() {
    restaurants = [];
    toggleMethodButtons(false);
    updateStatus('ready', 'Ready to load data');
    
    // Clear all displays
    document.querySelector('#restaurant-list').innerHTML = '<p class="placeholder">Load data first, then click to display all restaurants</p>';
    document.querySelector('#filtered-list').innerHTML = '<p class="placeholder">Load data first, then click to show only affordable restaurants</p>';
    document.querySelector('#mapped-list').innerHTML = '<p class="placeholder">Load data first, then click to show just the restaurant names</p>';
    document.querySelector('#error-display').innerHTML = '<p class="placeholder">Click to see error handling in action</p>';
    
    console.log('Tutorial reset');
}

// Call these functions in the browser console:
// checkDataStatus() - see if data is loaded
// manualLoadData() - load data without clicking button
// resetTutorial() - reset everything for testing