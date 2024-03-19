// Fonction pour créer une carte de recette
function createRecipeCard(recipe) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    // Génération des ingrédients
    let ingredientsHTML = recipe.ingredients.map(ingredient => {
        return `
            <div class="ingredient">
                <span class="ingredient-name">${ingredient.ingredient}</span>
                <div class="ingredient-details">
                    <span class="ingredient-quantity">${ingredient.quantity || ''}</span>
                    <span class="ingredient-unit">${ingredient.unit || ''}</span>
                </div>
            </div>`;
    }).join('');

    // Construction de la carte de recette
    recipeCard.innerHTML = `
        <div class="recipe-id">${recipe.id}</div>
        <div class="recipe-image">
            <img src="images/${recipe.image}" alt="${recipe.name}">
            <div class="recipe-time">${recipe.time} min</div>
        </div>
        <div class="recipe-name">${recipe.name}</div>
        <div class="recipe-details">
            <div class="recipe-description-title">Recette</div>
            <div class="recipe-description">${recipe.description}</div>
            <div class="recipe-ingredients-title">Ingrédients</div>
            <div class="recipe-ingredients">${ingredientsHTML}</div>
            <div class="recipe-info">
                <div class="servings">${recipe.servings}</div>
                <div class="appliance">${recipe.appliance || ''}</div>
                <div class="ustensils">${recipe.ustensils.join(', ') || ''}</div>
            </div>
        </div>`;

    return recipeCard;
}
// met a jour le compteur des recettes affiches 
function updateRecipeCount(count) {
    document.querySelector('.recipes-count').textContent = `${count} RECETTES`;
}
// Fonction pour afficher toutes les recettes
function displayRecipes(filteredRecipes) {
    const recipesContainer = document.querySelector('.recipes-container');
    recipesContainer.innerHTML = ''; // Effacer les recettes actuelles
    filteredRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe); // Vous devez avoir cette fonction définie
        recipesContainer.appendChild(recipeCard);
    });
    updateRecipeCount(filteredRecipes.length); // Mettre à jour le compteur avec le nombre de recettes
}

document.addEventListener("DOMContentLoaded", () => {
    // Supposons que 'recipes' est votre tableau de toutes les recettes
    displayRecipes(recipes);
});


