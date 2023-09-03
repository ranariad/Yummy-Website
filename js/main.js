$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500)

    })
})


////////////////////// Navbar side  FUNCTIONALITIES ///////////////////////////////


function toggleDrawerIcon()
{
    const drawerIcon =  $("nav #drawer #open-btn").eq(0);
    if( drawerIcon.hasClass('fa-bars') )
    {
        drawerIcon.removeClass('fa-bars');
        drawerIcon.addClass('fa-close');
    }
    else
    {
        drawerIcon.removeClass('fa-close');
        drawerIcon.addClass('fa-bars');
    }
}

function toggoleSideDrawer()
{
    const sideBarWidth = $("nav .links").outerWidth();

    toggleDrawerIcon();
     animateLinks();
    $("nav").animate(
        {"left": $("nav").css("left") === '0px'? `-${sideBarWidth}px` : '0px' },
        500,       
        'easeOutExpo'
    );
   
}


function animateLinks()
{
    const links = $("nav ul li");

    if(links.eq(0).css('top') === `${$('nav ul').outerHeight()}px`)
    {
        let top = 5;
        let i = 0;
        const interval = setInterval(() => {
            links.eq(i).animate({'top':`${top}%`},500,'easeInSine');
            top += 18;
            i++;
            if(i == links.length){  clearInterval(interval); }
        }, 200);    
    }
    else
    {
        links.animate({'top':`100%`},400)
    }
}

$("nav #drawer #open-btn").click(toggoleSideDrawer)
$("nav .links li").on('click', toggoleSideDrawer)


////////////////////// SEARCH FUNCTIONALITIES ///////////////////////////////
// show search inputs 
$('nav ul li').eq(0).on('click',()=>{
    $('#search-bars').fadeIn(500)
    mealList.innerHTML=""
});

// search meals by name

async function searchByName(term){
    mealList.innerHTML=""
    $(".loading-screen").fadeIn(300)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    let response = await api.json() 
    console.log(response);
    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".loading-screen").fadeOut(300)
}

// search meals by first letter
async function searchByFLetter(term){
    mealList.innerHTML=""
    $(".loading-screen").fadeIn(300)
    term == "" ? term = "a" : "";
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    let response = await api.json() 
    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".loading-screen").fadeOut(300)

}

////////////////////// category FUNCTIONALITIES ///////////////////////////////

// get meals by category 
const category = document.getElementById("category")
category.addEventListener("click",function(){
    $(".loading-screen").fadeIn(300)
    getCategories()
    $(".loading-screen").fadeOut(300)
})

async function getCategories(){
    mealList.innerHTML = ""
   
    let api = await fetch (`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let response = await api.json()
    // console.log(response.categories);
    displayCategories(response.categories)

}

const mealList = document.querySelector(".meal-list")

function displayCategories(arr){
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="categoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute rounded  text-center text-black p-2 overflow-hidden bg-white bg-opacity-75">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription}</p>
                    </div>
                </div>
        </div>
        `
    }

    mealList.innerHTML = cartoona
}

async function categoryMeals(cat){
    mealList.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
    let response = await api.json()
    console.log(response);
    displayMeals(response.meals.slice(0,20))
    $(".loading-screen").fadeOut(300)
}

function displayMeals(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2 bg-white bg-opacity-75">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    mealList.innerHTML = cartoona
}

async function getMealDetails(mealID){
    mealList.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
    console.log(respone);
    displayMealDetails(respone.meals[0])
    $(".loading-screen").fadeOut(300)
}

function displayMealDetails(meal){
    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }


    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    mealList.innerHTML = cartoona
}

////////////////////// Area FUNCTIONALITIES ///////////////////////////////
// get meals by area 
const Area = document.getElementById("area")
Area.addEventListener("click",function(){
    getArea()
})

async function  getArea(){
    mealList.innerHTML=""
    $(".loading-screen").fadeIn(300)
    let api = await fetch (`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let response = await api.json()
   // console.log(response.meals);
    displayArea(response.meals)
    $(".loading-screen").fadeOut(300)
}

function displayArea(arr){
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    mealList.innerHTML = cartoona
}

async function getAreaMeals(area){
    mealList.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
}

////////////////////// Ingredients FUNCTIONALITIES ///////////////////////////////

// get meals by Ingredients 
const Ingredients = document.getElementById("Ingredients")
Ingredients.addEventListener("click",function(){
    getIngredients()
})

async function getIngredients(){
    mealList.innerHTML=""
    $(".loading-screen").fadeIn(300)
    let api = await fetch (`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let response = await api.json()
    //console.log(response.meals);
    displayIngredients(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
}

function displayIngredients(arr){
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3 ">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2  text-center cursor-pointer ">
                        <i class="fa-solid fa-drumstick-bite fa-4x mb-1 "></i>
                        <h3>${arr[i].strIngredient.split(" ").slice(0,2).join(" ")}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    mealList.innerHTML = cartoona
}

async function getIngredientsMeals(ingredients){
    mealList.innerHTML=""
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
}


////////////////////// Contact Us FUNCTIONALITIES ///////////////////////////////
let submitBtn 
let contactUs = document.getElementById("contactUs")
contactUs.addEventListener("click",showContacts)



function showContacts() {
    mealList.innerHTML = `<div id="contact" class="contact d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center p-0">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" onclick="submitClick()"  class="btn btn-outline-danger px-2 mt-3" disabled>Submit</button>
    </div>
</div> `
    
    submitBtn = document.getElementById("submitBtn")

    
    

     document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })

  

    
}

function submitClick(){
    $(".loading-screen").fadeIn(300)
    setTimeout(() => {
        $('#contact').html('<div class="text-center pt-5 d-flex justify-content-center align-items-center"><h2 class="fs-1 text-success mt-5">Submit Successfully</h2></div>');
    }, 1000);
    $(".loading-screen").fadeOut(300)
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")

    } else {
        submitBtn.setAttribute("disabled", true)
       
    }
}


function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}



