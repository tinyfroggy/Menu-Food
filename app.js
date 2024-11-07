// declare variables
const search = document.getElementById("search");

const containerMenu = document.getElementById("container-menu");
const suggestionsContainer = document.getElementById("suggestions-container");
const favoriteFoodContainer = document.getElementById("favorite-food-container");

const miscellaneous = document.getElementById("miscellaneous");
const beef = document.getElementById("beef");
const chicken = document.getElementById("chicken");
const pasta = document.getElementById("pasta");
const seafood = document.getElementById("seafood");
const sections = [miscellaneous, beef, chicken, pasta, seafood];

const favoriteFoodListBtn = document.getElementById("favorite-food-list-button");
const closeFavoriteFoodListBtn = document.getElementById("close-favorite-food-list-button");
const favoriteFoodBtn = document.getElementById("add-favorite");
const deleteFavoriteFoodBtn = document.getElementById("remove-favorite-food-button");

// local storage
let favoriteFoodList = [];

function getIdsFromLocalStorage() {
  localStorage.getItem("favoriteFoodList")
    ? (favoriteFoodList = JSON.parse(localStorage.getItem("favoriteFoodList")))
    : (favoriteFoodList = []);
}

getIdsFromLocalStorage();

function AddToLocalStorage() {
  localStorage.setItem("favoriteFoodList", JSON.stringify(favoriteFoodList));
}

// events listeners
window.addEventListener("load", () => {
  search.value = ""
});

search.addEventListener("keyup", (event) => {
  searchByNameFood(event.target.value);

  suggestionsContainer.classList.remove("hidden");
});

favoriteFoodListBtn.addEventListener("click", () => {
  favoriteFoodContainer.classList.remove("hidden");

  favoriteFoodListBtn.classList.add("hidden");
  closeFavoriteFoodListBtn.classList.remove("hidden");
});

closeFavoriteFoodListBtn.addEventListener("click", () => {
  favoriteFoodContainer.classList.add("hidden");

  favoriteFoodListBtn.classList.remove("hidden");
  closeFavoriteFoodListBtn.classList.add("hidden");
});

// إخفاء الاقتراحات عند النقر خارج حقل البحث
document.addEventListener("click", (event) => {
  if (!search.contains(event.target) && !suggestionsContainer.contains(event.target)) {
    suggestionsContainer.classList.add("hidden");
  }
});

miscellaneous.addEventListener("click", () => {
  activeSection(miscellaneous);
  containerMenu.innerHTML = "";
  filterCategories("miscellaneous");
});

beef.addEventListener("click", () => {
  activeSection(beef);
  containerMenu.innerHTML = "";
  filterCategories("beef");
});

chicken.addEventListener("click", () => {
  activeSection(chicken);
  containerMenu.innerHTML = "";
  filterCategories("chicken");
});

pasta.addEventListener("click", () => {
  activeSection(pasta);
  containerMenu.innerHTML = "";
  filterCategories("pasta");
});

seafood.addEventListener("click", () => {
  activeSection(seafood);
  containerMenu.innerHTML = "";
  filterCategories("seafood");
});

// functions
function activeSection(selectedSection) {
  sections.forEach(section => {
    section.classList.remove("active");
  });

  selectedSection.classList.add("active");
}


async function searchByNameFood(foodName) {
  const urlSearch = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;

  const response = await fetch(urlSearch);
  const data = await response.json();

  const suggestions = await data.meals;

  suggestionsContainer.innerHTML = "";

  if (!suggestions) {
    suggestionsContainer.innerHTML = `
      <div class="text-center text-white text-xl font-bold bg-red-500 p-3 rounded">
        Food Not Found
      </div>
    `;
    return;
  }

  for (const suggestion of suggestions) {
    const suggestionElement =
      `
      <!-- suggestions -->
          <div onclick="foodInfo(${suggestion.idMeal})" id="suggestions" class="flex items-center justify-between p-2 border-solid border-2 border-white rounded h-28 cursor-pointer bg-emerald-500 mb-2">
            <img class="w-20 h-20  border-solid border-2 border-white" src="${suggestion.strMealThumb}" alt="Image Food">
            <div class="flex w-56 justify-between ">
              <h1 class="text-xl font-bold text-white">${suggestion.strMeal}</h1>
              <h1 class="text-lg font-bold text-cyan-900">${suggestion.strArea}</h1>
            </div>
          </div>
          <!-- End suggestions -->
    `

    suggestionsContainer.innerHTML += suggestionElement;
  }

}

async function displayFood() {
  const urlRandom = `https://www.themealdb.com/api/json/v1/1/random.php`;

  const response = await fetch(urlRandom);
  const data = await response.json();
  const cardFood =
    `
    <!-- food card -->
    <div id="food-card" class="w-full h-96 p-3 flex items-center justify-start flex-col  bg-emerald-900 rounded-lg">
    <div class="flex justify-between  w-full">
        <img class="w-40 h-w-40  border-solid border-2 border-black rounded-md"
          src="${data.meals[0].strMealThumb}" alt="Food Image">
        <button id="add-favorite" onclick="addOnFavoriteList(${data.meals[0].idMeal})"  class="bg-emerald-900  rounded-md text-xl font-bold ">
          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#fff">
            <path
              d="M479.69-391.33q50.64-46 81.41-76.19 30.76-30.18 47.4-51.68 16.5-21.88 22.5-38.28 6-16.41 6-34.96 0-35.96-25.58-61.09-25.58-25.14-61.31-25.14-21.52 0-39.98 8.67-18.46 8.67-30.03 22.67-11.57-14-30.34-22.67-18.77-8.67-40.43-8.67-35.43 0-60.55 25.84-25.11 25.83-25.11 61.6 0 18.36 4.5 34.46t21.33 36.44q15.98 20.82 47.31 51.19 31.32 30.36 82.88 77.81ZM170-75.33v-692q0-44.1 31.79-75.39Q233.57-874 276-874h408q42.7 0 74.68 31.28 31.99 31.29 31.99 75.39v692L480-207.67 170-75.33Zm106-161.34 204-85.55 204 85.55v-530.66H276v530.66Zm0-530.66h408-408Z" />
          </svg>
        </button>
      </div>

      <div class="flex justify-between w-full">
        <h1 class="mt-1 mb-2 text-lg font-bold text-white">${data.meals[0].strMeal}</h1>
        <h1 class="text-lg font-bold text-cyan-400">${data.meals[0].strArea}</h1>
      </div>

      <p class="text-white font-semibold leading-relaxed tracking-wide overflow-y-auto rounded-lg p-4 ">${data.meals[0].strInstructions}</p>
      <a class="text-emerald-300 font-semibold text-lg mt-2" href="${data.meals[0].strYoutube}">Youtube Link</a>
    </div>
    <!-- End food card -->
    `;

  containerMenu.innerHTML += cardFood
}

async function filterCategories(category) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  try {

    const response = await fetch(url);
    // json object
    const data = await response.json();

    data.meals.forEach(async meal => {
      const mealDetails = await categoryDetails(meal.idMeal);
      const cardFood =
        `
        <!-- food card -->
        <div id="food-card" class="w-full h-96 p-3 flex items-center justify-start flex-col bg-emerald-900 rounded-lg">
          <div class="flex justify-between w-full">
            <img class="w-40 h-40 border-solid border-2 border-black rounded-md" src="${mealDetails.strMealThumb}" alt="Food Image">
            <button id="add-favorite" onclick="addOnFavoriteList(${mealDetails.idMeal})"  class="bg-emerald-900 rounded-md text-xl font-bold ">
              <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#fff">
                <path d="M479.69-391.33q50.64-46 81.41-76.19 30.76-30.18 47.4-51.68 16.5-21.88 22.5-38.28 6-16.41 6-34.96 0-35.96-25.58-61.09-25.58-25.14-61.31-25.14-21.52 0-39.98 8.67-18.46 8.67-30.03 22.67-11.57-14-30.34-22.67-18.77-8.67-40.43-8.67-35.43 0-60.55 25.84-25.11 25.83-25.11 61.6 0 18.36 4.5 34.46t21.33 36.44q15.98 20.82 47.31 51.19 31.32 30.36 82.88 77.81ZM170-75.33v-692q0-44.1 31.79-75.39Q233.57-874 276-874h408q42.7 0 74.68 31.28 31.99 31.29 31.99 75.39v692L480-207.67 170-75.33Zm106-161.34 204-85.55 204 85.55v-530.66H276v530.66Zm0-530.66h408-408Z" />
              </svg>
            </button>
          </div>
  
          <div class="flex justify-between w-full">
            <h1 class="mt-2 mb-2 text-sm font-bold text-white">${mealDetails.strMeal}</h1>
            <h1 class="text-lg font-bold text-cyan-400">${mealDetails.strArea || "N/A"}</h1>
          </div>
  
          <p class="text-white font-semibold leading-relaxed tracking-wide overflow-y-auto rounded-lg p-4 ">${mealDetails.strInstructions || "Instructions not available"}</p>
          <a class="text-emerald-300 font-semibold text-lg mt-2" href="${mealDetails.strYoutube || "#"}">Youtube Link</a>
        </div>
        <!-- End food card -->
      `;

      containerMenu.innerHTML += cardFood;

    });
  } catch (error) {
    console.error('Error fetching meals:', error);
  }
}

async function categoryDetails(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
}

async function foodInfo(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

  const data = await response.json();

  const cardFood =
    `
    <!-- food card -->
    <div id="food-card" class="w-full h-96 p-3 flex items-center justify-start flex-col bg-emerald-900 rounded-lg">
      <div class="flex justify-between w-full">
        <img class="w-40 h-40 border-solid border-2 border-black rounded-md" src="${data.meals[0].strMealThumb}" alt="Food Image">
        <button id="add-favorite" onclick="addOnFavoriteList(${data.meals[0].idMeal})"  class="bg-emerald-900 rounded-md text-xl font-bold ">
          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#fff">
            <path d="M479.69-391.33q50.64-46 81.41-76.19 30.76-30.18 47.4-51.68 16.5-21.88 22.5-38.28 6-16.41 6-34.96 0-35.96-25.58-61.09-25.58-25.14-61.31-25.14-21.52 0-39.98 8.67-18.46 8.67-30.03 22.67-11.57-14-30.34-22.67-18.77-8.67-40.43-8.67-35.43 0-60.55 25.84-25.11 25.83-25.11 61.6 0 18.36 4.5 34.46t21.33 36.44q15.98 20.82 47.31 51.19 31.32 30.36 82.88 77.81ZM170-75.33v-692q0-44.1 31.79-75.39Q233.57-874 276-874h408q42.7 0 74.68 31.28 31.99 31.29 31.99 75.39v692L480-207.67 170-75.33Zm106-161.34 204-85.55 204 85.55v-530.66H276v530.66Zm0-530.66h408-408Z" />
          </svg>
        </button>
      </div>

      <div class="flex justify-between w-full">
        <h1 class="mt-2 mb-2 text-sm font-bold text-white">${data.meals[0].strMeal}</h1>
        <h1 class="text-lg font-bold text-white">${data.meals[0].strArea || "N/A"}</h1>
      </div>

      <p class="text-white font-semibold leading-relaxed tracking-wide overflow-y-auto rounded-lg p-4 ">${data.meals[0].strInstructions || "Instructions not available"}</p>
      <a class="text-emerald-300 font-semibold text-lg mt-2" href="${data.meals[0].strYoutube || "#"}">Youtube Link</a>
    </div>
    <!-- End food card -->
  `;

  containerMenu.innerHTML = cardFood;
  suggestionsContainer.classList.add("hidden");
}

async function displayFromFavoriteList() {
  favoriteFoodContainer.innerHTML = '';

  if (favoriteFoodList.length === 0) {
    favoriteFoodContainer.innerHTML = '<h1 class="text-white">No favorite food</h1>';
    return;
  }

  for (const id of favoriteFoodList) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();

    const foodInfo =
      `
      <!-- favorite food -->
      <div 
        class="flex items-center justify-between p-2 border-solid border-2 border-white h-28 cursor-pointer bg-emerald-400 mb-2 rounded-md">
        <img class="w-20 h-20 border-solid border-2 border-white"
          onclick="foodInfo(${data.meals[0].idMeal})" src="${data.meals[0].strMealThumb}" alt="Image Food">
        <div class="flex items-center  w-56 h-20 justify-between ml-2" onclick="foodInfo(${data.meals[0].idMeal})">
          <h1 class="text-sm font-bold text-white">${data.meals[0].strMeal}</h1>
          <h1 class="text-sm font-bold text-white">${data.meals[0].strArea}</h1>
        </div>

        <button class="ml-3 hover:bg-emerald-950" onclick="removeFavoriteFood(${data.meals[0].idMeal})" id="remove-favorite-food-button">
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e8eaed">
            <path
              d="M870-697H606v-83h264v83ZM175-82v-694q0-39.46 27.48-67.23Q229.95-871 269-871h277v95H269v551l211-88.24L691-225v-322h95v465L480-212 175-82Zm94-694h277-277Z" />
          </svg>
        </button>
      </div>
      <!-- End favorite food -->
    `;

    favoriteFoodContainer.innerHTML += foodInfo;
  }
}

async function addOnFavoriteList(id) {

  if (favoriteFoodList.includes(id)) {
    alert("Already added!");
    return;
  }

  favoriteFoodList.push(id);
  AddToLocalStorage();
  displayFromFavoriteList();
}

async function removeFavoriteFood(id) {

  const index = favoriteFoodList.indexOf(id);
  if (index > -1) {
    favoriteFoodList.splice(index, 1);
  }
  AddToLocalStorage();
  displayFromFavoriteList();
}

function home() {
  containerMenu.innerHTML = "";
  displayFood();
  displayFood();
  displayFood();
  displayFood();
  displayFood();
  displayFood();
}

favoriteFoodContainer.innerHTML = '<h1 class="text-white">No favorite food</h1>';

displayFromFavoriteList();
home();

