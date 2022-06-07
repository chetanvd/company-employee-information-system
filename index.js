const Express = require('express');
const app = Express();
const bodyParser = require('body-parser');

const port = process.env.PORT || '8088';

const adminRoute = require('./routes/admin.route');
const utilRoute = require('./routes/util.route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/admin-service', adminRoute);
app.use('/api/v1/util-service', utilRoute);

app.listen(port, () => {
  console.info(`Server started on PORT : ${port}`);
});
