import React, { useEffect, useState } from "react";
import app from "../config/firebase";
import { getDatabase, push, ref, set, get, remove, onValue, update } from "firebase/database";
// import { Toaster } from "react-hot-toast";

function AppToDo() {

    const db = getDatabase(app);
    const [inputValue, setInputValue] = useState("");
    const [inputValue1, setInputValue1] = useState("");
    const [updateId, setUpdateId] = useState(false);
    const [todolist, setTodolist] = useState([]);
    const [prolist, setProlist] = useState([]);
    const [conlist, setConlist] = useState([]);
    const [source,setSource]=useState("");
    // const [inputValue1, setInputValue1] = useState("");
    // const [inputValue2, setInputValue2] = useState([]);

    // const [tasks, setTasks] = useState({ todo: [], inProgress: [], completed: [] });

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
                const sortData = temp.sort((a,b) => {
                    return a.name.localeCompare(b.name);
                })
                setTodolist(sortData);
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
                const sortData = temp.sort((a,b) => {
                    return a.name.localeCompare(b.name);
                })
                setProlist(sortData);
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
                const sortData = temp.sort((a,b) => {
                    return a.name.localeCompare(b.name);
                })
                setConlist(sortData);
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

    // console.log(todolist);
    const onDragOver = (e) => {
        e.preventDefault();
    };

    const handleRemove = async (id, type) => {
        const dbRef = ref(db, `tasks/${type}/${id}`);
        await remove(dbRef)   
        setInputValue1("");
        fetchData2();
    
    }

    const handleUpdateClick = (source,item,id) => {
        setSource(source);
        setInputValue1(item);
        setUpdateId(id); 
    }

    const updateData = async (e) => {
        e.preventDefault();
        if(!update) {
            alert("No input selected for update");
        }
        console.log(source); 
        const dbRef = ref(db, `tasks/${source}/${updateId}`);
        await update(dbRef, { name: inputValue1 })
            .then(() => {
                alert("Task successfully updated");
                setInputValue1("");
                setUpdateId(null);
                fetchData2();
            })
            .catch((error) => {
                alert("Error updating task: " + error.message);
            });
        
    }

return (
    <div className="cursor-grab">
        <div className="grid grid-cols-1 md:grid-cols-2 m-10 text-center">
            <form onSubmit={saveData}>
                {/* adding */}
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
            <form onSubmit={updateData}>
                {/* update */}
                <div className="my-2">
                    <input
                        type="text"
                        placeholder="Go For Update"
                        className="bg-slate-100 border-2 border-slate-300 rounded-lg p-2 mx-3"
                        value={inputValue1}
                        onChange={(e) => setInputValue1(e.target.value)}
                    />
                    <button type="submit" className="bg-cyan-500 p-2 text-white rounded-md">Update</button>
                </div>
            </form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="m-20">
                <h1 className="my-3 text-center bg-violet-500 p-3 rounded-md text-white text-lg">To Do List</h1>
                <div className="border-2 h-96 relative overflow-auto" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "todo")}>
                    {todolist.map((item, index) => (
                        <div key={index} draggable onDragStart={(e) => onDragStart(e, item.dodoid, "todo")} className="border-4 p-3 m-3 bg-purple-300" onClick={() => handleUpdateClick("todo",item.name,item.dodoid)}>
                            {item.name}
                            <button className="absolute right-1 mx-5 my-0.5 text-red-700" onClick={() => handleRemove(item.dodoid, "todo")} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))}
            </div>
        </div>
        <div className="m-20">
            <h1 className="my-3 text-center bg-yellow-500 p-3 rounded-md text-white text-lg">In Progress</h1>
            <div className="border-2 h-96 relative overflow-auto" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "inProgress")}>
                {prolist.map((item, index) => (
                    <div key={index} draggable onDragStart={(e) => onDragStart(e, item.dodoid, "inProgress")} className="border-4 p-3 m-3 bg-yellow-300"  onClick={() => handleUpdateClick("inProgress",item.name,item.dodoid)}>
                        {item.name}
                        <button className="absolute right-1 mx-5 my-0.5 text-opacity-70 text-red-700" onClick={() => handleRemove(item.dodoid, "inProgress")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
        <div className="m-20">
            <h1 className="my-3 text-center bg-green-500 p-3 rounded-md text-white text-lg">Completed</h1>
            <div className="border-2 h-96 relative overflow-auto" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "completed")}>
                {conlist.map((item, index) => (
                    <div key={index} draggable onDragStart={(e) => onDragStart(e, item.dodoid, "completed")} className="border-4 p-3 m-3 bg-green-300"  onClick={() => handleUpdateClick("completed",item.name,item.dodoid)}>
                        {item.name}
                        <button className="absolute right-1 mx-5 my-0.5 text-opacity-70 text-red-700" onClick={() => handleRemove(item.dodoid, "completed")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    </div>
  );
}

export default AppToDo;
