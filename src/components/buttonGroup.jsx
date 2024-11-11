import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { CiCircleInfo } from "react-icons/ci";

import {
  deletetask,
} from "../slice/todoSlice";

const TaskItemButtons = ({
  taskId,
  currentStatus,
  dispatch,
  setDetailsOpen,
}) => {
  return (
    <div className="flex justify-center items-center">
      <IconButton className="text-red-700" onClick={handleEditTask}>
        <EditIcon fontSize={"small"} />
      </IconButton>
      <IconButton
        className="text-red-700"
        onClick={() =>
          dispatch(deletetask({ id: taskId, status: currentStatus }))
        }
      >
        <DeleteIcon fontSize={"small"} />
      </IconButton>
      <IconButton onClick={() => setDetailsOpen(true)}>
        <CiCircleInfo />
      </IconButton>
    </div>
  );
};

export default TaskItemButtons;
