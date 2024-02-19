// Set canvas size
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = 228; // Set the desired width
const canvasHeight = 128; // Set the desired height
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const palette = [["#1E0F26", "#460980", "#722392", "#CB59B8", "#FF7C01"], ["#0F1E26", "#094680", "#237292", "#59CBB8", "#7CFF01"]];
var chrs = "000000000000000000000001000001110000111100001111000111110001111100000000000000001000000011100000111100001111000011111000111110000000111100002111000222110005522200054111000001100000000000000000111100001112000011222000222550001114500001100000000000000000000000000000000000000000000100000111000011110000111100011111000111110000000000000000100000001110000011110000111100001111100011111000000011110000211100022211000552220005411100000000000000000000000011110000111200001222000021150000111000000100000000000000000000000000000000000000000000010000011100001111000011110001111100011111000000000000000010000000111000001111000011110000111110001111100000001111000021110000222100005112000001110000001000000000000000001111000011120000112220002225500011145000000000000000000000000000000000000000000000000011000001110000011100000111000001110000011100000000000000001100000011100000111000004440000045100000155500000000001100000012000000120000000500000004000000010000000000000000115000002100000020000000500000005000000010000000000000000000000000000000000000000000001100000111000001110000011100000111000001110000000000000000110000001110000011100000444000004510000015550000000000110000001200000012000000020000011100000100000000000000000011500000210000005500000045000000110000000110000000000000000000000000000000000000000000110000011100000111000001110000011100000111000000000000000011000000111000001110000044400000451000001555000000000011000000220000005500000145000001010000000000000000000000001150000021000000200000001000000011000000011000000000000000000000000000000000000000000001000001110000111100001111000111440001141500000000000000001000000011100000111100001111000044111000514110000000155500002151000222220005522200054111000001100000000000000000555100001512000022222000222550001114500001100000000000000000000000000000000000000000000100000111000011110000111100011144000114150000000000000000100000001110000011110000111100004411100051411000000015550000215100022222000255220000541100000000000000000000000055510000151200002222200021145000111000000100000000000000000000000000000000000000000000010000011100001111000011110001114400011415000000000000000010000000111000001111000011110000441110005141100000001555000021510002222200054112000001110000001000000000000000005551000015120000222220002255200011450000000000000000000000000000000000000000000000000011000001110000011100000444000001540000555100000000000000001100000011100000111000001110000011100000111000000000051100000012000000020000000500000005000000010000000000000000110000002100000021000000500000004000000010000000000000000000000000000000000000000000001100000111000001110000044400000154000055510000000000000000110000001110000011100000111000001110000011100000000005110000001200000055000000540000001100000110000000000000000011000000210000002100000020000000111000000010000000000000000000000000000000000000000000110000011100000111000004440000015400005551000000000000000011000000111000001110000011100000111000001110000000000511000000120000000200000004000000110000011000000000000000001100000022000000550000005410000010100000000000000000000000000000";
var playerInp = [0, 0, 0, 0];
var playerPos = [0, 0];
var cameraPos = [0, 0];
var cameraSpeed = [0, 0];
var frame = 0;
var angle = 0;

function lerpHexColor(startColor, endColor, t) {
    // Parse start and end colors
    const start = parseInt(startColor.replace(/^#/, ''), 16);
    const end = parseInt(endColor.replace(/^#/, ''), 16);

    // Extract RGB components
    const startR = (start >> 16) & 0xff;
    const startG = (start >> 8) & 0xff;
    const startB = start & 0xff;
    const endR = (end >> 16) & 0xff;
    const endG = (end >> 8) & 0xff;
    const endB = end & 0xff;

    // Interpolate RGB components
    const lerpedR = Math.round(startR + (endR - startR) * t);
    const lerpedG = Math.round(startG + (endG - startG) * t);
    const lerpedB = Math.round(startB + (endB - startB) * t);

    // Combine interpolated components into a hexadecimal color string
    const lerpedColor = '#' + ((1 << 24) + (lerpedR << 16) + (lerpedG << 8) + lerpedB).toString(16).slice(1);

    return lerpedColor;
}

// Function to draw on canvas
function drawPixel(x, y, index, pal) {
    ctx.fillStyle = palette[Math.floor(index)][pal];//lerpHexColor(palette[Math.floor(index)][pal], palette[Math.ceil(index)][pal], index % 1);
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

function drawChr(x, y, index, pal) {
    var startIndex = index * 64;
    for (var px = 0; px < 8; px++) {
        for (var py = 0; py < 8; py++) {
            if (chrs[startIndex + px + (py * 8)] > 0) {
                drawPixel(x + px, y + py, pal, chrs[startIndex + px + (py * 8)] - 1);
            }
        }
    }
}

// JavaScript code in script.js
document.addEventListener("DOMContentLoaded", function () {
    repeatEverySecond();
    // Handle user input (WASD and spacebar)
    document.addEventListener("keydown", function (event) {
        const key = event.key.toLowerCase();
        // Handle WASD and spacebar
        if (["w", "a", "s", "d", " "].includes(key)) {
            event.preventDefault();
            switch (key) {
                case "w":
                    playerInp[0] = 1;
                    break;
                case "a":
                    playerInp[3] = 1;
                    break;
                case "s":
                    playerInp[2] = 1;
                    break;
                case "d":
                    playerInp[1] = 1;
                    break;
                case " ":

                    break;
                default:
                    break;
            }
        }
    });
    document.addEventListener("keyup", function (event) {
        const key = event.key.toLowerCase();
        // Handle WASD and spacebar
        if (["w", "a", "s", "d", " "].includes(key)) {
            event.preventDefault();
            switch (key) {
                case "w":
                    playerInp[0] = 0;
                    break;
                case "a":
                    playerInp[3] = 0;
                    break;
                case "s":
                    playerInp[2] = 0;
                    break;
                case "d":
                    playerInp[1] = 0;
                    break;
                case " ":

                    break;
                default:
                    break;
            }
        }
    });
});

function lerp(a, b, t) {
    return (a * (1 - t)) + (b * t);
}

function update() {
    frame++;
    // tick stuff
    playerPos[0] += playerInp[1];
    playerPos[0] -= playerInp[3];
    playerPos[1] += playerInp[2];
    playerPos[1] -= playerInp[0];

    // only scroll camera if the player is outside of a small box
    var camdiff = [cameraPos[0] - playerPos[0] + (canvasWidth / 2), cameraPos[1] - playerPos[1] + (canvasHeight / 2)];
    if (Math.abs(camdiff[0]) > 16) {
        cameraPos[0] = lerp(cameraPos[0], playerPos[0] - (canvasWidth / 2), 0.03);
    }
    if (Math.abs(camdiff[1]) > 9) {
        cameraPos[1] = lerp(cameraPos[1], playerPos[1] - (canvasHeight / 2), 0.03);
    }

    // draw stuff
    for (var i = 0; i < canvasWidth; i++) {
        for (var y = 0; y < canvasHeight; y++) {

            var useB = Math.abs(i + Math.floor(cameraPos[0])) % 16 < 8;
            if (Math.abs(y + Math.floor(cameraPos[1])) % 16 < 8) {
                useB = !useB;
            }
            drawPixel(i, y, 1, (useB ? 1 : 0));
        }
    }

    // set walk frame
    var walkFrame = Math.floor(frame / 8) % 4;
    var walkRemapArr = [0, 1, 0, 2];
    walkFrame = walkRemapArr[walkFrame];
    // set angle
    var dx = playerInp[3] - playerInp[1];
    var dy = playerInp[2] - playerInp[0];
    if (dy != 0) {
        angle = dy + 1;
    } else if (dx != 0) {
        angle = dx + 2;
    } else {
        walkFrame = 0;
    }

    drawChr(playerPos[0] - Math.ceil(cameraPos[0]) - 8, playerPos[1] - Math.ceil(cameraPos[1]) - 8 - (walkFrame > 0), 0 + (walkFrame * 4) + (angle * 12), 0);
    drawChr(playerPos[0] - Math.ceil(cameraPos[0]) - 0, playerPos[1] - Math.ceil(cameraPos[1]) - 8 - (walkFrame > 0), 1 + (walkFrame * 4) + (angle * 12), 0);
    drawChr(playerPos[0] - Math.ceil(cameraPos[0]) - 8, playerPos[1] - Math.ceil(cameraPos[1]) - 0 - (walkFrame > 0), 2 + (walkFrame * 4) + (angle * 12), 0);
    drawChr(playerPos[0] - Math.ceil(cameraPos[0]) - 0, playerPos[1] - Math.ceil(cameraPos[1]) - 0 - (walkFrame > 0), 3 + (walkFrame * 4) + (angle * 12), 0);
    //drawPixel(playerPos[0] - Math.ceil(cameraPos[0]), playerPos[1] - Math.ceil(cameraPos[1]), 0, 3);
}

let intervalID;

function repeatEverySecond() {
    intervalID = setInterval(update, 16);
}