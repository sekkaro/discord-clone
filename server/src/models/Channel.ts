import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Channel ||
  mongoose.model("Channel", ChannelSchema);
