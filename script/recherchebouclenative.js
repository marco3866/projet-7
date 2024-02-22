let lastSearchTerm = ''; // Pour mémoriser le dernier terme de recherche
let lastSearchResult = []; // Pour mémoriser les derniers résultats de recherche

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-container .fa-search');

    // Fonction pour effectuer la recherche et mettre à jour l'affichage
    function performSearch(searchTerm) {
        console.log(searchTerm.length >= 3 ? `Recherche en cours pour : ${searchTerm}` : "Moins de 3 caractères, affichage de toutes les recettes.");
    
        // Mémoriser le terme de recherche actuel pour une utilisation future
        lastSearchTerm = searchTerm;
    
        const filteredRecipes = filterRecipesBySearchTermAndTags(searchTerm, activeTags);
        
        console.log("Nombre de recettes après filtrage :", filteredRecipes.length);
    
        // Mettre à jour lastSearchResult avec les recettes filtrées
        lastSearchResult = filteredRecipes;
    
        displayRecipes(filteredRecipes);
        updateFilterOptions(filteredRecipes);
        // Pas besoin d'appeler updateActiveTagsAfterSearch ici car les tags actifs ne changent pas lors d'une recherche
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
    if (category === 'appliances') category = 'appliance';
    if (category === 'utensils') category = 'ustensils';

    if (!activeTags.hasOwnProperty(category)) {
        console.error(`Catégorie non reconnue : ${category}`);
        return;
    }

    if (!activeTags[category].has(option)) {
        activeTags[category].add(option);
        displaySelectedTag(option, category);
    } else {
        activeTags[category].delete(option);
        removeDisplayedTag(option, category);
    }

    updateDisplayedRecipesWithActiveTags();
}
function removeDisplayedTag(tagText, category) {
    const tagToRemove = document.querySelector(`.selected-tag[data-category="${category}"]`).textContent === tagText;
    if (tagToRemove) tagToRemove.remove();
}
function updateDisplayedRecipesWithActiveTags() {
    // Utiliser filterRecipesBySearchTermAndTags pour filtrer les recettes en fonction du dernier terme de recherche et des tags actifs
    const filteredRecipes = filterRecipesBySearchTermAndTags(lastSearchTerm, activeTags);

    displayRecipes(filteredRecipes);
    updateFilterOptions(filteredRecipes);
}
function filterRecipesBySearchTermAndTags(searchTerm, activeTags) {
    return recipes.filter(recipe => {
        const matchesSearchTerm = searchTerm.length < 3 ||
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()));

        const ingredientMatch = [...activeTags.ingredients].every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient === tag));
        const applianceMatch = activeTags.appliance.size === 0 || activeTags.appliance.has(recipe.appliance);
        const utensilMatch = [...activeTags.ustensils].every(tag => recipe.ustensils.includes(tag));

        return matchesSearchTerm && ingredientMatch && applianceMatch && utensilMatch;
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
function filterRecipesBySearchTermAndTags(searchTerm, activeTags) {
    return recipes.filter(recipe => {
        const matchesSearchTerm = searchTerm.length < 3 ||
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()));

        const ingredientMatch = [...activeTags.ingredients].every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient === tag));
        const applianceMatch = activeTags.appliance.size === 0 || activeTags.appliance.has(recipe.appliance);
        const utensilMatch = [...activeTags.ustensils].every(tag => recipe.ustensils.includes(tag));

        return matchesSearchTerm && ingredientMatch && applianceMatch && utensilMatch;
    });
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
