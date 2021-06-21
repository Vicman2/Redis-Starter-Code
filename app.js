const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const redis = require('redis')


app.use(express.json());
app.use(express.urlencoded({extended: true}))

const client = redis.createClient();

// Adds a key-value pair to the DB
app.post('/addPair', (req, res) => {
    const {key, value} = req.body;
    client.set(key, value, (err) => {
        if(err){
            return res.send(false)
        }
        res.send(true)
    })
})

// Gets a key-value pair from the db
app.get("/getPair/:key", (req, res) => {
    const {key} = req.params;
    client.get(key, (err, response) => {
        if(err){
            return res.send(false)
        }
        res.send(response)
    })
})

// Gets an array stored with the key parameter
app.get("/getArray/:key", (req, res) => {
    const {key} = req.params;
    client.lrange(key, 0, -1, (err, response) => {
        if(err){
            return res.send(false)
        }
        res.send(response)
    })
})

// Adds an array to the DB
app.post('/addArray', (req, res) => {
    const {key,array} = req.body;
    client.rpush(key, JSON.stringify(array), (err, response) => {
        if(err){
            return res.send(false)
        }
        res.send(true)
    })
})

// Add an object to the DB
app.get('/getObject/:key', (req, res) => {
    const {key} = req.params;
    client.hgetall(key, (err, response) => {
        if(err){
            return res.send(false)
        }
        res.send(response)
    })
})

// Get Object from the DB
app.post('/addObject', (req, res) => {
    const {key, object} = req.body;
    client.hmset(key, object, err => {
        if(err){
            return res.send(false)
        }
        res.send(true)
    })
})

// Add Expiration
app.post('/addExpiration', (req, res) => {
    const {key, seconds} = req.body;
    client.expire(key, seconds, (err) => {
        if(err){
            return res.send(false)
        }
        res.send(true)
    })
})

app.delete('/removeEntry/:key', (req, res) => {
    const {key} = req.params;
    client.del(key, (err) => {
        if(err){
            return res.send(false)
        }
        res.send(true)
    })
})

client.on('connect', () => console.log("Connected to redis db successfully"))

const port  = process.env.PORT || 2023
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

server.on('error', error => {
    console.log(`Error occured on the server ${error}`)
})