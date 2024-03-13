let lastSearchTerm = ''; // Pour mémoriser le dernier terme de recherche
let lastSearchResult = []; // Pour mémoriser les derniers résultats de recherche

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-container .fa-search');
    // Sélecteur pour la mini-barre de recherche des ingrédients
    const searchInputIngredients = document.querySelector('.dropdown-ingredients .search-input');
    const searchInputAppliances = document.querySelector('.dropdown-appliances .search-input');
    const searchInputUtensils = document.querySelector('.dropdown-utensils .search-input');
    // Attacher des gestionnaires d'événements pour la recherche dans les ingrédients
    attachSearchHandler(searchInputIngredients, 'ingredients');
    attachSearchHandler(searchInputAppliances, 'appliance');
    attachSearchHandler(searchInputUtensils, 'ustensils');
    // Fonction pour effectuer la recherche et mettre à jour l'affichage
    function performSearch(searchTerm) {
        console.log(searchTerm.length >= 3 ? `Recherche en cours pour : ${searchTerm}` : "Moins de 3 caractères, affichage de toutes les recettes.");
    
        // Mémoriser le terme de recherche actuel pour une utilisation future
        lastSearchTerm = searchTerm;
    
        // Filtrer les recettes en fonction du terme de recherche et des tags actifs
        console.time("FiltrageDesRecettes");
        const filteredRecipes = filterRecipesBySearchTermAndTags(searchTerm, activeTags);
        console.timeEnd("FiltrageDesRecettes");
    
        console.log("Nombre de recettes après filtrage :", filteredRecipes.length);
    
        // Mettre à jour lastSearchResult avec les recettes filtrées
        lastSearchResult = filteredRecipes;
    
        // Afficher les recettes filtrées et mettre à jour les options de filtre
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


// Fait apparaite les bons tags par rapport au recette 
function updateDropdownOptions(dropdownClass, options) {
    const dropdown = document.querySelector('.' + dropdownClass);
    if (!dropdown) {
        console.error(`Élément non trouvé pour le sélecteur : .${dropdownClass}`);
        return;
    }

    let category = dropdownClass.split('-')[1];
    if (category === 'appliances') category = 'appliance';
    if (category === 'utensils') category = 'ustensils';

    if (!(category in activeTags)) {
        console.error(`Catégorie non reconnue ou non initialisée : ${category}`);
        return;
    }

    // Mémoriser la valeur actuelle et la position du curseur dans la barre de recherche
    const searchBox = dropdown.querySelector('.search-box');
    const searchInput = searchBox ? searchBox.querySelector('.search-input') : null;
    const cursorPosition = searchInput ? searchInput.selectionStart : 0;
    const searchValue = searchInput ? searchInput.value : "";

    dropdown.innerHTML = '';
    if (searchBox) {
        dropdown.appendChild(searchBox);
    }

    options = Array.from(options).filter(option => !activeTags[category].has(option));

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('tag');
        optionElement.textContent = option;
        optionElement.addEventListener('click', function() {
            handleFilterOptionClick(option, dropdownClass);
        });
        dropdown.appendChild(optionElement);
    });

    // Restaurer la valeur et le focus de la barre de recherche
    if (searchInput) {
        searchInput.value = searchValue;
        searchInput.focus();
        searchInput.setSelectionRange(cursorPosition, cursorPosition);
    }
}
// AFFICHER LES TAGS APRES RECHERCHE EN HAUT
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
    // SUPPRIME LES TAGS DEJA PRESENt en jaune
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
// Cette fonction filtre les tags et les recherche en meme temps
function filterRecipesBySearchTermAndTags(searchTerm, activeTags) {
    return recipes.filter(recipe => {
      // Vérifier si la recette correspond au terme de recherche
      const matchesSearchTerm = searchTerm.length < 3 ||
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient =>
          ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
      // Vérifier si chaque tag d'ingrédient est présent dans la recette
      const ingredientMatch = Array.from(activeTags.ingredients).every(tag =>
        recipe.ingredients.some(ingredient => ingredient.ingredient === tag)
      );
  
      // Vérifier si l'appareil de la recette correspond à au moins un tag d'appareil actif
      const applianceMatch = activeTags.appliance.size === 0 ||
        Array.from(activeTags.appliance).some(tag => recipe.appliance === tag);
  
      // Vérifier si chaque tag d'ustensile est présent dans la recette
      const utensilMatch = Array.from(activeTags.ustensils).every(tag =>
        recipe.ustensils.includes(tag)
      );
  
      // La recette est incluse dans le résultat filtré si elle correspond à tous les critères
      return matchesSearchTerm && ingredientMatch && applianceMatch && utensilMatch;
    });
  }

// Cette fonction met à jour l'affichage des tags sélectionnés sans supprimer les tags non présents dans les résultats filtrés
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

function updateSelectedTagsDisplay() {
    const selectedTagContainer = document.querySelector('.selected-tags-container');
    selectedTagContainer.innerHTML = '';

    for (const category in activeTags) {
        activeTags[category].forEach(tag => {
            displaySelectedTag(tag, category);
        });
    }
}

function attachSearchHandler(searchInput, category) {
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performCategorySearch(searchInput.value, category);
        }
    });

    searchInput.addEventListener('input', () => {
        performCategorySearch(searchInput.value, category);
    });
}

// POUR RECHERCHER DANS CATEGORY
function performCategorySearch(searchTerm, category) {
    let options = new Set();

    console.log(`Recherche dans la catégorie : ${category}`);

    if (category === 'ingredients') {
        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())) {
                    options.add(ingredient.ingredient);
                }
            });
        });
    } else if (category === 'appliances') {
        console.log("Recherche dans les appareils");
        appliancesSet.forEach(appliance => {
            if (appliance.toLowerCase().includes(searchTerm.toLowerCase())) {
                options.add(appliance);
            }
        });
    } else if (category === 'utensils') {
        console.log("Recherche dans les ustensiles");
        utensilsSet.forEach(utensil => {
            if (utensil.toLowerCase().includes(searchTerm.toLowerCase())) {
                options.add(utensil);
            }
        });
    } else {
        console.error(`Catégorie inconnue : ${category}`);
    }

    // Assurez-vous que les sélecteurs de classe sont corrects
    updateDropdownOptions(`dropdown-${category}`, options);
}