import React, { useState } from 'react';

function Fav() {
  const [lists, setLists] = useState([
    { id: 1, name: 'My Favourites', itemCount: 10 }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editModal, setEditModal] = useState({ isOpen: false, list: null, newName: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, list: null });

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now(),
        name: newListName.trim(),
        itemCount: 0
      };
      setLists([...lists, newList]);
      setNewListName('');
      setIsCreating(false);
    }
  };

  const handleEditList = () => {
    if (editModal.newName.trim()) {
      setLists(lists.map(list =>
        list.id === editModal.list.id
          ? { ...list, name: editModal.newName.trim() }
          : list
      ));
      setEditModal({ isOpen: false, list: null, newName: '' });
    }
  };

  const handleDeleteList = () => {
    setLists(lists.filter(list => list.id !== deleteModal.list.id));
    setDeleteModal({ isOpen: false, list: null });
  };

  const openEditModal = (list) => {
    setEditModal({ isOpen: true, list, newName: list.name });
  };

  const openDeleteModal = (list) => {
    setDeleteModal({ isOpen: true, list });
  };

const handleShare = async (list) => {
  const text = `Check out my list: ${list.name}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: list.name,
        text,
      });
    } catch {
      // user cancelled → ignore
    }
  } else {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard");
  }
};

const ShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      d="M12 3v12"
      strokeLinecap="round"
    />
    <path
      d="M8 7l4-4 4 4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18" strokeLinecap="round" />
    <path
      d="M8 6V4h8v2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
  </svg>
);




  const renderListCard = (list) => (
    <div
      key={list.id}
      className="flex items-center justify-between p-4 sm:p-6 rounded-2xl mb-4 transition-all duration-200
      bg-white/80 backdrop-blur-lg border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
      hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
      hover:border-blue-200/60 hover:scale-[1.02] w-full overflow-hidden max-w-full"
    >
      {/* Content area */}
      <div className="flex-1 min-w-0 mr-10 overflow-hidden">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-lg mb-1 break-words leading-tight">
          {list.name}
        </h3>
        {list.name !== 'My Favourites' && (
          <p className="text-gray-600 text-sm break-words">
            {list.itemCount} items
          </p>
        )}
      </div>

{/* button */}
<div className="flex items-center gap-3 flex-shrink-0">
  {/* Share */}
  <button
    onClick={() => handleShare(list)}
    title="Share"
    className="w-10 h-10 rounded-xl
    bg-white/80 border border-gray-200
    text-gray-500 hover:text-blue-500
    hover:bg-blue-50
    flex items-center justify-center transition"
  >
    <ShareIcon />
  </button>

  {/* Edit */}
  <button
    onClick={() => openEditModal(list)}
    disabled={list.name === 'My Favourites'}
    title="Edit"
    className={`w-10 h-10 rounded-xl
    bg-white/80 border border-gray-200
    flex items-center justify-center transition
    ${
      list.name === 'My Favourites'
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
    }`}
  >
    <EditIcon />
  </button>

  {/* Delete */}
  <button
    onClick={() => openDeleteModal(list)}
    disabled={list.name === 'My Favourites'}
    title="Delete"
    className={`w-10 h-10 rounded-xl
    bg-white/80 border border-gray-200
    flex items-center justify-center transition
    ${
      list.name === 'My Favourites'
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
    }`}
  >
    <DeleteIcon />
  </button>

</div>


</div>
  );

  const renderCreateListForm = () => (
    <div className="p-4 sm:p-6 rounded-2xl mb-4 transition-all duration-200
      bg-white/80 backdrop-blur-lg border border-blue-200/60
      shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] w-full overflow-hidden max-w-full">
      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-4 break-words">
        Create New List
      </h3>

      <div className="flex flex-col gap-3 w-full max-w-full overflow-hidden">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200/60 bg-white/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]
          focus:outline-none focus:border-blue-300 placeholder-gray-400 text-sm sm:text-base"
        />

        <div className="flex gap-3 w-full max-w-full">
          <button
            onClick={handleCreateList}
            disabled={!newListName.trim()}
            className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>

          <button
            onClick={() => {
              setIsCreating(false);
              setNewListName('');
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-gray-200/60 text-gray-600
            hover:text-red-500 transition-all duration-200 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 overflow-x-hidden w-full">
      <div className="w-full max-w-full mx-auto overflow-hidden">

        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-6 break-words">
          My Lists
        </h1>

        <div className="space-y-4 w-full max-w-full overflow-hidden">
          {lists.map(renderListCard)}

          {isCreating ? (
            renderCreateListForm()
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-4 sm:p-6 rounded-2xl cursor-pointer bg-white/60 backdrop-blur-lg border 
              border-gray-200/50 border-dashed hover:border-blue-200/60 hover:scale-[1.02] transition-all
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] max-w-full overflow-hidden"
            >
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-blue-500 font-semibold text-base sm:text-lg whitespace-nowrap">
                  Create a New List
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Empty state */}
        {lists.length === 1 && lists[0].name === 'My Favourites' && !isCreating && (
          <div className="w-full mx-auto mt-8 max-w-full overflow-hidden">
            <div className="text-center p-6 sm:p-8 rounded-2xl bg-white/60 border border-gray-200/50 shadow-md max-w-full overflow-hidden">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-gray-400 text-xl sm:text-2xl">📝</span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">
                Create Your First Custom List
              </h3>

              <p className="text-gray-600 text-sm mb-5 break-words">
                Organize your favorites into custom lists
              </p>

              <button
                onClick={() => setIsCreating(true)}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Create New List
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm mx-auto overflow-hidden">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Edit List</h3>
                <input
                  type="text"
                  value={editModal.newName}
                  onChange={(e) => setEditModal(prev => ({ ...prev, newName: e.target.value }))}
                  className="w-full p-3 border rounded-lg mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleEditList}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditModal({ isOpen: false, list: null, newName: '' })}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm mx-auto overflow-hidden">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Delete List</h3>
                <p className="mb-6">Are you sure you want to delete this list?</p>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteList}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setDeleteModal({ isOpen: false, list: null })}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Fav;
