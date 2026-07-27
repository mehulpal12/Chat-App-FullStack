import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  isGroup: boolean;
  name?: string;
  admin?: mongoose.Types.ObjectId;
  users: string[];
  latestMessage?: {
    text: string;
    sender: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
   isGroup: {
      type: Boolean,
      default: false,
      index: true,
    },

    name: {
      type: String,
      trim: true,
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

  users: {
    type: [String],
    required: true,
    index: true
  },
  latestMessage: {
    text: {
      type: String,
    },
    sender: {
      type: String,
        },
  },

}, {timestamps:true});





export const Chat = mongoose.model<IChat>("Chat", chatSchema)