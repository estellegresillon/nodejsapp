const { members } = require("./data");

createId = () => members[members.length - 1].id + 1;

getUser = (id) => {
  return members.filter((member) => (member.id === id ? member : null));
};

isNameTaken = (req, res) => {
  const nameTaken = members.filter(
    (member) => member.name === req.body.name
  )[0];

  if (nameTaken) {
    res.json(error(`Name ${req.body.name} is already taken.`));
  }

  return nameTaken;
};

exports.createId = createId;
exports.getUser = getUser;
exports.isNameTaken = isNameTaken;
