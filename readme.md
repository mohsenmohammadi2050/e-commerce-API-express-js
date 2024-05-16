# Exam Project

# Project Description:

This project aims to construct a back-end system featuring an admin interface for an e-commerce website. The project contains two primary sections: an API designed to fetch data from the database and an Admin interface for data manipulation in the front end.

# INSTALLATION INSTRUCTIONS:

To run this app, clone the repository or download the zip file, and install dependencies:

1. git clone https://github.com/noroff-backend-1/jan23-ft-ep1-mohsenmohammadi2050.git

3. Go to the files location: cd 'write the Folder name which has been created after cloning'

4. npm install

5. create a **_.env file_** in **_the main folder_** with the information provided in the example env file below:

-   ADMIN_USERNAME = "username1234"
-   ADMIN_PASSWORD = "password1234"
-   DATABASE_NAME = "exam2"
-   DIALECT = "mysql"
-   DIALECTMODEL = "mysql2"
-   PORT = "3000"
-   HOST = "localhost"
-   TOKEN_SECRET = "your token secret"
-   ADMIN_FIRSTNAME_INIT = "Admin"
-   ADMIN_LASTNAME_INIT = "Support"
-   ADMIN_USERNAME_INIT = "Admin"
-   ADMIN_EMAIL_INIT = "admin@noroff.no"
-   ADMIN_PASSWORD_INIT = "P@ssword2023"
-   ADMIN_ADDRESS_INIT = "Online"
-   ADMIN_PHONENUMBER_INIT = "911"

### how to create a token secret

-   In the powershell, run the node by typing node and enter
-   copy and paste the following command into the node: **require('crypto').randomBytes(64).toString('hex')**
-   copy created string and paste it the .env file for TOKEN_SECRET field.

### admin credentials

The credentials provided in the .env file will be used for adding an admin user into the users table in the database. You can change them with your own credentials.

5. Go to the Mysql Workbench and create your database by running the following command:

Create database exam2;

6. In the Mysql Workbench, create a User with all the necessary permissions and privileges for your database. The sql query below can be used. (**Note.** If you create your desired names for the database and User, You need to put them in the Environment Variables as ADMIN_USERNAME, ADMIN_PASSWORD and DATABASE_NAME)

-   USE exam2;
-   CREATE User 'username1234'@'localhost' IDENTIFIED BY 'password1234';
-   GRANT ALL PRIVILEGES ON exam2.\* TO 'username1234'@'localhost' WITH GRANT OPTION;

7. Start the server by typing **npm start**

# USAGE GUIDELINES:

## Swagger documentation

A Swagger document has been generated outlining API routes. To access the API documentation, please visit http://localhost:3000/doc before engaging with any API routes. The Swagger documentation provides details on all created routes, along with explanations and examples demonstrating how to utilize them. Additionally, I included some guidelines and explanations below for further clarity.

## init route

After running the application, nine tables are automatically created in the database. To populate the database with dummy data, send a POST request to the 'http://localhost:3000/init/' route. This endpoint is designed to insert sample data into various tables, including **roles**, **memberships**, **statuses**, **brands**, **categories**, **products**, and **users**. Sending multiple requests won't duplicate records but can update existing data or introduce new entries if manual modifications have been made. For instance, altering a product's name and subsequently sending a new request to the 'init' route will reinsert the previously updated product under its old name. Additionally, if a record has been deleted (with a soft delete implemented), the route will restore the record upon receiving another request. 

**Note:** It might be a good idea to restrict users from making more requests than one. However, allowing users to send multiple requests can be useful if they've deleted a record entirely from the database. If a user wants to re-insert the deleted record, doing so manually can be bothersome. Sending a new request to the init route will automatically insert the missing record back into the database. 

## Folders

Here are explanations for some important functionalities and implementations. However, not all functionalities are covered here. Please refer to the Swagger documentation to test all routes and their respective functionalities.

### Middlewares:

Contained within the "middlewares" folder are two directories: **auth** and **validators**, serving the purposes of authorization and validation for both the back-end API and front-end routes. The "auth" folder contains three js files: **_isAuth_**, **_isAdmin_**, and **_isAdminLoggedIn_**. The **_isAuth_** file manages authorization for registered users, restricting access solely to authorized users for specific routes, while others such as admin or guests are denied access. Similarly, the **isAdmin** file handles authorization for admin users, whereas **isAdminLoggedIn** manages authorization within the front-end (admin interface routes). This middleware denies access to users or guests for the front-end routes and verifies whether the admin is logged in.

The 'validators' folder contains validators dedicated to API routes. These validators are imported into the route files and serve as middleware, responsible for validating data sent to these routes.

### Models:

This folder comprises models representing the database tables. Sequelize library is utilized for defining models and their respective fields. Further details about tables and their relationships will be provided in the reflection PDF file, discussing the database tables.

In total, there are nine models corresponding to the database tables. Below is a list of these defined models:

-   brand
-   category
-   item
-   membership
-   order
-   product
-   role
-   status
-   user

**Order and Cart:** I received permission from the instructor to modify one of the requirements outlined in the instructions. Upon running the application, you'll notice that I've defined **_four_** statuses for the order in the status table, whereas the instructions specify only **_three_** statuses. The rationale behind this alteration is the close relationship between orders and carts, sharing almost identical fields and relationships in the database. By introducing an additional status named **_Not-checkout_** to the status table, we can easily differentiate between orders and carts, avoiding the necessity of defining two separate tables for user carts and orders. This approach saves both memory and time since there's no need to maintain a separate table for user carts. Additionally, comprehending the relationships between orders, carts, and items within the database becomes more straightforward. Consequently, when users wish to add items to their cart, an order marked with the status **_Not-checkout_** is created in the order table. The **_Not-checkout_** status designates an order as a cart before the checkout process. Upon checkout, the status transitions from **_Not-checkout_** to **_In-progress_**, signifying the conversion of a cart to an order. Furthermore, it's pertinent to note that each user can possess only one cart at any given time but can have multiple orders with various statuses like **_In-progress_**, **_Ordered_**, or **_Completed_**. The items within carts and orders will be stored in a separate table labeled **items**. An item includes two crucial fields, **_isDeleted_** and **_isPurchased_**, alongside other essential attributes like product ID, quantity, and unit price. Upon adding an item to the cart, the **_isDeleted_** and **_isPurchased_** fields hold a boolean value of **_false_**. When a user proceeds to checkout their cart, all items within the cart transition to **_true_** for the **_isPurchased_** field. Moreover, users can delete an item from the cart, resulting in the **_isDeleted_** field reflecting a **_true_** value, indicating that the item will not be purchased by the user.

**Cart:** Users have exclusive access to view, add, and modify items in their cart, including adjusting quantities and removing items. Deleting items from the cart is also restricted to users.

**Items:** A separate table is created specifically for items. When users add an item to their cart, a corresponding entry is made in this table. While an item is in the cart, users can update its quantity or delete it. However, once the cart is checked out, modifications or deletions are no longer possible. Additionally, the unit price of items automatically updates if the price of the associated product changes. Furthermore, membership discounts are calculated and applied to the unit prices based on the user's membership status. The system restricts duplicate items, if a user attempts to add the same item to the cart, the quantity of the selected item is incremented. For example, if a user already has an item with a quantity of 2 in their cart and wants to add the same item with a quantity of 3, the quantity of the selected item will increase to 5.

There are also two GET routes(inside the carts route) exclusively for admin access to view all purchased or deleted items. This functionality is also accessible through the admin interface.

**Note:** All routes for items and carts are put together in the carts js file(inside the routes folder). There isn't a different route js file just for items because carts and items are closely linked.

**Order:** Orders have a soft delete function and a corresponding route. Only admin have the authority to delete orders that have reached the **Completed** status. Orders labeled as 'In-progress' or 'Ordered' cannot be deleted. Additionally, only admin can modify the status of an order. Users can solely view their orders without the ability to delete or modify them. Furthermore, there's an admin-exclusive route to retrieve all orders and their respective items for all users. It's clear that only users have the capability to proceed with the checkout process.

**Products:** Following the instructions, a soft delete feature is included for products. In addition to the regular product routes, there's an extra update route dedicated to restoring deleted products. This restoration function requires providing the product's ID in the URL path.
The application enforce uniqueness in product names, allowing two products to share identical values for all other properties but not the same name. Furthermore, a product which is deleted (soft delete) can not be added to a cart. The brands and categories assigned to a product cannot be deleted even if the product is marked as deleted. This is due to the possibility of restoring a product after deletion, and once restored, a product cannot have null values for its brand or category.

**Note:** The discount field hasn't been applied to products; instead, it's implemented for items added to a cart based on the user's membership. The instructions didn't clearly mention this field for products, even though the example picture shows a discount field for products. I realized this issue late, so it hasn't been implemented.

**Role, Status, Membership:**
I've extended a soft delete feature across all these tables by incorporating an 'isDeleted' field within them. Although the instructions didn't explicitly call for soft deletes in these tables, I believed it crucial for code and script consistency. This addition ensures that even after records are deleted, the application continues to function smoothly. The application relies on IDs created by the 'init' route and stored in these tables. Complete deletion of the records could potentially disrupt the application. For instance, if admin accidentally deletes the Gold membership record before any user achieves this membership, the application will crash when a user attempts to reach this membership because the system relies on the corresponding Id for its functionality. However, with the soft delete mechanism in place, the application remains stable after deletion. Furthermore, the system prohibits and prevents the existence of duplicate names in roles, statuses, and memberships. Access to these tables is exclusively granted to admin.

**User:** I've implemented a soft delete feature for the user table by introducing an 'isDeleted' attribute. This addition enables us to retain order and item records associated with users, allowing them the option to view their orders even after their account has been deleted. It's worth noting that only users possess the ability to delete their accounts, initiated by sending a DELETE request to the designated API route outlined in the Swagger documentation.

Users are unable to delete their accounts if there are any pending orders marked as 'ordered' or 'in-progress'. Account deletion is only permitted when all user-created orders have reached a 'completed' status. Furthermore, upon account deletion, the user's cart and individual items will be flagged as 'deleted' (soft delete) in the database.

In the event a user attempts to create a new account using the same username and email, they'll receive a message indicating the possibility of restoring their old account. However, the account restoration process isn't implemented in this project. Instead, users will receive a notification prompting further authentication via email to initiate the account restoration process.

**Signup and login:** The signup and login processes each have their dedicated URL addresses. Guest users can sign up by sending a POST request to the API with the required credentials (as detailed in the Swagger documentation) and will receive a 'User' role upon successful signup. Subsequently, signed-up users can log in using their email and passwords. It's important to note that usernames and emails must be unique; otherwise, an error will be returned.
Note that there's no endpoint implemented to create an admin user through a POST request to the signup endpoint. However, admin have the capability to change a user's role by sending a PUT request to the API. This functionality can be executed via Postman or directly from the admin interface.

For detailed insights into other models, please refer to either the model JavaScript files or inspect the database tables.

## Routes and routerFunctions

You'll notice two folders handling the API routes: **Routes** and **RouterFunctions**. **Routes** deals with checking requests and sending back responses, while **RouterFunctions** manages the main operations and error handling for these routes. I split them because some routes need a lot of work, and keeping everything in one place might make things messy. It's easier to understand when we separate the complicated bits into a different folder and then import them as needed into the **Routes** folder.

**Note**: It's important to note that a few routes, such as login and sign up, lack a 'RouterFunction' within the **RouterFunctions** folder. This is due to encountered issues associated with the crypto module. It appears that the crypto module functions exclusively within the **Routes** folder, causing limitations in its use across other directories.

**admin folder**: In the **Routes** folder, there's a separate folder named **_admin_**. It's dedicated to managing routes for the admin interface. This section interacts with the API routes solely through GET requests. When handling admin routes, it retrieves data from the API and displays it using ejs files found in the views folder. For other actions like POST, PUT, and DELETE, the requests are sent directly to the API using plain JavaScript files located in the public directory.

**JSONWEBTOKEN**: Authentication and authorization handled using JSONWEBTOKEN. To access the admin interface, the admin must log in. When you run the application, visit 'http://localhost:3000/admin/auth/login' to log in. Without logging in or having a 'User' or 'Guest' role, you won't be able to access any pages, including the main page.

Once logged in, the JSONWEBTOKEN is sent from the API to the 'admin/auth/login' route and decoded. It's stored in both localStorage and cookies for different purposes:

-   Decoded in the login route to send the 'user' object to ejs files.
-   Stored in localStorage for vanilla JavaScript files to use when making direct requests like POST, PUT, and DELETE to the API.
-   Stored in cookies for authorization using the 'isAdminLoggedIn' middleware. This middleware checks if the admin is logged in and has the correct 'Admin' role. If not, access to the routes is denied.

**Note**: The admin interface includes a logout feature. Clicking the sign-out button removes the JSONWEBTOKEN from both localStorage and cookies.

To explore the admin interface and its functionalities, log in using the admin credentials generated by the **init** route. Navigate through different pages by clicking the buttons on the navbar. The admin interface is not designed responsive unfortunately, but it is user-friendly, I think. Modals, provided by Bootstrap, will display error or success messages for easy understanding and operation.

## Utils

This directory contains a JavaScript file responsible for generating random numbers used in orders. It's imported into the cartFunctions within the routerFunctions folder.

## Public

Contained here are two subdirectories for JavaScript functions and CSS styles. The CSS code remains minimal in this project. I've incorporated jQuery and Bootstrap CDNs alongside vanilla JavaScript to manage form handling, errors, and HTML page styling.

## Services

This folder holds essential service files required for data manipulation within the database.

## views

This directory stores all EJS files specifically designed for the admin interface.

# Libraries/Packages

-   "axios": "^1.6.2",
-   "cookie-parser": "~1.4.4",
-   "crypto": "^1.0.1",
-   "debug": "~2.6.9",
-   "dotenv": "^16.3.1",
-   "ejs": "^3.1.9",
-   "express": "^4.18.2",
-   "http-errors": "~1.6.3",
-   "jest": "^29.7.0",
-   "jsend": "^1.1.0",
-   "jsonwebtoken": "^9.0.2",
-   "morgan": "~1.9.1",
-   "mysql": "^2.18.1",
-   "mysql2": "^3.6.3",
-   "sequelize": "^6.35.1",
-   "supertest": "^6.3.3",
-   "swagger-autogen": "^2.23.7",
-   "swagger-ui-express": "^5.0.0"

In addition, Jquery and Bootstrap are used for this project using cdns.

# NodeJS Version Used

v18.16.1


