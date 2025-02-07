import Form from "../models/form.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get Form Stats
const getFormStats = asyncHandler(async (req, res) => {
  try {
    const totalForms = await Form.countDocuments({ userId: req.user._id });
    const publishedForms = await Form.countDocuments({ userId: req.user._id, published: true });
    res.json(new ApiResponse(200, { totalForms, publishedForms }, "Form stats fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Server Error", error);
  }
});

// Create a New Form
const createForm = asyncHandler(async (req, res) => {
  try {
    const formData = { ...req.body, userId: req.user._id };
    const form = new Form(formData);
    await form.save();
    res.status(201).json(new ApiResponse(201, form, "Form created successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to create form", error);
  }
});

// Get All Forms
const getForms = asyncHandler(async (req, res) => {
  try {
    const forms = await Form.find({
      $or: [{ userId: req.user._id }, { coordinatorId: req.user._id }],
    });
    res.json(new ApiResponse(200, forms, "Forms fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch forms", error);
  }
});

// Get Form by Slug (formId)
const getFormBySlug = asyncHandler(async (req, res) => {
  try {
    const form = await Form.findOne({ formId: req.params.slug, $or: [ {userId: req.user._id}, {coordinatorId: req.user._id}] });
    if (!form) throw new ApiError(404, "Form not found");
    res.json(new ApiResponse(200, form, "Form fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Server Error", error);
  }
});

// Update Form Content
const updateFormContent = asyncHandler(async (req, res) => {
  try {
    const updatedForm = await Form.findOneAndUpdate(
      { formId: req.params.formId, userId: req.user._id },
      { $set: { formFields: req.body} },
      { new: true }
    );
    if (!updatedForm) throw new ApiError(404, "Form not found");
    res.json(new ApiResponse(200, updatedForm, "Form updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to update form", error);
  }
});

// Publish Form
const publishForm = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber, vehicleNumber } = req.body;

    // Check if assignee user exists
    let assigneeUser = await User.findOne({ email });

    // If user does not exist, create new user
    if (!assigneeUser) {
      assigneeUser = new User({
        username: name.toLowerCase().replace(/\s+/g, ""),
        email,
        phoneNumber,
        password: vehicleNumber,
      });

      await assigneeUser.save();
    }

    // Find and update the form
    const form = await Form.findOneAndUpdate(
      { formId: req.params.formId, userId: req.user._id },
      { published: true, coordinatorId: assigneeUser._id },
      { new: true }
    );

    if (!form) {
      console.error("Form not found for ID:", req.params.formId);
      throw new ApiError(404, "Form not found");
    }

    res.json(new ApiResponse(200, form, "Form published successfully"));
  } catch (error) {
    console.error("Error publishing form:", error);
    throw new ApiError(500, "Failed to publish form", error);
  }
});

// Get Form Content by URL
const getFormContentByUrl = asyncHandler(async (req, res) => {
  try {
    const form = await Form.findOne({ shareURL: req.params.url, userId: req.user._id });
    if (!form) throw new ApiError(404, "Form not found");
    res.json(new ApiResponse(200, form, "Form fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Server Error", error);
  }
});

export {
    getFormBySlug,
    createForm,
    getForms,
    publishForm,
    getFormContentByUrl,
    getFormStats,
    updateFormContent
}