// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();
server.use(express.json());

//adds a user to the database
//user must include the fields name and bio
server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    const user = req.body;

    if(!name || !bio) {
        return res.status(400).json({error: "Please provide name and bio for the user." });
    }
    
    db.insert(user)
        .then(user => {
            res.status(201).json(user);
        }).catch(error => {
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        });

});

//retrieves all users in the database
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        }).catch(error => {
            res.status(500).json({ error: "The users information could not be retrieved." });
        });
});

//finds a specific user by id within the database
//returns undefined if the user does not exist
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
            console.log(user);
            if(user){
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        }).catch(error => {
            res.status(500).json({ error: "The user information could not be retrieved." });
        })
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(deleted => {
            console.log(deleted);
            if(deleted > 0) {
                res.status(200).json(deleted);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        }).catch(error => {
            res.status(500).json({ error: "The user could not be removed" });
        })
});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, bio } = req.body;

    if(!name || !bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }

    const changes = req.body;

    db.update(id, changes)
    .then(updated => {
        if(updated > 0){
            res.status(200).json(updated);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        res.status()
    }).catch(error => {
        res.status(500).json({ error: "The user information could not be modified." });
    });
});

server.listen(4001, () => {
    console.log("Api up and running on port 4001.");
});