let billAmount = 0
let tipPercentage = 0
let peopleCount = 1

let totalTipAmount = 0.00
let tipAmountPerPerson = 0.00

let billInputElement = document.getElementById("bill")
let peopleCountElement = document.getElementById("peopleCount")
let customTipElement = document.getElementById("customTip")
let tipPercentageElemtnts = document.getElementsByClassName("tip")

let totalTipAmountElement = document.getElementById("totalTipAmount")
let tipAmountPerPersonElement = document.getElementById("tipAmountPerPerson")
let btnResetElement = document.getElementById("btnReset") 

let errorMessageElement = document.getElementById("errorMessage") 

var pointerToPreviousButton = undefined
var isAppDataDefault = true

//These methods are to make sure that the text cursor is always on the right side
billInputElement.addEventListener('click' ,() =>{
    printBillAmount()
})

peopleCountElement.addEventListener('click' ,() =>{
    printPeopleCount()
})

customTipElement.addEventListener("click", event => {
    if(customTipElement.type === "button"){
        customTipElement.type = "text"
        customTipElement.className = "text-input"
        customTipElement.style.width = "80px"
        customTipElement.value = ""
    }

    if(pointerToPreviousButton === undefined){
        pointerToPreviousButton = event
    }else if(pointerToPreviousButton.path[0].type != "text"){
        pointerToPreviousButton.path[0].className = "tip-amount-item tip"
        pointerToPreviousButton = event    
    }

    isAppDataDefault = false
    handleResetButton()
    printTipPercentage()
    processData()
})

btnResetElement.addEventListener("click", () =>{
    resetApp()
    
    isAppDataDefault = true
    handleResetButton()

})

billInputElement.addEventListener('input' ,() =>{
    var insertedBillAmount = 
            prepareNumberForProcessing(billInputElement.value)

    if(!isNumberValid(insertedBillAmount)){
        printBillAmount()
        console.log("Here")
        billInputElement.setCustomValidity('Not good')
        errorMessageElement.innerText = "You can only enter number!"
        return
    }else{
        billInputElement.setCustomValidity('')
        errorMessageElement.innerText = ""
    }

    /*For some reson calling .lenght return undefined, so 
    I created methot that return string lenght */
    if(getStringLength(insertedBillAmount) > billAmount.toFixed(2).length){
        moveDigitToLeft(insertedBillAmount)
    }else{
        moveDigitToRight(insertedBillAmount)
    }

    isAppDataDefault = false
    handleResetButton()

    printBillAmount()
    processData()
})

peopleCountElement.addEventListener('input' ,() =>{
    let insertedNumber = peopleCountElement.value

    if(insertedNumber === ""){
        return
    }
    if(!isNumberValid(insertedNumber)){
        //Let user know
        console.log("Here people")
        
        peopleCountElement.setCustomValidity('Not good')
        errorMessageElement.innerText = "You can only enter number!"
    }else{
        peopleCountElement.setCustomValidity('')
        errorMessageElement.innerText = ""
    }

    peopleCount = parseInt(insertedNumber)

    if(Number.isNaN(peopleCount)){
        peopleCount = 0
    }

    isAppDataDefault = false

    handleResetButton()
    printPeopleCount()
    processData()
})

//setting events for tip buttons
for (let index = 0; index < tipPercentageElemtnts.length; index++) {
    tipPercentageElemtnts[index].addEventListener("click", event =>{

        tipPercentage = parseInt(event.path[0].value)
        processData()

        if(pointerToPreviousButton === undefined){
            pointerToPreviousButton = event
            event.path[0].className = "tip-amount-item-clicked tip"
            return
        }else if(pointerToPreviousButton.path[0].type === "text"){

            pointerToPreviousButton.path[0].type = "button"
            pointerToPreviousButton.path[0].className = "tip-amount-item"
            pointerToPreviousButton.path[0].value = "Custom"

            event.path[0].className = "tip-amount-item-clicked tip"
            pointerToPreviousButton = event
        }else{
            pointerToPreviousButton.path[0].className = "tip-amount-item tip"
            event.path[0].className = "tip-amount-item-clicked tip"
            pointerToPreviousButton = event
        }
        
        if(event.path[0].type === "text"){
            return
        }

        isAppDataDefault = false
        
        handleResetButton()
    })
}

customTipElement.addEventListener("input", event => {

    if(!isNumberValid(customTipElement.value)){
        console.log("not good")
    }
    
    var tmpTipPercentage = parseInt(customTipElement.value)
    
    if(Number.isNaN(tmpTipPercentage)){
        tipPercentage = 0
    }else if(tmpTipPercentage > 100){
        //tip can not be grater that 100%

    }else{
        tipPercentage = tmpTipPercentage
    }

    isAppDataDefault = false
    
    handleResetButton()
    printTipPercentage()
    processData()
})


resetApp()


function moveDigitToLeft(number)
{
    var array = number.split('.')
    var left = array[0]
    var right = array[1]

    var movingDigit = right[0]
    right = right.substring(1, getStringLength(right))
    
    billAmount = parseFloat(left+ movingDigit + "." + right)
    
}

function moveDigitToRight(number)
{
    var array = number.split('.')
    var left = array[0]
    var right = array[1]

    var leftLenght = getStringLength(left)
    var movingDigit = left[leftLenght -1]

    if(leftLenght-1 === 0){
        left = "0"
    }else{
        left = left.substring(0, leftLenght-1)
    }
    
    billAmount = parseFloat(left + "." + movingDigit + right)
    
}

function getStringLength(string){
    var index = 0

    while(string[index] != undefined){
        index++
    }

    return index
}

function isNumberValid(number){
    let reg = /[0-9]$/g
    /* Return null if there is no match, 
    when user enter letter it will be null*/
    var isLastLetterNumber = reg.exec(number) != null
    var isNumberSafe =  getStringLength(number) <= 15
    return isLastLetterNumber && isNumberSafe
}

function processData(){
    if(peopleCount === 0)
        return
    
    totalTipAmount = billAmount * (tipPercentage / 100)
    tipAmountPerPerson = totalTipAmount / peopleCount
    printResult()
}

function resetApp(){
    billAmount = 0
    tipPercentage = 5
    peopleCount = 1

    totalTipAmount = 0
    tipAmountPerPerson = 0

    printBillAmount()
    printPeopleCount()
    printResult()

    tipPercentageElemtnts[0].click()
}

function printBillAmount(){
    //If you don't remove the previous string, text cursor won't be on the right
    billInputElement.value = "" 
    var numberForPrinting = prepareNumberForPrinting(billAmount.toFixed(2))
    billInputElement.value = numberForPrinting  
}

function printPeopleCount(){
    //If you don't remove the previous string, text cursor won't be on the right
    peopleCountElement.value = ""
    peopleCountElement.value = peopleCount
}

function printTipPercentage(){
    customTipElement.value = ""
    customTipElement.value = tipPercentage
}

function printResult(){
    totalTipAmountElement.innerText = 
        "$" + prepareNumberForPrinting(totalTipAmount.toFixed(2))
    tipAmountPerPersonElement.innerText =
        "$" + prepareNumberForPrinting(tipAmountPerPerson.toFixed(2))
    
}

function prepareNumberForPrinting(number){
    var string = ""
    var numberArray = number.split('.')
    var beforePoint = numberArray[0]
    var afterPoint = numberArray[1]
    var beforeLenght = getStringLength(beforePoint)

    if(beforeLenght <= 3){
        string = number
    }
    else if(beforeLenght >= 4 && beforeLenght <= 6){
        string = beforePoint.substring(0, beforeLenght-3) 
        + " " + beforePoint.substring(beforeLenght-3, beforeLenght)
        + "." + afterPoint 
    }
    else if(beforeLenght >=7  && beforeLenght <= 9){
        string = beforePoint.substring(0, beforeLenght-6) 
        + " " + beforePoint.substring(beforeLenght-6, beforeLenght-3)
        + " " + beforePoint.substring(beforeLenght-3, beforeLenght)
        + "." + afterPoint 
    }
    else if(beforeLenght >=10  && beforeLenght <= 12){
        string = beforePoint.substring(0, beforeLenght-9) 
        + " " + beforePoint.substring(beforeLenght-9, beforeLenght-6)
        + " " + beforePoint.substring(beforeLenght-6, beforeLenght-3)
        + " " + beforePoint.substring(beforeLenght-3, beforeLenght)
        + "." + afterPoint 
    }
    return string
}

function prepareNumberForProcessing(number){
    var string = ""
    var index = 0

    while(number[index] != undefined){
        if(number[index] === ' ' ){
            index++
        }

        string += number[index]
        index++
    }

    return string
}

function handleResetButton(){
    
    btnResetElement.disabled = isAppDataDefault
}