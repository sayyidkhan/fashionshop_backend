# Database Integrity
- Integrity constraints are a set of rules. they are used to maintain the quality of information.
- integrity constraints ensure that data insertion, updating and other processes have to be performed that data integrity is affected.
- Integrity constraints are used to guard against accidental damage to the database.

### types of integrity constraints
#### 1. Domain constraint
Data column constraints are listed below.
- id's are auto created and generated upon insertion of new records

##### database name: fashionshop
##### table name: product

| Name        |   Data Type  |  Nullable | Default Value |
|-------------|:------------:|----------:| -------------:|
| id          | INT          |No         |AUTO INCREMENT |
| name        | CHAR(60)     |No         |''             |
| description | CHAR(200)    |No         |''             |
| price       | DECIMAL(8,2) |No         |0.00           | 

##### description of product table

| Name        |   Description                         |
|-------------|:-------------------------------------:|
| id          | id of product                         |
| name        | name of product                       |
| description | describe which category it belongs to |
| price       | price of the product                  |

##### sql create table script

```mysql
# create table script for product
CREATE TABLE product (
id           INT           NOT NULL AUTO_INCREMENT,
name         CHAR(60)      NOT NULL DEFAULT '',
description  VARCHAR(200)  NOT NULL DEFAULT '',
price        DECIMAL(8,2)  NOT NULL DEFAULT 0.00,
PRIMARY KEY  (id));
```

#### 2. entity integrity constraint

- no null values are used in the table (all values are required to be inserted at the point of record creation)
- no foreign keys are used in this project within the other table columns specified above

#### 3. referential integrity constraint
To update referential integrity constraint when foreign key is used in the project.

- Not Applicable

#### 4. key constraint

- all id's used in the product table are unique keys
- it is not allowed to insert two id's of the same value in the column id to maintain database integrity
- it is allowed that two or more products with the same name but referring to the same id due to to differentiate between two prices (one is on sales and one is isnt) 