// ===================================
// Live Search Functionality
// Works with main.js loaded poems
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let allPoems = [];

    // We'll populate allPoems from main.js – but to make search work independently:
    fetch('assets/data/poems.json')
        .then(res => res.json())
        .then(poems => {
            allPoems = poems;
        });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        const poemsContainer = document.getElementById('poemsContainer');

        if (query === '') {
            // Reload all poems (we'll use a global function or re-fetch)
            location.reload(); // Simple way for now – or call displayPoems again
            return;
        }

        const filtered = allPoems.filter(poem =>
            poem.title.toLowerCase().includes(query.toLowerCase()) ||
            poem.poet.toLowerCase().includes(query.toLowerCase()) ||
            poem.poem.toLowerCase().includes(query.toLowerCase()) ||
            (poem.theme && poem.theme.some(t => t.includes(query)))
        );

        // Reuse display logic (we'll extract it or duplicate minimally)
        if (filtered.length === 0) {
            poemsContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">کوئی شاعری نہیں ملی۔</p>';
            return;
        }

        poemsContainer.innerHTML = filtered.map(poem => `
            <article class="poem-card" data-id="${poem.id}">
                <h3>${poem.title}</h3>
                <div class="poem-content">
                    <div class="poem-text">
                        ${highlightText(poem.poem, query)}
                    </div>
                    <div class="poem-meta">
                        <strong>${poem.poet}</strong><br>
                        <em>${poem.year}</em>
                    </div>
                </div>
                <a href="#poem/${poem.slug}" class="read-more-btn">مکمل پڑھیں →</a>
            </article>
        `).join('');
    });

    function highlightText(text, query) {
        if (!query) return text.split('\n').map(line => line ? `<p>${line}</p>` : '').join('');
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.split('\n').map(line => {
            if (!line.trim()) return '';
            const highlighted = line.replace(regex, '<mark>$1</mark>');
            return `<p>${highlighted}</p>`;
        }).join('');
    }
});