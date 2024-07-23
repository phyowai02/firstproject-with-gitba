import React, { useEffect, useState } from "react";
import app from "../config/firebase";
import { getDatabase, push, ref, set, get, remove, onValue } from "firebase/database";
// import { Toaster } from "react-hot-toast";

function AppToDo() {

    const db = getDatabase(app);
    const [inputValue, setInputValue] = useState("");
    const [todolist, setTodolist] = useState([]);
    const [prolist, setProlist] = useState([]);
    const [conlist, setConlist] = useState([]);
    // const [inputValue1, setInputValue1] = useState("");
    // const [inputValue2, setInputValue2] = useState([]);

    const [tasks, setTasks] = useState({ todo: [], inProgress: [], completed: [] });

    // const saveData = async (e) => {

    //     e.preventDefault();
    //     if(inputValue1.trim() === ''){
    //         alert("Task cannot be empty");
    //         return;
    //     }
    //     const db = getDatabase(app);
    //     const newDoc = push(ref(db, "task/todo"));

    //     inputValue1=="" ? alert("empty") : 
    //     set (newDoc, {
    //         name: inputValue1,
    //     }).then( () => {
    //         alert("successful")
    //     }).catch((error)=> {
    //         alert("error: " + error.message)
    //     })
    // }

    const saveData = async (e) => {

        e.preventDefault();
        // if (inputValue.length == 0) {
        //     alert("Task cannot be empty");
        //     return;
        // }
        if (inputValue.trim() === '') {
            alert("Input cannot be empty");
            return;
        }
        const newDoc = push(ref(db, "tasks/todo"));
        set(newDoc, { name: inputValue }).then(() => {
            alert("Successfully added");
            setInputValue("");
            // fetchData();
            fetchData2();

        }).catch((error) => {
            alert("Error: " + error.message);
        });
    };

    // //read data
    // const fetchData = async () => {
    //     const db = getDatabase(app);
    //     const dbRef = ref(db, "task/todo");
    //     const snapshot = await get(dbRef);
    //     if(snapshot.exists()){
    //         setInputValue2(Object.values(snapshot.val()));
    //     } else {
    //         alert("error");
    //     }
    // }

    // const fetchData = async () => {
    //     const dbRef = ref(db, "tasks");
    //     const snapshot = await get(dbRef);
    //     if (snapshot.exists()) {
    //         const data = snapshot.val();
    //         setTasks({
    //             todo: data.todo ? Object.entries(data.todo) : [],
    //             inProgress: data.inProgress ? Object.entries(data.inProgress) : [],
    //             completed: data.completed ? Object.entries(data.completed) : []
    //         });
    //     } else {
    //         setTasks({ todo: [], inProgress: [], completed: [] });
    //     }
    // };

    const fetchData2 = () => {
        const dodo1 = ref(db, "tasks/todo");
        onValue(dodo1, snapshot => {
            const data = snapshot.val();
            if(data) {
                // console.log(data);
                const temp = Object.keys(data).map(id => ({
                    ...data[id], dodoid: id
                }))
                setTodolist(temp);
            }
            else {
                setTodolist([]);
            }
        })

        const dodo2 = ref(db, "tasks/inProgress");
        onValue(dodo2, snapshot => {
            const data = snapshot.val();
            if(data) {
                const temp = Object.keys(data).map(id => ({
                    ...data[id], dodoid: id
                }))
                setProlist(temp);
            }
            else {
                setProlist([]);
            }
        })

        const dodo3 = ref(db, "tasks/completed");
        onValue(dodo3, snapshot => {
            const data = snapshot.val();
            if(data) {
                const temp = Object.keys(data).map(id => ({
                    ...data[id], dodoid: id
                }))
                setConlist(temp);
            }
            else {
                setConlist([]);
            }
        })


    }

    useEffect(() => {
        fetchData2();
    }, []);

    const onDragStart = (e, id, category) => {
        e.dataTransfer.setData("id", id);
        e.dataTransfer.setData("category", category);
    };

    const onDrop = async (e, newCategory) => {
        const id = e.dataTransfer.getData("id");
        const oldCategory = e.dataTransfer.getData("category");
        // console.log(oldCategory);
        // console.log(newCategory);
        if (oldCategory !== newCategory) {
            const taskRef = ref(db, `tasks/${oldCategory}/${id}`);
            const taskSnapshot = await get(taskRef);
            if (taskSnapshot.exists()) {
                const taskData = taskSnapshot.val();
                await remove(taskRef);
                const newTaskRef = push(ref(db, `tasks/${newCategory}`));
                await set(newTaskRef, taskData);
                fetchData2();
            }
        }
    };

    console.log(todolist);
    const onDragOver = (e) => {
        e.preventDefault();
    };

return (
    <div className="cursor-grab">
        <form className="text-center m-10" onSubmit={saveData}>
            <input
                // {inputValue2.map((item,index)=>(
                //     <div key={index}>
                //         <div draggable className="border-4 p-3 m-3 bg-purple-300">{item.name}</div>
                //     </div>
                //     ))}
                type="text"
                placeholder="Enter Something"
                className="bg-slate-100 border-2 border-slate-300 rounded-lg p-2 mx-3"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="bg-red-500 p-2 text-white rounded-md">Submit</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="m-20">
                <h1 className="my-3">To Do List</h1>
                <div className="border-2 h-96" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "todo")}>
                    {todolist.map((item, index) => (
                        <div key={index} draggable onDragStart={(e) => onDragStart(e, item.dodoid, "todo")} className="border-4 p-3 m-3 bg-purple-300">
                            {item.name}
                        </div>
                    ))}
            </div>
        </div>
        <div className="m-20">
            <h1 className="my-3">In Progress</h1>
            <div className="border-2 h-96" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "inProgress")}>
                {prolist.map((item, index) => (
                    <div key={index} draggable onDragStart={(e) => onDragStart(e, item.dodoid, "inProgress")} className="border-4 p-3 m-3 bg-yellow-300">
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
        <div className="m-20">
            <h1 className="my-3">Completed</h1>
            <div className="border-2 h-96" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "completed")}>
                {conlist.map((item, index) => (
                    <div key={index} draggable onDragStart={(e) => onDragStart(e, item.dodoid, "completed")} className="border-4 p-3 m-3 bg-green-300">
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
        </div>
    </div>
  );
}

export default AppToDo;
