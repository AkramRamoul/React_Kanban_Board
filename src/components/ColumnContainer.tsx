import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Delete from "../icons/Delete";
import { column, Id, task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import Task from "./Task";

interface Props {
  column: column;
  deleteColumn: (id: Id) => void;
  updateTitle: (id: Id, title: string) => void;
  createTask: (ColumnID: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: task[];
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateTitle,
    createTask,
    updateTask,
    tasks,
    deleteTask,
  } = props;
  const [edit, setEdit] = useState<boolean>(false);
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: edit,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
  bg-ColumnBackgroundColor
  w-[350px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col
  opacity-60
  border-2
  border-rose-500
  "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  bg-ColumnBackgroundColor
  w-[350px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col
  "
    >
      {/*title*/}
      <div
        onClick={() => {
          setEdit(true);
        }}
        {...attributes}
        {...listeners}
        className="
      bg-mainBackgroundColor
       text-md h-[60px] 
       cursor-grab 
       rounded-t-md
       rounded-b-none
       p-3
       font-bold
       border-ColumnBackgroundColor
       border-4
       flex 
       items-center
       justify-between"
      >
        <div className="flex gap-2">
          <div
            className="
        flex 
        justify-center 
        items-center
        bg-ColumnBackgroundColor
        px-2
        p-1
        text-sm
        rounded-full
        "
          >
            {tasks.length}
          </div>
          {!edit && column.title}
          {edit && (
            <input
              value={column.title}
              onChange={(e) => updateTitle(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEdit(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEdit(false);
              }}
              className="bg-black
              focus:border-rose-500 border
              rounded outline-none px-2
              "
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
          stroke-gray-500
          hover:stroke-white
          px-1
          py-2
          hover:bg-ColumnBackgroundColor
          rounded
        "
        >
          <Delete />
        </button>
      </div>

      <div
        className="flex flex-grow flex-col gap-4 p-4
      overflow-x-hidden overflow-y-auto"
      >
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 
        items-center border-ColumnBackgroundColor border-2
        rouded-md p-4 hover:bg-mainBackgroundColor
        hover:text-rose-500 active:bg-black
        rounded-md
       "
      >
        <PlusIcon /> Add Task
      </button>
    </div>
  );
};

export default ColumnContainer;
