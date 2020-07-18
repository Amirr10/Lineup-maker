let item = document.querySelector('.item')
let rightList = document.querySelector('.right-list')
let shuffleBtn = document.querySelector('.btn')
let playerBtn = document.querySelectorAll('.player-btn')
let ul = document.querySelector('.ul-list')
let shuffleBtnWrap = document.querySelector('.shuffle-btn')
let edit = document.querySelector('.edit')
let copyBtn = document.querySelector('.copy')
let editList = 0
let flag = 0

let dbDummyArray
let pickedPlayers = [
    [], [], [], [] //Level A, B, C, D
]


function getPlayerLevelByName(name){
    let obj = dbDummyArray.filter(el => el.name === name)
    return obj[0].level
}

function getPlayerObjectByName(name){
    let obj = dbDummyArray.filter(el => el.name === name)
    return obj[0]
}



//load list on loading
window.addEventListener('DOMContentLoaded', () => {
    displayPlayerList()
})


//display list on the left
function displayPlayerList(){

    //fetch data from mongodb
    fetch('http://localhost:5000/')
        .then(res => res.json())
        .then(data => {
            dbDummyArray = data
            console.log(data)

            dbDummyArray.forEach((obj) => {
                let li = document.createElement('li')
                li.className = 'li-item'
                li.setAttribute('flag', 'false')

                li.addEventListener('click', (e) => {
                    pickPlayer(e)
                })

                li.addEventListener('mouseover', (e) => {
                    displayLevel(e)
                })

                li.addEventListener('mouseout', (e) => {
                    unDisplayLevel(e)
                })

                li.innerHTML = `${obj.name} <button class=del-btn>X</button>`
                ul.appendChild(li)
            })

        })
}


//add players to each level
playerBtn.forEach(element => {
    element.addEventListener('click', () => {
        let inputField = element.previousElementSibling

        if(inputField.className === "inputA"){
            addPlayerToDB(inputField.value, 'A')
            console.log("A")

            dbDummyArray.push({name: inputField.value, level:'A'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputB"){
            addPlayerToDB(inputField.value, 'B')
            console.log("B")

            dbDummyArray.push({name: inputField.value, level:'B'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputC"){
            addPlayerToDB(inputField.value, 'C')
            console.log("C")

            dbDummyArray.push({name: inputField.value, level:'C'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputD"){
            addPlayerToDB(inputField.value, 'D')
            console.log("D")

            dbDummyArray.push({name: inputField.value, level:'D'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
    })
});

//send post request with name and level to db, and save user in db
function addPlayerToDB(value, level){

    fetch('http://localhost:5000/post', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: value, level: level })
            })
}

function removePlayerFromDb(name){
    console.log(name)

    fetch('http://localhost:5000/delete', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
}

//display delete buttons and hide them
edit.addEventListener('click', () => {
    if(!editList){
        unMarkPlayerList()
        editPlayers()
        editList = 1
    } else {
        hideDeletePlayers()
        editList = 0
    }
    
})

function editPlayers(){
    //get list element of del-btn class
    let delBtn = ul.querySelectorAll('.del-btn')

    // loop thorugh list of names and display del-btn
    delBtn.forEach(btn => {
        btn.style.visibility = 'visible'

        btn.addEventListener('click', () => {
            let name = btn.parentElement.textContent.split(' ')

            //remove from db
            removePlayerFromDb(name[0])

            //remove from dom and from playerlist
            ul.removeChild(btn.parentElement)
        })
    })    
}

//when user click Edit List the second time, hide red delete btn
function hideDeletePlayers(){
    //get list element of del-btn class
    let delBtn = ul.querySelectorAll('.del-btn')

    // loop thorugh list of names and display del-btn
    delBtn.forEach(btn => {
        btn.innerHTML = ''
        // btn.style.visibility = 'hidden'
    })    


    let li = document.querySelectorAll('.li-item')

    //fetch data from mongodb
     fetch('http://localhost:5000/')
     .then(res => res.json())
     .then(data => {
         dbDummyArray = data
         console.log(data)

         dbDummyArray.forEach((obj,i) => {
             li[i].className = 'li-item'
             li[i].setAttribute('flag', 'false')
         })
     })
}


//remove all players from pickedPlayer[] and unMark them
function unMarkPlayerList(){
    pickedPlayers.forEach((list,i) => {
      list.splice(0, list.length)
    })

    console.log(pickedPlayers, "picked list!")

    let liItem = ul.querySelectorAll('.li-item')
    liItem.forEach(item => {
        // console.log(item.lastChild.style.visibility, "first")
        let itemName = item.textContent
        let name = itemName.split(' ')

        item.style.color = "white"
        item.textContent = `${name[0]}`
        item.setAttribute('flag', "false")
        item.innerHTML = `${name[0]} <button class=del-btn>X</button>`

        item.lastChild.style.visibility = 'visible'  
    })

}


//hide delete buttons when clicking next to the names
rightList.addEventListener('click', (e) => {
    if(e.target.className !== 'edit' && e.target.className !== 'del-btn' && editList){
        hideDeletePlayers()
    }
})


//showing player rank when hovering on a player in player list
function displayLevel(e){
    let newName
    let li = e.currentTarget
    let name = li.textContent.split(' ')
    console.log(name)
    if(name[1] === 'X'){
         newName = name[0] 
        console.log(newName, "AAAS")
    } else {
         newName = name[0] + ' ' + name[1]
         console.log(newName)
    }
    let level = getPlayerLevelByName(newName)

    let btn1 = li.querySelector('.del-btn')
    let div = document.createElement('div')
    div.className = "box"
    div.innerHTML = `Name - ${newName}
                     <br> Level - ${level}`

    btn1.append(div)
    div.style.visibility = 'visible'
}


function unDisplayLevel(e){
    let li = e.currentTarget
    let btn1 = li.querySelector('.del-btn')
    let div = btn1.querySelector('.box')
    btn1.removeChild(div)

}


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


//function that adding new player name to the player list
function displayAddedPlayer(obj) {
    let li = document.createElement('li')
    li.className = 'li-item'
    li.setAttribute('flag', 'false')
    li.addEventListener('click', (e) => {
        pickPlayer(e)
    })

    li.innerHTML = `${obj.name}`
    ul.appendChild(li)
    
}


function pickPlayer(e){

    let listLi = e.currentTarget
    console.log(listLi)
    
    let itemName = listLi.textContent
    let name = itemName.split(' ')
    // console.log(name)
    let fullObj = dbDummyArray.filter(el => el.name === name[0])


    //check if name has more then one name
    if(name[1] !== 'X'){
        name = `${name[0]} ${name[1]}`
    } else {
        name = `${name[0]}`
    }
    
    if (listLi.getAttribute('flag') === "false") {
        listLi.style.color = "green"
        listLi.innerHTML = `${name} &nbsp; &#10003;`
        listLi.setAttribute('flag', "true") 
        pushPlayerToArrByLevel(name.toLowerCase(), fullObj[0].level)
    } else {
        listLi.style.color = "white"
        listLi.textContent = `${name.toUpperCase()}`
        popPlayerFromList(name.toLowerCase())
        listLi.setAttribute('flag', "false")
    }

}


//when user pick a player,
//the player object is being pushed to array by is level
function pushPlayerToArrByLevel(name, level){

        console.log(dbDummyArray)
        // let fullObj = dbDummyArray.filter(el => el.name === name)        
        // let level = fullObj[0].level
        
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


//pop a player from the list of picked players
function popPlayerFromList(name){

    let cleanName = name.split(" ")

    //get the player level from playerObj
    let fullObj = dbDummyArray.filter(el => el.name === cleanName[0])
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