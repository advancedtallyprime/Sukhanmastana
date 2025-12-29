// ===================================
// Sukhan Mastanaa - Main JavaScript
// Load and display poems dynamically
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const poemsContainer = document.getElementById('poemsContainer');
    const searchInput = document.getElementById('searchInput');

    let allPoems = []; // Will store the full list of poems

    // Fetch poems from JSON file
    async function loadPoems() {
        try {
            const response = await fetch('assets/data/poems.json');
            if (!response.ok) throw new Error('Poems data not found');
            
            allPoems = await response.json();
            displayPoems(allPoems);
            highlightPoemOfTheDay();
        } catch (error) {
            poemsContainer.innerHTML = `
                <p class="text-center" style="color: red; grid-column: 1 / -1;">
                    شاعری لوڈ کرنے میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔
                </p>`;
            console.error('Error loading poems:', error);
        }
    }

    // Display poems as cards
    function displayPoems(poems) {
        if (poems.length === 0) {
            poemsContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">کوئی شاعری نہیں ملی۔</p>';
            return;
        }

        poemsContainer.innerHTML = poems.map(poem => `
            <article class="poem-card" data-id="${poem.id}">
                <h3>${poem.title}</h3>
                <div class="poem-content">
                    <div class="poem-text">
                        ${poem.poem.split('\n').map(line => 
                            line.trim() ? `<p>${line}</p>` : ''
                        ).join('')}
                    </div>
                    <div class="poem-meta">
                        <strong>${poem.poet}</strong><br>
                        <em>${poem.year}</em>
                    </div>
                </div>
                <a href="#poem/${poem.slug}" class="read-more-btn">مکمل پڑھیں →</a>
            </article>
        `).join('');
    }

    // Highlight today's poem as "Poem of the Day"
    function highlightPoemOfTheDay() {
        const today = new Date().getDate(); // 1-31
        const poemOfDayIndex = today % allPoems.length;
        const poemCards = document.querySelectorAll('.poem-card');
        
        if (poemCards[poemOfDayIndex]) {
            poemCards[poemOfDayIndex].style.border = '4px solid #d4af37';
            poemCards[poemOfDayIndex].style.transform = 'scale(1.03)';
            
            // Add a ribbon badge
            poemCards[poemOfDayIndex].insertAdjacentHTML('afterbegin', 
                '<div style="position:absolute; top:10px; left:10px; background:#d4af37; color:#1a3a5f; padding:0.5rem 1rem; border-radius:8px; font-weight:bold; font-size:0.9rem; z-index:10;">آج کی شاعری ✨</div>'
            );
        }
    }

    // Initial load
    loadPoems();

    // Optional: Future-proof for single poem pages (hash routing)
    window.addEventListener('hashchange', () => {
        if (location.hash.startsWith('#poem/')) {
            const slug = location.hash.split('/')[1];
            const poem = allPoems.find(p => p.slug === slug);
            if (poem) showSinglePoem(poem);
        }
    });

    function showSinglePoem(poem) {
        poemsContainer.innerHTML = `
            <div class="poem-full">
                <h1>${poem.title}</h1>
                <h2>از: ${poem.poet}</h2>
                <hr>
                <div class="full-poem-text">
                    ${poem.poem.split('\n').map(line => 
                        line.trim() ? `<p>${line}</p>` : '<br>'
                    ).join('')}
                </div>
                <p><strong>سنہ اشاعت:</strong> ${poem.year}</p>
                <p><strong>موضوعات:</strong> ${poem.theme.join(' • ')}</p>
                <a href="#" onclick="history.back()" style="display:inline-block; margin-top:2rem; color:#1a3a5f;">← واپس جائیں</a>
            </div>
        `;
    }
});
// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    darkModeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Load saved preference
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
} else {
    darkModeToggle.textContent = '🌙';
}

darkModeToggle.addEventListener('click', toggleDarkMode);