// miniSearchHandler.js

document.addEventListener("DOMContentLoaded", () => {
    const ingredientSearchInput = document.querySelector('.dropdown-ingredients .search-input');
    const applianceSearchInput = document.querySelector('.dropdown-appliances .search-input');
    const utensilSearchInput = document.querySelector('.dropdown-utensils .search-input');

    ingredientSearchInput.addEventListener('input', () => filterDropdownOptions('dropdown-ingredients', ingredientSearchInput.value));
    applianceSearchInput.addEventListener('input', () => filterDropdownOptions('dropdown-appliances', applianceSearchInput.value));
    utensilSearchInput.addEventListener('input', () => filterDropdownOptions('dropdown-utensils', utensilSearchInput.value));
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
    if (category === 'utensils') category = 'ustensils'; // Assurez-vous que c'est cohérent avec votre choix dans `activeTags`

    // Vérifiez que la catégorie est bien présente dans activeTags
    if (!(category in activeTags)) {
        console.error(`Catégorie non reconnue ou non initialisée : ${category}`);
        return;
    }

    const searchBox = dropdown.querySelector('.search-box');
    dropdown.innerHTML = '';
    if (searchBox) {
        dropdown.appendChild(searchBox);
    }

    // Filtre les options pour exclure les tags actifs
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
}