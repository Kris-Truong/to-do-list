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
        <input className="input-area" type="text" onChange={handleChange} value={inputText} />
        <i className="fa fa-plus-circle" onClick={addItem} aria-hidden="true" style={{fontSize:"1.5rem"}}></i>
        </div>
    )
}

export default InputForm;