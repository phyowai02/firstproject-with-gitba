import React, { useEffect, useState } from 'react';
import app from "../config/firebase";
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';

function Testing() {

    const db = getDatabase(app);
    const [inputValue, setInputValue ] = useState("");

    const [tasks, setTasks] = useState({ todo: [], inProgress: [], completed: []});

    const saveDate = async(e) => {

        e.preventDefault();
        if(inputValue.trim() === '') {
            alert("cannot be empty");
            return;
        }
        const newDoc = push(ref(db, "tasks/todo"));
        set(newDoc, {name : inputValue}).then(() => {
            alert("Successfully added");
            setInputValue("");
        }).catch((error) => {
            alert("Error: " + error.message);
        });

    };

    const fetchData = async () => {
        const dbRef = ref(db, "task");
        const snapshot = await get(dbRef);
        if (snapshot.exists()){
            const data = snapshot.val();
            setTasks({
                todo: data.todo ? Object.entries(data.todo) : [],
                inProgress: data.inProgress ? Object.entries(data.inProgress) : [],
                completed: data.completed ? Object.entries(data.completed) : []
            });
        }else {
            setTasks({ todo: [], inProgress: [], completed: []})
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const onDragStart = (e, id, category) => {
        e.dataTransfer.setData("id", id);
        e.dataTransfer.setData("category", category);
    };

    const onDrop = async(e, newCategory) => {
        const id = e.dataTransfer.getData("id");
        const oldCategory = e.dataTransfer.getData("category");

        if(oldCategory !== newCategory) {
            const taskRef = ref(db, `tasks/${oldCategory}/${id}`);
            const taskSnapshot = await get(taskRef);
            if(taskSnapshot(exists)){
                const taskData = taskSnapshot.val();
                await remove(taskRef);
                const newTaskRef  = push(ref(db, `tasks/${newCategory}`));
                await set(newTaskRef, taskData);
                fetchData();
            }
        }

    }
}

export default Testing;