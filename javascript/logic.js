/* DROP LOGIC */

const allowDrop = (e) => {
    e.preventDefault();
}

const drag = (e) => {
    e.dataTransfer.setData("text", e.target.id);
}

const drop = (e) => {
    e.preventDefault();
    if (e.target.nodeName == "IMG") {
        let parentDiv = e.target.parentNode;
        const data = e.dataTransfer.getData("text");
        parentDiv.appendChild(document.getElementById(data));
        moveCard(data, e.target.closest(".stack").id);
        drawCards();
        return;
    }
    const data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
    moveCard(data, e.target.closest(".stack").id);
    drawCards();
}

// ARRAYS
let deck = [
    '2cl', '2di', '2he', '2sp',
    '3cl', '3di', '3he', '3sp',
    '4cl', '4di', '4he', '4sp',
    '5cl', '5di', '5he', '5sp',
    '6cl', '6di', '6he', '6sp',
    '7cl', '7di', '7he', '7sp',
    '8cl', '8di', '8he', '8sp',
    '9cl', '9di', '9he', '9sp',
    '10cl', '10di', '10he', '10sp',
    'jackcl', 'jackdi', 'jackhe', 'jacksp',
    'queencl', 'queendi', 'queenhe', 'queensp',
    'kingcl', 'kingdi', 'kinghe', 'kingsp',
    'acecl', 'acedi', 'acehe', 'acesp'
];

let topDeckLeftBoxOne = [];
let topDeckLeftBoxTwo = [];
let topDeckLeftBoxThree = [];
let topDeckLeftBoxFour = [];

let topDeckRightBoxOne = [];

let stackOne = []; // 1
let stackTwo = []; // 2
let stackThree = []; // 3
let stackFour = []; // 4
let stackFive = []; // 5
let stackSix = []; // 6
let stackSeven = []; // 7
let stacks = [stackOne, stackTwo, stackThree, stackFour, stackFive, stackSix, stackSeven];
let discovered = [0,0,0,0,0,0,0];
// Toolbox

const locateCard = (id) => {

    if (deck.indexOf(id) != -1) {
        let i = deck.indexOf(id);
        data = {
            'array': deck,
            'index': i
        }
        return data;
    }

    for (let i = 0; i < stacks.length; i++) {
        if (stacks[i].indexOf(id) != -1) {
            let x = stacks[i].indexOf(id);
            data = {
                'array': stacks[i],
                'index': x
            }
            return data;
        }
    }

    return -1;
}

const moveCard = (id, destination) => {
    let location = locateCard(id);
    
    if (location == -1) return;

    try {
        children = getChildren(id);
    } catch (error) {}

    location.array.splice(location.index, 1);
    eval(destination).push(id);
    
    if (children != null) {
        for (let i = 0; i < children.length; i++) {
            location.array.splice(location.index, 1);
            eval(destination).push(children[i]);
        }
    }
}

const getChildren = (id) => {
    let location = locateCard(id);
    let children = [];
    for (let i = location.index + 1; i < location.array.length; i++) {
        children.push(location.array[i]);
    }

    if (children.length > 0) return children;
    return null;
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const initiateGame = () => {
    let index = getRandomInt(deck.length);
    stackOne.push(deck[index]);
    deck.splice(index, 1);

    for (let i = 0; i < 2; i++) {
        index = getRandomInt(deck.length);
        stackTwo.push(deck[index]);
        deck.splice(index, 1);
    }

    for (let i = 0; i < 3; i++) {
        index = getRandomInt(deck.length);
        stackThree.push(deck[index]);
        deck.splice(index, 1);
    }

    for (let i = 0; i < 4; i++) {
        index = getRandomInt(deck.length);
        stackFour.push(deck[index]);
        deck.splice(index, 1);
    }

    for (let i = 0; i < 5; i++) {
        index = getRandomInt(deck.length);
        stackFive.push(deck[index]);
        deck.splice(index, 1);
    }

    for (let i = 0; i < 6; i++) {
        index = getRandomInt(deck.length);
        stackSix.push(deck[index]);
        deck.splice(index, 1);
    }

    for (let i = 0; i < 7; i++) {
        index = getRandomInt(deck.length);
        stackSeven.push(deck[index]);
        deck.splice(index, 1);
    }


    drawCards();

}

const drawCards = () => {
    let elementId;
    for (let z = 0; z < stacks.length; z++) {
        if(stacks[z].length < 1) continue;

        switch (z) {
            case 0:
                elementId = "stackOne";
                break;
            case 1:
                elementId = "stackTwo";
                break;
            case 2:
                elementId = "stackThree";
                break;
            case 3:
                elementId = "stackFour";
                break;
            case 4:
                elementId = "stackFive";
                break;
            case 5:
                elementId = "stackSix";
                break;
            case 6:
                elementId = "stackSeven";
                break;
            default:
                break;
        }


        render = document.getElementById(elementId);
        if(stacks[z].length <= 1) {
            render.innerHTML = `
            <div id="${stacks[z][0]}" class="card" draggable="true" ondragstart="drag(event)">
                <img src="./media/cards/${stacks[z][0]}.png" draggable="false"   alt="">
            </div>
            `;
        } else {
            render.innerHTML = `
                <div id="${stacks[z][0]}" class="card" draggable="true" ondragstart="drag(event)">
                    <img src="./media/cards/backside2.png" draggable="false"   alt="">
                </div>
                `;
        }
        

        let stackLastNote = document.getElementById(stacks[z][0]);
        for (let y = 1; y < stacks[z].length; y++) {
            if(y == stacks[z].length-1) {
                stackLastNote.innerHTML += `
                <div id="${stacks[z][y]}" class="card" draggable="true" ondragstart="drag(event)">
                    <img src="./media/cards/${stacks[z][y]}.png" draggable="false"   alt="">
                </div>
                `;
            } else {
                stackLastNote.innerHTML += `
                <div id="${stacks[z][y]}" class="card" draggable="true" ondragstart="drag(event)">
                    <img src="./media/cards/backside2.png" draggable="false"   alt="">
                </div>
                `;
            }
            
            stackLastNote = document.getElementById(stacks[z][y]);
    }
}




}


initiateGame();