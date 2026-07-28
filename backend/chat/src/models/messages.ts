import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: Date;
  seenBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId, // ✅ FIXED
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },

    image: {
      url: String,
      publicId: String,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "mixed"],
      required: true,
    },

    // ✅ CORRECT GROUP-READY FIELD
    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    seen: {
      type: Boolean,
      default: false,
    },

    seenAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT INDEX (pagination + performance)
schema.index({ chatId: 1, createdAt: -1 });

export const Messages = mongoose.model<IMessage>("Message", schema);