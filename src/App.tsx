import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ModelTodo {
  id: number;
  title: string;
  description: string;
  createdAt: number;
  hashtag: string[];
}

function App() {
  const [todoList, setTodoList] = useState<ModelTodo[]>([]);
  const [editId, setEditId] = useState<number>(-1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const todoSchema = yup.object().shape({
    title: yup
      .string()
      .required("You must input title first")
      .min(2, "Too Short!"),
    description: yup.string().required("Description should be not empty!"),
  });

  const { handleSubmit } = useForm({
    resolver: yupResolver(todoSchema),
  });

  const onSubmit = () => {
    const todo: ModelTodo = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      title: title,
      description: description,
      createdAt: Date.now(),
      hashtag: [],
    };
    setTodoList([...todoList, todo]);
    setTitle("");
    setDescription("");
  };

  const removeTodo = (todo: ModelTodo) => {
    setTodoList(todoList.filter((prev) => prev.id !== todo.id));
  };

  const handleToggleEdit = (id: number) => {
    if (id === editId) {
      setEditId(-1);
    }
    setEditId(id);
  };

  const updateTodo = (todo: ModelTodo) => {
    const findTodo = todoList.find((item) => item.id === todo.id);
    if (findTodo) {
      setTitle(findTodo?.title);
      setDescription(findTodo?.description);
      handleToggleEdit(findTodo.id);
    }
  };

  const submitEditTodo = () => {
    const data = todoList.map((todo) => {
      if (todo.id === editId) {
        return {
          ...todo,
          title: title,
          description: description,
          createdAt: Date.now(),
          hashtag: [],
        };
      }
      return todo;
    });
    setTodoList(data);
    setEditId(-1);
    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <h1>What Would You To Do Today?</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label>
          Title:
          <input
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            type="text"
            value={title !== "" ? title : ""}
            name="name"
          ></input>
        </label>
        <label>
          Description:
          <input
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            type="text"
            name="name"
            value={description !== "" ? description : ""}
          ></input>
        </label>
        {editId === -1 ? (
          <input
            onSubmit={handleSubmit(onSubmit)}
            type="submit"
            value={editId !== -1 ? "Submit" : "Add Todo"}
          />
        ) : null}
      </form>
      {todoList?.map((e) => (
        <div key={e.id}>
          <p>{e.title}</p>
          <p>{e.description}</p>
          <button onClick={() => removeTodo(e)}>Delete From Todo</button>
          <button onClick={() => updateTodo(e)}>
            {editId === e.id ? "Update" : "Update Todo"}
          </button>
          {editId === e.id ? (
            <button onClick={() => submitEditTodo()}>Submit Edit</button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default App;
