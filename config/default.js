module.exports = {
    app : {
        port : 5000
    },
    db: {
        host: "localhost",
        port : 3306,
        username :  "root",
        password : "rootroot",
        database : "fashionshop"
    },
    dataset_filename : "clothing_dataset.csv",
    swaggerOptions : {
        title : "FashionShop Backend API",
        description : "API for backend catalog",
        version: "1.0",
        product_api : "Product API",
        pagination_api : "Product Pagination API",
        swagger_api_url : "swagger-ui",
    }
}