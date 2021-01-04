window.onload = () => {
    $("body").on("keydown", function(e) {
        if (e.key == "ArrowUp" || e.key == "ArrowRight" || e.key == "ArrowDown" || e.key == "ArrowLeft") {
            moveTiles(e.key.replace("Arrow", ""));
        }
    })
}
function onTileClick(event) {
    $(event.target).addClass("slide-right-2");
}

let game = {
    tiles: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
    score: 0,
    lastMove: ""
}

function iterateTiles(eachTile, eachRow, direction) {
    if (!eachRow) eachRow = () => {};
    switch(direction) {
        case "Up":
            for (let i = 0;  i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    eachTile(j, i, game.tiles[j][i]);
                }
                eachRow()
            }
            break;
        case "Right":
            for (let i = 0;  i < 4; i++) {
                for (let j = 3;  j >= 0; j--) {
                    eachTile(i, j, game.tiles[i][j]);
                }
                eachRow()
            }
            break;
        case "Down":
            for (let i = 3;  i >= 0; i--) {
                for (let j = 3;  j >= 0; j--) {
                    eachTile(j, i, game.tiles[j][i]);
                }
                eachRow()
            }
            break;
        case "Left":
            for (let i = 0;  i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    eachTile(i, j, game.tiles[i][j]);
                }
                eachRow()
            }
            break;
        default:
            game.tiles.forEach((row, x) => {
                row.forEach((tile, y) => {
                    eachTile(x, y, tile);
                })
                eachRow()
            })
            break;
    }
}

function newTiles() {
    let openTiles = [];
    iterateTiles((x, y, val) => {
        if (val == 0) openTiles.push(x.toString() + y.toString());
    });
    chooseAndDraw(openTiles);
    if (Math.floor(Math.random() * 2)) chooseAndDraw(openTiles); //randomly creates a second tile
}

function chooseAndDraw(tiles) {
    let chosen = tiles[Math.floor(Math.random() * tiles.length)];
    let [x, y] = chosen.split("").map(it => parseInt(it));
    let number = Math.floor(Math.random() * 2 + 1) * 2;
    $("#" + chosen).html(`<div class="${number}"></div>`);
    game.tiles[x][y] = number;
}

function moveTiles(direction) {
    let row = [];
    iterateTiles((x, y, val) => {
        row.push({x, y, val});
    }, () => {
        row.forEach((it, index) => {
            if (index == 0) return;
            if (it.val == 0) return;
            let lastZero = false;
            for (let i = index - 1; i >= 0; i--) {
                if (it.val == row[i].val && !row[i].touched) {
                    row[i].val = row[i].val * 2;
                    row[i].touched = true;
                    game.tiles[row[i].x][row[i].y] = row[i].val;
                    game.tiles[it.x][it.y] = 0;
                    it.val = 0;
                }
                if (row[i].val == 0) {
                    lastZero = i;
                }
            }
            if (lastZero != undefined) {
                row[lastZero].val = it.val;
                game.tiles[row[lastZero].x][row[lastZero].y] = it.val;
                game.tiles[it.x][it.y] = 0;
                it.val = 0;
            }
        })
        row = [];
    }, direction)
    drawTiles();
    newTiles();
}

function drawTiles() {
    $(".tile").each(function( index ) {
        $(this).html("");
    });
    iterateTiles((x, y, val) => {
        if (val != 0) {
            $("#" + x + y).html(`<div class="${val}"></div>`);
        }
    });
}

newTiles();