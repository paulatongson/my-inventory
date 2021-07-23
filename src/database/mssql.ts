import sql from "mssql";
import { readFileSync } from "fs";

const sqlConfig = { 
  user: "paulatongson",
  password: "Ivana666tongson",
  database: "artdemic",
  server: "artdemic.database.windows.net",
  port: 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

async function exeQuery(query: string) {
  const pool = new sql.ConnectionPool(sqlConfig);
  await pool.connect();
  const result = await pool.query(query);
  pool.close();

  return result;
}

async function initializeTables() {
  const initTableQuery = readFileSync("sql-init-command.sql", "utf-8");
  try {
    await exeQuery(initTableQuery);
  } catch (error) {
    console.log("LINE 19: ", error);
  }
}

export { exeQuery, initializeTables };
