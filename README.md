# Managing IT Projects - PHP SRePS Project
The aim of this project (PHP-SRePS) is to create an application/system that will
analyse weekly and monthly sales data.

## Environment Setup
To setup the environment for development follow these steps:
1. Install [NodeJS](https://nodejs.org/en/download/)
2. Use the following commands
```
# Clone the repository
git clone https://github.com/haydendonald/Managing-IT-Projects
# Enter the project directory
cd Managing-IT-Projects
# Install dependencies
npm install
# Execute the application
npm start
```

## Database information
### Stock database
Records the current stock levels
| Felid  | Description | Data Type |
| ------------- | ------------- | ------------- |
| _id | The unique id of the item | String |
| name | The name of the item | String |
| description | The description of the item | String |
| price | The price of a singular item | String |
| currentStock | The amount of this item in stock | int |

### Sales database
Records the sales
| Felid  | Description | Data Type |
| ------------- | ------------- | ------------- |
| _id | The unique id of this sale | String |
| date  | The date of the sale  | Date |
| items | A list of the items in the sale | (Items) Object |
| employeeId | The employee id who did the sale | String |
| customerId | The customer id | String |
| totalCost | The final price of the sale | int |

### Employee Database
Records the employee information
| Felid  | Description | Data Type |
| ------------- | ------------- | ------------- |
| _id | The unique id of the employee | String |
| firstName | The first name of the employee | String |
| lastName | The last name of the employee | String |

### Customer Database
Records the customer information
| Felid  | Description | Data Type |
| ------------- | ------------- | ------------- |
| _id | The unique id of the customer | String |
| firstName | The first name of the customer | String |
| lastName | The last name of the customer | String |

## Screenshots
### Main Menu
![Alt text](/screenshot/mainmenu.png?raw=true)
