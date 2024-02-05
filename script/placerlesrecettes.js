// Assurez-vous que ce script est inclus après le script 'recipes.js' dans votre HTML

document.addEventListener("DOMContentLoaded", () => {
    const recipesContainer = document.querySelector('.recipes-container');
    
    // Supposons que vos recettes soient dans une variable 'recipes' définie dans 'recipes.js'
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        // Génération des ingrédients
        let ingredientsHTML = '';
        recipe.ingredients.forEach(ingredient => {
            ingredientsHTML += `
                <div class="ingredient">
                    <span class="ingredient-name">${ingredient.ingredient}</span>
                    <div class="ingredient-details">
                        <span class="ingredient-quantity">${ingredient.quantity || ''}</span>
                        <span class="ingredient-unit">${ingredient.unit || ''}</span>
                    </div>
                </div>`;
        });

        // Remplissage de la carte de recette avec les données
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

        recipesContainer.appendChild(recipeCard);
    });
});
