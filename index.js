// implement your API here
const express = require('express')


const db = require('./data/db.js');

const server = express();



server.listen(5000, () => {
    console.log('listening on port 5000')
})

server.use(express.json());

// making a post request to /api/users
// if request body is missing name or bio: cancel request respond with http:400 bad request 
// return json { errorMessage: 'Please provide name and bio for the user'}
// if info about user is valid: save the user to the database,
// return httpstatus 201 (created) and return newly created user document.
// if error respond http status code 500 (servor error), 
// return json object { error: There was an error while saving the user to the database }

//200-299 success
//300-399 redirect
//400-499 client error
//500-559 servor error

//working post

server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    const { name, bio } = req.body;
    if (!name || !bio ){
        return res.status(400).json({ message: 'Please provide name and bio for the user.'})
    } 
    db.insert(userInfo)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(error => {
        res.status(500).json({ message: 'error creating the data' })
    })
})



//making a get resquest to /api/users
    // if error retrieving users from db:
    // cancel the requestAnimationFrame. repsond with http status code 500.
    // return json object { error: 'The users information could not be retrieved.'}

    //working get 

server.get('/api/users', (req, res) => { 
    db
    .find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json('errr')
    })
})



// When client makes a get request to /api/users/:id:
//     if the user id is not found:
//         return 404 HTTP status code (Not Found)
//         return json object { message: 'The user with the specified ID does not exist'}

//     if theres an error retrieving user from database: 
//         cancel request , respond with HTTP status code 500.
//         return { error: 'The user information could not be retrieved.'}

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
 
    db
    .findById(id)
    .then(user => {
        if (user){
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'user not found'})
        }
        
    })
    .catch(err => {
        es.status(500).json({ error: 'The user information could not be retrived.'})
    })
    
})




// when client makes a delete request to /api/users/:id:
//     if user id not found:
//         return HTTP status 404 not found
//         return json obj { message: 'The user witht the specified ID does not exist'}
//     if the reqeust body is missing ht ename or bio property:
//         cancel request.
//         respond with HTTP STATUS code 400 (bad request)
//         return { error: 'The user information could not be modified.'}
//     if the user is found and new inofrmation is valid:
//         update the user document in the database using the new info sent in the request body.HTTP
//         return HTTP statuse code 200 (OK)
//         return the newly updated user document.

//delete working

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const findId = db.findById(id);
        db
        .remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'user not found'})
            }
             
        })
        .catch(err => {
            res.status(500).json({ error: 'Error deleting the hub'})
        })
    })

//update user
//update working

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    const { name, bio } = req.body;
    console.log(changes)
    if (!name || !bio){
        return res.status(400).json({ message: 'Please provide name and bio for the user.'})
    } 
    db
    .update(id, changes)
    .then(updated => {
        if(updated) {
            res.status(200).json(updated)
        }else {
            res.status(404).json({ message: 'user not found'})
        }
    })
    .catch(err => res.status(500).json({ error: 'The user information could not be modified.'}))
})
