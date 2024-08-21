/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../../types';
import classNames from 'classnames';

import TodosContext from '../../contexts/Todos/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoCard = ({ todo }: Props) => {
  const { deleteTodo, updateTodo } = TodosContext.useContract();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const isMock = todo.id < 0;

  const handleDeleteTodo = async () => {
    setIsUpdating(true);

    await deleteTodo(todo.id);

    setIsUpdating(false);
  };

  const handleUpdateTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;

    setIsEditing(false);
    setIsUpdating(true);

    if (!title) {
      await deleteTodo(todo.id);
    } else {
      await updateTodo(todo.id, { title });
    }

    setIsUpdating(false);
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);

    await updateTodo(todo.id, { completed: !todo.completed });

    setIsUpdating(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          onClick={handleToggleComplete}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateTodo}>
          <input
            name="title"
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}

          <button
            onClick={handleDeleteTodo}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            style={{ visibility: isHover ? 'visible' : 'hidden' }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdating || isMock,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );

  // return (
  //   <>
  //     {/* This is a completed todo */}
  //     <div data-cy="Todo" className="todo completed">
  //       <label className="todo__status-label">
  //         <input
  //           data-cy="TodoStatus"
  //           type="checkbox"
  //           className="todo__status"
  //           checked
  //         />
  //       </label>

  //       <span data-cy="TodoTitle" className="todo__title">
  //         Completed Todo
  //       </span>

  //       {/* Remove button appears only on hover */}
  //       <button type="button" className="todo__remove" data-cy="TodoDelete">
  //         ×
  //       </button>

  //       {/* overlay will cover the todo while it is being deleted or updated */}
  //       <div data-cy="TodoLoader" className="modal overlay">
  //         <div className="modal-background has-background-white-ter" />
  //         <div className="loader" />
  //       </div>
  //     </div>

  //     {/* This todo is an active todo */}
  //     <div data-cy="Todo" className="todo">
  //       <label className="todo__status-label">
  //         <input
  //           data-cy="TodoStatus"
  //           type="checkbox"
  //           className="todo__status"
  //         />
  //       </label>

  //       <span data-cy="TodoTitle" className="todo__title">
  //         Not Completed Todo
  //       </span>
  //       <button type="button" className="todo__remove" data-cy="TodoDelete">
  //         ×
  //       </button>

  //       <div data-cy="TodoLoader" className="modal overlay">
  //         <div className="modal-background has-background-white-ter" />
  //         <div className="loader" />
  //       </div>
  //     </div>

  //     {/* This todo is being edited */}
  //     <div data-cy="Todo" className="todo">
  //       <label className="todo__status-label">
  //         <input
  //           data-cy="TodoStatus"
  //           type="checkbox"
  //           className="todo__status"
  //         />
  //       </label>

  //       {/* This form is shown instead of the title and remove button */}
  //       <form>
  //         <input
  //           data-cy="TodoTitleField"
  //           type="text"
  //           className="todo__title-field"
  //           placeholder="Empty todo will be deleted"
  //           value="Todo is being edited now"
  //         />
  //       </form>

  //       <div data-cy="TodoLoader" className="modal overlay">
  //         <div className="modal-background has-background-white-ter" />
  //         <div className="loader" />
  //       </div>
  //     </div>

  //     {/* This todo is in loadind state */}
  //     <div data-cy="Todo" className="todo">
  //       <label className="todo__status-label">
  //         <input
  //           data-cy="TodoStatus"
  //           type="checkbox"
  //           className="todo__status"
  //         />
  //       </label>

  //       <span data-cy="TodoTitle" className="todo__title">
  //         Todo is being saved now
  //       </span>

  //       <button type="button" className="todo__remove" data-cy="TodoDelete">
  //         ×
  //       </button>

  //       {/* 'is-active' class puts this modal on top of the todo */}
  //       <div data-cy="TodoLoader" className="modal overlay is-active">
  //         <div className="modal-background has-background-white-ter" />
  //         <div className="loader" />
  //       </div>
  //     </div>
  //   </>
  // );
};
