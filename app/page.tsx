'use client'

import { useState, useEffect } from "react";
import { Location, Widget } from "./types";

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({} as Location);
  const [modal, setModalState] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Fetch locations on app load
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8080/locations"); // Replace with your API endpoint
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);  // Empty dependency array ensures it runs only once

  function openModal(location: Location) {
    setSelectedLocation(location);
    setModalState(true);
  }

  async function closeModal() {
    try {
      const response = await fetch(`http://localhost:8080/locations/${selectedLocation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedLocation),
      });
  
      if (response.ok) {
        console.log("Location updated successfully!");
        setNotification("Location updated successfully!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        console.error("Failed to update location.");
      }
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setModalState(false);
    }
  }

  return (
    
    <div className="p-4">
      <header className="bg-green-800 text-white p-4 mb-8 flex items-center">
        <h1 className="text-xl font-bold">Optilogic</h1>
      </header>
      {/* Notification */}
      {notification && (
        <div className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          {notification}
        </div>
      )}

      {/* TABLE */}
      <h2 id="locations-heading" className="text-xl font-bold mb-4">ACME Locations</h2>
      <table
        className="table-auto border-collapse border border-gray-300 w-full"
        aria-labelledby="locations-heading"
      >
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-right">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Number of Widgets</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location: Location, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2 text-right">{location.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{location.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{location.widgets.length}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                <button
                  title="Edit Location"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={() => openModal(location)}
                  >
                    Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    {/* Modal */}
    {modal && selectedLocation && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Location</h2>
        <p className="mb-4">Editing: {selectedLocation.name}</p>
        {selectedLocation.widgets.map((widget: Widget, index: number) => (
          <div>
            <p>Quantity of {widget.name}</p>
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={widget.quantity}
              onChange={(e) => {
                const updatedWidgets = [...selectedLocation.widgets];
                updatedWidgets[index].quantity = parseInt(e.target.value, 10);
                setSelectedLocation({ ...selectedLocation, widgets: updatedWidgets})
              }} 
              />
          </div>
        ) )}
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => closeModal()}
        >Save</button>
      </div>
    </div>
    )}
  </div>  
  )
}
