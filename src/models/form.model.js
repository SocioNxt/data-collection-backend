import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const FormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    published: {
      type: Boolean,
      default: false,
    },
    formName: {
      type: String,
      required: true,
    },
    formId: {
      type: String,
      required: true,
      unique: true,
    },
    formDomain: {
      type: String,
      default: "",
    },
    formFields: {
      type: [
        {
          type: Object,
          default: () => ({}),
        },
      ],
      default: [],
    },
    visits: {
      type: Number,
      default: 0,
    },
    submissions: {
      type: Number,
      default: 0,
    },
    shareURL: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    clusturId: {
      type: String,
      default: "",
    },
    coordinatorId: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: String,
      default: "",
    },
    formSubmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FormSubmission'}],
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.models.Form || mongoose.model("Form", FormSchema);
export default Form;