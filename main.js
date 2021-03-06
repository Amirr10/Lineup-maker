let item = document.querySelector('.item')
let rightList = document.querySelector('.right-list')
let shuffleBtn = document.querySelector('.btn')
let playerBtn = document.querySelectorAll('.player-btn')
let ul = document.querySelector('.ul-list')
let shuffleBtnWrap = document.querySelector('.shuffle-btn')
let edit = document.querySelector('.edit')
let addPlayerBtn = document.querySelector('.add-player-btn')
let copyBtn = document.querySelector('.copy')
let editList = 0
let flag = 0
let unMarkFlag = 0

let dbDummyArray
let pickedPlayers = [
    [], [], [], [], [], []          //Level A, B, C, D
                    //Level A+, A, B+, B, C+, C
]


//return player full name
function getPlayerNameByName(arr){
    let name = arr
    let blank = name[1].trim()    

    if(arr[1] === "X" || arr[1] === "" || arr[1] === "XName" || blank === "") {
         name = arr[0]
    } else {
         name = arr[0] + ' ' + arr[1]
    }

    let obj = dbDummyArray.filter(el => el.name === name)
    return obj[0].name
}


function getPlayerLevelByName(name){
    let obj = dbDummyArray.filter(el => el.name === name)
    return obj[0].level
}

function getPlayerObjectByName(name){
    let obj = dbDummyArray.filter(el => el.name === name)
    return obj[0]
}

//sorting player list by level
function sortByLevel(a, b) {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    return 0;
}

//load list on loading
window.addEventListener('DOMContentLoaded', () => {
    displayPlayerList()
})


//display list on the left
function displayPlayerList(){

    //fetch data from mongodb
    fetch('https://lineup-picker.herokuapp.com/')
        .then(res => res.json())
        .then(data => {
            
            dbDummyArray = data.sort(sortByLevel)

            console.log(dbDummyArray,'dbdummyarrayyyy')
            
            dbDummyArray.forEach((obj) => {

                let li = document.createElement('li')
                li.className = 'li-item'
                li.setAttribute('flag', 'false')

                
                li.addEventListener('click', (e) => {
                    if(!editList){
                        pickPlayer(e)
                    }
                })

                li.addEventListener('mouseover', (e) => {
                    displayLevel(e)
                })

                li.addEventListener('mouseout', (e) => {
                    unDisplayLevel(e)
                })

                li.innerHTML = `<p>${obj.name}</p> <button class=del-btn>X</button>`
                ul.appendChild(li)
            })

        })
}


addPlayerBtn.addEventListener('click', () => {
    showAddPlayerMenu()
})

//toggle btn to show/hide adding players to the list
function showAddPlayerMenu(){

    let inpWrapper = document.querySelector('.input-wrapper')
    let levelDesc = document.querySelector('.level-desc')

    //desktop view
    if(window.screen.width > 425){
        if(inpWrapper.style.display === 'grid'){
            inpWrapper.style.display = "none"
            levelDesc.style.display = "none"
        } else {
            inpWrapper.style.display = "grid"
            levelDesc.style.display = "flex"
        }
        
    //mobile view
    } else {
        //move shuffle button down func on mobile view
        if(inpWrapper.style.display === 'flex'){
            inpWrapper.style.display = "none"
            levelDesc.style.display = "none"
        } else {
            inpWrapper.style.display = "flex"
            levelDesc.style.display = "flex"

        }
    }
    
} 



//add players to each level
playerBtn.forEach(element => {
    element.addEventListener('click', () => {
        let inputField = element.previousElementSibling

        if(inputField.className === "inputA+" && inputField.value !== ''){
            addPlayerToDB(inputField.value, 'A+')

            dbDummyArray.push({name: inputField.value, level:'A+'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputA" && inputField.value !== ''){
            addPlayerToDB(inputField.value, 'A')

            dbDummyArray.push({name: inputField.value, level:'A'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }


        if(inputField.className === "inputB+" && inputField.value !== ''){
            addPlayerToDB(inputField.value, 'B+')

            dbDummyArray.push({name: inputField.value, level:'B+'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputB" && inputField.value !== ''){
            addPlayerToDB(inputField.value, 'B')

            dbDummyArray.push({name: inputField.value, level:'B'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }

        
        if(inputField.className === "inputC+" && inputField.value !== ''){
            addPlayerToDB(inputField.value, 'C+')

            dbDummyArray.push({name: inputField.value, level:'C+'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
        if(inputField.className === "inputC" && inputField.value !== ''){
            addPlayerToDB(inputField.value, 'C')

            dbDummyArray.push({name: inputField.value, level:'C'})
            displayAddedPlayer(dbDummyArray[dbDummyArray.length-1])
            inputField.value = ''
        }
        
    })
});


//send post request with name and level to db, and save user in db
function addPlayerToDB(value, level){

    fetch('https://lineup-picker.herokuapp.com/post', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: value, level: level })
            })
}

//remove player from DB by name
function removePlayerFromDb(name){

    fetch('https://lineup-picker.herokuapp.com/delete', {
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


//edit function that let you delete players
function editPlayers(){
    //get list element of del-btn class
    let delBtn = ul.querySelectorAll('.del-btn')

    // loop thorugh list of names and display del-btn
    delBtn.forEach(btn => {
        btn.style.visibility = 'visible'

        btn.addEventListener('click', () => {
            let nameArr = btn.parentElement.textContent.split(' ')
            let name = getPlayerNameByName(nameArr)

            //remove from db
            removePlayerFromDb(name)

            //remove from dom and from playerlist
            ul.removeChild(btn.parentElement)

            popPlayerFromList(name)
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
    })    

    // let copyWrapper = document.querySelector('.copy-wrap')
    // copyWrapper.style.display = 'none'
}


//remove all players from pickedPlayer[] and unMark them
function unMarkPlayerList(){
     unMarkFlag = 1

    pickedPlayers.forEach((list,i) => {
      list.splice(0, list.length)
    })


    let liItem = ul.querySelectorAll('.li-item')
    liItem.forEach(item => {
        let itemName = item.textContent
        
        let nameArr = itemName.split(' ')
        let name = getPlayerNameByName(nameArr)

        item.style.color = "white"
        item.textContent = `${name}`
        item.setAttribute('flag', "false")
        item.innerHTML = `<p>${name}</p> <button class=del-btn>X</button>`
        item.lastChild.style.visibility = 'visible'  
    })
}


//showing player rank when hovering on a player in player list
function displayLevel(e){
    let newName
    let li = e.currentTarget
    let name = li.textContent.split(' ')

    newName = getPlayerNameByName(name)
    let level = getPlayerLevelByName(newName)


    let btn1 = li.querySelector('.del-btn')
    let div = document.createElement('div')
    div.className = "box"
    div.innerHTML = `<p>Name - ${newName}
                     <br> Level - ${level}</p>`

    li.append(div)
    div.style.visibility = 'visible'
}

//remove display box when mouse leave player name
function unDisplayLevel(e){
        let li = e.currentTarget
        let div = li.querySelector('.box')
        li.removeChild(div)    
}


//shuffle every level seperatly
function shufflePlayers(){

    //Check if there are too many players
    let totalPlayers = checkSumPlayers()
    if(totalPlayers > 21){
        alert(`${totalPlayers} players, Too many !`)
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

    }

}


//Check total number of players
function checkSumPlayers(){
    let sum = 0

    pickedPlayers.map((array, arrayNum) => {
       sum += array.length
    })
    return sum
}


//random between 3 numbers
shuffleBtn.addEventListener('click', shuffle)

//display teams in order and call shufflePlayers func
function shuffle(){

    let inputWrapper = document.querySelector('.input-wrapper')
    let levelDesc = document.querySelector('.level-desc')
    let copyWrapper = document.querySelector('.copy-wrap')

    levelDesc.style.display = "none"
    inputWrapper.style.display = "none"

    
    if(flag > 0){
        let teams = document.querySelector('.teams').childNodes

        for (let i = 0; i < 3; i++) {
            let element = document.querySelector(`.team${i+1}`)
            element.innerHTML = `<div class="team${i}"><h1 class="class-h1">Team ${i+1}</h1></div>`
        }

    }

  
        //check if all no player was picked, if pickedPlayers arr is not empty
        //show copy button
        let checkEmptyArrays = pickedPlayers.every(arr => arr.length === 0)
        if(checkEmptyArrays){
            copyWrapper.style.display = "none"
        } else {
            copyWrapper.style.display = "block"
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

    li.innerHTML = `${obj.name} &nbsp;`
    ul.appendChild(li)   
}


//mark player that was picked and and insert to pickedPlayer array 
//or delete from array
function pickPlayer(e){

    let listLi = e.currentTarget
    
    let itemName = listLi.textContent
    let regex = /(?!XName)\S+/gi
    let cutReg = itemName.match(regex)
    let name

    if (cutReg.length > 1) {
        if (cutReg[1] === '-' || cutReg[1] === 'Name' || cutReg[1] === "✓" || cutReg[1] === "✓Name") {
            name = cutReg[0]
        } else {
            name = cutReg[0] + ' ' + cutReg[1]
        }
    } else {
        name = cutReg[0]
    }
   
    let fullObj = dbDummyArray.filter(el => el.name === name)

    //check if name has more then one name
    let newName = fullObj[0].name
    
    if (listLi.getAttribute('flag') === "false") {
        listLi.style.color = "#65FF33"
        listLi.innerHTML = `<p>${newName}</p> &nbsp; &#10003;  `
        listLi.setAttribute('flag', "true") 
        pushPlayerToArrByLevel(newName, fullObj[0].level)
    } else {
        listLi.style.color = "white"
        listLi.innerHTML = `<p>${newName}</p> &nbsp;`
        popPlayerFromList(newName)
        listLi.setAttribute('flag', "false")
    }

}


//when user pick a player,
//the player object is being pushed to array by is level
function pushPlayerToArrByLevel(name, level){
        
        if(level){
            if (level === 'A+') {
                pickedPlayers[0].push(name)
            }
            if (level === 'A') {
                pickedPlayers[1].push(name)
            }
            if (level === 'B+') {
                pickedPlayers[2].push(name)
            }
            if (level === 'B') {
                pickedPlayers[3].push(name)
            }
            if (level === 'C+') {
                pickedPlayers[4].push(name)
            }
            if (level === 'C') {
                pickedPlayers[5].push(name)
            }
        }

}


//pop a player from the list of picked players
function popPlayerFromList(name){

    let cleanName = name.split(" ")

    //get the player level from playerObj
    let fullObj = dbDummyArray.filter(el => el.name === name)
    let level = fullObj[0].level

    //filter the array with the level of the player from pickedPlayers array
    if(level){
        if (level === 'A+') {
            pickedPlayers[0] = pickedPlayers[0].filter(player => player !== name)
        }
        if (level === 'A') {
            pickedPlayers[1] = pickedPlayers[1].filter(player => player !== name)
        }
        if (level === 'B+') {
            pickedPlayers[2] = pickedPlayers[2].filter(player => player !== name)
        }
        if (level === 'B') {
            pickedPlayers[3] = pickedPlayers[3].filter(player => player !== name)
        }
        if (level === 'C+') {
            pickedPlayers[4] = pickedPlayers[4].filter(player => player !== name)
        }
        if (level === 'C') {
            pickedPlayers[5] = pickedPlayers[5].filter(player => player !== name)
        }
        
    }

}



//call copy function
let copyToClip = document.querySelector('.copy')
copyToClip.addEventListener('click', () => {
    copyTeamsToClipboard()
})


//copy all the teams inorder for displaying them in whatsapp
function copyTeamsToClipboard(){
    
    let div = setTeamsIntoDiv()
    
    let copyWrapper = document.querySelector('.copy-wrap')
    let wrapper = document.querySelector('.wrapper')
    let input = document.createElement('textarea')
    let copyMsg = document.createElement('span')

    copyMsg.className = 'copy-popup'
    copyMsg.innerHTML = 'הועתק'

    wrapper.appendChild(input)
    input.textContent = div.innerText


    //check if its ios device
    let isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

	if (isiOSDevice) {
	  
		let editable = input.contentEditable;
		let readOnly = input.readOnly;

		input.contentEditable = true;
		input.readOnly = false;

		let range = document.createRange();
		range.selectNodeContents(input);

		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);

		input.setSelectionRange(0, 999999);
		input.contentEditable = editable;
		input.readOnly = readOnly;

	} else {
	 	input.select();
	}

    document.execCommand('copy');

    input.remove()


    //display popup copy msg for 1 second
    copyWrapper.append(copyMsg)
    setTimeout(() => {
        copyMsg.remove()
    }, 1000);
}


//organize teams into div before copy 
function setTeamsIntoDiv(){
    
    let team1, team2, team3
    let text = document.querySelector('.teams').children

    text[0].childNodes.forEach(name => team1 +=  ' ' + name.textContent)
    text[1].childNodes.forEach(name => team2 +=  ' ' + name.textContent)
    text[2].childNodes.forEach(name => team3 +=  ' ' + name.textContent)

    let reg = /[^Team 1 2 3 undefined]+/g
    team1 = team1.match(reg)
    team2 = team2.match(reg)
    team3 = team3.match(reg)

    let div = document.createElement('div')
    div.innerHTML = `<p>קבוצה 1 - ${team1}<p/> \n\n <p>קבוצה 2 - ${team2}</p> \n\n <p> קבוצה 3 - ${team3}</p>`
    
    return div
}




let showLevels = document.querySelector('.show-levels-btn')
let modalBg = document.querySelector('.modal-bg')
let modal = document.querySelector('.modal')

showLevels.addEventListener('click', () => {
    modalBg.classList.toggle('bg-active')

    modal.innerHTML = `<span class="exit-modal">X</span>
                        <div class="grid-modal"></div>`
    
    let gridModal = document.querySelector('.grid-modal')

    fetch('https://lineup-picker.herokuapp.com/')
        .then(res => res.json())
        .then(data => {
            
            dbDummyArray = data.sort(sortByLevel)

            console.log(dbDummyArray,'dbdummyarrayyyy')
            
            dbDummyArray.forEach((obj) => {

                let li = document.createElement('li')
                li.className = 'li-item'

                li.innerHTML = `<p class="li-modal">${obj.name} ${obj.level}</p> `
                gridModal.appendChild(li)
            })

            let exitModal = document.querySelector('.exit-modal')
            exitModal.addEventListener('click', () => {
                modalBg.classList.remove('bg-active')
            })
        })
})



//display all players name and level in the middle of the screen
function displayModal(){

}