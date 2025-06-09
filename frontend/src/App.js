import React, { useState, useEffect } from 'react';

// Helper component for icons
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const UserPlusIcon = () => <Icon path="M16 9v6h-2V9h-2v6H8V9H6v6H4v3h16v-3h-2V9h-2zm-4-7c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const TrashIcon = () => <Icon path="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />;
const SendIcon = () => <Icon path="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />; // Using a send icon

// Main App Component
export default function App() {
  const [people, setPeople] = useState([]);
  const [personName, setPersonName] = useState('');
  const [orderCost, setOrderCost] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSending, setIsSending] = useState(false); // To show loading state on button

  // Effect to recalculate total when people list changes
  useEffect(() => {
    const currentTotal = people.reduce((sum, person) => sum + parseFloat(person.cost || 0), 0);
    setTotalCost(currentTotal);
  }, [people]);

  // Function to handle adding a new person
  const handleAddPerson = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!personName.trim()) {
      setModalMessage("Please enter a name for the person.");
      setShowModal(true);
      return;
    }
    const cost = parseFloat(orderCost);
    if (isNaN(cost) || cost <= 0) {
      setModalMessage("Please enter a valid positive cost for the order.");
      setShowModal(true);
      return;
    }

    setPeople([...people, { id: Date.now(), name: personName, cost: cost }]);
    setPersonName('');
    setOrderCost('');
  };

  // Function to remove a person from the list
  const handleRemovePerson = (id) => {
    setPeople(people.filter(person => person.id !== id));
  };

  // Function to send data to the backend
  const handleSendData = async () => {
    if (people.length === 0) {
      setModalMessage("There are no orders to send.");
      setShowModal(true);
      return;
    }

    setIsSending(true); // Indicate that sending is in progress
    setModalMessage("Sending data to server..."); // Initial modal message
    setShowModal(true);


    // Prepare data in the format {name: string, cost: number}
    const ordersList = people.map(person => ({
      name: person.name,
      cost: parseFloat(person.cost)
    }));

    // Format data as { orders: [...] }
    const dataToSend = { orders: ordersList };

    try {
      const response = await fetch('http://127.0.0.1:5000/select_person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json(); // Assuming server sends back JSON
        setModalMessage(`${result.message} is paying!`);
        // Optionally, you could clear the list here if needed:
        //setPeople([]);
      } else {
        // Handle HTTP errors like 404, 500 etc.
        const errorData = await response.text(); // Or response.json() if server sends structured error
        setModalMessage(`Error sending data: ${response.status} ${response.statusText}. ${errorData ? `Server says: ${errorData}` : ''}`);
      }
    } catch (error) {
      // Handle network errors or other issues with the fetch call
      console.error("Failed to send data:", error);
      setModalMessage(`Failed to send data. Please check your connection or the server. Error: ${error.message}`);
    } finally {
      setIsSending(false); // Reset sending state
      // Keep modal open to show final status, user will close it.
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center p-4 font-sans">
      {/* App Title */}
      <header className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-sky-400">Order Cost Tracker</h1>
        <p className="mt-2 text-lg text-slate-400">Add people and their order costs, then send the data.</p>
      </header>

      <main className="w-full max-w-2xl bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8">
        {/* Input Form */}
        <form onSubmit={handleAddPerson} className="mb-8 space-y-6">
          <div className="space-y-3">
            <div>
              <label htmlFor="personName" className="block text-sm font-medium text-sky-300 mb-1">
                Person's Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserPlusIcon className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  id="personName"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  className="block w-full rounded-lg border-slate-700 bg-slate-900 py-3 pl-10 pr-3 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="orderCost" className="block text-sm font-medium text-sky-300 mb-1">
                Order Cost ($)
              </label>
              <div className="relative rounded-md shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                   <span className="text-slate-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="orderCost"
                  value={orderCost}
                  onChange={(e) => setOrderCost(e.target.value)}
                  placeholder="e.g., 25.50"
                  className="block w-full rounded-lg border-slate-700 bg-slate-900 py-3 pl-8 pr-3 text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Add Person & Order
          </button>
        </form>

        {/* List of People and Orders */}
        {people.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-sky-400 mb-4 border-b border-slate-700 pb-2">Entries</h2>
            <ul className="space-y-3">
              {people.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg shadow hover:bg-slate-700 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-slate-200">{person.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sky-400 font-semibold mr-4">${parseFloat(person.cost).toFixed(2)}</span>
                    <button
                      onClick={() => handleRemovePerson(person.id)}
                      className="p-1.5 rounded-md text-rose-500 hover:bg-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 focus:ring-offset-slate-700 transition-colors duration-150"
                      aria-label={`Remove ${person.name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Total Cost Display */}
        {people.length > 0 && (
          <div className="mt-6 p-6 bg-slate-900 rounded-lg shadow-inner">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-sky-300">Total Cost:</h3>
              <p className="text-3xl font-bold text-emerald-400">${totalCost.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Button to send data to server */}
        <div className="mt-10 text-center">
          <button
            onClick={handleSendData}
            className={`rounded-lg bg-indigo-600 px-8 py-3.5 text-lg font-semibold text-white shadow-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 ease-in-out transform hover:scale-105 ${isSending ? 'opacity-50 cursor-not-allowed' : ''} ${people.length === 0 ? 'opacity-50 cursor-not-allowed bg-slate-600 hover:bg-slate-600' : ''}`}
            disabled={isSending || people.length === 0}
          >
            {isSending ? 'Sending...' : 'Who Pays?'}
          </button>
        </div>
      </main>

      {/* Modal for notifications */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center border border-sky-500">
            <h3 className="text-lg font-semibold text-sky-400 mb-4">Notification</h3>
            <p className="text-slate-300 mb-6 whitespace-pre-wrap">{modalMessage}</p> {/* Added whitespace-pre-wrap for better message formatting */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <footer className="w-full max-w-2xl mt-12 text-center">
        <p className="text-sm text-slate-500">
          A simple React app for tracking shared expenses.
        </p>
      </footer>
    </div>
  );
}
