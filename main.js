let item = document.querySelector('.item')
let shuffleBtn = document.querySelector('.btn')
let playerBtn = document.querySelectorAll('.player-btn')
let ul = document.querySelector('.ul-list')
let shuffleBtnWrap = document.querySelector('.shuffle-btn')
let copyBtn = document.querySelector('.copy')
let flag = 0

let pickedPlayers = [
    [], [], [], [] //Level A, B, C, D
]

let playersObj = [
    {name: 'יקיר', level: 'A'},
    {name:"אמרי" , level:'A' },
    {name: 'תום', level:'A' },
    {name: 'דין', level: 'A'},
    {name: 'נאור', level: 'A'},
    {name: 'אמיר', level: 'A'},
    {name: 'גון', level: 'B'},
    {name: 'מעיין', level: 'B'},
    {name: 'מרציאנו', level: 'B'},
    {name: 'דוד', level: 'B'},
    {name: 'ירדן', level: 'B'},
    {name: 'ג\'וני', level: 'B'},
    {name: 'אורן', level: 'C'},
    {name: 'שוואב', level: 'C'},
    {name: 'יונקי', level: 'C'},
    {name: 'טלץ', level: 'C'},
    {name: 'אמיר שני', level: 'C'},
    {name: 'דרור', level: 'C'},
    {name: 'צ\'יקו', level: 'D'},
    {name: 'גיא', level: 'D'}

]

// let players = [
//     [ //A players
//      'אמיר','נאור','דין','תום','אמרי'
//     ],
//     [ //B players
//      'טל','מרציאנו','קרירי','גון'
//     ],
//     [ //C players
//        'טלץ','יונקי','שוואב','אורן2','ירדן','דוד'
//     ],
//     [ //D players
//        'חגי', 'אורן','אמיר שני','אושר','דרור'
//     ]
// ]


//load list on loading
window.addEventListener('DOMContentLoaded', () => {
    displayPlayerList()
})


//add players to each level
playerBtn.forEach(element => {
    element.addEventListener('click', () => {
        let inputField = element.previousElementSibling

        if(inputField.className === "inputA"){
            console.log("A")

            playersObj.push({name: inputField.value, level:'A'})
            displayAddedPlayer(playersObj[playersObj.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputB"){
            console.log("B")

            playersObj.push({name: inputField.value, level:'B'})
            displayAddedPlayer(playersObj[playersObj.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputC"){
            console.log("C")

            playersObj.push({name: inputField.value, level:'C'})
            displayAddedPlayer(playersObj[playersObj.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputD"){
            console.log("D")

            playersObj.push({name: inputField.value, level:'D'})
            displayAddedPlayer(playersObj[playersObj.length-1])
            inputField.value = ''
        }
    })
});



//shuffle every level seperatly
function shufflePlayers(){

    //Check if there are too many players
    let totalPlayers = checkSumPlayers()
    if(totalPlayers > 21){
        alert(`${totalPlayers} players, Too many !`)
        return
    }

    //shuffle each level of players
    pickedPlayers.map(array => {
        array.sort(() => {
                return .5 - Math.random();
            });
        })
   
    let total = 0 
    for (let i = 0; i < pickedPlayers.length; i++) {
        for (let j = 0; j < pickedPlayers[i].length; j++) {
            let modulo = (total % 3) + 1

            //display pickedPlayers in three cols
            let team = document.querySelector(`.team${modulo}`)
            team.innerHTML += `<div class="player-row">${pickedPlayers[i][j].toUpperCase()}</div>`

            total++
        }
        console.log("Shuffle function")
    }

    if(window.screen.width > 425){
        shuffleBtnWrap.style.position = "absolute"
        shuffleBtnWrap.style.width = "79%"
        shuffleBtnWrap.style.bottom = "5%"
        copyBtn.style.visibility = "visible"
    } else {
        shuffleBtnWrap.style.position = "absolute"
        shuffleBtnWrap.style.width = "70%"
        shuffleBtnWrap.style.bottom = "5%"
        copyBtn.style.visibility = "visible"
    }
}


//Check total number of players
function checkSumPlayers(){
    let sum = 0

    pickedPlayers.map((array, arrayNum) => {
       sum += array.length
    })
    console.log(sum, "number of players")
    return sum
}


//random between 3 numbers
shuffleBtn.addEventListener('click', shuffle)

function shuffle(){
    if(flag > 0){
        let teams = document.querySelector('.teams').childNodes
        console.log(teams)

        for (let i = 0; i < 3; i++) {
            let element = document.querySelector(`.team${i+1}`)
            element.innerHTML = `<div class="team${i}"><h1 class="class-h1">Team ${i+1}</h1></div>`
        }

    }
    shufflePlayers()
    flag++
}



//display list on the left
function displayPlayerList(){
    playersObj.forEach((obj) => {
        let li = document.createElement('li')
        li.className = 'li-item'
        li.setAttribute('flag', 'false')
        li.addEventListener('click', (e) => {
            pickPlayer(e)
        })
        li.innerHTML = `${obj.name.toUpperCase()}`
        ul.appendChild(li)
    })
}


function displayAddedPlayer(obj) {
    let li = document.createElement('li')
    li.className = 'li-item'
    li.setAttribute('flag', 'false')
    li.addEventListener('click', (e) => {
        pickPlayer(e)
    })

    li.innerHTML = `${obj.name.toUpperCase()}`
    ul.appendChild(li)
}


function pickPlayer(e){
    let listLi = e.currentTarget
    
    let itemName = listLi.textContent
    let name = itemName.split(' ')

    if (listLi.getAttribute('flag') === "false") {
        listLi.style.color = "green"
        listLi.innerHTML = `${name[0]} &nbsp; &#10003;`
        listLi.setAttribute('flag', "true")
        pushPlayerToArrByLevel(name[0].toLowerCase())
    } else {
        listLi.style.color = "white"
        listLi.textContent = `${name[0].toUpperCase()}`
        popPlayerFromList(name[0].toLowerCase())
        listLi.setAttribute('flag', "false")
    }
            
}



function pushPlayerToArrByLevel(name){

        let fullObj = playersObj.filter(el => el.name === name)
        let level = fullObj[0].level
        
        if(level){
            if (level === 'A') {
                pickedPlayers[0].push(name)
                console.log(pickedPlayers[0], level + " - Picked List")
            }
            if (level === 'B') {
                pickedPlayers[1].push(name)
                console.log(pickedPlayers[1], level + " - Picked List")

            }
            if (level === 'C') {
                pickedPlayers[2].push(name)
                console.log(pickedPlayers[2], level +" - Picked List")

            }
            if (level === 'D') {
                pickedPlayers[3].push(name)
                console.log(pickedPlayers[3], level +" - Picked List")
            }
        }

}


function popPlayerFromList(name){

    let cleanName = name.split(" ")

    //get the player level from playerObj
    let fullObj = playersObj.filter(el => el.name === cleanName[0])
    let level = fullObj[0].level

    //filter the array with the level of the player from pickedPlayers array
    if(level){
        if (level === 'A') {
            pickedPlayers[0] = pickedPlayers[0].filter(player => player !== cleanName[0])
            console.log(pickedPlayers,"Player Popped")
        }
        if (level === 'B') {
            pickedPlayers[1] = pickedPlayers[1].filter(player => player !== cleanName[0])
            console.log(pickedPlayers,"Player Popped")

        }
        if (level === 'C') {
            pickedPlayers[2] = pickedPlayers[2].filter(player => player !== cleanName[0])
            console.log(pickedPlayers,"Player Popped")
        }
        if (level === 'D') {
            pickedPlayers[3] = pickedPlayers[3].filter(player => player !== cleanName[0])
            console.log(pickedPlayers,"Player Popped")
        }
    }

}


// document.querySelector('.copy').addEventListener('click', () => {
//     let text = document.querySelector('.team1').querySelectorAll('.player-row')
//     let a
//     text.forEach(name => {
//         a += name.textContent + ' '
//         console.log(a)
//     })
    
//     window.navigator.clipboard.writeText(a)
// })