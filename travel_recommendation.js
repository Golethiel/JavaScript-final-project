// Wait for the DOM content to be fully loaded before running the script.
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the HTML elements
    const searchButton = document.getElementById('searchBtn');
    const searchInput = document.getElementById('search');
    const resetButton = document.getElementById('resetBtn');
    const resultsContainer = document.getElementById('searchResults');

    // Add an event listener to the search button for 'click' events.
    searchButton.addEventListener('click', async (event) => {
        // Prevent the default form submission behavior, which would refresh the page.
        event.preventDefault();

        // Get the value from the search input field.
        const searchTerm = searchInput.value;

        // Check if the search term is empty and log a message if it is.
        if (searchTerm.trim() === '') {
            clearResults();
            console.log("Please enter a search term.");
            return;
        }

        // Call the main search function with the user's input.
        await searchTravelData(searchTerm);
    });

    // add an event listener for the reset button
    resetButton.addEventListener('click', () => {
        clearResults();
        searchInput.value = '';
    });

    // Handles the core search logic, fetching data from a JSON file and logging results. */
    // @param {string} searchTerm The term to search for (e.g., 'Australia', 'beaches'). */
    const searchTravelData = async (searchTerm) => {
        try {
            // Use the Fetch API to retrieve the JSON file.
            // The 'await' keyword pauses execution until the promise is resolved.
            const response = await fetch('travel_recommendation_api.json');

            // Check if the response was successful.
            if (!response.ok) {
                // If the response is not OK (e.g., 404 Not Found), throw an error.
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON data from the response.
            const data = await response.json();

            // Normalize the search term to lowercase for a case-insensitive search.
            const normalizedSearchTerm = searchTerm.toLowerCase();

            let results = [];

            // Perform the search based on the user's input.
            // Check for general categories first.
            if (normalizedSearchTerm === 'countries' || normalizedSearchTerm === 'country') {
                console.log('Results for "countries":', data.countries);
                data.countries.forEach(country => {
                    results = results.concat(country.cities);
                });
            } else if (normalizedSearchTerm === 'temples' || normalizedSearchTerm === 'temple') {
                console.log('Results for "temples":', data.temples);
                results = data.temples;
            } else if (normalizedSearchTerm === 'beaches' || normalizedSearchTerm === 'beach') {
                console.log('Results for "beaches":', data.beaches);
                results = data.beaches;
            } else {
                // Search for a specific country name.
                // The find() method returns the first element in the provided array that satisfies the testing function.
                const country = data.countries.find(c => c.name.toLowerCase() === normalizedSearchTerm);
                if (country) {
                    console.log(`Results for "${country.name}":`, country.cities);
                    results = country.cities;
                } 
            }

            // display the search results on the page
            displayResults(results);

        } catch (error) {
            // Catch any errors that occurred during the fetch or parsing process.
            console.error('Error fetching or processing data:', error);
            clearResults();
            resultsContainer.innerHTML = `<p class="error-message">Sorry, there was an 
            issue retrieving the data. Please try again later.</p>`;
        }
    };

    // diaplay the array of travel recommendations
    const displayResults = (results) => {
        // Clear any previous results before displaying new ones.
        clearResults();

        // show the results container
        resultsContainer.style.display = 'flex';

        if (results.length === 0) {
            resultsContainer.innerHTML = `<p class="no-results-message">
            No results found. Try searching for "countries", "temples",
             "beaches", or a specific country.</p>`;
            return;
        }

        // Iterate over the results and create an HTML card for each.
        results.forEach(item => {
            const card = document.createElement('div');
            // Add a class for styling
            card.classList.add('result-card'); 

            // Create the content for the card.
            // uses placeholder image links
            const cardContent = `
                <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found'" />
                <div class="card-text">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                </div>
            `;
            card.innerHTML = cardContent;

            // Append the new card to the results container.
            resultsContainer.appendChild(card);
        });
    };

    // Helper function to clear the content of the results container
    const clearResults = () => {
        resultsContainer.innerHTML = '';
        // hide the container when clearing the results
        resultsContainer.style.display = 'none';
    };    
});