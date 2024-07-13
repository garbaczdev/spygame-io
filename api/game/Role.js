const fs = require('fs');


const allRoles = JSON.parse(fs.readFileSync('./roles.json', 'utf8'));


class Role {
  constructor(name, isSpy, hint="") {
    this.name = name;
    this.isSpy = isSpy;
    this.hint = hint;
  }
}

module.exports  = { allRoles, Role };
