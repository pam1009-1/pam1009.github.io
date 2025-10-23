// ============================================
// TUTORIAL 7: SAME DATA, DIFFERENT STORIES
// Information architecture through multiple presentations
// ============================================

// Global variables to store data
let restaurants = [];
let currentView = 'card';

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tutorial 7: Multiple data presentations ready!');
    
    // Get UI elements
    const loadButton = document.querySelector('#load-data-button');
    const statusDisplay = document.querySelector('#loading-status');
    const dataSummary = document.querySelector('#data-summary');
    const viewControls = document.querySelector('#view-controls');
    const displayContainer = document.querySelector('#display-container');
    const tutorialInsights = document.querySelector('#tutorial-insights');
    
    // Get view buttons
    const cardViewBtn = document.querySelector('#card-view-btn');
    const tableViewBtn = document.querySelector('#table-view-btn');
    const statsViewBtn = document.querySelector('#stats-view-btn');
    
    // ============================================
    // DATA LOADING (Building on Week 6)
    // ============================================
    
    loadButton.addEventListener('click', async function() {
        // Step 1: Show loading state
        // Hint: Use the same loading pattern from Tutorial 6
        
        // YOUR CODE HERE:
        statusDisplay.classList.remove('success','error')
        statusDisplay.classList.add('loading')
        statusDisplay.querySelector('.status-message').textContent = 'Loading Prince George’s County restaurants…';
        loadButton.textContent = 'Loading';
        loadButton.disabled = true;
        
        try {
            // Step 2: Load the GeoJSON data
            // Hint: await fetch('restaurants.geojson') - note the .geojson extension
            // Hint: GeoJSON loads exactly like regular JSON
            const response = await fetch('restaurants.geojson');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            // Step 3: Extract restaurant features from GeoJSON
            // Hint: const restaurantData = await response.json();
            // Hint: restaurants = restaurantData.features; (GeoJSON has a 'features' array)
            // YOUR CODE HERE:
            const restaurantData = await response.json();
            restaurants = Array.isArray(restaurantData?.features) ? restaurantData.features : [];
            if (restaurants.length === 0) throw new Error('No features in GeoJSON');
            
            // Step 4: Show success and enable interface
            // Hint: Show data summary, enable view controls
            // Hint: Call showDataSummary() and showInitialView()
            
            // YOUR CODE HERE:
            statusDisplay.classList.remove('loading');
            statusDisplay.classList.add('success');
            statusDisplay.querySelector('.status-message').textContent = `Loaded ${restaurants.length} records successfully.`;
            showDataSummary();
            showInitialView();
            loadButton.textContent = 'Reload Data';
            loadButton.disabled = false;
        } catch (error) {
            // Step 5: Handle loading errors
            // YOUR CODE HERE:
            console.error(error);
            statusDisplay.classList.remove('loading');
            statusDisplay.classList.add('error');
            statusDisplay.querySelector('.status-message').textContent = `Failed to load data: ${error.message}`;
            loadButton.textContent = 'Try Again:)'
            loadButton.disabled = false;  
        }
    });
    
    // ============================================
    // VIEW SWITCHING (Building on Week 4)
    // ============================================
    
    // Card view button
    cardViewBtn.addEventListener('click', function() {
        // Step 6: Switch to card view
        // Hint: Call switchToView('card') and updateViewButtons
        
        // YOUR CODE HERE:
        switchToView('card');
        updateViewButtons(cardViewBtn);
        
        
    });
    
    // Table view button
    tableViewBtn.addEventListener('click', function() {
        // Step 7: Switch to table view
        // YOUR CODE HERE:
        switchToView('table');
        updateViewButtons(tableViewBtn);
        
    });
    
    // Stats view button
    statsViewBtn.addEventListener('click', function() {
        // Step 8: Switch to stats view
        // YOUR CODE HERE:
        switchToView('stats');
        updateViewButtons(statsViewBtn);
        
    });
    
    // ============================================
    // CARD VIEW - "Discover restaurants"
    // ============================================
    
    function showCardView() {
        const cardGrid = document.querySelector('#card-grid');
        cardGrid.innerHTML = '';
        
        // Step 9: Create cards for restaurant discovery
        // Hint: Use restaurants.forEach(function(restaurant) {})
        // Hint: Access restaurant data with restaurant.properties.name, etc.
        // Hint: Focus on: name, location, recent inspection status
        
        // YOUR CODE HERE:
        restaurants.slice(0, 60).forEach((feature) => {
            const p = feature.properties || {};
            const name = p.name || 'Unnamed Restaurant';
            const city = p.city || 'Unknown city';
            const status = getComplianceStatus(feature);
            const date = formatDate(p.inspection_date);

            const card = document.createElement('div');
            card.className = `restaurant-card ${status}`;

            const title = document.createElement('div');
            title.className = 'card-name';
            title.textContent = name;

            const location = document.createElement('div');
            location.className = 'card-location';
            location.textContent = city;

            const badge = document.createElement('span');
            badge.className = `card-status ${status}`;
            badge.textContent = status.replace('-', ' ');

            const when = document.createElement('div');
            when.className = 'card-date';
            when.textContent = `Last inspection: ${date}`;

            card.appendChild(title);
            card.appendChild(location);
            card.appendChild(badge);
            card.appendChild(when);
            cardGrid.appendChild(card);
        });
        
        console.log('Card view: Emphasizing restaurant discovery');
    }
    
    // ============================================
    // TABLE VIEW - "Compare safety records"
    // ============================================
    
    function showTableView() {
        const tableBody = document.querySelector('#inspection-table tbody');
        tableBody.innerHTML = '';
        
        // Step 10: Create table rows for comparison
        // Hint: Show first 50 restaurants to avoid performance issues
        // Hint: Focus on: name, city, inspection_date, inspection_results
        // Hint: Include specific compliance fields for comparison
        
        // YOUR CODE HERE:
        restaurants.slice(0, 50).forEach((feature) => {
            const p = feature.properties || {};
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.className = 'table-restaurant-name';
            tdName.textContent = p.name || 'Unnamed Restaurant';

            const tdCity = document.createElement('td');
            tdCity.textContent = p.city || '—';

            const tdDate = document.createElement('td');
            tdDate.textContent = formatDate(p.inspection_date);

            const tdResult = document.createElement('td');
            const status = getComplianceStatus(feature);
            const pill = document.createElement('span');
            pill.className = `table-status ${status}`;
            pill.textContent = status.replace('-', ' ');
            tdResult.appendChild(pill);

            const tdHands = document.createElement('td');
            const hands = getComplianceIndicator(p.proper_hand_washing);
            tdHands.className = `compliance-indicator ${hands === '✓' ? 'pass' : (hands === '✗' ? 'fail' : '')}`;
            tdHands.textContent = hands;

            const tdTemp = document.createElement('td');
            const temp = getComplianceIndicator(p.cooking_time_and_temperature);
            tdTemp.className = `compliance-indicator ${temp === '✓' ? 'pass' : (temp === '✗' ? 'fail' : '')}`;
            tdTemp.textContent = temp;

            tr.appendChild(tdName);
            tr.appendChild(tdCity);
            tr.appendChild(tdDate);
            tr.appendChild(tdResult);
            tr.appendChild(tdHands);
            tr.appendChild(tdTemp);
            tableBody.appendChild(tr);



        });
        
        console.log('Table view: Emphasizing safety record comparison');
    }
    
    // ============================================
    // STATS VIEW - "Analyze patterns"
    // ============================================
    
    function showStatsView() {
        // Step 11: Calculate aggregate statistics
        // Hint: Use array methods to calculate totals, percentages, patterns
        // Hint: Count compliance vs non-compliance
        // Hint: Group by city and calculate city-level stats
        
        // YOUR CODE HERE:
        const statsGrid = document.querySelector('#stats-grid');
        const cityStatsWrap = document.querySelector('#city-stats');
        statsGrid.innerHTML = '';
        cityStatsWrap.innerHTML = '';

        const total = restaurants.length;
        const compliant = restaurants.filter(r => getComplianceStatus(r) === 'compliant').length;
        const nonCompliant = restaurants.filter(r => getComplianceStatus(r) === 'non-compliant').length;
        const other = total - compliant - nonCompliant;
        const complianceRate = total ? Math.round((compliant / total) * 1000) / 10 : 0;

        const stats = [
            {number: total.toLocaleString(), label: 'Total restaurants'},
            {number: `${complianceRate}%`, label: 'Compliance rate'},
            {number: compliant.toLocaleString(), label: 'Compliant inspections'},
            {number: nonCompliant.toLocaleString(), label: 'Non-compliant inspections'},
        ];

        stats.forEach(s => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            const n = document.createElement('div');
            n.className = 'stat-number';
            n.textContent = s.number;
            const l = document.createElement('p');
            l.className = 'stat-label';
            l.textContent = s.label;
             card.appendChild(n);
            card.appendChild(l);
            statsGrid.appendChild(card);
        });

        const cityMap = new Map();
        restaurants.forEach(r => {
            const city = (r.properties?.city || 'Unknown').trim();
            const status = getComplianceStatus(r);
            if (!cityMap.has(city)) cityMap.set(city, { total: 0, compliant: 0 });
            const entry = cityMap.get(city);
            entry.total += 1;
            if (status === 'compliant') entry.compliant += 1;
        });

        [...cityMap.entries()]
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10)
            .forEach(([city, { total, compliant }]) => {
                const rate = total ? Math.round((compliant / total) * 1000) / 10 : 0;
                const row = document.createElement('div');
                row.className = 'city-stat';
                const name = document.createElement('div');
                name.className = 'city-name';
                name.textContent = city;
                const meta = document.createElement('div');
                meta.className = 'city-compliance';
                meta.textContent = `${compliant}/${total} compliant • ${rate}%`;
                row.appendChild(name);
                row.appendChild(meta);
                cityStatsWrap.appendChild(row);
            });


        console.log('Stats view: Emphasizing county-wide patterns');
    }
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Update UI to show data summary
    function showDataSummary() {
        // Step 12: Calculate and display summary statistics
        // Hint: Count total restaurants, compliance rate, unique cities
        
        // YOUR CODE HERE:
        const countEl = document.querySelector('#record-count');
        const rateEl = document.querySelector('#compliance-rate');
        const cityEl = document.querySelector('#city-count');

        const total = restaurants.length;
        const compliant = restaurants.filter(r => getComplianceStatus(r) === 'compliant').length;
        const complianceRate = total ? Math.round((compliant / total) * 1000) / 10 : 0;

        const citySet = new Set(
            restaurants
                .map(r => (r.properties?.city || 'Unknown').trim())
        );

        countEl.textContent = total.toLocaleString();
        rateEl.textContent = `${complianceRate}%`;
        cityEl.textContent = citySet.size.toLocaleString();

        
        dataSummary.classList.remove('hidden');
    }
    
    // Switch between views
    function switchToView(viewName) {
    currentView = viewName;
    
    // Hide all view panels
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Show selected view panel
    document.querySelector(`#${viewName}-view`).classList.add('active');
    
    // Replace the switch statement with lookup table
    const viewFunctions = {
        'card': showCardView,
        'table': showTableView,
        'stats': showStatsView,
        'default': () => console.error('Unknown view:', viewName)
    };
    
    const viewFunction = viewFunctions[viewName] || viewFunctions['default'];
    viewFunction();
}
    
    // Update view button states
    function updateViewButtons(activeButton) {
        document.querySelectorAll('.view-button').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    // Show the interface after data loads
    function showInitialView() {
        viewControls.classList.remove('hidden');
        displayContainer.classList.remove('hidden');
        tutorialInsights.classList.remove('hidden');
        
        // Show card view by default
        switchToView('card');
    }
    
    // Helper: Determine compliance status
    function getComplianceStatus(restaurant) {
        const result = restaurant.properties.inspection_results;
        if (!result || result === '------') return 'other';
        return result.toLowerCase().includes('non-compliant') ? 'non-compliant' : 'compliant';
    }
    
    // Helper: Format date for display
    function formatDate(dateString) {
        if (!dateString || dateString === '------') return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    // Helper: Get compliance indicator
    function getComplianceIndicator(value) {
        if (!value || value === '------') return 'N/A';
        return value === 'In Compliance' ? '✓' : '✗';
    }
    
});

// ============================================
// DEBUGGING FUNCTIONS
// ============================================

// Show current data status
function checkTutorial7Status() {
    console.log('=== Tutorial 7 Status ===');
    console.log('Restaurants loaded:', restaurants.length);
    console.log('Current view:', currentView);
    
    if (restaurants.length > 0) {
        // Show sample restaurant data structure
        console.log('Sample restaurant:', restaurants[0].properties);
        
        // Show compliance breakdown
        const compliant = restaurants.filter(r => getComplianceStatus(r) === 'compliant').length;
        const nonCompliant = restaurants.filter(r => getComplianceStatus(r) === 'non-compliant').length;
        const other = restaurants.length - compliant - nonCompliant;
        
        console.log('Compliance breakdown:');
        console.log(`- Compliant: ${compliant}`);
        console.log(`- Non-compliant: ${nonCompliant}`);
        console.log(`- Other: ${other}`);
        
        // Show city distribution
        const cities = {};
        restaurants.forEach(r => {
            const city = r.properties.city;
            cities[city] = (cities[city] || 0) + 1;
        });
        
        console.log('Top cities:');
        Object.entries(cities)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .forEach(([city, count]) => console.log(`- ${city}: ${count}`));
    }
    console.log('========================');
}

// Manually load data for testing
async function manualLoadTutorial7() {
    try {
        const response = await fetch('restaurants.geojson');
        if (!response.ok) throw new Error('Load failed');
        const data = await response.json();
        restaurants = data.features;
        console.log(`Loaded ${restaurants.length} restaurants`);
        
        // Enable the interface
        document.querySelector('#view-controls').classList.remove('hidden');
        document.querySelector('#display-container').classList.remove('hidden');
        document.querySelector('#tutorial-insights').classList.remove('hidden');
        
        // Show initial view
        switchToView('card');
        return restaurants;
    } catch (error) {
        console.error('Manual load failed:', error);
    }
}

// Test all three views
function testAllViews() {
    if (restaurants.length === 0) {
        console.log('Load data first with manualLoadTutorial7()');
        return;
    }
    
    console.log('Testing all views...');
    
    // Test card view
    switchToView('card');
    setTimeout(() => {
        switchToView('table');
        setTimeout(() => {
            switchToView('stats');
            console.log('All views tested');
        }, 1000);
    }, 1000);
}

// Reset tutorial state
function resetTutorial7() {
    restaurants = [];
    currentView = 'card';
    
    // Reset UI
    document.querySelector('#view-controls').classList.add('hidden');
    document.querySelector('#display-container').classList.add('hidden');
    document.querySelector('#tutorial-insights').classList.add('hidden');
    document.querySelector('#data-summary').classList.add('hidden');
    
    // Reset status
    const statusDisplay = document.querySelector('#loading-status');
    statusDisplay.classList.remove('loading', 'success', 'error');
    statusDisplay.querySelector('.status-message').textContent = 'Ready to load restaurant inspection data';
    
    // Reset load button
    const loadButton = document.querySelector('#load-data-button');
    loadButton.textContent = 'Load Restaurant Data';
    loadButton.disabled = false;
    
    console.log('Tutorial 7 reset');
}

// Helper functions available globally
function getComplianceStatus(restaurant) {
    const result = restaurant.properties.inspection_results;
    if (!result || result === '------') return 'other';
    return result.toLowerCase().includes('non-compliant') ? 'non-compliant' : 'compliant';
}

function formatDate(dateString) {
    if (!dateString || dateString === '------') return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function getComplianceIndicator(value) {
    if (!value || value === '------') return 'N/A';
    return value === 'In Compliance' ? '✓' : '✗';
}

// Call these functions in the browser console:
// checkTutorial7Status() - see current state and data analysis
// manualLoadTutorial7() - load data without clicking button
// testAllViews() - automatically test all three views
// resetTutorial7() - reset everything for fresh start