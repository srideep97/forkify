export const elements = {
    searchForm : document.querySelector('.search'),
    searchInput : document.querySelector('.search__field'),
    searchRecipe : document.querySelector('.results__list'),
    searchRes : document.querySelector('.results'),
    recipe : document.querySelector('.recipe'),
    shopping : document.querySelector('.shopping__list'),
    likesMenu : document.querySelector('.likes__field'),
    likesList : document.querySelector('.likes__list')
};

export const elementStrings = {
    loader : 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}"> 
            <svg>
                <use href="img/cw.svg"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
};