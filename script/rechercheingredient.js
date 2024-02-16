document.addEventListener("DOMContentLoaded", () => {
    const ingredientSearchInput = document.querySelector('.dropdown-ingredients .search-input');
    const ingredientSearchIcon = document.querySelector('.dropdown-ingredients .fa-search');
    const dropdownIngredients = document.querySelector('.dropdown-ingredients');

    // Créer un ensemble de tous les ingrédients uniques
    const ingredientsSet = new Set(recipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient)));

    // Fonction pour actualiser l'affichage des tags d'ingrédients
    function updateIngredientTags(filteredIngredients) {
        const tagsContainer = dropdownIngredients.querySelector('.tags-container');
        tagsContainer.innerHTML = ''; // Effacer les tags existants

        filteredIngredients.forEach(ingredient => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.textContent = ingredient;
            tagElement.addEventListener('click', () => {
                // Logique à exécuter lorsqu'un tag est cliqué
                console.log(`Tag sélectionné: ${ingredient}`);
            });
            tagsContainer.appendChild(tagElement);
        });
    }

    // Fonction pour effectuer la recherche dans les ingrédients
    function performIngredientSearch(searchTerm) {
        if (searchTerm.length >= 3) {
            console.log(`Recherche en cours pour les ingrédients: ${searchTerm}`);
            const filteredIngredients = Array.from(ingredientsSet)
                .filter(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()));

            updateIngredientTags(filteredIngredients);
        } else {
            // Afficher tous les ingrédients si la recherche est effacée
            updateIngredientTags(Array.from(ingredientsSet));
        }
    }

    // Gestionnaire d'événements pour le clic sur l'icône de recherche
    ingredientSearchIcon.addEventListener('click', () => {
        console.log('Clic sur l\'icône de recherche pour ingrédients détecté.');
        performIngredientSearch(ingredientSearchInput.value);
    });

    // Gestionnaire d'événements pour la saisie au clavier (keyup)
    ingredientSearchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            console.log('Touche "Entrée" détectée pour ingrédients.');
            performIngredientSearch(ingredientSearchInput.value);
        }
    });

    // Gestionnaire d'événements pour la recherche intuitive (input)
    ingredientSearchInput.addEventListener('input', (event) => {
        performIngredientSearch(event.target.value);
    });
});