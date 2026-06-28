const gamesContainer = document.getElementById("gamesContainer");

const selectedCount = document.getElementById("selectedCount");
const totalSize = document.getElementById("totalSize");
const storage = document.getElementById("storage");

const clearButton = document.getElementById("clearSelection");
const myGamesButton = document.getElementById("myGames");

let selectedGames = [];
let showOnlySelected = false;

function getGameName(path) {

    let name = path.split("/").pop();

    name = name.substring(0, name.lastIndexOf("."));

    name = name.replace(/[_-]/g, " ");

    return name.replace(/\b\w/g, function(letter) {
        return letter.toUpperCase();
    });

}

function renderGames() {

    gamesContainer.innerHTML = "";

    let gamesToShow = games;

    if (showOnlySelected) {
        gamesToShow = games.filter(function(game) {
            return selectedGames.includes(game.image);
        });
    }

    gamesToShow.forEach(function(game) {

        const card = document.createElement("div");

        card.className = "game";

        if (selectedGames.includes(game.image))
            card.classList.add("selected");

        const checked = selectedGames.includes(game.image) ? "checked" : "";

        card.innerHTML = `

            <img src="${game.image}" loading="lazy">

            <div class="gameInfo">

                

                <div class="gameSize">
                    ${game.size.toFixed(2)} GB
                </div>

                <input
                    type="checkbox"
                    ${checked}
                >

            </div>

        `;

        const checkbox = card.querySelector("input");

        checkbox.addEventListener("click", function(e) {

            e.stopPropagation();

            toggleGame(game.image);

        });

        card.addEventListener("click", function() {

            toggleGame(game.image);

        });

        gamesContainer.appendChild(card);

    });

    // If showing only selected and no games are selected, show a message
    if (showOnlySelected && selectedGames.length === 0) {
        gamesContainer.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px;font-size:18px;color:#9ca3af;">
                هیچ یاریەک دیاری نەکراوە. تکایە یاریەکان دابنێ بۆ کۆکردنەوە.
            </div>
        `;
    }

}


function toggleGame(image) {

    if (selectedGames.includes(image)) {

        selectedGames = selectedGames.filter(function(item) {
            return item !== image;
        });

    } else {

        selectedGames.push(image);

    }

    updateSummary();

    renderGames();

}

function updateSummary() {

    // Update selected count if element exists
    if (selectedCount) {
        selectedCount.innerText = selectedGames.length;
    }

    let total = 0;

    selectedGames.forEach(function(image) {

        const game = games.find(function(g) {
            return g.image === image;
        });

        if (game) {

            total += Number(game.size);

        }

    });

   

    // Update progress bar with two-stage growth
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        let percentage = 0;
        
        // First stage: 0 to 58.4 GB (Flash 64GB)
        if (total <= 58.4) {
            percentage = (total / 58.4) * 100;
            progressBar.style.background = 'linear-gradient(90deg, #00d9ff, #00ff87)';
        } 
        // Second stage: 58.4 to 463.9 GB (Hard 500GB)
        else if (total > 58.4 && total < 463.9) {
            // Reset to 0 and grow again from 58.4 to 463.9
            const secondStageTotal = total - 58.4;
            const secondStageMax = 463.9 - 58.4;
            percentage = (secondStageTotal / secondStageMax) * 100;
            progressBar.style.background = 'linear-gradient(90deg, #ffd93d, #ff9a44)';
        } 
        // Third stage: 463.9+ GB (Warning)
        else if (total >= 463.9) {
            percentage = 100;
            progressBar.style.background = 'linear-gradient(90deg, #ff6b6b, #ff4444)';
        }
        
        // Ensure percentage doesn't exceed 100
        if (percentage > 100) percentage = 100;
        progressBar.style.width = percentage + '%';
    }

    // Updated storage conditions
    if (total <= 58.4) {
        storage.innerText = "Flash 64GB";
    } else if (total > 58.4 && total < 463.9) {
        storage.innerText = "Hard 500GB";
    } else if (total >= 463.9) {
        storage.innerText = "یاری کەمکەوە";
    }

}

clearButton.addEventListener("click", function() {

    selectedGames = [];

    // If we're in "My Games" mode, stay in it but show empty state
    if (showOnlySelected) {
        renderGames();
    }

    updateSummary();

    // Re-render to update checkbox states
    if (!showOnlySelected) {
        renderGames();
    }

});

myGamesButton.addEventListener("click", function() {

    // Toggle the mode
    showOnlySelected = !showOnlySelected;

    // Update button text to show current state
    if (showOnlySelected) {
        myGamesButton.textContent = "هەموو یاریەکان";
        myGamesButton.style.background = "#ff6b6b";
        
        // Hide storage box when showing selected games
        const storageBox = document.querySelector('.box:not(.line-style)');
        if (storageBox) {
        }
    } else {
        myGamesButton.textContent = "ئەو یاریانەی دیاریکراون";
        myGamesButton.style.background = "#00d9ff";
        
        // Show storage box again
        const storageBox = document.querySelector('.box:not(.line-style)');
        if (storageBox) {
            storageBox.style.display = "block";
        }
    }

    renderGames();

});

// Initial render
updateSummary();
renderGames();
