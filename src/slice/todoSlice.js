import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

const initialState = {
  todo: [],
  inprogress: [],
  completed: [],
  columns: ["todo", "inprogress", "completed"],
};

const todoslice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addtask: (state, action) => {
      const { taskName, taskDescription, startDate, endDate } = action.payload;
      state.todo.push({
        id: Math.random().toString(26),
        taskName,
        taskDescription,
        startDate: new Date(startDate).toISOString(), // Convert to string
        endDate: new Date(endDate).toISOString(),
        status: "todo",
      });
    },
    updateTask: (state, action) => {
      const updatedTask = action.payload;
      const column = updatedTask.status;

      // Find the task by ID within the specified column
      const taskIndex = state[column].findIndex(
        (task) => task.id === updatedTask.id
      );

      if (taskIndex !== -1) {
        // Update the task if found
        state[column][taskIndex] = {
          ...state[column][taskIndex],
          ...updatedTask,
        };
      }
    },
    updateTaskOrder: (state, action) => {
      const { sourceColumn, destinationColumn, sourceIndex, destinationIndex } =
        action.payload;

      const [draggedTask] = state[sourceColumn].splice(sourceIndex, 1);
      draggedTask.status = destinationColumn; // Remove the task from source column
      const des = state[destinationColumn].splice(
        destinationIndex,
        0,
        draggedTask
      );
      // Add the task to destination column
    },
    deleteTask: (state, action) => {
      // Loop through columns to find the task and delete it from the correct column
      const taskId = action.payload;

      // Find the column the task belongs to
      for (let column of state.columns) {
        state[column] = state[column].filter((task) => task.id !== taskId);
      }
    },
    addColumn: (state, action) => {
      if (!state.columns.includes(columnName)) {
        state.columns.push(columnName); // Add the column if it doesn't already exist
        state[columnName] = [];
        console.log("🚀 ~ columnName:", columnName);
        // Initialize the new column as an empty array
      }
    },
    deleteColumn: (state, action) => {
      const columnName = action.payload;
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the "${columnName}" column?`
      );
      if (confirmDelete) {
        // Delete the column and its tasks
        delete state[columnName]; // Remove column data
        state.columns = state.columns.filter((col) => col !== columnName); // Remove column name from the array
      }
    },
  },
});

export const {
  addtask,
  updateTask,
  updateTaskOrder,
  addColumn,
  deleteColumn,
  deleteTask,
} = todoslice.actions;

export default todoslice.reducer;
