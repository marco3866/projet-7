// Déclaration des ensembles pour stocker des valeurs uniques et des tags actifs
var ingredientsSet = new Set();
var appliancesSet = new Set();
var utensilsSet = new Set();
var activeTags = {
    ingredients: new Set(),
    appliance: new Set(),
    ustensils: new Set()
};

// Fonction pour filtrer les recettes par tag
function filterRecipesByTag(tag, category) {
    const filteredRecipes = recipes.filter(recipe => {
        if (category === 'ingredients') {
            return recipe.ingredients.some(ingredient => ingredient.ingredient === tag);
        } else if (category === 'appliance') {
            return recipe.appliance === tag;
        } else if (category === 'ustensils') {
            return recipe.ustensils.includes(tag);
        }
        return false;
    });
    displayRecipes(filteredRecipes);
}

// Fonction pour mettre à jour les tags en fonction des recettes filtrées
function updateTagSets(filteredRecipes) {
    ingredientsSet.clear();
    appliancesSet.clear();
    utensilsSet.clear();

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(item => ingredientsSet.add(item.ingredient));
        appliancesSet.add(recipe.appliance);
        recipe.ustensils.forEach(utensil => utensilsSet.add(utensil));
    });
    updateDropdownTags();
}

// Fonction pour mettre à jour les dropdowns avec les tags
function updateDropdownTags() {
    updateTags(document.querySelector('.dropdown-ingredients .tags-container'), ingredientsSet, 'ingredients');
    updateTags(document.querySelector('.dropdown-appliances .tags-container'), appliancesSet, 'appliance');
    updateTags(document.querySelector('.dropdown-utensils .tags-container'), utensilsSet, 'ustensils');
}

// Fonction pour mettre à jour les tags d'un dropdown spécifique
function updateTags(dropdown, tagSet, category) {
    dropdown.innerHTML = '';
    tagSet.forEach(tag => {
        if (!activeTags[category].has(tag)) {
            dropdown.appendChild(createTag(tag, category));
        }
    });
}

// Fonction pour créer un tag et l'ajouter au DOM
function createTag(text, category) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = text;
    tag.setAttribute('data-category', category);

    tag.addEventListener('click', () => {
        if (!activeTags[category].has(text)) {
            activeTags[category].add(text);
            displaySelectedTag(text, category);
            updateDisplayedRecipes();
        }
    });
    return tag;
}
// Fonction pour afficher le tag sélectionné et gérer sa suppression
function displaySelectedTag(tagText, category) {
    const selectedTagContainer = document.querySelector(`.${category}-selected-tags`);
    if (!selectedTagContainer) {
        console.error(`Le conteneur pour les tags sélectionnés de la catégorie ${category} est introuvable.`);
        return;
    }

    const tag = document.createElement('div');
    tag.className = 'selected-tag';
    tag.textContent = tagText;

    const removeButton = document.createElement('span');
    removeButton.textContent = '×';
    removeButton.className = 'remove-selected-tag';
    removeButton.onclick = function() {
        activeTags[category].delete(tagText);
        tag.remove();
        updateDisplayedRecipes(); // Mettre à jour l'affichage des recettes
    };

    tag.appendChild(removeButton);
    selectedTagContainer.appendChild(tag);
}

// Fonction pour mettre à jour l'affichage des recettes en fonction des tags actifs
function updateDisplayedRecipes() {
    const filteredRecipes = recipes.filter(recipe => {
        const ingredientMatch = [...activeTags.ingredients].every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient === tag));
        const applianceMatch = activeTags.appliance.size === 0 || activeTags.appliance.has(recipe.appliance);
        const utensilMatch = [...activeTags.ustensils].every(utensil => 
            recipe.ustensils.includes(utensil));

        return ingredientMatch && applianceMatch && utensilMatch;
    });

    displayRecipes(filteredRecipes); // Assurez-vous que cette fonction est bien définie pour afficher les recettes
}
