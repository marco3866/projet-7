// Dans un script chargé en premier

var ingredientsSet = new Set();
var appliancesSet = new Set();
var utensilsSet = new Set();

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
// Fonction pour afficher les recettes filtrées et mettre à jour les tags
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
    console.log("Avant mise à jour des tags:", document.querySelector('.search-box'));
    updateTagSets(filteredRecipes);
    console.log("Après mise à jour des tags:", document.querySelector('.search-box'));
}

// Met à jour les ensembles de tags en fonction des recettes filtrées
function updateTagSets(filteredRecipes) {
    console.log("Mise à jour des ensembles de tags basée sur les recettes filtrées.");
    ingredientsSet.clear();
    appliancesSet.clear();
    utensilsSet.clear();

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(item => ingredientsSet.add(item.ingredient));
        appliancesSet.add(recipe.appliance);
        recipe.ustensils.forEach(item => utensilsSet.add(item));
    });

    console.log(`Nouveaux ensembles de tags: 
                 Ingredients: ${[...ingredientsSet]},
                 Appliances: ${[...appliancesSet]},
                 Utensils: ${[...utensilsSet]}`);

    // Mettre à jour les dropdowns avec les nouveaux ensembles de tags
    updateDropdownTags();
}

function updateDropdownTags() {
    console.log("Mise à jour des dropdowns avec les nouveaux ensembles de tags.");
    updateTags(dropdownIngredients, ingredientsSet, 'ingredients');
    updateTags(dropdownAppliances, appliancesSet, 'appliance');
    updateTags(dropdownUtensils, utensilsSet, 'ustensils');
}

function updateTags(dropdown, tagSet, category) {
    console.log(`Mise à jour des tags pour ${category}.`);

    // Préserver la barre de recherche si elle existe
    const searchBox = dropdown.querySelector('.search-box');
    dropdown.innerHTML = '';
    if (searchBox) {
        dropdown.appendChild(searchBox);
    }

    // Ajouter les tags mis à jour
    tagSet.forEach(tag => {
        if (!activeTags[category].has(tag)) {
            dropdown.appendChild(createTag(tag, category));
        }
    });
}

function createTag(text, category) {
    // Utilisez 'button' ou 'a' si vous voulez que chaque tag soit cliquable comme un bouton ou un lien
    const tag = document.createElement('div');
    tag.className = 'tag dropdown-option'; // Ajoutez ici les classes nécessaires pour le style
    tag.textContent = text;
    tag.setAttribute('data-category', category);

    // Ajouter un écouteur d'événements pour gérer le clic sur le tag
    tag.addEventListener('click', () => {
        if (!activeTags[category].has(text)) {
            activeTags[category].add(text); // Ajouter le tag aux tags actifs
            displaySelectedTag(text, category); // Afficher le tag comme sélectionné
            updateDisplayedRecipes(); // Mise à jour de l'affichage des recettes avec les nouveaux tags actifs
        }
    });

    return tag; // Retourner le tag créé
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