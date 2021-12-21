const stockDB = require("./database/stock.js");
const saleDB = require("./database/sales.js");

//When the window loads
window.onload = function() {
    stockDB.init();
    saleDB.init();
    updateStockLevels();
    saleAnalysis();
}

//Populate the table with the stock levels
function updateStockLevels() {
    stockDB.get({}).then((result) => {
        // Add the table header
        document.getElementById("name").innerHTML = "Name";
        document.getElementById("desc").innerHTML = "Description";
        document.getElementById("price").innerHTML = "Price";
        document.getElementById("stock").innerHTML = "Current stock";
        var table = document.getElementById("stockTable");

        //An array to hold stock info, there should be no duplicate in here
        var items = new Array();

        result.forEach(element => {
            //check if stock item is already in items array
            if (!items.some(e => e.name == element.name)){
                items.push(element); //if not, push in
            }else{
                for (var i = 0; i < items.length; i++){     // if there are dupes, add the stock number together
                    if (items[i].name == element.name){
                        items[i].currentStock += element.currentStock;
                    }
                }
            }
        });
        
        items.forEach(element => {
            // Add row for each element in result from database
            var row = table.insertRow(1);
            var name = row.insertCell(0);
            var desc = row.insertCell(1);
            var price = row.insertCell(2);
            var currentStock = row.insertCell(3);
            var edit = row.insertCell(4);
            var del = row.insertCell(5);
            var id = element._id;
            // Display them
            name.innerHTML = element.name;
            desc.innerHTML = element.description;
            price.innerHTML = element.price;
            currentStock.innerHTML = element.currentStock;
            edit.innerHTML = "<button onclick=" + "editItem('" + id + "')" + ">Edit</button>";
            del.innerHTML = "<button onclick=" + "deleteItem('" + id + "')" + ">Delete</button>";
        });

        showReStock(items);
    });

}

//Show the edit item form
function showEditItem() {
    document.getElementById("editStock").style.display = "block";
    document.getElementById("stockLevels").style.display = "none";
    document.getElementById("saleAnalysis").style.display = "none";
}

//Show the stock levels
function showStockLevels() {
    document.getElementById("editStock").style.display = "none";
    document.getElementById("stockLevels").style.display = "block";
    document.getElementById("saleAnalysis").style.display = "none";
}

//Show sale analysis table
function showSaleAnalysis() {
    document.getElementById("editStock").style.display = "none";
    document.getElementById("stockLevels").style.display = "none";
    document.getElementById("saleAnalysis").style.display = "block";
}

//Edit an item
function editItem(itemId) {
    //Populate the edit fields with the database values
    stockDB.get(itemId).then((result) => {
        document.getElementById("itemName").value = result[0].name;
        document.getElementById("itemDescription").value = result[0].description;
        document.getElementById("itemPrice").value = result[0].price;
        document.getElementById("itemStock").value = result[0].currentStock;
        document.getElementById("id").value = result[0]._id;
        //change button text
        document.getElementById('editadd').textContent = "Save";
        showEditItem();
    }).catch((error) => {
        alert("An error occurred deleting the item");
        console.log(error);
    })
}

//If there is an item id set update it otherwise add the new item
function addItem() {
    //Lets do some validation
    if(document.getElementById("itemName").value == "") {
        showPopup("Whoops!", "Please check the item name again");
        return;
    }
    if(document.getElementById("itemName").value == "" || parseInt(document.getElementById("itemPrice").value) < 0) {
        showPopup("Whoops!", "Please check the item price again");
        return;
    }
    if(document.getElementById("itemName").value == "" || parseInt(document.getElementById("itemStock").value) < 0) {
        showPopup("Whoops!", "Please check the item stock again");
        return;
    }

    var itemId = document.getElementById("id").value;
    if(itemId == "") {
        //Add the item
        stockDB.add(document.getElementById("itemName").value, document.getElementById("itemDescription").value, parseInt(document.getElementById("itemPrice").value), parseInt(document.getElementById("itemStock").value)).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
    }
    else {
        //Update the item
        stockDB.update(itemId, document.getElementById("itemName").value, document.getElementById("itemDescription").value, parseInt(document.getElementById("itemPrice").value), parseInt(document.getElementById("itemStock").value)).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
    }

    window.location.reload();
}

//Delete the item from the database
function deleteItem(itemId) {
    stockDB.remove(itemId).then((result) => {
        location.reload();
    }).catch((error) => {
        alert("An error occurred deleting the item");
        console.log(error);
    })
}

//restock table which take the item array that was created in updateStockLevels
function showReStock(stockItem){
    var table = document.getElementById("stockTableNeedRestock");

    stockItem.forEach(element => {
        if (element.currentStock <= 5){
            var row = table.insertRow(1);
            var name = row.insertCell(0);
            var desc = row.insertCell(1);
            var price = row.insertCell(2);
            var currentStock = row.insertCell(3);
            var edit = row.insertCell(4);
            var del = row.insertCell(5);
            var id = element._id;

            name.innerHTML = element.name;
            desc.innerHTML = element.description;
            price.innerHTML = element.price;
            currentStock.innerHTML = element.currentStock;
            edit.innerHTML = "<button onclick=" + "editItem('" + id + "')" + ">Edit</button>";
            del.innerHTML = "<button onclick=" + "deleteItem('" + id + "')" + ">Delete</button>";
        }
    });
}

// Display item sales and find the best selling item
function saleAnalysis(){
    saleDB.get({}).then((result) => {
        //Array to stock item without duplicate
        var items = [];
        result.forEach(element => {
            for (var key in element.items){
                var itemObject = element.items[key].item;
                var amount = element.items[key].amount;

                if (!items.some(e => e.item.name == itemObject.name)){ // check if item is in array
                    items.push({    // if not push
                        "item" : itemObject,
                        "amount" : amount
                    });
                }else{
                    items.forEach(element => {      // if there is, add the amount
                        if (element.item.name == itemObject.name){
                            element.amount += amount
                        }
                    });
                }
                
            }
        });

        //Create table 
        var table = document.getElementById("saleAnalysisTable");

        var totalRevenue = 0, bestitem = null;  //total revenue and best selling item
        items.forEach(element => {
            var row = table.insertRow(1);
            var name = row.insertCell(0);
            var desc = row.insertCell(1);
            var revenue = row.insertCell(2);
            var sold = row.insertCell(3);

            var itemTotalRevenue = element.item.price * element.amount

            name.innerHTML = element.item.name;
            desc.innerHTML = element.item.description;
            revenue.innerHTML = '$' + itemTotalRevenue;
            sold.innerHTML = element.amount;

            totalRevenue += itemTotalRevenue;   //calculate total revenue

            if (bestitem == null){
                bestitem = element;
            }else{
                if ((bestitem.item.price * bestitem.amount) < (itemTotalRevenue)){      //Replace best item if its revenue is better
                    bestitem = element;
                }
            }
        });

        //display them
        document.getElementById("totalrevenue").innerHTML = totalRevenue || "Unknown";
        document.getElementById("bestItem").innerHTML = bestitem?.item?.name || "Unknown";
    });
}