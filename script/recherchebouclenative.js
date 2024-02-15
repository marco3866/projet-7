document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-container .fa-search');

    // Fonction pour effectuer la recherche et mettre à jour l'affichage
    function performSearch(searchTerm) {
        console.log(`Recherche en cours pour : ${searchTerm}`);
        const filteredRecipes = recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(ingredient => 
                ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        displayRecipes(filteredRecipes);
    }

    // Fonction pour gérer l'événement de clic sur l'icône de recherche
    function handleSearchIconClick() {
        console.log('Clic sur l\'icône de recherche détecté.');
        performSearch(searchInput.value);
    }

    // Fonction pour gérer l'événement de touche "Entrée" sur le champ de saisie
    function handleSearchInputKeyUp(event) {
        console.log(`Touche pressée : ${event.key}`);
        if (event.key === 'Enter') {
            console.log('Touche "Entrée" détectée.');
            performSearch(searchInput.value);
        }
    }

    // Ajout des écouteurs d'événements
    searchIcon.addEventListener('click', handleSearchIconClick);
    searchInput.addEventListener('keyup', handleSearchInputKeyUp);
});