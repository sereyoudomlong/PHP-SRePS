const salesDB = require("./database/sales.js");
const employeeDB = require('./database/employee')
const customerDB = require('./database/customer')

window.onload = () => {
    console.log('loaded')
    salesDB.init()
    employeeDB.init()
    customerDB.init()

    document.getElementById("dateWeekly").addEventListener("input", () => {
        showWeeklySales();
    });
    document.getElementById("datemonth").addEventListener("input", () => {
        showMonthlySales();
    });
}

const showMonthlySales = async () => {
    
    // get value of data input 
    const monthSelector = document.getElementById('datemonth')
    const month = monthSelector.valueAsDate.getMonth()
    const year = monthSelector.valueAsDate.getYear()

    const allSales = await salesDB.get()

    const allEmployees = await employeeDB.get()

    const allCustomers = await customerDB.get()

    //get all sales orders and filter by date
    const salesByMonth = allSales.filter((saleItem) => {

        const saleItemDate = new Date(saleItem.date)
        
        return saleItemDate.getMonth() == month && saleItemDate.getYear() == year
    })

    document.getElementById("monthlyTable").innerHTML = "<tr><th>Date</th><th>Item Count</th><th>Employee</th><th>Customer</th><th>Price</th><th></th><th></th></tr>";

    salesByMonth.forEach((saleItem) => {
        //get employee
        const filteredEmployees = allEmployees.filter((employee) => {
            return employee._id == saleItem.employeeId
        })

        //get customer
        const filteredCustomers = allCustomers.filter((customer) => {
            return customer._id == saleItem.customerId
        })

        //for each sale item - append to table
        const tableReference = document.getElementById('monthlyTable').getElementsByTagName('tbody')[0]

        const newRowToAdd = tableReference.insertRow(tableReference.rows.length);

        newRowToAdd.innerHTML = `
        <tr>
            <td>${saleItem.date.toLocaleDateString()}</td>
            <td>${Object.keys(saleItem.items).length}</td>
            <td>${filteredEmployees[0].firstName}</td>
            <td>${filteredCustomers[0].firstName}</td>
            <td>${saleItem.totalCost}</td>
            <td><button onclick="window.location.href = './modifySale.html?id=${saleItem._id}'">Edit</button></td>
            <td><button onclick="removeSale('${saleItem._id}')">Remove</button></td>
        </tr>
        `
    })
    console.log('clicked', salesByMonth)
}

const showWeeklySales = async () => {
    //get value of date input
    const weekSelector = document.getElementById('dateWeekly')

    const selectedDate = weekSelector.valueAsDate

    //receiving data from db
    const allSales = await salesDB.get()
    const allEmployees = await employeeDB.get()
    const allCustomers = await customerDB.get()

    const sales = [
        {
            sale: 1
        },
        {
            sale: 1
        }
    ]

    //filter all sales by wekk + 7 days
    salesByWeek = allSales.filter((saleItem) => {
        const currentDate = new Date(selectedDate)
        
        const dateInSevenDaysTime = new Date(selectedDate)
        dateInSevenDaysTime.setDate(dateInSevenDaysTime.getDate() + 7);

        const saleItemDate = new Date(saleItem.date)

        return (saleItemDate >= currentDate && saleItemDate <= dateInSevenDaysTime)
    })

    document.getElementById("weeklyTable").innerHTML = "<tr><th>Date</th><th>Item Count</th><th>Employee</th><th>Customer</th><th>Price</th><th></th><th></th></tr>";

    //add new table row elements for each item that was returned 
    salesByWeek.forEach((saleItem) => {
        // get employee
        const filteredEmployees = allEmployees.filter((employee) => {
            return employee._id == saleItem.employeeId
        })

        //get customer 
        const filteredCustomers = allCustomers.filter((customer) => {
            return customer._id == saleItem.customerId
        })
        //for each sale item, append to table
        const tableReference = document.getElementById('weeklyTable').getElementsByTagName('tbody')[0]
        const newRowToAdd = tableReference.insertRow(tableReference.rows.length);

        newRowToAdd.innerHTML = `
        <tr>
            <td>${saleItem.date.toLocaleDateString()}</td>
            <td>${Object.keys(saleItem.items).length}</td>
            <td>${filteredEmployees[0].firstName}</td>
            <td>${filteredCustomers[0].firstName}</td>
            <td>${saleItem.totalCost}</td>
            <td><button onclick="window.location.href = './modifySale.html?id=${saleItem._id}'">Edit</button></td>
            <td><button onclick="removeSale('${saleItem._id}')">Remove</button></td>
        </tr>
        `
    })
}

//Remove a sale
function removeSale(id) {
    salesDB.remove(id).then((result) => {
        showWeeklySales();
        showMonthlySales();
    }).catch((error) => {
        showPopup("Error", "Something happened while deleting that record");
        console.log(error);
    });
}