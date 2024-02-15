document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-container .fa-search');

    // Fonction pour effectuer la recherche et mettre à jour l'affichage
    function performSearch(searchTerm) {
        if (searchTerm.length >= 3) { // Vérifiez si l'utilisateur a saisi au moins 3 lettres
            console.log(`Recherche en cours pour : ${searchTerm}`);
            const filteredRecipes = recipes.filter(recipe =>
                recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.ingredients.some(ingredient =>
                    ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            displayRecipes(filteredRecipes);
        } else {
            displayRecipes(recipes); // Afficher toutes les recettes si moins de 3 lettres sont saisies
        }
    }

    // Fonction pour gérer l'événement de touche "Entrée" sur le champ de saisie
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            console.log('Touche "Entrée" détectée.');
            performSearch(searchInput.value);
        }
    });

    // Fonction pour gérer la recherche intuitive à chaque saisie
    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });

    // Ajout de l'écouteur d'événement de clic sur l'icône de recherche
    searchIcon.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
});