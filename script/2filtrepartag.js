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
    const filteredRecipes = recipes.filter(recipe => {
        const ingredientMatch = [...activeTags.ingredients].every(ingredient => 
            recipe.ingredients.some(ing => ing.ingredient === ingredient));
        const applianceMatch = activeTags.appliance.size === 0 || activeTags.appliance.has(recipe.appliance);
        const utensilMatch = [...activeTags.ustensils].every(utensil => recipe.ustensils.includes(utensil));

        return ingredientMatch && applianceMatch && utensilMatch;
    });

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);
}

// Fonction pour créer un tag et attacher un gestionnaire d'événement de clic
function createTag(text, category) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = text;
    tag.setAttribute('data-category', category);

    tag.addEventListener('click', () => {
        // Ajouter le tag aux tags actifs
        activeTags[category].add(text);
        displaySelectedTag(text, category);
        updateDisplayedRecipes(); // Mise à jour de l'affichage des recettes avec les nouveaux tags actifs
    });

    return tag;
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
        if (!event.target.matches('.filter-button')) {
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
