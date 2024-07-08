
let searchField = document.getElementById('search');
let summary = document.getElementById("summary");

const checkboxes = document.getElementById("topSection").querySelectorAll("input[type='checkbox']");
let selectedFoods = [];
let foodValues = [];
let selectedFilters = [];
let filterValues = [];

let rootsButton = document.getElementById("rootsButton");
let veggiesButton = document.getElementById("veggiesButton");
let fruitsButton = document.getElementById("fruitsButton");
let nutsButton = document.getElementById("nutsButton");
let grainsButton = document.getElementById("grainsButton");
let animalsButton = document.getElementById("animalsButton");
let spicesButton = document.getElementById("spicesButton");

let popupContainer = document.getElementById("popupContainer");
let popupText = document.getElementById("popupText");
let popupText2 = document.getElementById("popupText2");
let popupText3 = document.getElementById("popupText3");

let foodValuesCount = [];
let firstIndex = -1;
let firstCount = 0;
let secondIndex = -1;
let secondCount = 0;
let thirdIndex = -1;
let thirdCount = 0;

// Sätter alla foodValues till 0. 
resetFoodValues();
resetFilterValues();

let firstPercent = 0;
let secondPercent = 0;
let thirdPercent = 0;

const filterCheckboxes = document.getElementById("bottomSection").querySelectorAll("input[type='checkbox']");; 

// Open disclaimer 
function openPopup() {
    window.location.hash = 'disclaimerPopup';
}

window.onload = openPopup;


rootsButton.addEventListener("click", function () {
    if (roots.getAttribute("style") === "display:block;") {
        roots.setAttribute("style", "display:none;");
    }
    else {
        roots.setAttribute("style", "display:block;");
    }
});

veggiesButton.addEventListener("click", function () {
    if (veggies.getAttribute("style") === "display:block;") {
        veggies.setAttribute("style", "display:none;");
    }
    else {
        veggies.setAttribute("style", "display:block;");
    }
});

fruitsButton.addEventListener("click", function () {
    if (fruits.getAttribute("style") === "display:block;") {
        fruits.setAttribute("style", "display:none;");
    }
    else {
        fruits.setAttribute("style", "display:block;");
    }
});

nutsButton.addEventListener("click", function () {
    if (nutsAndSeeds.getAttribute("style") === "display:block;") {
        nutsAndSeeds.setAttribute("style", "display:none;");
    }
    else {
        nutsAndSeeds.setAttribute("style", "display:block;");
    }
});

grainsButton.addEventListener("click", function () {
    if (grains.getAttribute("style") === "display:block;") {
        grains.setAttribute("style", "display:none;");
    }
    else {
        grains.setAttribute("style", "display:block;");
    }
});

animalsButton.addEventListener("click", function () {
    if (animals.getAttribute("style") === "display:block;") {
        animals.setAttribute("style", "display:none;");
    }
    else {
        animals.setAttribute("style", "display:block;");
    }
});

dairyButton.addEventListener("click", function () {
    if (dairy.getAttribute("style") === "display:block;") {
        dairy.setAttribute("style", "display:none;");
    }
    else {
        dairy.setAttribute("style", "display:block;");
    }
});

spicesButton.addEventListener("click", function () {
    if (spices.getAttribute("style") === "display:block;") {
        spices.setAttribute("style", "display:none;");
    }
    else {
        spices.setAttribute("style", "display:block;");
    }
});

processedButton.addEventListener("click", function () {
    if (ultraProcessed.getAttribute("style") === "display:block;") {
        ultraProcessed.setAttribute("style", "display:none;");
    }
    else {
        ultraProcessed.setAttribute("style", "display:block;");
    }
});


searchButton.addEventListener("click", function () {
    let filter = searchField.value.toUpperCase();
    let found = false;

    showAllCategories();

    for (let i = 0; i < checkboxes.length; i++) {
        let txtValue = checkboxes[i].value.toUpperCase();

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            found = true;
            checkboxes[i].style.display = "";
            checkboxes[i].parentElement.style.display = "";
        } else {
            checkboxes[i].style.display = "none";
            checkboxes[i].parentElement.style.display = "none";
        }
    }

    if (found === false) {
        // reset foodlist
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].style.display = "";
            checkboxes[i].parentElement.style.display = "";
        }
    }

    // clear field
    searchField.value = null;
});

showAllButton.addEventListener("click", function () {
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].style.display = "";
        checkboxes[i].parentElement.style.display = "";
    }
    showAllCategories();
});


checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {
        // When a checkbox gets checked and the list of selected foods didn't include the food 
        if ((checkbox.checked) && (!selectedFoods.includes(checkbox.value))) {
            chosenText.textContent = "";
            selectedFoods.push(checkbox.value);
            selectedFoods.forEach(function (element) {
                chosenText.textContent += `${element}, `;
            })
            const values = checkbox.parentNode.dataset.values.split(" ");
            values.forEach(function (value) {
                foodValues[value]++;
            })
        }

        // When a checkbox gets unchecked and the list includes the food
        else if ((!checkbox.checked) && (selectedFoods.includes(checkbox.value))) {
            // Resets the chosen-text 
            chosenText.textContent = "";
            // Finds the index of the food that was unchecked 
            let index1 = selectedFoods.indexOf(checkbox.value);
            // Removes the food from the list of chosen foods
            selectedFoods.splice(index1, 1);
            // Makes a new chosen-text with foods remaining in the chosen-list
            selectedFoods.forEach(function (element) {
                chosenText.textContent += `${element}, `;
            })
            // Reduces the corresponding values in foodValues
            const values = checkbox.parentNode.dataset.values.split(" ");
            values.forEach(function (value) {
                foodValues[value]--;
            })
        }
        
        countFoodValues();
    })
});

/* Ska lyssna om filter väljs för analysen. 
- Funkar hyfsat, tills man väljer bort ett filter, då måste man starta om från början för att få rätt. Ska jag lägga in en funktion som räknar om alla food values när man väljer bort ett filter? 
*/ 
filterCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {
        // When a checkbox gets checked and the list of selected foods didn't include the food 
        if ((checkbox.checked) && (!selectedFilters.includes(checkbox.value))) {
            selectedFilters.push(checkbox.value);
            const values = checkbox.parentNode.dataset.values.split(" ");
            values.forEach(function (value) {
                filterValues[value]++;
                console.log(filterValues);
            })
            console.log(selectedFilters); 
        }

        // When a checkbox gets unchecked and the list includes the food
        else if ((!checkbox.checked) && (selectedFilters.includes(checkbox.value))) {
            // Finds the index of the filter that was unchecked 
            let index1 = selectedFilters.indexOf(checkbox.value);
            // Removes the filter from the list 
            selectedFilters.splice(index1, 1);
            // Reduces the corresponding values in filterValues
            const values = checkbox.parentNode.dataset.values.split(" ");
            values.forEach(function (value) {
                filterValues[value]--;
                console.log(filterValues);
            })
            console.log(selectedFilters); 
        }

        countFoodValues();
    })
});

function countFoodValues() {
    // First check if any filter is chosen and if so set corresponding food value to zero
    if (filterValues.fiberFilter === 1) {
        foodValues.fiber = 0; 
    }
    if (filterValues.fodmapFilter === 1) {
        foodValues.fodmaps = 0; 
    }
    if (filterValues.fatsFilter === 1) {
        foodValues.over_10g_fat = 0; 
    }
    if (filterValues.carbsFilter === 1) {
        foodValues.carbs = 0; 
    }
    if (filterValues.proteinFilter === 1) {
        foodValues.protein = 0; 
    }

    foodValuesCount = [
        "fiber", foodValues.fiber, 
        "carbs", foodValues.carbs, 
        "over_10g_fat", foodValues.over_10g_fat, 
        "protein", foodValues.protein, 
        "fodmaps", foodValues.fodmaps, 
        "histamine", foodValues.histamine, 
        "over_3g_lactose", foodValues.over_3g_lactose]; 

    // Sorterar foodValuesCount 
    for (k = 1; k < foodValuesCount.length - 2; k = k + 2) {
        for (i = 1; i < foodValuesCount.length; i = i + 2) {
            if (foodValuesCount[i] > foodValuesCount[i + 2]) {
                let tempText = foodValuesCount[i - 1];
                let tempValue = foodValuesCount[i];
                foodValuesCount[i - 1] = foodValuesCount[i + 1];
                foodValuesCount[i] = foodValuesCount[i + 2];
                foodValuesCount[i + 1] = tempText;
                foodValuesCount[i + 2] = tempValue;
            }
        }
    }

    // Kollar vilket Value som har högst antal
    firstCount = 0;
    for (i = 0; i < foodValuesCount.length; i++) {
        if (foodValuesCount[i] >= firstCount) {
            firstCount = foodValuesCount[i];
            firstIndex = i;
        }
    }

    secondCount = 0;
    for (i = 0; i < firstIndex; i++) {
        if (foodValuesCount[i] >= secondCount) {
            secondCount = foodValuesCount[i];
            secondIndex = i;
        }
    }

    thirdCount = 0;
    for (i = 0; i < secondIndex; i++) {
        if (foodValuesCount[i] >= thirdCount) {
            thirdCount = foodValuesCount[i];
            thirdIndex = i;
        }
    }

    if (firstCount != 0) {
        getPercentages();
    }
    else {
        summaryText.textContent = "Select foods to see a summary.";
    }
}

function getPercentages() {
    firstPercent = firstCount / selectedFoods.length * 100;
    firstPercent = Math.floor(firstPercent);
    secondPercent = secondCount / selectedFoods.length * 100;
    secondPercent = Math.floor(secondPercent);
    thirdPercent = thirdCount / selectedFoods.length * 100;
    thirdPercent = Math.floor(thirdPercent);

    if (secondCount === 0) {
        summaryText.textContent = 
        `You have chosen ${selectedFoods.length} foods from the list and ${firstPercent}% of them have ${foodValuesCount[firstIndex - 1]} in common.`;
    }
    else if (thirdCount === 0) {
        summaryText.textContent = 
        `You have chosen ${selectedFoods.length} foods from the list and their commonalitys are: ${firstPercent}% have ${foodValuesCount[firstIndex - 1]} and ${secondPercent}% have ${foodValuesCount[secondIndex - 1]} in common.`;
    }
    else {
        summaryText.textContent = 
        `You have chosen ${selectedFoods.length} foods from the list and their commonalitys are: ${firstPercent}% have ${foodValuesCount[firstIndex - 1]}, ${secondPercent}% have ${foodValuesCount[secondIndex - 1]} and ${thirdPercent}% have ${foodValuesCount[thirdIndex - 1]} in common.`;
    }
}
 
showAnalysisButton.addEventListener("click", function () {
    if (selectedFoods.length > 0) {
        if (foodValuesCount[firstIndex - 1] === "fodmaps") {
            popupText.textContent = "The number one commonality of these foods is FODMAPs which can cause mild or moderate gastrointestinal discomfort for anyone if the intake is high enough. For sensitive individuals, like people with Irritable bowel syndrome (IBS), moderate symtoms can occur at a relatively low intake. With high daly intake the gastrointestinal symtoms can become severe, causing acute diarrhea and mind numbing abdominal pain. Common foods high in FODMAPS are among others: Garlic, Onions, Pasta, Plain white bread, beans and peas. Follow the link in the main menu to read more.";
        }
        else if (foodValuesCount[firstIndex - 1] === "fiber") {
            popupText.textContent = "The number one commonality of these foods is Fiber which can cause mild or moderate gas and bloating for anyone if the intake is high enough.";
            popupText2.textContent = "High fiber intake during dehydration can contribute to constipation and if the dehydration is not corrected the constipation can cause severe gastrointestinal discomfort and lowered apetite, which in the worst case scenario will worsen the dehydration. ";
            popupText3.textContent = "For sensitive individuals, like people with gut-microbial dysbiosis, gastrointestinal discomfort can occur at a relatively low intake. Common foods high in Fiber are among others: Flax seeds, Chia seeds, Wheat/Oat bran, Whole grain pasta/bread/rice, beans and peas. Follow the link in the main menu to read more.";
        }
        else if (foodValuesCount[firstIndex - 1] === "over_3g_lactose") {
            popupText.textContent = "Lactose";
        }
        else if (foodValuesCount[firstIndex - 1] === "over_10g_fat") {
            popupText.textContent = "Fat";
        }
        else if (foodValuesCount[firstIndex - 1] === "protein") {
            popupText.textContent = "Protein";
        }
        else if (foodValuesCount[firstIndex - 1] === "carbs") {
            popupText.textContent = "Carbs";
        }
        else if (foodValuesCount[firstIndex - 1] === "histamine") {
            popupText.textContent = "Histamine";
        }
        else {
            popupText.textContent = "Wohoo!";
        }
    }
    else {
        popupText.textContent = "Select foods to see a deeper summary and analysis of the foods.";
    }
    popupContainer.classList.toggle("show");
    popupText.classList.toggle("show");
    popupText2.classList.toggle("show");
    popupText3.classList.toggle("show");
});

popupContainer.addEventListener("click", function () {
    popupContainer.classList.toggle("show");
    popupText.classList.toggle("show");
    popupText2.classList.toggle("show");
    popupText3.classList.toggle("show");
});

restartButton.addEventListener("click", function () {
    clearCheckboxes();

    // Clear search
    searchField.value = null;
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].style.display = "";
        checkboxes[i].parentElement.style.display = "";
    }

    // Clear list of selected foods, food values and display of chosen foods. 
    resetAllValues();
    chosenText.textContent = "Click on a category to show lists of foods";

    // Hide all food categories
    summaryText.textContent = "Select foods to see a summary.";
    hideAllCategories();
});

function hideAllCategories() {
    roots.setAttribute("style", "display:none;");
    veggies.setAttribute("style", "display:none;");
    fruits.setAttribute("style", "display:none;");
    nutsAndSeeds.setAttribute("style", "display:none;");
    grains.setAttribute("style", "display:none;");
    animals.setAttribute("style", "display:none");
    dairy.setAttribute("style", "display:none;");
    spices.setAttribute("style", "display:none");
    ultraProcessed.setAttribute("style", "display:none");
}

function showAllCategories() {
    roots.setAttribute("style", "display:block;");
    veggies.setAttribute("style", "display:block;");
    fruits.setAttribute("style", "display:block;");
    nutsAndSeeds.setAttribute("style", "display:block;");
    grains.setAttribute("style", "display:block;");
    animals.setAttribute("style", "display:block;");
    dairy.setAttribute("style", "display:block;");
    spices.setAttribute("style", "display:block;"); 
    ultraProcessed.setAttribute("style", "display:block;");
}

function clearCheckboxes() {
    // Reset food item checkboxes
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });

    // Reset analysis filter checkboxes
    filterCheckboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
}

function resetAllValues() {
    resetFoodValues();
    resetFilterValues();
    selectedFoods = [];
    selectedFilters = [];
    foodValuesCount = [];
    firstIndex = -1;
    firstCount = 0;
    secondIndex = -1;
    secondCount = 0;
    thirdIndex = -1;
    thirdCount = 0;
}

function resetFoodValues() {
    foodValues.fiber = 0;
    foodValues.carbs = 0;
    foodValues.over_10g_fat = 0;
    foodValues.protein = 0;
    foodValues.fodmaps = 0;
    foodValues.histamine = 0;
    foodValues.over_3g_lactose = 0; 
}

function resetFilterValues() {
    filterValues.fiberFilter = 0; 
    filterValues.fodmapFilter = 0; 
    filterValues.fatsFilter = 0; 
    filterValues.carbFilter = 0; 
    filterValues.proteinFilter = 0; 
}

/* TODO
Jag vill lägga till möjligheten att filtrera bort saker från analysen, tex macros, fiber, fodmaps, mm, 
för att kunna se vad som blir kvar när man tagit bort saker man redan vet att man reagerar på eller ¨
vet att man inte har besvär av.  

Så det skulle kunna vara en "Filtrera analysen-meny" strax under analys-knappen där man kan välja en 
eller flera faktorer, som exkluderar dessa från beräkningarna i countfoodvalues-metoden
*/