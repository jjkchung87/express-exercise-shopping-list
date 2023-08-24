
const express = require('express')
const itemsRoutes = require("./routes/items")
const ExpressError = require("./expressError")

const app = express()
app.use(express.json())
app.use("/items",itemsRoutes)

//404 error handler
app.use((req,res,next) => {
    const e = new ExpressError("Page not found", 404)
    next(e) 
})

//Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    
    return res.json({
        error: err.message,
    })
})

module.exports = app;

