import { useState } from "react";
import { useEffect } from "react";

export default function App() {
  const [userModel, setUserModal] = useState(false);
  const [persons, setPerson] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then(data => setPerson(data));
  }, []);

  function handleModal(person = null) {
    setSelectedPerson(person); // null means Add User
    setUserModal(true);
  }
  


  return (
    <>
      <div className="min-h-screen text-gray-100">
        <h1 className="font-bold text-5xl leading-[1.5] mb-6 text-white">
          User Details
        </h1>
        <div className="w-full flex justify-end mb-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            onClick={() => handleModal()}
          >
            Add User
          </button>
        </div>
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 text-gray-200">Id</th>
              <th className="py-2 px-4 border-b border-gray-700 text-gray-200">Name</th>
              <th className="py-2 px-4 border-b border-gray-700 text-gray-200">Age</th>
              <th className="py-2 px-4 border-b border-gray-700 text-gray-200">Email</th>
              <th className="py-2 px-4 border-b border-gray-700 text-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person, index) => (
              <tr key={person.id} className="hover:bg-gray-700">
                <td className="py-2 px-4 border-b border-gray-700">{++index}</td>
                <td className="py-2 px-4 border-b border-gray-700">{person.name}</td>
                <td className="py-2 px-4 border-b border-gray-700">{person.age}</td>
                <td className="py-2 px-4 border-b border-gray-700">{person.email}</td>
                <td className="py-2 px-4 border-b border-gray-700">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                    onClick={() => handleModal(person)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() =>
                      fetch(`http://localhost:5000/users/${person._id}`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: person._id }),
                      })
                      .then(() => {
                        setPerson((prev) => prev.filter((p) => p._id !== person._id));
                      })
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userModel && (
        <UserModal
          setUserModal={setUserModal}
          setPerson={setPerson}
          person={selectedPerson}
        />
      )}
    </>
  );
}



function UserModal({ setUserModal, setPerson, person }) {
  const [name, setName] = useState(person?.name || "");
  const [age, setAge] = useState(person?.age || "");
  const [email, setEmail] = useState(person?.email || "");

  async function handleSubmit(e) {
    e.preventDefault();

    if (person) {
      // Update existing user
      try {
        const response = await fetch(`http://localhost:5000/users/${person._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, age, email }),
        });
        const updatedUser = await response.json();
        setPerson((prev) =>
          prev.map((p) => (p._id === person.id ? updatedUser : p))
        );
      }
      catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      // Add new user
      try {
        const response = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, age, email }),
        });
        const newUser = await response.json();
        setPerson((prev) => [...prev, newUser]);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }

    setUserModal(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-70"
        onClick={() => setUserModal(false)}
      ></div>

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md z-10 text-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {person ? "Update User" : "Add User"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="border border-gray-700 bg-gray-900 rounded px-3 py-2 text-gray-100 placeholder-gray-400"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border border-gray-700 bg-gray-900 rounded px-3 py-2 text-gray-100 placeholder-gray-400"
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            className="border border-gray-700 bg-gray-900 rounded px-3 py-2 text-gray-100 placeholder-gray-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </form>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl"
          onClick={() => setUserModal(false)}
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
