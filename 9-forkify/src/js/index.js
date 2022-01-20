import Recipe from './models/Recipe';
import Search from './models/Search';
import List from './models/List';
import Likes from './models/Likes';

import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as listView from './views/listView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';


const state = {};



const controlSearch = async () => {

    //get query form the view
    const query = searchView.getInput();

    if(query){

        //add the query and the results in to the search prop of state
        state.search = new Search(query);

        //prepare UI
        searchView.clearInput();
        searchView.clearList();
        renderLoader(elements.searchRes);

        //get the recipes and add the results to the state
        await state.search.getRecipes();

        //display on to the UI
        clearLoader();
        searchView.renderRecipes(state.search.result);

    }
};



elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});


document.querySelector('.results__pages').addEventListener('click', e => {

    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearList();
        searchView.renderRecipes(state.search.result, goToPage);
    }

});


/* RECIPE CONTROLLER */

const controlRecipe = async () => {

    const id = window.location.hash.replace('#','');

    if(id){

        //prepare ui for the recipe
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if(state.search) searchView.highlightSelected(id);
        //get the recipe 
        state.recipe = new Recipe(id);
        //getting data
        await state.recipe.getRecipe();
        //getting the servings and time
        state.recipe.parseIngredients();
        state.recipe.calcTime();
        state.recipe.calcServings();

        //logging onto ui
        clearLoader();
        recipeView.renderRecipe(state.recipe,
            state.likes.isLiked(id)
            );

    }

};

window.addEventListener('hashchange', controlRecipe);




/** list controller */

const controlList = () => {

    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

};



elements.shopping.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);

        listView.deleteItem(id);
    }

    else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});

/**
 * LIKES CONTROLLER
 */

 elements.recipe.addEventListener('click', e => {

    if(e.target.matches('.btn-decrease , .btn-decrease *')){
        if(state.recipe.servings > 1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    }
    else if(e.target.matches('.btn-increase , .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }

    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();
    }
});


const controlLikes = () => {
    if(!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    if(!state.likes.isLiked(currentId)){
        //add it to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);

        //toggle the like button
        likesView.toggleLikeBtn(true);
        //add it to the ui
        //console.log(state.likes);
        likesView.renderLike(newLike);
    }
    else {
    //remove from state
    state.likes.deleteLike(currentId);

    //toggle the like button
    likesView.toggleLikeBtn(false);
    //remove from ui
    //console.log(state.likes);
    likesView.deleteLike(currentId);
   
    }
    
    likesView.toggleLikeMenu(state.likes.getNumLikes());

}

window.addEventListener('load', ()=> {
    state.likes = new Likes();

    state.likes.readStorage();
    //likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    });
});
