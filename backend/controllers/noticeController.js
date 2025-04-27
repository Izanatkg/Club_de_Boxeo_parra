const asyncHandler = require('express-async-handler');
const Notice = require('../models/noticeModel');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = asyncHandler(async (req, res) => {
  // Para la landing page, solo mostramos avisos activos
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  
  const notices = await Notice.find(filter).sort({ createdAt: -1 });
  res.status(200).json(notices);
});

// @desc    Get notice by ID
// @route   GET /api/notices/:id
// @access  Private
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error('Aviso no encontrado');
  }

  res.status(200).json(notice);
});

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private
const createNotice = asyncHandler(async (req, res) => {
  const { title, content, isActive } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Por favor ingrese todos los campos requeridos');
  }

  const notice = await Notice.create({
    title,
    content,
    isActive: isActive !== undefined ? isActive : true,
    user: req.user.id,
  });

  res.status(201).json(notice);
});

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private
const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error('Aviso no encontrado');
  }

  const updatedNotice = await Notice.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedNotice);
});

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error('Aviso no encontrado');
  }

  await notice.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Toggle notice active status
// @route   PUT /api/notices/:id/toggle
// @access  Private
const toggleNoticeStatus = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error('Aviso no encontrado');
  }

  notice.isActive = !notice.isActive;
  await notice.save();

  res.status(200).json(notice);
});

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeStatus,
};
