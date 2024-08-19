import React from "react";
import Chat from "./Chat"; // Import your Chat component

const AppLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (for contacts or other navigation) */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>
        {/* Placeholder for contact list */}
        <ul>
          <li className="p-2 mb-2 bg-white rounded-lg">John Doe</li>
          <li className="p-2 mb-2 bg-white rounded-lg">Jane Smith</li>
          {/* Add more contacts here */}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-grow">
        <Chat /> {/* Render the Chat component here */}
      </div>
    </div>
  );
};

export default AppLayout;
