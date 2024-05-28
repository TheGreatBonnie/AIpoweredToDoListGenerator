"use client"; // Indicates that this file is a client-side module

import { TodoItem } from "./TodoItem"; // Importing the TodoItem component
import { nanoid } from "nanoid"; // Importing the nanoid library for generating unique IDs
import { useState } from "react"; // Importing the useState hook from React
import { Todo } from "../types/todo"; // Importing the Todo type

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

// Defining the TodoList component as a functional component
export const TodoList: React.FC = () => {
  // State to hold the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State to hold the current input value
  const [input, setInput] = useState("");

  useCopilotReadable({
    description: "The user's todo list.",
    value: todos,
  });

  // Define the "updateTodoList" action using the useCopilotAction function
  useCopilotAction({
    // Name of the action
    name: "updateTodoList",

    // Description of what the action does
    description: "Update the users todo list",

    // Define the parameters that the action accepts
    parameters: [
      {
        // The name of the parameter
        name: "items",

        // The type of the parameter, an array of objects
        type: "object[]",

        // Description of the parameter
        description: "The new and updated todo list items.",

        // Define the attributes of each object in the items array
        attributes: [
          {
            // The id of the todo item
            name: "id",
            type: "string",
            description:
              "The id of the todo item. When creating a new todo item, just make up a new id.",
          },
          {
            // The text of the todo item
            name: "text",
            type: "string",
            description: "The text of the todo item.",
          },
          {
            // The completion status of the todo item
            name: "isCompleted",
            type: "boolean",
            description: "The completion status of the todo item.",
          },
          {
            // The person assigned to the todo item
            name: "assignedTo",
            type: "string",
            description:
              "The person assigned to the todo item. If you don't know, assign it to 'YOU'.",

            // This attribute is required
            required: true,
          },
        ],
      },
    ],

    // Define the handler function that executes when the action is invoked
    handler: ({ items }) => {
      // Log the items to the console for debugging purposes
      console.log(items);

      // Create a copy of the existing todos array
      const newTodos = [...todos];

      // Iterate over each item in the items array
      for (const item of items) {
        // Find the index of the existing todo item with the same id
        const existingItemIndex = newTodos.findIndex(
          (todo) => todo.id === item.id
        );

        // If an existing item is found, update it
        if (existingItemIndex !== -1) {
          newTodos[existingItemIndex] = item;
        }
        // If no existing item is found, add the new item to the newTodos array
        else {
          newTodos.push(item);
        }
      }

      // Update the state with the new todos array
      setTodos(newTodos);
    },

    // Provide feedback or a message while the action is processing
    render: "Updating the todo list...",
  });

  // Define the "deleteTodo" action using the useCopilotAction function
  useCopilotAction({
    // Name of the action
    name: "deleteTodo",

    // Description of what the action does
    description: "Delete a todo item",

    // Define the parameters that the action accepts
    parameters: [
      {
        // The name of the parameter
        name: "id",

        // The type of the parameter, a string
        type: "string",

        // Description of the parameter
        description: "The id of the todo item to delete.",
      },
    ],

    // Define the handler function that executes when the action is invoked
    handler: ({ id }) => {
      // Update the state by filtering out the todo item with the given id
      setTodos(todos.filter((todo) => todo.id !== id));
    },

    // Provide feedback or a message while the action is processing
    render: "Deleting a todo item...",
  });

  // Function to add a new todo
  const addTodo = () => {
    if (input.trim() !== "") {
      // Check if the input is not empty
      const newTodo: Todo = {
        id: nanoid(), // Generate a unique ID for the new todo
        text: input.trim(), // Trim the input text
        isCompleted: false, // Set the initial completion status to false
      };
      setTodos([...todos, newTodo]); // Add the new todo to the list
      setInput(""); // Clear the input field
    }
  };

  // Function to handle key press events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Check if the Enter key was pressed
      addTodo(); // Add the todo
    }
  };

  // Function to toggle the completion status of a todo
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  // Function to delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Function to assign a person to a todo
  const assignPerson = (id: string, person: string | null) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, assignedTo: person ? person : undefined }
          : todo
      )
    );
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          className="border rounded-md p-2 flex-1 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update the input state on change
          onKeyDown={handleKeyPress} // Handle the Enter key press
        />
        <button
          className="bg-blue-500 rounded-md p-2 text-white"
          // Add the todo on button click
          onClick={addTodo}>
          Add Todo
        </button>
      </div>
      {todos.length > 0 && ( // Check if there are any todos
        <div className="border rounded-lg">
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id} // Unique key for each todo item
              todo={todo} // Pass the todo object as a prop
              toggleComplete={toggleComplete} // Pass the toggleComplete function as a prop
              deleteTodo={deleteTodo} // Pass the deleteTodo function as a prop
              assignPerson={assignPerson} // Pass the assignPerson function as a prop
              hasBorder={index !== todos.length - 1} // Conditionally add a border to all but the last item
            />
          ))}
        </div>
      )}
    </div>
  );
};
