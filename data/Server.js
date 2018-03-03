const { eslintData } = require("./fileData");

const gitIgnoreData = `node_modules
db/psql.js`;

const listenData = `const app = require('./app');
const hostPort = 3000;
app.listen( *{hostPort}, () => console.log('listening on *{hostPort}))`;

const appData = `const app = require("express")();
const apiRouter = require("./routes/api");
const bodyParser = require("body-parser").json;

app.use(bodyParser());

app.get("/", (req, res) => res.send("all good!"));

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  res.status(404)
  next({status:404})
});

app.use((err, req, res, next) => {
  if (err.status === 404) return res.status(404).send("page not found");
  next(err)
});

app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

module.exports = app;`;

const apiData = `const express = require("express");
const router = express.Router();

router.route("/api");

module.exports = router;`;

const route1Data = `const express = require("express");
const router = express.Router();
const {} = require("../controllers/route1");

router.route("/");

module.exports = router;`;

const route2Data = `const express = require("express");
const router = express.Router();
const {} = require("../controllers/route2");

router.route("/");

module.exports = router;`;

const controllerData = `module.exports = {};`;

const specData = `const app = require("../app");
const request = require("supertest")(app);
const { expect } = require("chai");

describe("/api", () => {
  describe("/route1", () => {
    it("GET returns status 200 and an object of ....", () => {
      return request
        .get("/api/route1")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.array).to.be.an("array");
          expect(res.body.array[0].value).to.equal("value");
        });
    });
  });
});`;

const seedData = `DROP DATABASE IF EXISTS database_1;
CREATE DATABASE database_1;
\c database_1;
CREATE TABLE table_1
(
  _id SERIAL PRIMARY KEY,
  _name VARCHAR(50) NOT NULL
);
CREATE TABLE table_2
(
  _id2 SERIAL PRIMARY KEY,
  _name2 VARCHAR(50) NOT NULL,
  _id INT,
  FOREIGN KEY (_id) REFERENCES table_1(_id),
  value1 VARCHAR(50) NOT NULL,
  value2 VARCHAR(50) NOT NULL
);

INSERT INTO table_1
(_name)
VALUES ('');
INSERT INTO table_2
  (_name2, _id, value1, value2)
VALUES
  ('', 0, '', '');

SELECT * FROM table_1;
SELECT * FROM table_2;
`;

const dbData = `const pgp = require("pg-promise")({ promiseLib: Promise });
const { database } = require("./psql.js");
module.exports = pgp(database);`;

const psqlData = `const database = {
  port: 5432,
  host: "localhost",
  database: "database",
  user: "******",
  password: "********"
};

module.exports = { database };`;

const filesServer = [
  { path: `/listen.js`, data: listenData },
  { path: `/app.js`, data: appData },
  { path: `/.eslintrc`, data: eslintData },
  { path: `/.gitignore`, data: gitIgnoreData },
  { path: `/routes/api.js`, data: apiData },
  { path: `/routes/route1.js`, data: route1Data },
  { path: `/routes/route2.js`, data: route2Data },
  { path: `/controllers/route1.js`, data: controllerData },
  { path: `/controllers/route2.js`, data: controllerData },
  { path: `/spec/spec.app.js`, data: specData },
  { path: `/seedDB/seed.sql`, data: seedData },
  { path: `/db/db.js`, data: dbData },
  { path: `/db/psql.js`, data: psqlData }
];

const serverDirs = [
  "models",
  "controllers",
  "utils",
  "routes",
  "seedDB",
  "spec",
  "db"
];

const commandsServer = `npm init -y && npm i body-parser express pg-promise && npm i chai supertest -D`;
module.exports = { serverDirs, filesServer, commandsServer };
