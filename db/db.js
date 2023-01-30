import { connect, mongoose } from "mongoose";
import moment from "moment/moment.js";

const { Schema } = mongoose;

mongoose.set("strictQuery", false);
export const uri =
  "mongodb+srv://Abdulboriy:MongoDB@cluster0.mpywc.mongodb.net/?retryWrites=true&w=majority/task4";

connect(uri);

export const Users = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  }, // String is shorthand for {type: String}
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  time: {
    type: String,
    default: moment().format("lll"),
    required: true,
  },
  lastLogin: {
    type: String,
    default: "not available",
    required: true,
  },
});

export const User = mongoose.model("User", Users);
