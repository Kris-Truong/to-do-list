import React, {useContext} from "react";
import { TodoContext } from "../ToDoContext";

const InputForm = () => {
const {inputText, setInputText, addItem} = useContext(TodoContext);

function handleChange (event) {
    const newValue = event.target.value
    setInputText(newValue);
}

    return (
        <div className="form">
        <input className="input-area" type="text" onChange={handleChange} value={inputText} placeholder="Add a new task"/>
        <button onClick={addItem} aria-label="Add Task" style={{ background: "none", border: "none" }}>
             <i className="fa fa-plus-circle" style={{ fontSize: "1.8rem" }}></i>
        </button>
        </div>
    )
}

export default InputForm;