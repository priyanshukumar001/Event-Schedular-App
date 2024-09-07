import mongoose from "mongoose";

const Schema = mongoose.Schema;

//defining basic schema for storing admin information 
const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;