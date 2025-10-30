// backend/src/controllers/taskController.js
const prisma = require('../db');

async function getTasks(req, res) {
  try {
    console.log('📋 GetTasks called for user:', req.user.id);
    
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    console.log('✅ Tasks retrieved:', tasks.length);
    res.json({ tasks });
  } catch (err) {
    console.error('❌ GetTasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createTask(req, res) {
  try {
    console.log('➕ CreateTask called for user:', req.user.id);
    const { title, description, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'todo',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id
      }
    });

    console.log('✅ Task created:', task.id);
    res.status(201).json({ task });
  } catch (err) {
    console.error('❌ CreateTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateTask(req, res) {
  try {
    console.log('✏️ UpdateTask called for task:', req.params.id);
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id: parseInt(id), userId: req.user.id }
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      }
    });

    console.log('✅ Task updated:', task.id);
    res.json({ task });
  } catch (err) {
    console.error('❌ UpdateTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteTask(req, res) {
  try {
    console.log('🗑️ DeleteTask called for task:', req.params.id);
    const { id } = req.params;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id: parseInt(id), userId: req.user.id }
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    console.log('✅ Task deleted:', id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('❌ DeleteTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };