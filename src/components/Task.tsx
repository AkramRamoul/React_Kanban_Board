import { useState } from "react";
import Delete from "../icons/Delete";
import { Id, task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const Task = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: edit,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEdit = () => {
    setEdit((prev) => !prev);
    setMouseOver((prev) => !prev);
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColor p-2.5 h-[100px]
        min-h-[100px] items-center flex text-left rounded-xl
        relative opacity-30 border-2 border-rose-500"
      ></div>
    );
  }

  if (edit) {
    return (
      <div
        className="bg-mainBackgroundColor p-2.5 h-[100px]
min-h-[100px] items-center flex text-left rounded-xl
hover:ring-inset cursor-grab
hover:ring-rose-500 hover:ring-2 relative"
      >
        <textarea
          className="
        h-[100%]
        w-full
        resize-none
        rounded-none
        bg-transparent
        text-white
        focus:outline-none
        "
          value={task.content}
          autoFocus
          placeholder="Write a Task here"
          onBlur={toggleEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEdit();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      style={style}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      onClick={toggleEdit}
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      className="bg-mainBackgroundColor p-2.5 h-[100px]
  min-h-[100px] items-center flex text-left rounded-xl
  hover:ring-inset cursor-grab
  hover:ring-rose-500 hover:ring-2 relative task"
    >
      <p
        className="my-auto h-[90%] 
      w-full 
      overflow-y-auto
      overflow-x-hidden
      whitespace-pre-wrap
      "
      >
        {task.content}
      </p>

      {mouseOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2-translate-1/2
        bg-ColumnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <Delete />
        </button>
      )}
    </div>
  );
};

export default Task;
