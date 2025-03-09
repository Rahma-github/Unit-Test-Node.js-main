
var todosModel = require('../models/todo')

const getAllTodos =  () => {
  return todosModel.find()
}


const saveTodo = async (newTodo) => {
  return await todosModel.create(newTodo)
}



const getTodoById = async (id) => {
  return await todosModel.findOne({ _id: id })
}

// for lab
const updateTitleTodoById = async (id,title) => {
  return await todosModel.findOneAndUpdate({ _id: id }, { title }, { new: true })
}



const getUserTodos = async (userId) => {
  // console.log("userid from fun getusertodo",userId,"type beta3aha is ",typeof userId);
  
  const todos = await todosModel.find({ userId });
  if (todos.length === 0) {
    return [];
  }
  return todos;
};


const deleteAllTodos = async () =>  await todosModel.deleteMany()



module.exports = { getAllTodos, saveTodo, getTodoById, updateTitleTodoById, deleteAllTodos, getUserTodos }