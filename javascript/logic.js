/* DROP LOGIC */
const allowDrop = (e) => {
    e.preventDefault();
}

const drag = (e) => {
    e.dataTransfer.setData("targetID", e.target.id);
}

const drop = (e) => {
    e.preventDefault();
    if (e.target.nodeName == "IMG") {
        let parentDiv = e.target.parentNode;
        const data = e.dataTransfer.getData("targetID");
        
        console.log(checkIfLegalMove(parseCard(data), parseCard(e.target.parentNode.id)));
        if(checkIfLegalMove(parseCard(data), parseCard(e.target.parentNode.id))) {
            parentDiv.appendChild(document.getElementById(data));
            moveCard(data, e.target.closest(".stack").id);
            drawCards();
            return;
        } else {
            return;
        }  
    }
    const data = e.dataTransfer.getData("targetID");
    e.target.appendChild(document.getElementById(data));
    moveCard(data, e.target.closest(".stack").id);
    drawCards();
    return;
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


let shuffleStack = []; // Shuffle Stack


let stackOne = []; // 1
let stackTwo = []; // 2
let stackThree = []; // 3
let stackFour = []; // 4
let stackFive = []; // 5
let stackSix = []; // 6
let stackSeven = []; // 7

let completionStackOne = []; // Completion Stack 1
let completionStackTwo = []; // Completion Stack 2
let completionStackThree = []; // Completion Stack 3
let completionStackFour = []; // Completion Stakc 4

let stacks = [stackOne, stackTwo, stackThree,
    stackFour, stackFive, stackSix, stackSeven,
    completionStackOne, completionStackTwo,
    completionStackThree, completionStackFour, shuffleStack];




let discovered = [];




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

    if(location.array == stacks[11]) {
        location.array.splice(location.index, 1);
        eval(destination).push(id);
        shuffle();
        deck.pop();
        return;
    }

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

const shuffle = () => {
    if(deck.length <= 0) return;
    
    let render = document.getElementById("shuffleStack");
    let randInt = getRandomInt(deck.length-1);
    
    if(render.innerHTML != "") {
        deck.push(stacks[11][0]);
    }

    render.innerHTML = "";
    
    if(stacks[11].length >= 1) {
        stacks[11] = [];
    }

    render.innerHTML = `
            <div id="${deck[randInt]}" class="card" draggable="true" ondragstart="drag(event)">
                <img src="./media/cards/${deck[randInt]}.png" draggable="false"   alt="">
            </div>
            `;
    stacks[11].push(deck[randInt]);
    deck.splice(randInt,1);
    
}


const parseCard = (id) => {
    let specialCues = ['jack', 'queen', 'king', 'ace'];
    let value;
    let type;
    let data;
    for(let i = 0; i < specialCues.length; i++) {
        if(id.includes(specialCues[i])) {
            value = id.slice(id.indexOf(specialCues[i]), id.indexOf(specialCues[i]) + specialCues[i].length);
            type = id.slice(id.indexOf(specialCues[i]) + specialCues[i].length, id.length);
            data = {
                "value": value,
                "type": type
            }
            return data;
        }
    }

    if(id.includes("10")) {
        value = id.slice(0,2);
        type = id.slice(2, id.length);
        data = {
            "value": value,
            "type": type
        }
        return data;
    }

    value = id.slice(0,1);
    type = id.slice(1, id.length);
    data = {
        "value": value,
        "type": type
    }
    return data;
}

const checkIfLegalMove = (mCard, sCard) => {
    // mCard = Moved card.
    // sCard = Stationary card.
    console.log("-- Current cards --");
    console.log("mCard: " + mCard.value + " | " + mCard.type);
    console.log("sCard: " + sCard.value + " | " + sCard.type);

    let specialCues = ['jack', 'queen', 'king', 'ace'];
    let specialCuesWithRanking = {
        'jack': 1,
        'queen': 2,
        'king': 3,
        'ace': 4
    }

    if(mCard.type == sCard.type) {
        console.log("Cards are same type");
        let allowedLocations = [completionStackOne, completionStackTwo, completionStackThree, completionStackFour];
        let completionCard = false;
        for(let i = 0; i < stacks.length; i++) {
            if(stacks[i].includes(sCard.value+sCard.type)) {
                if(allowedLocations.includes(stacks[i])) completionCard = true;
            }
        }
        if(!completionCard) {
            return false; // same type
        } else {
            console.log("Entered.");
            if(specialCues.includes(mCard.value) && sCard.value != "ace") {
                if(specialCuesWithRanking[mCard.value] == specialCuesWithRanking[sCard.value] + 1) return true;
            }

            if(parseInt(sCard.value) == 10 && mCard.value == "jack") return true;

            if(sCard.value == "ace" && mCard.value == "2") return true; 
            if(parseInt(mCard.value) == parseInt(sCard.value) + 1) return true;
        }
    }
    if(mCard.type == "sp" && sCard.type == "cl" || mCard.type == "cl" && sCard.type == "sp") {
        console.log("Cards are both black");
        return false; // both black
    } 
    if(mCard.type == "di" && sCard.type == "he" || mCard.type == "he" && sCard.type == "di") {
        console.log("Cards are both red");
        return false; // both red
    }

    if(specialCues.includes(mCard.value) || specialCues.includes(sCard.value)) {
        if(!specialCues.includes(mCard.value) && sCard.value != "jack") {
            console.log("mCard mCard is not special cues and sCard is not jack.");
            return false;
        }
        if(sCard.value == "jack" && mCard.value == "10") {
            console.log("sCard is jack and mCard is 10");
            return true;
        }
        // One of the cards are a special card.
        if(specialCuesWithRanking[mCard.value] == specialCuesWithRanking[sCard.value] - 1) {
            console.log("mCard is equal to the sCard value - 1");
            return true;
        }
        console.log("Card failed all tests");
        return false;
    }

    if(parseInt(mCard.value) == parseInt(sCard.value) - 1) return true;
    return false;
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
    shuffle();
    deck.pop();
}

const drawCards = () => {
    let elementId;
    for (let z = 0; z < stacks.length; z++) {
        if (stacks[z].length < 1) continue;
        let classToApply = "card";
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
            case 7:
                elementId = "completionStackOne";
                classToApply = "card-c";
                break;
            case 8:
                elementId = "completionStackTwo";
                classToApply = "card-c";
                break;
            case 9:
                elementId = "completionStackThree";
                classToApply = "card-c";
                break;
            case 10:
                elementId = "completionStackFour";
                classToApply = "card-c";
                break;
            case 11:
                elementId = "shuffleStack";
                break;
            default:
                break;
        }


        render = document.getElementById(elementId);
        if (stacks[z].length <= 1) {
            render.innerHTML = `
            <div id="${stacks[z][0]}" class="${classToApply}" draggable="true" ondragstart="drag(event)">
                <img src="./media/cards/${stacks[z][0]}.png" draggable="false"   alt="">
            </div>
            `;

            if(!discovered.includes(stacks[z][0])) {
                discovered.push(stacks[z][0]);
            }

        } else {

            if(discovered.includes(stacks[z][0])) {
                render.innerHTML = `
                <div id="${stacks[z][0]}" class="${classToApply}" draggable="true" ondragstart="drag(event)">
                    <img src="./media/cards/${stacks[z][0]}.png" draggable="false"   alt="">
                </div>
                `;
            } else {
                render.innerHTML = `
                <div id="${stacks[z][0]}" class="${classToApply}" draggable="true" ondragstart="drag(event)">
                    <img src="./media/cards/backside2.png" draggable="false"   alt="">
                </div>
                `;
            }
        }


        let stackLastNote = document.getElementById(stacks[z][0]);
        for (let y = 1; y < stacks[z].length; y++) {
            if (y == stacks[z].length - 1) {
                stackLastNote.innerHTML += `
                <div id="${stacks[z][y]}" class="${classToApply}" draggable="true" ondragstart="drag(event)">
                    <img src="./media/cards/${stacks[z][y]}.png" draggable="false"   alt="">
                </div>
                `;

                if(!discovered.includes(stacks[z][y])) {
                    discovered.push(stacks[z][y]);
                }
            } else {
                if(discovered.includes(stacks[z][y])) {
                    stackLastNote.innerHTML += `
                    <div id="${stacks[z][y]}" class="${classToApply}" draggable="true" ondragstart="drag(event)">
                        <img src="./media/cards/${stacks[z][y]}.png" draggable="false"   alt="">
                    </div>
                    `;
                } else {
                    stackLastNote.innerHTML += `
                    <div id="${stacks[z][y]}" class="${classToApply}" draggable="true" ondragstart="drag(event)">
                        <img src="./media/cards/backside2.png" draggable="false"   alt="">
                    </div>
                    `;
                }
            }

            stackLastNote = document.getElementById(stacks[z][y]);
        }
    }

}

initiateGame();