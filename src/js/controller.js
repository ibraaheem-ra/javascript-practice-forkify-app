import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import previewView from './views/previewView.js';
import AddRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
// const recipeContainer = document.querySelector('.recipe');
// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(window.location);
    if (!id) return;

    resultsView.update(model.getSerchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    const { recipe } = model.state;
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controllSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSerchResultsPage());
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

controllSearchResults();
// controlRecipes();
const controllPagination = function (gotoPage) {
  resultsView.render(model.getSerchResultsPage(gotoPage));
  PaginationView.render(model.state.search);
};

const controllServing = function (newServing) {
  model.updateServings(newServing);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controllAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controllBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controllAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    addRecipeView.renderSpinner();
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controllBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controllServing);
  recipeView.addHandlerBookmark(controllAddBookmark);
  searchView.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controllPagination);
  addRecipeView.addHandlerUpload(controllAddRecipe);
};
init();

// import { search } from 'core-js/fn/symbol';
// import { async } from 'regenerator-runtime';
// import * as model from './model.js'
// import recipeView from './views/RecipeView.js';
// import SearchView from './views/SearchView.js';
// import ResultsView from './views/ResultsView.js';
// import PaginationView from './views/PaginationView.js';

// // https://forkify-api.herokuapp.com/v2

// if(module.hot) {
//   module.hot.accept()
// }

// const controllRecipes = async function() {
//   try{

//     const id = window.location.hash.slice(1)
//     console.log(id);

//     if(!id) return

//     ResultsView.update(model.getSerchResultsPage())

//     recipeView.renderSpinner()

//     await model.loadRecipe(id)

//     recipeView.render(model.state.recipe)

//   }catch(err) {
//     recipeView.renderError()
//   }
// };

// const controllSearchResults = async function() {
//   try{
//     ResultsView.renderSpinner()
//     const query = SearchView.getQuery()
//     if(!query) return

//     await model.loadSearchResults(query)
//     console.log(model.state.search.result);
//     // ResultsView.render(model.state.search.result)
//     ResultsView.render(model.getSerchResultsPage())

//     PaginationView.render(model.state.search)

//   }catch(err) {
//     console.log(err)
//   }
// }

// const controllPagination = function(gotoPage) {
//     ResultsView.render(model.getSerchResultsPage(gotoPage))

//     PaginationView.render(model.state.search)

// }

// const controllServing = function(newServing) {
//   model.updateServings(newServing)

//   recipeView.update(model.state.recipe)
// }

// const controllAddBookmark = function() {

//   if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
//   else model.deleteBookmark(model.state.recipe.id)

//   console.log(model.state.recipe);
//   recipeView.update(model.state.recipe)

// }

// const init = function() {
//   recipeView.addHandlereRender(controllRecipes)
//   recipeView.addHandlerUpdateServing(controllServing)
//   recipeView.addHandlerAddBookmark(controllAddBookmark)
//   SearchView.addHandlerSearch(controllSearchResults)
//   PaginationView.addHandlerClick(controllPagination)
// }
// init()
// // window.addEventListener('hashchange', controllRecipes)
// // window.addEventListener('load', controllRecipes)
