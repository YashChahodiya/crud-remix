import { useNavigate, useParams } from "@remix-run/react";
import React, { useEffect, useState } from "react";

interface DataItem {
  id: string;
  name: string;
  field: string;
}

const Users: React.FC<DataItem> = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editField, setEditField] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("data"));
    if (storedData) {
      const filteredData = storedData.filter((item) => item.id === id);
      setData(filteredData);
      setData1(storedData); // Set data1 from localStorage
    } else {
      setData([]);
      setData1([]);
    }
  }, [data1]);

  const handleDelete = (itemId) => {
    const updatedData = data1.filter((item) => item.id !== itemId);
    setData1(updatedData); // Update data1 without the deleted item

    // Update localStorage

    localStorage.setItem("data", JSON.stringify(updatedData));
    window.location.href = "/";
  };

  const handleEdit = (itemId) => {
    const itemToEdit = data1.find((item) => item.id === itemId);
    if (itemToEdit) {
      setEditIndex(itemId);
      setEditName(itemToEdit.name);
      setEditField(itemToEdit.field);
    }
  };

  const handleSave = () => {
    const updatedData = data1.map((item) =>
      item.id === editIndex
        ? { ...item, name: editName, field: editField }
        : item
    );
    setData1(updatedData); // Update data1 with edited item

    // Update localStorage
    localStorage.setItem("data", JSON.stringify(updatedData));

    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditName("");
    setEditField("");
  };

  const navigateToMainPage = () => {
    window.location.href = "/";
  };

  return (
    <div className="bg-black h-screen overflow-hidden">
      <div className="max-w-2xl mx-auto mt-8  ">
        <button
          onClick={navigateToMainPage}
          className="inline-block px-5 py-2 mb-10 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none "
        >
          Back to Main Page
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">User Details : </h2>
        {data.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item.id} className="bg-zinc-900">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {editIndex === item.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {editIndex === item.id ? (
                      <input
                        type="text"
                        value={editField}
                        onChange={(e) => setEditField(e.target.value)}
                        className="w-full px-3 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    ) : (
                      item.field
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {editIndex === item.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="inline-block px-3 py-2 mr-2 bg-green-600 text-black rounded-md hover:bg-green-800 focus:outline-none "
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="inline-block px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(item?.id)}
                          className="inline-block px-5 py-2 mr-2 bg-sky-700 text-white rounded-md hover:bg-sky-900 focus:outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-block px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none "
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
