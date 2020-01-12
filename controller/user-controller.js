var User = require("../models/user");
var Message = require("../models/message");
var Group = require("../models/group");
var jwt = require("jsonwebtoken");
var config = require("../config/config");

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    config.jwtSecret,
    {
      expiresIn: 86400 // 86400 expires in 24 hours
    }
  );
}

exports.registerUser = (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res
      .status(400)
      .json({ msg: "You need to send Username and password" });
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      return res.status(400).json({ msg: "The email already exists" });
    }
    if (err) {
      return res.status(400).json({ msg: err });
    }
    User.findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        return res.status(400).json({ msg: "The username already exists" });
      }
      if (err) {
        return res.status(400).json({ msg: err });
      }

      let newUser = User(req.body);
      newUser.save((err, user) => {
        if (err) {
          return res.status(400).json({ msg: err });
        }
        return res.status(201).json(user);
      });
    });
  });
};

exports.loginUser = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .send({ msg: "You need to give  username and password" });
  }

  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      return res.status(400).send({ msg: err });
    }

    if (!user) {
      return res.status(400).json({ msg: "The username does not exist" });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        return res.status(200).json({
          token: createToken(user)
        });
      } else {
        return res
          .status(400)
          .json({ msg: " username and password don't match." });
      }
    });
  });
};

exports.Users = (req, res) => {
  console.log(req.params.mid);
  User.find({ username: { $ne: req.params.mid } }, (err, users) => {
    if (users) {
      return res.status(201).json(users);
    }
  });
};
exports.DeleteUser = (req, res) => {
  console.log(req.params.mid);
  Group.deleteOne({ username: { $eq: req.params.mid } }, (err, user) => {
    if (user) {
      return res.status(201).json(users);
    }
  });
};
exports.Messages = (req, res) => {
  if (req.params.id && req.params.mid) {
    to = req.params.id;
    from = req.params.mid;
    q1 = {
      $and: [{ to: { $eq: to } }, { from: { $eq: from } }]
    };
    q2 = {
      $and: [{ to: { $eq: from } }, { from: { $eq: to } }]
    };

    query = { $or: [q1, q2] };

    Message.find(query, (err, messages) => {
      if (messages) {
        console.log(messages);
        return res.status(201).json(messages);
      }
    });
  } else {
    return res.status(400).json({ msg: " invalid query attempted" });
  }
};

exports.createGroup = (req, res) => {
  if (!req.body.groupid || !req.body.owner) {
    return res.status(400).json({ msg: "Group Name need to be specified" });
  }
  console.log(req.body.groupid);
  Group.findOne({ groupid: req.body.groupid }, (err, group) => {
    if (group) {
      return res.status(400).json({ msg: "group already exists try another " });
    }
    if (err) {
      return res.status(400).json({ msg: err });
    }

    let newGroup = Group(req.body);
    newGroup.save((err, group) => {
      if (err) {
        return res.status(400).json({ msg: err });
      }
      return res.status(201).json(group);
    });
  });
};
exports.Groups = (req, res) => {
  Group.find({}, (err, groups) => {
    if (groups) {
      return res.status(201).json(groups);
    }
  });
};
exports.GroupMessages = (req, res) => {
  if (req.params.gid) {
    gid = req.params.gid;
    query = { groupid: { $eq: gid } };
    console.log(query);
    Message.find(query, (err, messages) => {
      if (messages) {
        console.log(messages);
        return res.status(201).json(messages);
      }
    });
  } else {
    return res.status(400).json({ msg: " invalid query attempted" });
  }
};

exports.DeleteGroup = (req, res) => {
  console.log(req.params.gid);
  Group.deleteOne({ groupid: { $eq: req.params.gid } }, (err, group) => {
    if (group) {
      query = { groupid: { $eq: req.params.gid } };
      Message.deleteMany(query, (err, messages) => {
        return res.status(201).json(group);
      });
    }
  });
};
