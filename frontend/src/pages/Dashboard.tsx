import { useEffect, useState } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BACKEND_URL_TASK } from "../config";
import { toast } from 'react-toastify';

interface Task {
    task: string;
    completion: boolean;
    _id: string;
}

const Dashbaord = () => {

    const [text, setText] = useState('');
    const [done, setDone] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `${BACKEND_URL_TASK}/tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTasks(response.data.allTaks);
        } catch (error) {
            console.log(error);
        }
    };


    async function addTask() {
        const task = text;
        const token = localStorage.getItem('token');
        try {

            const response = await axios.post(`${BACKEND_URL_TASK}/create`, { task }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response.data.message);
            setText("");
            fetchTasks();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Status:", error.response?.status);
                console.log("Backend Error:", error.response?.data);
                toast.error(error.response?.data.message);
            } else {
                console.log("Unexpected Error:", error);
            }
        }

        // async function checkCompletion(){
        //     const isDone = done;
        //     const token = localStorage.getItem("token");


        // }




    }

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            <Navbar />
            <div className=" h-[90vh] w-full">
                <div className="bg-black/10 h-[60vh] w-[50vw] border rounded m-auto mt-20">
                    <div className="flex bg-black/10 items-center justify-between h-15">

                        <input type="text" className="outline-1 w-160 p-1 rounded ml-3 h-10" onChange={(e) => setText(e.target.value)}
                            value={text} />

                        <Button lable="Add" styles="bg-green-300 hover:bg-green-500 px-5 mr-3 ml-2" onClick={addTask} />

                    </div>

                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="border-b h-15 flex items-center px-2 justify-between"
                        >
                            <p
                                className={
                                    task.completion
                                        ? "line-through text-gray-500"
                                        : ""
                                }
                            >
                                {task.task}
                            </p>

                            <div className="flex gap-2">

                                <Button lable="Delete" styles="bg-red-300 hover:bg-red-500" onClick={async () => {
                                    const taskId = task._id;
                                    const token = localStorage.getItem("token");
                                    try {

                                        const response = await axios.delete(`${BACKEND_URL_TASK}/delete/${taskId}`, {
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                        });
                                        toast.info(response.data.message);
                                        fetchTasks();
                                    } catch (error) {
                                        if (axios.isAxiosError(error)) {
                                            console.log("Status:", error.response?.status);
                                            console.log("Backend Error:", error.response?.data);
                                            toast.error(error.response?.data.message);
                                        } else {
                                            console.log("Unexpected Error:", error);
                                        }
                                    }
                                }} />
                                <span>
                                    {task.completion ? "✅" : "⏳"}
                                </span>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    )

}

export default Dashbaord;