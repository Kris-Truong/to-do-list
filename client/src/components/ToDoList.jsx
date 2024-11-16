import React, {useContext} from "react";
import { TodoContext } from "../ToDoContext";

const ToDoList = () => {

    const {items, editingItemId, editText, setEditText, editItem, startEdit, deleteItem} = useContext(TodoContext);

    function editChange (event) {
        const newEditValue = event.target.value;
        setEditText(newEditValue);
    }

    return (
        <div className="list-container">
        <ul>
          {items.map((item) => (
            <li key={item.id} id={item.id}>
              <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              </label>
              {editingItemId === item.id ? (
                <>
                  <input className="edit"
                    type="text"
                    value={editText}
                    onChange={editChange}
                  />
                  <i class="fa fa-check" onClick={editItem} aria-hidden="true"></i>
                </>
              ) : (
                <>
                  {item.title}
                  <i class="fa fa-pencil-square-o" onClick={() => startEdit(item.id, item.title)} aria-hidden="true"></i>
                </>
              )}
              <i class="fa fa-trash-o" onClick={() => deleteItem(item.id)}aria-hidden="true"></i>
            </li>
          ))}
        </ul>
      </div>
    )
}

export default ToDoList;