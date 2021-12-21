const stockDB = require("./database/stock.js");
const saleDB = require("./database/sales.js");
const { count } = require("./database/database.js");

var cart = new Array() ; //Store our items in our cart
var saleItem = new Array();
//When the window loads
window.onload = function() {
    stockDB.init();
    saleDB.init();
    populateItems();
}

//Populate the items from the database
function populateItems() {
    stockDB.get({}).then((result) => {
        result.forEach(element => {
            if (!saleItem.some(e => e.name == element.name)){
                saleItem.push(element);
            }
        });
        
        var selectItem = document.getElementById("items");
        saleItem.forEach(element => {
            var create = document.createElement("option");
            create.appendChild(document.createTextNode(element.name));
            create.value = "option value";
            selectItem.appendChild(create);
        });

        //If we have some items show the add sale, otherwise show an error
        if(saleItem.length > 0){document.getElementById("addSale").style.display = "block";}
        else {document.getElementById("addSaleNoItems").style.display = "block";}
        console.log(result);

    }).catch((error) => {
        alert("An error occurred while getting the stock");
        console.log(error);
    });
}
//Add an item to our cart
function addItemToCart() {
    var get = document.getElementById("items");
    var getValue = get.options[get.selectedIndex].text;
    var amount = document.getElementById("amountItems").value;

    //Validate
    if(getValue == ""){showPopup("Whoops!", "Please select an item to add!"); return;}
    if(amount == ""){showPopup("Whoops!", "Please enter an amount of items to add!"); return;}

    //Check that we have enough stock available
    console.log(saleItem);
    stockDB.get({_id: saleItem._id});

    saleItem.forEach(element => {
        if (element.name == getValue){
            if(amount > element.currentStock) {
                showPopup("Whoops!", "Sorry there is not enough stock for that item, there is only " + element.currentStock + " available");
                return;
            }

            cart.push({
                key : element,
                amount 
            });
        }
        });
    console.log(cart);
    populateCartTable();
}  

//Update the table showing the items in our cart
function populateCartTable() {
    document.getElementById("stockTable").innerHTML = "<tr><th>Name</th><th>Description</th><th>Price</th><th>Amount</th><th></th></tr>";
    var get = document.getElementById("items");
    var table = document.getElementById("stockTable");
    var getValue = get.options[get.selectedIndex].text;
    var amount = document.getElementById("amountItems").value;

    var i = 0;
    cart.forEach(element => {
        var row = table.insertRow(1);
        row.insertCell(0).innerHTML = element.key.name;
        row.insertCell(1).innerHTML = element.key.description;
        row.insertCell(2).innerHTML = element.key.price;
        row.insertCell(3).innerHTML = element.amount;
        row.insertCell(4).innerHTML = "<button onclick=" + "'removeItem(" + '"' + i + '"' + ")'" + ">Remove</button>";
        i++;
    });

    var oRows = document.getElementById("stockTable").getElementsByTagName("tr");
    var iRowCount = oRows.length -1 ;
    var countCart = document.getElementById("countcart");
    countCart.innerHTML = iRowCount ;

    var totalPrice = document.getElementById("totalprice");
    let sumValue = Array.from(table.rows).slice(1).reduce((total, row) => {
        return total += parseFloat(row.cells[2].innerHTML) * parseFloat(row.cells[3].innerHTML);
    }, 0);
    totalPrice.innerHTML = "$" + sumValue.toFixed(2);
}

//When we click add sale add our sale to the database
function addSale() {
    var items = {};
    for(var i in cart) {
        items[cart[i].key._id] = parseInt(cart[i].amount);
    }
    saleDB.add(items, stockDB).then((result) => {
        showPopup("Sale Added!", "Your sale was completed!").then(() => {
            window.location.reload();
        });
    }).catch((error) => {
        showPopup("Something happened", "Sorry your sale was not added");
        console.log(error);
    });
}

//Remove an item from our cart
function removeItem(index) {
    cart.splice(index, 1);
    populateCartTable();
}