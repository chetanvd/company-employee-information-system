const statusCode = Object.freeze({
  ok: 200,
  created: 201,
  no_content: 204,
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  internal_server_error: 500,
});

const collectionName = Object.freeze({
  COMPANY: 'companies',
  EMPLOYEE: 'employees',
  ADMIN: 'admin',
});

module.exports = {
  statusCode,
  collectionName,
};
