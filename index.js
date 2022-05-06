const Express = require('express');
const app = Express();
const bodyParser = require('body-parser');
require('dotenv').config();

//Importing ROUTES
const adminRoute = require('./routes/admin.route');
const companyRoute = require('./routes/company.route');
const employeeRoute = require('./routes/employee.route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/admin-service', adminRoute);
app.use('/api/v1/company-service', companyRoute);
app.use('/api/v1/employee-service', employeeRoute);

app.listen(process.env.port, () => {
  console.info(
    `v${process.env.version} - listening on http://localhost:${process.env.port}`
  );
});

module.exports = app;
