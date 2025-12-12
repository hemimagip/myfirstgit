"use client";

import {useReducer, useState} from "react";
import styles from "./page.module.css";

function TodoReducer(state, action)
{
    switch (action.type)
    {
        case"ADD_TODO":
        return[...state,{id:Date.now(),text:action.payload.text,duration:action.payload.duration,completed:false}];
        case"DELETE_TODO":
        return state.filter((todo)=>todo.id!==action.payload);
        case"COMPLETE_TODO":
        return state.map((todo)=>todo.id===action.payload?{...todo,completed:!todo.completed}:todo);
        default:
            return state;
    }
}
export default function TodoApp(){ 
    const[todos,dispatch]=useReducer(TodoReducer,[]);
    const[input,setInput]=useState("");
    const[duration,setDuration]=useState("");
    const[showCongrats,setShowCongrats]=useState(false);
    const[congratsMessage,setCongratsMessage]=useState("");
    
    const addTodo=()=>
        {
        if(input.trim()==="")return;
        dispatch({type:"ADD_TODO",payload:{text:input,duration:duration||"No duration"}});
        setInput("");
        setDuration("");
    };
    
    const handleComplete=(todoId)=>{
        dispatch({type:"COMPLETE_TODO",payload:todoId});
        setCongratsMessage("🎉 Congratulations! Task Completed!");
        setShowCongrats(true);
        setTimeout(()=>setShowCongrats(false),3000);
        
        const updatedTodos = todos.map((todo)=>todo.id===todoId?{...todo,completed:!todo.completed}:todo);
        const completedAll = updatedTodos.every(t=>t.completed);
        
        if(completedAll && todos.length > 0){
            setTimeout(()=>{
                setCongratsMessage("🎊 TODAY ENDED WITH SUCCESS!! 🎊");
                setShowCongrats(true);
            },3500);
        }
    };
    
    const allCompleted = todos.length > 0 && todos.every(t=>t.completed);
    
    return(<div className={styles.container}>
           <h2 className={styles.title}>What TODO Today !!</h2>
           <div className={styles.inputContainer}>
            <input className={styles.input} placeholder="Add Task" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <input className={styles.durationInput} type="text" placeholder="Duration (e.g., 30min)" value={duration} onChange={(e)=>setDuration(e.target.value)}/>
             <button className={styles.button} onClick={addTodo}>Add</button>
           </div>
           
           {showCongrats && <div className={`${styles.congratsMessage} ${allCompleted?styles.blast:""}`}>{congratsMessage}</div>}
           
           <ul className={styles.todoList}>
            {todos.length === 0 ? (
              <li className={styles.emptyState}>No todos yet. Add one to get started!</li>
            ) : (
              todos.map(todo=>(<li key={todo.id} className={`${styles.todoItem} ${todo.completed?styles.completed:""}`}>
              <div className={styles.todoContent}>
                <input type="checkbox" checked={todo.completed} onChange={()=>handleComplete(todo.id)} className={styles.checkbox}/>
                <span className={styles.todoText}>{todo.text}</span>
                <span className={styles.duration}>⏱️ {todo.duration}</span>
              </div>
              <button className={styles.deleteButton} onClick={()=>dispatch({type:"DELETE_TODO",payload:todo.id})}>Delete</button></li>))
            )}
    </ul>
    </div>);
}