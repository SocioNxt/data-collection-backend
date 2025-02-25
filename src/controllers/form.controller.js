import Form from "../models/form.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {generateIdFromLabel} from "../utils/idGenerator.js";

import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Get Form Stats
const getFormStats = asyncHandler(async (req, res) => {
  try {
    const totalForms = await Form.countDocuments({ $or: [ {userId: req.user._id}, {coordinatorId: req.user._id}] });
    const publishedForms = await Form.countDocuments({ $or: [ {userId: req.user._id}, {coordinatorId: req.user._id}], published: true });
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
      { $set: { formFields: req.body, createdBy: req.user.username } },
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

// AI-Powered Form Creation
const generateFormWithAI = async (req, res) => {
  try {
    const { domainName, formFieldType, formName } = req.body;

    if (!domainName || !formFieldType) {
      return res.status(400).json({ error: "Missing required parameters: domainName or formFieldType" });
    }

    const prompt = `
    You are an expert in designing dynamic web forms.

    Based on the domain "${domainName}", generate a JSON schema for a form that collects relevant data.

    **Important Rules**:
    - Only use these field types: 
      **"TextField", "TitleField", "SubTitleField", "ParagraphField", "SeparatorField", "SpacerField", "NumberField", "TextAreaField", "DateField", "SelectField", "CheckboxField", "ImageUploader", "RadioField", "MultiSelectCheckboxField".**
    - **DO NOT** include "Button", "Submit", or any other field types.
    - Ensure a structured JSON response with domain-relevant fields.

    Example:
    [
      {
        "id": "full_name",
        "type": "TextField",
        "extraAttributes": {
          "label": "Full Name",
          "required": true,
          "placeHolder": "Enter your full name"
        }
      }
    ]

    **Only return JSON. Do NOT include explanations or markdown formatting.**
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();

    responseText = responseText.replace(/```json|```/g, "").trim();

    const generatedFields = JSON.parse(responseText);

    // Remove any invalid field types (extra safety check)
    const allowedTypes = [
      "TextField", "TitleField", "SubTitleField", "ParagraphField", "SeparatorField", "SpacerField",
      "NumberField", "TextAreaField", "DateField", "SelectField", "CheckboxField", "ImageUploader",
      "RadioField", "MultiSelectCheckboxField"
    ];
    
    const filteredFields = generatedFields.filter(field => allowedTypes.includes(field.type));

    const formId = generateIdFromLabel(domainName);
    
    const newForm = new Form({
      userId: req.user._id,
      formName: formName,
      formId: formId,
      formDomain: domainName,
      formFields: filteredFields,
      createdBy: req.user.username,
    });

    await newForm.save();

    res.status(201).json({ success: true, message: "Form created successfully", data: newForm });
  } catch (error) {
    console.error("Error generating form with Gemini AI:", error);
    res.status(500).json({ error: "Failed to generate form", details: error.message });
  }
};

export {
    getFormBySlug,
    createForm,
    getForms,
    publishForm,
    getFormContentByUrl,
    getFormStats,
    updateFormContent,
    generateFormWithAI
}