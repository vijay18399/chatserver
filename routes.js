var express         = require('express'),
   routes          =  express.Router();
var userController  = require('./controller/user-controller');


routes.get('/', (req, res) => {
    return res.send(' API End point');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
routes.get('/users/:mid', userController.Users);
routes.delete('/users/:mid', userController.DeleteUser);
routes.get('/messages/:mid/:id', userController.Messages);
routes.get('/gmessages/:gid', userController.GroupMessages);
routes.get('/groups/', userController.Groups);
routes.delete('/groups/:gid', userController.DeleteGroup);
routes.post('/create_group', userController.createGroup);


module.exports = routes;
