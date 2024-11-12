import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  addColumn,
  addtask,
  deleteColumn,
  deleteTask,
  updateTask,
  updateTaskOrder,
} from "../slice/todoSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";

import CustomButton, { IconButton } from "../components/customButton";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CiCircleInfo } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const TodoList = () => {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [newColumnName, setNewColumnName] = useState("");
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tododata);
  const columns = useSelector((state) => state.tododata.columns);
  const navigate = useNavigate();

  const initialValues = editTask
    ? { ...editTask }
    : {
        taskName: "",
        taskDescription: "",
        startDate: "",
        endDate: "",
        status: "",
      };

  // console.log("🚀 ~ TodoList ~ initialValues:", initialValues);
  const validationSchema = Yup.object({
    taskName: Yup.string()
      .required("Task name is required")
      .max(50, "Task name must be 50 characters or less"),
    taskDescription: Yup.string()
      .required("Description is required")
      .max(200, "Description must be 200 characters or less"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .required("End date is required"),
  });

  const handleEdit = (task) => {
    setEditTask(task); // Set task to be edited in state
    setOpen(true); // Open the modal with task details
  };

  const handleSubmit = (values, { resetForm }) => {
    const newTask = {
      id: new Date().getTime(),
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      // status: "todo",
    };
    dispatch(addtask(newTask));
    resetForm();
    setOpen(false);
  };

  const handleUpdate = (values) => {
    console.log("🚀 ~ handleUpdate ~ values:", values);

    dispatch(updateTask({ ...values, status: values.status })); // Dispatch the update task action
    setOpen(false); // Close the modal after dispatching the update
  };

  // const hello = () => {
  //   console.log("Hello World!");
  // };
  const handleLogout = () => {
    localStorage.removeItem("loggingUser");
    navigate("/login");
  };

  const handleDelete = (taskId) => {
    // Dispatch the delete task action
    dispatch(deleteTask(taskId));
  };
  // Add and delete column

  const defaultColumns = ["todo", "inprogress", "completed"];

  const handleaddcolumn = () => {
    if (newColumnName.trim() === "") {
      alert("Please enter a column name.");
      return;
    }
    dispatch(addColumn(newColumnName));

    setNewColumnName(""); // Reset the column name input
  };

  const handledeletecolumn = (columnName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the "${columnName}" column?`
    );
    if (confirmDelete) {
      dispatch(deleteColumn(columnName));
    }
  };

  const handleViewDetails = (data) => {
    setDetailsOpen(true);
    setSelectedTaskId(data);
  };

  const statusStyle = {
    todo: "bg-blue-100",
    inprogress: "bg-yellow-100",
    completed: "bg-green-100",
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const Modal = ({ children }) => (
    <div className=" fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">{children}</div>
    </div>
  );

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return; // If dropped outside, do nothing

    // If the task is dropped at the same place, do nothing
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    // Dispatch the updateTaskOrder action to reorder tasks after the drag
    dispatch(
      updateTaskOrder({
        sourceColumn,
        destinationColumn,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">To-Do List</h1>
        <CustomButton
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow-md"
          name={"Logout"}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <CustomButton onClick={() => setOpen(true)} name="Create Task" />
        {/* Add column input */}
        <input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Enter new column name"
          className="p-2 border rounded"
        />
        <CustomButton
          onClick={handleaddcolumn}
          name={"Add Column"}
          className={"bg-green-600"}
        />
      </div>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold ">Create New Task</h2>
            <div>
              <IoMdClose
                onClick={() => setOpen(false)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={editTask ? handleUpdate : handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="box-border">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="taskName"
                        className="block mb-2 text-sm font-medium text-black"
                      >
                        Task Name
                      </label>
                      <input
                        type="text"
                        name="taskName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.taskName}
                        placeholder="Add Task"
                        className="w-full h-10 p-2 border rounded-md"
                      />
                      {touched.taskName && errors.taskName && (
                        <div style={{ color: "red" }}>{errors.taskName}</div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="taskDescription"
                        className="block mb-2 text-sm font-medium text-black"
                      >
                        Task Description
                      </label>
                      <textarea
                        name="taskDescription"
                        type="text"
                        placeholder="Add Description"
                        value={values.taskDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full p-2 border rounded-md resize-none"
                      />
                      {touched.taskDescription && errors.taskDescription && (
                        <div style={{ color: "red" }}>
                          {errors.taskDescription}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 w-full box-border mb-4">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          Start Date
                        </label>
                        <DatePicker
                          selected={values.startDate}
                          onChange={(date) => setFieldValue("startDate", date)}
                          dateFormat="dd/MM/yyyy"
                          className="w-full h-10 rounded-md border-2 border-[#ccc solid] p-2"
                        />
                        {touched.startDate && errors.startDate && (
                          <div style={{ color: "red" }}>{errors.startDate}</div>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="endDate"
                          className="block mb-2 text-sm font-medium text-black"
                        >
                          End Date
                        </label>
                        <DatePicker
                          selected={values.endDate}
                          onChange={(date) => setFieldValue("endDate", date)}
                          dateFormat="dd/MM/yyyy"
                          className="w-full h-10 rounded-md border-2 border-[#ccc solid] p-2"
                        />
                        {touched.endDate && errors.endDate && (
                          <div style={{ color: "red" }}>{errors.endDate}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow-md"
                  >
                    {editTask ? "Save" : "Create"}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </Modal>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-grow gap-4 ">
          {columns?.map((column) => (
            <div
              key={column}
              className={`min-w-[300px] p-4 rounded-lg shadow-lg h-full ${statusStyle[column]}`}
            >
              <div className="flex justify-between">
                <h2 className="font-bold mb-2 capitalize text-lg">{column}</h2>
                {!defaultColumns.includes(column) && (
                  <IconButton
                    className="text-red-700"
                    onClick={() => handledeletecolumn(column)}
                  >
                    <MdDelete fontSize={"18px"} />
                  </IconButton>
                )}
              </div>
              {/* <Column task={tasks} column={column} /> */}
              <Droppable droppableId={column}>
                {(provided, snapshot) => (
                  <div
                    className={`flex flex-col ${
                      snapshot.isDraggingOver
                        ? "border-2 border-dashed border-blue-500"
                        : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasks[column]?.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              border: snapshot.isDragging
                                ? "2px solid green"
                                : "none", // Apply border when task is being dragged
                            }}
                            key={task.id}
                            className="bg-white p-4 m-2 rounded-lg shadow-md  items-start"
                          >
                            <div className="overflow-hidden">
                              <h3 className="font-semibold overflow-hidden">
                                Name: {truncateText(task.taskName, 7)}
                              </h3>
                              <p className="text-sm text-gray-600 overflow-hidden">
                                Description :{" "}
                                {truncateText(task.taskDescription, 5)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Start Date :{" "}
                                {new Date(task.startDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                End Date :{" "}
                                {new Date(task.endDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </p>
                            </div>
                            <div className=" justify-center p-1">
                              <IconButton
                                onClick={() => handleViewDetails(task)}
                              >
                                <CiCircleInfo fontSize={"18px"} />
                              </IconButton>
                              <IconButton onClick={() => handleEdit(task)}>
                                <CiEdit fontSize={"18px"} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDelete(task.id)} // Handle delete
                              >
                                <MdDelete fontSize={"18px"} />{" "}
                              </IconButton>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      {detailsOpen && selectedTaskId && (
        <Modal className="overflow-x-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Task Details</h2>
            <div>
              <IoMdClose
                onClick={() => setDetailsOpen(false)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">
              Task Name: {selectedTaskId.taskName}
            </h3>
            <p className="text-sm text-gray-600">
              Description: {selectedTaskId.taskDescription}
            </p>
            <p className="text-sm text-gray-600">
              Start Date:{" "}
              {new Date(selectedTaskId.startDate).toLocaleDateString("en-GB")}
            </p>
            <p className="text-sm text-gray-600">
              End Date:{" "}
              {new Date(selectedTaskId.endDate).toLocaleDateString("en-GB")}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TodoList;
