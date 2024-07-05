import React, { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";

interface DataItem {
  id: string;
  name: string;
  field: string;
}

const TableData: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DataItem[]>([]);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [fieldError, setFieldError] = useState<string>("");
  const [editIndex, setEditIndex] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      setData([]);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("data", JSON.stringify(data));
    }
  }, [data]);

  const validateForm = (): boolean => {
    let isValid = true;
    if (name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (field.trim() === "") {
      setFieldError("Field is required");
      isValid = false;
    } else {
      setFieldError("");
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (validateForm()) {
      if (editIndex !== null) {
        // Update existing data item if editing
        const updatedData = data.map((item) =>
          item.id === editIndex ? { ...item, name, field } : item
        );
        setData(updatedData);
        setEditIndex(null);
      } else {
        // Add new data item if not editing
        const newId = uuidv4();
        setData([...data, { id: newId, name, field }]);
      }
      setName("");
      setField("");
    }
  };

  const handleEdit = (id: string): void => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setName(itemToEdit.name);
      setField(itemToEdit.field);
      setEditIndex(id);
    }
  };

  const handleDelete = (id: string): void => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    if (editIndex === id) {
      setEditIndex(null);
      setName("");
      setField("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 pt-32">CRUD in Remix :</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              nameError ? "border-red-500" : "border-gray-300 text-black"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {nameError && (
            <p className="text-sm text-red-500 mt-1">{nameError}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="field"
            className="block text-sm font-medium text-white"
          >
            Field:
          </label>
          <input
            type="text"
            id="field"
            name="field"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              fieldError ? "border-red-900" : "border-gray-300 text-black"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {fieldError && (
            <p className="text-sm text-red-500 mt-1">{fieldError}</p>
          )}
        </div>
        <button
          type="submit"
          className="inline-block px-4 py-2 ml-64 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 "
        >
          {/* // {editIndex !== null ? "Update" : "Add"} */}
          {"Add"}
        </button>
      </form>

      {data.length > 0 && (
        <table className="w-full border-collapse border border-gray-200 ">
          <thead className="bg-gray-100 bg-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Field
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className={item.id % 2 === 0 ? "bg-gray-700" : "bg-zinc-900 "}
              >
                <td className="px-6 py-4  text-[20] font-medium text-white">
                  {item.name}
                </td>
                <td className="px-6 py-4  text-[20] font-medium text-white">
                  {item.field}
                </td>
                <td className="px-6 py-4  text-sm text-center">
                  <button
                    onClick={() => navigate(`/users/${item.id}`)}
                    className="inline-block px-4 py-2  ml-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableData;
