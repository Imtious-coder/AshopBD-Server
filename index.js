const express = require('express')
require('dotenv').config()
const bodyParser = require('express')
const cors = require('cors')

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vx9y5.mongodb.net/emaJohn?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = 3001


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("emaJohn").collection("products");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        collection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKey', (req, res) => {
        const productKeys = req.body;
        collection.find({ key: {$in: productKeys} })
        .toArray((err, documents)=>{
            res.send(documents);
        })
    })


    console.log('database conected');
});


app.listen(process.env.PORT || port)