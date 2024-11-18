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
                  <button onClick={editItem}  aria-label={`Done Edit Task ${item.id}`} style={{ background: "none", border: "none" }}>
                  <i class="fa fa-check" style={{ fontSize: "1.5rem" }}></i>
                  </button>
                </>
              ) : (
                <>
                  {item.title}
                  <button onClick={() => startEdit(item.id, item.title)} aria-label={`Edit Task ${item.id}`} style={{ background: "none", border: "none" }}>
                  <i class="fa fa-pencil-square-o" style={{ fontSize: "1.5rem" }}></i>
                  </button>
                </>
              )}
              <button onClick={() => deleteItem(item.id)} aria-label={`Delete Task ${item.id}`} style={{ background: "none", border: "none" }}>
              <i class="fa fa-trash-o" style={{ fontSize: "1.5rem" }}></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
}

export default ToDoList;