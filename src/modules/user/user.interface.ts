export enum Role {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuth {
  provider: "google"|"credentials";
  id?: string;
  providerID: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;              
  phone?: string;
  picture?: string;
  address?: string;              
  role: Role;
  

  isAdmin?: boolean;             
  isActive?: IsActive;

  auths?: IAuth[];                

  createdAt?: Date;
  updatedAt?: Date;              
}
