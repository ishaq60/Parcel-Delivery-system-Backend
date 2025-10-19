 import express, { Request, Response } from "express"

import cors from "cors"
import { router } from "./router/route"

import { globalerrorhandaler } from "./middleware/globalehandaler"
import { success } from "zod"
import { notfound } from "./middleware/notfound"
 const app=express()
app.use(express.json())
app.use(cors())

app.use("/api/v1",router)

app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({message:"welcome to parcel delivery system"})
})
export default app

app.use(globalerrorhandaler)

app.use(notfound)