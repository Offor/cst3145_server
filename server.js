// const bodyParser = require('body-parser');
const express = require('express') //import dependecies
const app = express(); //instance of the dependency


app.use(express.json())
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})


//connect to Mondodb
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://offorb23:Onyedikachi1@cluster0.wdkyh.mongodb.net/', (err, client) => { 
   db = client.db('webstore');
})

//display a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send("Select a collection, e.g., /collection/messages");
})


//get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    
    //console.log('collection name:', req.collection)
    return next()
})

//retrieve all the obects from any
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

//adding post
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if(e) return next(e)
        res.send(results.ops)
    })
})

//return with object id
const ObjectID = require('mongodb').ObjectID;

app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})


//update an object 
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
 })

 
//deleting an object
 app.delete('/collection/:collectionName/:id', (req, res, next) => {
     req.collection.deleteOne(
         {
             _id: ObjectID(req.params.id)
         },
         (e, result) => {
             if(e) return next(e)
             res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
         }
     )
 })
app.listen(3000)