// Assurez-vous que 'recipes' est accessible et que 'displayRecipes' et 'updateTagSets' sont définies globalement ou importées.
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-container .fa-search');

    // Fonction pour effectuer la recherche et mettre à jour l'affichage.
    function performSearch(searchTerm) {
        console.log(`Recherche en cours pour : ${searchTerm}`);
        let filteredRecipes = recipes; // Utilisez toutes les recettes si la recherche est vide ou moins de 3 caractères.

        if (searchTerm.length >= 3) {
            // Filtrez les recettes si la recherche contient 3 caractères ou plus.
            filteredRecipes = recipes.filter(recipe =>
                recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.ingredients.some(ingredient =>
                    ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Mettre à jour l'affichage des recettes et des tags.
        displayRecipes(filteredRecipes); // Doit être défini dans un autre fichier JS ou être global.
        updateTagSets(filteredRecipes);  // Doit également être défini globalement ou importé.
    }

    // Écouteurs d'événements pour la recherche.
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            console.log('Touche "Entrée" détectée.');
            performSearch(searchInput.value.trim());
        }
    });

    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value.trim());
    });

    searchIcon.addEventListener('click', () => {
        performSearch(searchInput.value.trim());
    });
});
