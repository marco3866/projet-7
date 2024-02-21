document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-container .fa-search');

    // Fonction pour effectuer la recherche et mettre à jour l'affichage
    function performSearch(searchTerm) {
        console.log(searchTerm.length >= 3 ? `Recherche en cours pour : ${searchTerm}` : "Moins de 3 caractères, affichage de toutes les recettes.");
        const filteredRecipes = searchTerm.length >= 3 ? recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
        ) : recipes;

        console.log("Nombre de recettes après filtrage :", filteredRecipes.length);
        displayRecipes(filteredRecipes);
        updateFilterOptions(filteredRecipes);
    }

    // Attachement des gestionnaires d'événements pour la recherche
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });

    searchIcon.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
});

function updateDropdownOptions(dropdownClass, options) {
    const dropdown = document.querySelector('.' + dropdownClass);
    if (!dropdown) {
        console.error(`Élément non trouvé pour le sélecteur : .${dropdownClass}`);
        return;
    }

    dropdown.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('dropdown-option');
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

function updateFilterOptions(recipes) {
    const filteredIngredients = new Set();
    const filteredAppliances = new Set();
    const filteredUtensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => filteredIngredients.add(ingredient.ingredient));
        filteredAppliances.add(recipe.appliance);
        recipe.ustensils.forEach(utensil => filteredUtensils.add(utensil));
    });

    updateDropdownOptions('dropdown-ingredients', filteredIngredients);
    updateDropdownOptions('dropdown-appliances', filteredAppliances);
    updateDropdownOptions('dropdown-utensils', filteredUtensils);
}