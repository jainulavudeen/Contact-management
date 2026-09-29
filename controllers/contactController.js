const Contact = require("../models/Contact");

// POST /contacts
exports.createContact = async (req, res, next) => {
  try {
    const { contactId, name, phone, email } = req.body;
    const contact = await Contact.create({ contactId, name, phone, email });
    res.status(201).json({ success: true, message: "Contact created", data: contact });
  } catch (err) {
    next(err);
  }
};

// GET /contacts
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    next(err);
  }
};

// GET /contacts/:id
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ contactId: req.params.id });
    if (!contact) {
      return res.status(404).json({ success: false, message: `Contact '${req.params.id}' not found` });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// PUT /contacts/:id
exports.updateContact = async (req, res, next) => {
  try {
    // contactId is the record's identity, so it cannot be changed
    const { name, phone, email } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update: name, phone, email",
      });
    }

    const contact = await Contact.findOneAndUpdate({ contactId: req.params.id }, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!contact) {
      return res.status(404).json({ success: false, message: `Contact '${req.params.id}' not found` });
    }
    res.status(200).json({ success: true, message: "Contact updated", data: contact });
  } catch (err) {
    next(err);
  }
};

// DELETE /contacts/:id
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({ contactId: req.params.id });
    if (!contact) {
      return res.status(404).json({ success: false, message: `Contact '${req.params.id}' not found` });
    }
    res.status(200).json({ success: true, message: "Contact deleted", data: contact });
  } catch (err) {
    next(err);
  }
};
