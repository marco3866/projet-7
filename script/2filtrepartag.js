let activeTags = {
    ingredients: new Set(),
    appliance: new Set(),
    ustensils: new Set()
};
// Parcourir chaque recette et extraire les données
document.addEventListener("DOMContentLoaded", () => {
    const dropdownIngredients = document.querySelector('.dropdown-ingredients');
    const dropdownAppliances = document.querySelector('.dropdown-appliances');
    const dropdownUtensils = document.querySelector('.dropdown-utensils');

    // Ensembles pour stocker des valeurs uniques
    const ingredientsSet = new Set();
    const appliancesSet = new Set();
    const utensilsSet = new Set();

    // Parcourir chaque recette et extraire les données
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(item => {
            ingredientsSet.add(item.ingredient);
        });

        appliancesSet.add(recipe.appliance);

        recipe.ustensils.forEach(utensil => {
            utensilsSet.add(utensil);
        });
    });

    // Fonction pour filtrer les recettes par tag

function filterRecipesByTag(tag, category) {
    // Filtrer les recettes en fonction de la catégorie et du tag sélectionné
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

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);
}


// Fonction pour afficher le tag sélectionné et gérer la suppression
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
        // Supprimer le tag des actifs
        activeTags[category].delete(tagText);
        // Supprimer le tag du DOM
        tag.remove();
        // Mise à jour de l'affichage des recettes après la suppression du tag
        updateDisplayedRecipes();
    };

    tag.appendChild(removeButton);
    selectedTagContainer.appendChild(tag);
}

// III UPDATE AFTER FILTER pour supprimer et reinitialiser
function updateDisplayedRecipes() {
    // Filtrer les recettes selon les tags actifs
    const filteredRecipes = recipes.filter(recipe => {
        const ingredientMatch = [...activeTags.ingredients].every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient === tag));
        const applianceMatch = !activeTags.appliance.size || activeTags.appliance.has(recipe.appliance);
        const utensilMatch = [...activeTags.ustensils].every(tag => 
            recipe.ustensils.includes(tag));

        return ingredientMatch && applianceMatch && utensilMatch;
    });

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);

    // Mettre à jour les ensembles de tags en fonction des recettes filtrées
    updateTagSets(filteredRecipes);
}

// Met à jour les ensembles de tags en fonction des recettes filtrées
function updateTagSets(filteredRecipes) {
    // Vider les ensembles de tags actuels
    ingredientsSet.clear();
    appliancesSet.clear();
    utensilsSet.clear();

    // Ajouter les tags des recettes filtrées aux ensembles
    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(item => ingredientsSet.add(item.ingredient));
        appliancesSet.add(recipe.appliance);
        recipe.ustensils.forEach(item => utensilsSet.add(item));
    });

    // Mettre à jour les tags dans les dropdowns
    updateDropdownTags();
}
// Met à jour les dropdowns avec les tags des ensembles mis à jour
function updateDropdownTags() {
    updateTags(dropdownIngredients, ingredientsSet, 'ingredients');
    updateTags(dropdownAppliances, appliancesSet, 'appliance');
    updateTags(dropdownUtensils, utensilsSet, 'ustensils');
}
// Met à jour les tags d'un dropdown spécifique
function updateTags(dropdown, tagSet, category) {
    // Effacer les tags actuels
    dropdown.innerHTML = '';

    // Ajouter les tags pertinents
    tagSet.forEach(tag => {
        dropdown.appendChild(createTag(tag, category));
    });
}
// Fonction pour créer un tag et attacher un gestionnaire d'événement de clic
function createTag(tagText, category) {
    // Créer le tag seulement s'il est dans l'ensemble correspondant
    if (ingredientsSet.has(tagText) || appliancesSet.has(tagText) || utensilsSet.has(tagText)) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = tagText;
        tag.dataset.category = category;

        // Ajouter le gestionnaire de clic pour le tag
        tag.addEventListener('click', () => {
            // Ajouter le tag aux tags actifs et mettre à jour l'affichage
            activeTags[category].add(tagText);
            displaySelectedTag(tagText, category);
            updateDisplayedRecipes();
        });

        return tag;
    }
}

 // Ajouter des tags aux dropdowns et attacher des gestionnaires d'événement de clic
 ingredientsSet.forEach(ingredient => {
    dropdownIngredients.appendChild(createTag(ingredient, 'ingredients'));
});

appliancesSet.forEach(appliance => {
    dropdownAppliances.appendChild(createTag(appliance, 'appliance'));
});

utensilsSet.forEach(utensil => {
    dropdownUtensils.appendChild(createTag(utensil, 'ustensils'));
});
    // Event listeners for filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            // Close all dropdowns first
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== this.nextElementSibling) {
                    menu.classList.remove('show');
                }
            });

            // Toggle the next sibling element (the dropdown)
            this.nextElementSibling.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        // Si le clic n'est pas sur un bouton de filtre et pas à l'intérieur d'un menu déroulant, fermez les menus.
        if (!event.target.matches('.filter-button') && !event.target.closest('.dropdown-menu')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    }, true);
});
// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
    // Sélectionner toutes les cartes de recette
    const recipeCards = document.querySelectorAll('.recipe-card');

    // Parcourir chaque carte de recette et y attacher un gestionnaire d'événement
    recipeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Code pour gérer le clic sur la carte de recette
            console.log('Recette cliquée:', card);
        });
    });
});
