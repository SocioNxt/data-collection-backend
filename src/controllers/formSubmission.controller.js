import FormSubmission from '../models/formSubmission.model.js';
import Form from '../models/form.model.js';
import mongoose from 'mongoose';

// Submit a new form submission
export const submitForm = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { formUrl, content } = req.body;

    // Find the form by shareURL
    const form = await Form.findOne({ shareURL: formUrl }).session(session);
    if (!form) {
      console.error('Form not found for shareURL:', formUrl);
      await session.abortTransaction();
      return res.status(404).json({ success: false, error: 'Form not found' });
    }

    // Create a new submission
    const formSubmission = await FormSubmission.create(
      [
        {
          formId: form._id,
          formContent: content,
        },
      ],
      { session }
    );

    // Update form with submission reference and increment submission count
    const updatedForm = await Form.findByIdAndUpdate(
      form._id,
      {
        $push: { formSubmissions: formSubmission[0]._id },
        $inc: { submissions: 1 },
      },
      { new: true, session }
    );

    if (!updatedForm) {
      console.error('Failed to update form with submission reference');
      await session.abortTransaction();
      return res.status(500).json({ success: false, error: 'Failed to update form' });
    }

    // Commit the transaction
    await session.commitTransaction();

    // Serialize the response data
    const serializedSubmission = {
      id: formSubmission[0]._id.toString(),
      formId: formSubmission[0].formId.toString(),
      formContent: formSubmission[0].formContent,
      createdAt: formSubmission[0].createdAt?.toISOString(),
      updatedAt: formSubmission[0].updatedAt?.toISOString(),
    };

    res.status(201).json({
      success: true,
      data: serializedSubmission,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit form' });
  } finally {
    session.endSession();
    console.log('Session ended');
  }
};

// Get all submissions for a form
export const getFormSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findOne({
        userId: req.user._id,
        _id: formId
    }).populate({
        path: 'formSubmissions', 
        match: { formId },
        options: { sort: { createdAt: -1 } },
        strictPopulate: false
    });

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
  }
};

// Get a single submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await FormSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch submission' });
  }
};
