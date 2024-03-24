/* 
* Ändra till att ha vald mat på högersidan och uppdatera så fort man klickar på något. 
* Byt från checkboxar till knappar. Om man klickar på någon vald mat så ska den återgå 
* till listan till vänster. 
*/

let summary = document.getElementById("summary");
const checkboxes = document.querySelectorAll("input[type='checkbox']");
let selectedFoods = [];
let foodValues = [];

let popup = document.getElementById("popupText");

let foodValuesCount = [];
let firstIndex = -1;
let firstCount = 0;
let secondIndex = -1;
let secondCount = 0;
let thirdIndex = -1;
let thirdCount = 0;

resetFoodValues();

let firstPercent = 0;
let secondPercent = 0;
let thirdPercent = 0;

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

spicesButton.addEventListener("click", function () {
    if (spices.getAttribute("style") === "display:block;") {
        spices.setAttribute("style", "display:none;");
    }
    else {
        spices.setAttribute("style", "display:block;");
    }
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
            countFoodValues();
            if (firstCount != 0) {
                getPercentages();
            }
            else {
                summaryText.textContent = "Select foods to see a summary.";
            }
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
            countFoodValues();
            if (firstCount != 0) {
                getPercentages();
            }
            else {
                summaryText.textContent = "Select foods to see a summary.";
            }
        }
    })
});

function countFoodValues() {
    foodValuesCount = ["fiber", foodValues.fiber, "carbs", foodValues.carbs, "fat", foodValues.fat, "protein", foodValues.protein, "fodmaps", foodValues.fodmaps, "histamine", foodValues.histamine];

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

    firstCount = 0;
    console.log(`Before ${firstCount}`);
    for (i = 0; i < foodValuesCount.length; i++) {
        if (foodValuesCount[i] >= firstCount) {
            firstCount = foodValuesCount[i];
            firstIndex = i;
        }
    }
    console.log(`After ${firstCount}`);

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
}

function getPercentages() {
    firstPercent = firstCount / selectedFoods.length * 100;
    firstPercent = Math.floor(firstPercent);
    secondPercent = secondCount / selectedFoods.length * 100;
    secondPercent = Math.floor(secondPercent);
    thirdPercent = thirdCount / selectedFoods.length * 100;
    thirdPercent = Math.floor(thirdPercent);

    if (secondCount === 0) {
        summaryText.textContent = `You have chosen ${selectedFoods.length} foods from the list and ${firstPercent}% of them have ${foodValuesCount[firstIndex - 1]} in common.`;
    }
    else if (thirdCount === 0) {
        summaryText.textContent = `You have chosen ${selectedFoods.length} foods from the list and their commonalitys are: ${firstPercent}% have ${foodValuesCount[firstIndex - 1]} and ${secondPercent}% have ${foodValuesCount[secondIndex - 1]} in common.`;
    }
    else {
        summaryText.textContent = `You have chosen ${selectedFoods.length} foods from the list and their commonalitys are: ${firstPercent}% have ${foodValuesCount[firstIndex - 1]}, ${secondPercent}% have ${foodValuesCount[secondIndex - 1]} and ${thirdPercent}% have ${foodValuesCount[thirdIndex - 1]} in common.`;
    }
}

showAnalysisButton.addEventListener("click", function () {
    /* old
    if (selectedFoods.length > 0) {
        countFoodValues();
        if (firstCount != 0) {
            getPercentages();
        }
        else {
            summaryText.textContent = "Select foods to see a summary.";
        }
    }*/
    popup.classList.toggle("show");
});

restartButton.addEventListener("click", function () {
    clearCheckboxes();
    // Clear list of selected foods, food values and display of chosen foods. 
    resetAllValues();
    chosenText.textContent = "Click on a category to show lists of foods";

    // Hide all food categories
    summaryText.textContent = "Select foods to see a summary.";
    roots.setAttribute("style", "display:none;");
    veggies.setAttribute("style", "display:none;");
    fruits.setAttribute("style", "display:none;");
    nutsAndSeeds.setAttribute("style", "display:none;");
    grains.setAttribute("style", "display:none;");
    animals.setAttribute("style", "display:none");
    spices.setAttribute("style", "display:none");
});

function clearCheckboxes() {
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
}

function resetAllValues() {
    resetFoodValues();
    selectedFoods = [];
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
    foodValues.fat = 0;
    foodValues.protein = 0;
    foodValues.fodmaps = 0;
    foodValues.histamine = 0;
}
