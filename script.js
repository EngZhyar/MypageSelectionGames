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

                <div class="gameTitle">
                    ${getGameName(game.image)}
                </div>

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
                No games selected yet. Click on games to add them to your collection.
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

    selectedCount.innerText = selectedGames.length;

    let total = 0;

    selectedGames.forEach(function(image) {

        const game = games.find(function(g) {
            return g.image === image;
        });

        if (game) {

            total += Number(game.size);

        }

    });

    totalSize.innerText = total.toFixed(2) + " GB";

    if (total <= 58.5) {

        storage.innerText = "Flash 64GB";

    } else {

        storage.innerText = "Hard 500GB";

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
    } else {
        myGamesButton.textContent = " ئەو یاریانەی دیاریکراون";
        myGamesButton.style.background = "#00d9ff";
    }

    renderGames();

});

updateSummary();

renderGames();