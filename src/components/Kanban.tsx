import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { column, Id, task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Task from "./Task";
import useLocalStorage from "../hooks/useLocalStorage";

const Kanban = () => {
  const [columns, setColumns] = useLocalStorage<column[]>("columns", []);
  const [tasks, setTasks] = useLocalStorage<task[]>("tasks", []);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<column | null>(null);
  const [activeTask, setActiveTask] = useState<task | null>(null);

  const createTask = (ColumnID: Id) => {
    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        content: `Task ${tasks.length + 1}`,
        columnId: ColumnID,
      },
    ]);
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const updateTitle = (id: Id, title: string) => {
    setColumns((current) =>
      current.map((col) => (col.id === id ? { ...col, title } : col))
    );
  };

  const deleteTask = (id: Id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const updateTask = (id: Id, content: string) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const createColumn = () => {
    setColumns((current) => [
      ...current,
      { title: `Column ${columns.length + 1}`, id: crypto.randomUUID() },
    ]);
  };

  const deleteColumn = (id: Id) => {
    setColumns((current) => current.filter((col) => col.id !== id));
    setTasks((current) => current.filter((task) => task.columnId !== id));
  };

  const getColumnPos = (id: Id): number => {
    return columns.findIndex((col) => col.id === id);
  };

  const getTaskPos = (id: Id): number => {
    return tasks.findIndex((task) => task.id === id);
  };

  const OnDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activepos = getColumnPos(activeColumnId);
      const overpos = getColumnPos(overColumnId);
      return arrayMove(columns, activepos, overpos);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = getTaskPos(activeId);
        const overIndex = getTaskPos(overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = getTaskPos(activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden p-[40px]">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={OnDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  deleteColumn={deleteColumn}
                  key={column.id}
                  column={column}
                  updateTitle={updateTitle}
                  createTask={createTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-ColumnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
            onClick={createColumn}
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                updateTask={updateTask}
                deleteTask={deleteTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                createTask={createTask}
                updateTitle={updateTitle}
                column={activeColumn}
                deleteColumn={deleteColumn}
              />
            )}
            {activeTask && (
              <Task
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default Kanban;
