const router = require('express').Router();
const { User } = require('../../models');

// GET all users (/api/users)
router.get('/', (req, res) => {
    // access User model & run .findAll() method to read all users
    // much like SELECT * FROM users;
    User.findAll({
        // use attributes as the key & instruct query to exclude password column
        // needed to keep user info private
        // use array so we can add addtl later if needed
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET sing user (/api/users/1)
router.get('/:id', (req, res) => {
    // access User model & find read singular id
    // much like SELECT * FROM users WHERE id = 1;
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        // JOIN Post, Comment & Post models to User
        // expressed as an array of objects
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
          ]
    })
    // promise to capture DB call
    .then(dbUserData => {
        // if no users with that id ar found
        if (!dbUserData) {
            // let user know response was recieved but no users found
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST (create) /api/users
router.post('/', (req, res) => {
    // expects {username: 'Kyle', email: '7krich@gmail.com', password: 'password123'}
    // created acts much like INSERT INTO users (username, email, password) VALUES ("","","");
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    });
});

// route to verify user identity
router.post('/login', (req, res) => {
    // query User table to find the instance of a user that contains the user's credentials - user's email
    // expects {email: "", password: ""}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        // if no e-mail is found we don't need to try to verify the password since the acct doesn't exist
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that e-mail address!' });
            return;
        }
        
        // verify user
        // pass plaintext pwd stored in req.body.password into checkPassword argument in User.js
        const validPassword = dbUserData.checkPassword(req.body.password);
        // if match returns false
        if(!validPassword) {
            res.status(400).json({ mesage: 'Incorrect password!' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
        res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Kyle', email: '7krich@gmail.com', password: 'password123'}
    // if req.body has exact key/value pairs to match the model, we can use just req.body instead
    // updated combines params for created & looking up data
    // sql version = UPDATE users SET username = "", email = "", password = "" WHERE id = 1;
    User.update(req.body, {
        //following line req for update password hash to function
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// allow user to log out if signed in
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
})

module.exports = router;