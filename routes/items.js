const express = require('express')
const router = new express.Router()
const items = require("../fakeDb")
const ExpressError = require("../expressError")

router.get("/", (req, res) => {
    res.json({items:items})
})


router.get("/:name", (req, res) => {
    const foundItem = items.find(item => item.name.toLowerCase() === req.params.name.toLowerCase())
    console.log(req.params.name, foundItem)
    if(foundItem === undefined) {
        throw new ExpressError("Item not found", 404)
    }
    return res.json({item:foundItem})

})


router.post("/", function (req, res, next) {
    try {
      if (!req.body.name) throw new ExpressError("Name is required", 400);
      if (!req.body.price) throw new ExpressError("Price is required", 400);
      const newItem = { name: req.body.name, price: req.body.price }
      items.push(newItem)
      return res.status(201).json({ added: newItem })
    } catch (e) {
      return next(e)
    }
  })


router.patch("/:name", function (req, res, next) {
    try{
        const foundItem = items.find(item => item.name.toLowerCase() === req.params.name.toLowerCase())
        if(foundItem === undefined){
            throw new ExpressError("Item not found", 404)
        }
        if(!req.body.price) throw new ExpressError("Price is required", 400)

        foundItem.name = req.body.name;
        foundItem.price = +req.body.price;
        return res.json({updated: foundItem})
    } catch(e){
        return next(e)
    }
  })


router.delete("/:name", function (req, res, next) {
    try{
        const index = items.findIndex( item => item.name.toLowerCase() === req.params.name.toLowerCase())
        if(index === -1){
            throw new ExpressError("Item not found", 404)
        }
        items.splice(index,1)
        return res.json({message: "Deleted"})
    } catch(e){
        return next(e)
    }
  })

module.exports = router;