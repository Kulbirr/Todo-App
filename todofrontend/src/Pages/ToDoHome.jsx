import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ToDoHome({ isLoggedIn }) {
    const [tittle, setTittle] = useState({ tittle: "", description: "" });
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();
    const TodoApi = process.env.REACT_APP_TODO_API_URL;
    const UserApi = process.env.REACT_APP_USER_API_URL;

    // Change handler for both inputs
    function changeHandler(event) {
        const { name, value } = event.target;
        setTittle((prev) => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchAllToDos();
        } else {
            navigate("/login"); // Redirect to login if token is missing
        }
    }, [isLoggedIn]);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
        },
    };

    async function createToDo(e) {
        e.preventDefault();
        // Prepare the data to send to the API
        const data = {
            tittle: tittle.tittle,
            description: tittle.description,
        };

        try {
            const response = await axios.post(`${TodoApi}/add`, data, config);
            const newTodo = response.data;
            // Immediately add the new todo to the list
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            // Reset input fields after adding
            setTittle({ tittle: "", description: "" });
        } catch (error) {
            console.log("Inside createToDo error", error);
        }
    }

    async function fetchAllToDos() {
        try {
            const { data } = await axios.get(`${UserApi}/get-todos`, config);
            // console.log(data.flat());
            setTodos(data.flat());
        } catch (error) {
            console.log("Inside fetchAllToDos error", error);
        }
    }

    // Monitor todos array and ensure re-render happens
    // useEffect(() => {
    //     // This effect will trigger re-renders when todos change
    //     console.log('Todos have been updated', todos);
    // }, [todos]);

    async function deleteHandler(id) {
        try {
            await axios.delete(`${TodoApi}/delete?id=${id}`, config);
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.log("id",);
            console.log("Error inside deleteHandler: ", error);
        }
    }

    return (
        <div className="w-[50vw] h-[80vh] bg-white shadow-xl rounded-xl overflow-hidden">
            <form onSubmit={createToDo} className="bg-gradient-to-r from-[#6C7A89] to-[#758AA2] p-6 flex flex-wrap gap-5 justify-center items-center rounded-t-xl shadow-lg">
                <input
                    className="w-[40%] px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    type="text"
                    name="tittle"
                    placeholder="Enter Title"
                    value={tittle.tittle}
                    onChange={changeHandler}
                />

                <input
                    className="w-[40%] px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text"
                    name="description"
                    placeholder="Enter Description"
                    value={tittle.description}
                    onChange={changeHandler}
                />

                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none rounded-md shadow-md transition ease-in-out duration-200"
                >
                    Add Todo
                </button>
            </form>

            <h1 className="text-black text-center py-4 font-bold text-2xl tracking-wide">List Of Todos</h1>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[48vh] bg-gray-50 rounded-b-xl">
                {todos.map((item, index) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-200">
                        <div>
                            <p className="text-gray-800 font-medium">
                                {index + 1}. {item.tittle}: {item.description}
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => deleteHandler(item.id)}
                                className="text-red-600 hover:text-white focus:outline-none rounded-full hover:bg-red-600 p-2 transition ease-in-out duration-200"
                                aria-label="Delete"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}