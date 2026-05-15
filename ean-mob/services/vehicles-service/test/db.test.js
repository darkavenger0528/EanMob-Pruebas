const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const mysqlPath = require.resolve("mysql2/promise");
const dbPath = path.resolve(__dirname, "../src/config/db.js");

function loadDbWithQueries(responses) {
  const queries = [];
  const pool = {
    query: async (sql, values) => {
      queries.push({ sql, values });
      return responses.shift() || [[]];
    },
    getConnection: async () => ({
      ping: async () => {},
      release: () => {},
    }),
  };

  delete require.cache[dbPath];
  require.cache[mysqlPath] = {
    id: mysqlPath,
    filename: mysqlPath,
    loaded: true,
    exports: { createPool: () => pool },
  };

  process.env.DB_HOST = "localhost";
  process.env.DB_USER = "root";
  process.env.DB_PASSWORD = "root";
  process.env.JWT_SECRET = "test-secret";

  return { db: require(dbPath), queries };
}

test("initDb adds missing vehicle columns using MySQL-compatible ALTER syntax", async () => {
  const { db, queries } = loadDbWithQueries([
    [{}],
    [[{ COLUMN_NAME: "marca" }]],
    [{}],
    [{}],
  ]);

  await db.initDb();

  const sql = queries.map((query) => query.sql).join("\n");
  assert.match(sql, /INFORMATION_SCHEMA\.COLUMNS/);
  assert.match(sql, /ADD COLUMN anio YEAR NULL/);
  assert.match(sql, /ADD COLUMN numero_puestos INT NOT NULL DEFAULT 4/);
  const alterSql = queries
    .map((query) => query.sql)
    .filter((querySql) => querySql.startsWith("ALTER TABLE"))
    .join("\n");
  assert.doesNotMatch(alterSql, /IF NOT EXISTS/);
});
