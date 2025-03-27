const CrudService = require('../core/services/crud.service');
const Role = require('../models/role.model');
class RoleService extends CrudService{
  constructor(){
    super(Role);
  }

  async findRole(role) {
    const rolereturn = await Role.find({ nom: role.toLowerCase() });
    return rolereturn;
  };
  
}

module.exports = new RoleService();