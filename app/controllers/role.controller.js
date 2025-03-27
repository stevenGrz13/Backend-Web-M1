const CrudController = require("../core/controllers/crud.controller");
const roleService = require("../services/role.service");
const ApiResponse = require("../core/response.model");

class RoleController extends CrudController {
  constructor() {
    super(roleService);
  }

  async getRole(req, res) {
    const result = await roleService.findRole(req.params.nom);
    new ApiResponse(200, result, "Role got successfully").send(res);
  }
}

module.exports = new RoleController();
