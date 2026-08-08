const gamesContainer = document.getElementById("gamesContainer");

const selectedCount = document.getElementById("selectedCount");
const totalSize = document.getElementById("totalSize");
const storage = document.getElementById("storage");

const clearButton = document.getElementById("clearSelection");
const myGamesButton = document.getElementById("myGames");

let selectedGames = [];
let showOnlySelected = false;
const WARNING_THRESHOLD = 494;

function getGameName(path) {
    let name = path.split("/").pop();
    name = name.substring(0, name.lastIndexOf("."));
    name = name.replace(/[_-]/g, " ");
    return name.replace(/\b\w/g, function(letter) {
        return letter.toUpperCase();
    });
}

function getTotalSelectedSize() {
    let total = 0;
    selectedGames.forEach(function(image) {
        const game = games.find(function(g) {
            return g.image === image;
        });
        if (game) {
            total += Number(game.size);
        }
    });
    return total;
}

function renderGames() {
    gamesContainer.innerHTML = "";
    const totalSelectedSize = getTotalSelectedSize();

    let gamesToShow = games;
    if (showOnlySelected) {
        gamesToShow = games.filter(function(game) {
            return selectedGames.includes(game.image);
        });
    }

    gamesToShow.forEach(function(game) {
        const card = document.createElement("div");
        card.className = "game";

        const isSelected = selectedGames.includes(game.image);
        if (isSelected) card.classList.add("selected");

        const canSelect = (totalSelectedSize + game.size <= WARNING_THRESHOLD) || isSelected;
        const isDisabled = !canSelect && !isSelected;

        const checked = isSelected ? "checked" : "";

        card.innerHTML = `
            <img src="${game.image}" loading="lazy">
            <div class="gameInfo">
                <div class="gameSize">
                    ${game.size.toFixed(2)} GB
                </div>
                <input
                    type="checkbox"
                    ${checked}
                    ${isDisabled ? 'disabled' : ''}
                >
                ${isDisabled ? '<div class="storage-full-tag">پڕە</div>' : ''}
            </div>
        `;

        const checkbox = card.querySelector("input");

        checkbox.addEventListener("click", function(e) {
            e.stopPropagation();
            if (!this.disabled) {
                toggleGame(game.image);
            }
        });

        card.addEventListener("click", function() {
            if (!isDisabled) {
                toggleGame(game.image);
            }
        });

        gamesContainer.appendChild(card);
    });

    if (showOnlySelected && selectedGames.length === 0) {
        gamesContainer.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px;font-size:18px;color:#9ca3af;">
                هیچ یاریەک دیاری نەکراوە. تکایە یاریەکان دابنێ بۆ کۆکردنەوە.
            </div>
        `;
    }
}

function toggleGame(image) {
    const totalSelectedSize = getTotalSelectedSize();
    const game = games.find(function(g) {
        return g.image === image;
    });

    if (!game) return;

    if (selectedGames.includes(image)) {
        selectedGames = selectedGames.filter(function(item) {
            return item !== image;
        });
    } else {
        if (totalSelectedSize + game.size <= WARNING_THRESHOLD) {
            selectedGames.push(image);
        } else {
            alert(`ناتوانیت ئەم یاریە زیاد بکەیت! بۆشایی پڕە`);
            return;
        }
    }

    updateSummary();
    renderGames();
}

function updateSummary() {
    if (selectedCount) {
        selectedCount.innerText = selectedGames.length;
    }

    const total = getTotalSelectedSize();

    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        let percentage = (total / WARNING_THRESHOLD) * 100;
        
        if (total <= WARNING_THRESHOLD) {
            progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        } else {
            percentage = 100;
            progressBar.style.background = 'linear-gradient(90deg, #ff6b6b, #ff4444)';
        }
        
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
        progressBar.style.width = percentage + '%';
    }

    // Just 2 states
    if (total < WARNING_THRESHOLD) {
        storage.innerText = "Hard 500GB";
    } else {
        storage.innerText = "پڕە";
    }
}

clearButton.addEventListener("click", function() {
    selectedGames = [];

    if (showOnlySelected) {
        renderGames();
    }

    updateSummary();

    if (!showOnlySelected) {
        renderGames();
    }
});

myGamesButton.addEventListener("click", function() {
    showOnlySelected = !showOnlySelected;

    if (showOnlySelected) {
        myGamesButton.textContent = "هەموو یاریەکان";
        myGamesButton.style.background = "#ff6b6b";
        
        let totalSelectedSize = getTotalSelectedSize();
        clearButton.textContent = `${selectedGames.length}-${totalSelectedSize.toFixed(1)}`;
        clearButton.style.background = "#ffd93d";
        
        const storageBox = document.querySelector('.box:not(.line-style)');
        if (storageBox) {
            storageBox.style.display = "none";
        }
    } else {
        myGamesButton.textContent = "ئەو یاریانەی دیاریکراون";
        myGamesButton.style.background = "#00d9ff";
        clearButton.textContent = "لابردنی یاریە دیاریکراوەکان";
        clearButton.style.background = "#00d9ff";
        
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
