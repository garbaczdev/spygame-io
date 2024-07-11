const fs = require('fs');


const allRoles = JSON.parse(fs.readFileSync('./roles.json', 'utf8'));


class Role {
  constructor(name, isSpy) {
    this.name = name;
    this.isSpy = isSpy;
  }
}

module.exports  = { allRoles, Role };
