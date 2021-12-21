const employeeDB = require("./database/employee.js");
const customerDB = require("./database/customer.js");
const salesDB = require("./database/sales.js");
const stockDB = require("./database/stock.js");

window.onload = () => {
   salesDB.init();
   stockDB.init();
   employeeDB.init();
   customerDB.init();

   var items = {};
   stockDB.get({}).then((result) => {
       for(var i in result){items[result[i]._id] = 5;}
    salesDB.add(items, stockDB);
   });
}

function generateCSV(options, data) {
    return new Promise((resolve, reject) => {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        var csvWriter = createCsvWriter(options);
        csvWriter.writeRecords(data).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}
function generateHeader(name) {return {id: name, title: name};}

//Export the data to a CSV file
function exportData() {
    var data = [];
    var save = function() {
        generateCSV(options, data).then(() => {
            showPopup("Success!", "Exported your file successfully!");
        }).catch((error) => {
            showPopup("Something Happened", "An error occurred, sorry..");
            console.log(error);
        });
    }

    switch(document.getElementById("type").value) {
        //Export a entire stock database
        case "stock": {
            var options = {
                path: "stockDB.csv",
                header: []
            };
            stockDB.get({}).then((result) => {
                for(var i in result[0]) {
                    options.header.push(generateHeader(i));
                }

                options.header.push(generateHeader("itemsSold"));
                options.header.push(generateHeader("totalIncome"));

                salesDB.get({}).then((result2) => {
                    for(var i in result) {
                        data.push(result[i]);
                        var sold = 0;
                        var income = 0;

                        for(var j in result2) {
                            for(var k in result2[j].items) {
                                if(result2[j].items[k]._id == result[i]._id) {
                                    sold++;
                                    income += result2[j].items[k].item.price;
                                }
                            }
                        }

                        data[data.length - 1]["itemsSold"] = sold;
                        data[data.length - 1]["totalIncome"] = income;
                    }
                    
                    save();
                });
            });
            break;
        }
        //Export a entire sales database
        case "sales": {
            var options = {
                path: "salesDB.csv",
                header: []
            };
            salesDB.get({}).then((result) => {
                for(var i in result[0]) {
                    options.header.push(generateHeader(i));
                }
                for(var i in result) {
                    var set = "";
                    for(var j in result[i]) {
                        if(j == "items") {
                            for(var k in result[i][j]) {
                                set += "," + result[i][j][k].item.name + "=" + result[i][j][k].amount + "[$" + result[i][j][k].item.price + "]";
                            }
                        }
                    }
                    result[i]["items"] = set;
                    data.push(result[i])
                }
                save();
            });
            break;
        }
    }
}

