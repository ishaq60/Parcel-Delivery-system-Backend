import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser=async(playload:Partial<IUser>)=>{
    const {name,email}=playload
const user=await User.create({
    name,email
})
return user
}

//get all users
const getAllusers=async()=>{
    const users=await User.find()
    return users
}




export const UserService={
    createUser,
    getAllusers
}