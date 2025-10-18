import {Server} from "http"

import mongoose from "mongoose"
import app from "./app"
import { envVars } from "./config/env"



let server:Server

const startServer=async()=>{
try {

    await  mongoose.connect(envVars.DB_URL as string)
console.log("connected to Db!!")
server= app.listen(envVars.PORT,()=>{
    console.log(`server is listening to port ${envVars.PORT}`)
})
} catch (error) {
    console.log(error)
}
}
startServer()

process.on("unhandledRejection", (error) => {

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (error) => {

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  
  if (server) {
    server.close(() => process.exit(0));
  }
});