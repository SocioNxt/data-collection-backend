import mongoose from 'mongoose';

const FormSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
      index: true,
    },
    formContent: {
      type: [
        {
          type: Object,
          default: () => ({}),
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const FormSubmission = mongoose.models.FormSubmission || mongoose.model('FormSubmission', FormSubmissionSchema);

export default FormSubmission;