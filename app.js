const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");

const { PORT, ROOT_API } = require("./config.json");
const { members } = require("./data");
const { createId, getUser, isNameTaken } = require("./helpers");
const { error, success } = require("./messages");

const app = express();

let MembersRouter = express.Router();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MembersRouter.route("/")
  // Get all members
  .get((req, res) => {
    if (req.query.limit) {
      res.json(success(members.slice(0, req.query.limit)));
    } else {
      res.json(success(members));
    }
  })

  // Create a new member
  .post((req, res) => {
    if (req.body.name) {
      const nameIsTaken = isNameTaken(req, res);

      if (nameIsTaken) {
        return;
      }

      const member = {
        id: createId(),
        name: req.body.name,
      };

      members.push(member);

      res.json(success(member));
    } else {
      res.json(error("Enter a name"));
    }
  });

MembersRouter.route("/:id")
  // Get a member with an id
  .get((req, res) => {
    const index = req.params.id;
    const user = getUser(parseInt(index))[0];

    if (user) {
      res.json(success(user));
    } else {
      res.json(error(`User ${index} doesn't exist`));
    }
  })

  // Update a member with an id
  .put((req, res) => {
    const index = req.params.id;
    const newName = req.body.name;
    const user = getUser(parseInt(index))[0];

    if (user) {
      const nameIsTaken = isNameTaken(req, res);

      if (nameIsTaken) {
        return;
      }

      user.name = newName;
      res.json(success(`user ${user.name} has been renamed to ${newName}`));
    } else {
      res.json(error(`User ${index} doesn't exist`));
    }
  })

  // Delete a member with an id
  .delete((req, res) => {
    const index = parseInt(req.params.id);
    const user = getUser(parseInt(index))[0];

    if (user) {
      for (let i = 0; i < members.length; i++) {
        if (members[i].id === index) {
          members.splice(i, 1);
        }
      }

      res.json(success(`User ${user.name} with id ${index} has been deleted`));
    } else {
      res.json(error(`User ${index} doesn't exist`));
    }
  });

app.use(`${ROOT_API}/members`, MembersRouter);

app.listen(PORT, () => console.log(`Started on port ${PORT}`));
