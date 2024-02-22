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
        updateActiveTagsAfterSearch(filteredRecipes);
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

    // Préserver la barre de recherche si nécessaire
    const searchBox = dropdown.querySelector('.search-box');
    dropdown.innerHTML = '';
    if (searchBox) {
        dropdown.appendChild(searchBox);
    }

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('tag');
        optionElement.textContent = option;

        optionElement.addEventListener('click', () => {
            console.log(`Option cliquée: ${option}`);
            // Ajoutez ici la logique de traitement du clic sur l'option
            // Par exemple, mettre à jour les recettes affichées en fonction de l'option sélectionnée
            handleFilterOptionClick(option, dropdownClass);
        });

        dropdown.appendChild(optionElement);
    });
}
function displaySelectedTag(tagText, category) {
    const selectedTagContainer = document.querySelector('.selected-tags-container');
    if (!selectedTagContainer) {
        console.error('Le conteneur pour les tags sélectionnés est introuvable.');
        return;
    }

    const tag = document.createElement('div');
    tag.className = 'selected-tag';
    tag.textContent = tagText;
    tag.setAttribute('data-category', category);

    const removeButton = document.createElement('span');
    removeButton.textContent = '×';
    removeButton.className = 'remove-selected-tag';
    removeButton.onclick = function() {
        activeTags[category].delete(tagText);
        tag.remove();
        updateDisplayedRecipesWithActiveTags();
        updateSelectedTagsDisplay(); // Assurez-vous de mettre à jour les tags après la suppression
    };

    tag.appendChild(removeButton);
    selectedTagContainer.appendChild(tag);
}

function handleFilterOptionClick(option, dropdownClass) {
    let category = dropdownClass.split('-')[1];

    // Ajustement pour les catégories singulières
    if (category === 'appliances') category = 'appliance';
    if (category === 'utensils') category = 'ustensils'; // Assurez-vous d'utiliser 'ustensils' si c'est le terme utilisé dans `activeTags`

    // Vérification de la validité de la catégorie
    if (!activeTags.hasOwnProperty(category)) {
        console.error(`Catégorie non reconnue : ${category}`);
        return;
    }

    // Ajout ou suppression du tag sélectionné et mise à jour de l'affichage
    if (!activeTags[category].has(option)) {
        activeTags[category].add(option);
        displaySelectedTag(option, category);
    } else {
        activeTags[category].delete(option);
        const tagToRemove = document.querySelector(`.selected-tag[data-category="${category}"][textContent="${option}"]`);
        if (tagToRemove) tagToRemove.remove();
    }

    updateDisplayedRecipesWithActiveTags();
}
function removeDisplayedTag(tagText, category) {
    const tagToRemove = document.querySelector(`.selected-tag[data-category="${category}"]`).textContent === tagText;
    if (tagToRemove) tagToRemove.remove();
}
function updateDisplayedRecipesWithActiveTags() {
    const filteredRecipes = recipes.filter(recipe => {
        const ingredientMatch = [...activeTags.ingredients].every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient === tag));
        const applianceMatch = activeTags.appliance.size === 0 || activeTags.appliance.has(recipe.appliance);
        const utensilMatch = [...activeTags.ustensils].every(tag => recipe.ustensils.includes(tag));

        return ingredientMatch && applianceMatch && utensilMatch;
    });

    displayRecipes(filteredRecipes);
    updateFilterOptions(filteredRecipes);

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
function updateActiveTagsAfterSearch(filteredRecipes) {
    for (const category in activeTags) {
        activeTags[category].forEach(tag => {
            const isTagPresent = filteredRecipes.some(recipe => {
                if (category === 'ingredients') return recipe.ingredients.some(ingredient => ingredient.ingredient === tag);
                if (category === 'appliance') return recipe.appliance === tag;
                if (category === 'ustensils') return recipe.ustensils.includes(tag);
                return false;
            });

            if (!isTagPresent) {
                activeTags[category].delete(tag);
            }
        });
    }
    updateSelectedTagsDisplay();
}

function updateSelectedTagsDisplay() {
    const selectedTagContainer = document.querySelector('.selected-tags-container');
    selectedTagContainer.innerHTML = '';

    for (const category in activeTags) {
        activeTags[category].forEach(tag => {
            displaySelectedTag(tag, category);
        });
    }
}
