import React, {useState, createContext, useEffect} from "react";
import axios from "axios";

export const TodoContext = createContext();

const ToDoProvider = ({children}) => {
    const [items, setItems] = useState([]);
    const [inputText, setInputText] = useState("");
    const [editText, setEditText] = useState("");
    const [editingItemId, setEditingItemId] = useState(null); // null to represent the absence of a value
    const API_URL = "http://localhost:4000";
  
    useEffect(() => {
      axios
        .get(API_URL)
        .then((response) => {
          setItems(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error: ", error.message);
        });
    }, []);
  
  
    const addItem = () => {
      // inputText is being sent as json
      axios
        .post(`${API_URL}/add`, { title: inputText })
        .then((response) => {
          setItems([...items, response.data]);
          setInputText("");
        })
        .catch((error) => {
          console.error("Error: ", error.message);
        });
    };
  
    const startEdit = (id, currentTitle) => {
      setEditingItemId(id);
      setEditText(currentTitle);
    };
  
  
    const editItem = () => {
      axios
        .patch(`${API_URL}/edit/${editingItemId}`, { title: editText })
        .then((response) => {
          setItems(
            items.map((item) =>
              item.id === editingItemId ? response.data : item
            )
          );
          setEditingItemId(null); // Reset to null instead of string "null"
          setEditText("");
        })
        .catch((error) => {
          console.error("Error: ", error.message);
        });
    };
  
    const deleteItem = (id) => {
      axios.delete(`${API_URL}/delete/${id}`)
      .then (()=> {
        setItems(items.filter(item => item.id !== id));
      })
      .catch ((error) => {
        console.error("Error: ", error.message);
      })
    };

    return (
        <TodoContext.Provider 
        value = {{
            items,
            inputText,
            editText,
            editingItemId,
            setInputText,
            setEditText,
            addItem,
            startEdit,
            editItem,
            deleteItem,
        }}
        >
            {children}
        </TodoContext.Provider>
    );
};

export default ToDoProvider;
