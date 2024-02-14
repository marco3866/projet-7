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
// Cette fonction ajoutera le tag sélectionné dans le conteneur approprié
function displaySelectedTag(tagText, category) {
    const selectedTagContainer = document.querySelector('.selected-tags-container');
    if (!selectedTagContainer) {
        console.error('Le conteneur pour les tags sélectionnés est introuvable.');
        return;
    }

    const tag = document.createElement('div');
    tag.className = 'selected-tag';
    tag.textContent = tagText;

    // Ajouter un attribut de catégorie au tag sélectionné pour pouvoir filtrer ou supprimer plus tard
    tag.setAttribute('data-category', category);

    const removeButton = document.createElement('span');
    removeButton.textContent = '×';
    removeButton.className = 'remove-selected-tag';
    removeButton.onclick = function() {
        tag.remove();
        // Mettre à jour l'affichage des recettes ici si nécessaire
    };

    tag.appendChild(removeButton);
    selectedTagContainer.appendChild(tag);
}
// Fonction pour créer un tag et attacher un gestionnaire d'événement de clic
function createTag(text, category) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = text;
    tag.setAttribute('data-category', category); // Ajouter une donnée-attribut pour identifier la catégorie du tag

    // Attacher un gestionnaire d'événement de clic au tag
    tag.addEventListener('click', () => {
        filterRecipesByTag(text, category);
        displaySelectedTag(text, category);
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