import pg from "pg";
import dotenv from "dotenv";
//here we prepare the connection
dotenv.config();
//created a new object of type pgclient to start the connection between the api-server and DB server
const pgClient = new pg.Client(process.env.DATABASE_URL);

export default pgClient;
