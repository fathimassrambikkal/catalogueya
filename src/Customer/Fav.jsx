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

  const renderListCard = (list) => (
    <div 
      key={list.id}
      className="flex items-center justify-between p-4 sm:p-6 rounded-2xl mb-4 transition-all duration-200
        bg-white/80 backdrop-blur-lg border border-gray-200/60
        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
        hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
        hover:border-blue-200/60 hover:scale-[1.02] w-full"
    >
      {/* Content area - SIMPLIFIED */}
      <div className="flex-1 min-w-0 mr-3 overflow-hidden">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-lg mb-1 break-words leading-tight">
          {list.name}
        </h3>
        {list.name !== 'My Favourites' && (
          <p className="text-gray-600 text-sm break-words">
            {list.itemCount} items
          </p>
        )}
      </div>
      
      {/* Action buttons - SIMPLIFIED */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Share Button */}
        <button className="p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
          bg-white/80 backdrop-blur-lg border border-gray-200/60 w-10 h-10
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
          hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0 flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
        </button>

        {/* Edit Button */}
        <button 
          onClick={() => openEditModal(list)}
          disabled={list.name === 'My Favourites'}
          className={`p-2 rounded-xl transition-all duration-200 w-10 h-10
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            ${
              list.name === 'My Favourites' 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-green-500 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]'
            } flex-shrink-0 flex items-center justify-center`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>

        {/* Delete Button */}
        <button 
          onClick={() => openDeleteModal(list)}
          disabled={list.name === 'My Favourites'}
          className={`p-2 rounded-xl transition-all duration-200 w-10 h-10
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            ${
              list.name === 'My Favourites' 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-red-500 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]'
            } flex-shrink-0 flex items-center justify-center`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  );

  const renderCreateListForm = () => (
    <div className="p-4 sm:p-6 rounded-2xl mb-4 transition-all duration-200
      bg-white/80 backdrop-blur-lg border border-blue-200/60
      shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] w-full">
      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-4 break-words">
        Create New List
      </h3>
      <div className="flex flex-col gap-3 w-full">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200/60 bg-white/50
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)] focus:outline-none focus:border-blue-300
            placeholder-gray-400 text-sm sm:text-base"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleCreateList();
          }}
        />
        <div className="flex gap-3 w-full">
          <button
            onClick={handleCreateList}
            disabled={!newListName.trim()}
            className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
              shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm sm:text-base"
          >
            Create
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setNewListName('');
            }}
            className="flex-1 px-4 py-3 rounded-xl text-gray-600 hover:text-red-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 overflow-x-hidden w-full">
      <div className="w-full mx-auto">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 break-words">
          My Lists
        </h1>
        
        <div className="space-y-4 w-full">
          {lists.map(renderListCard)}

          {isCreating ? (
            renderCreateListForm()
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/50 border-dashed
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
                hover:border-blue-200/60 hover:scale-[1.02] hover:bg-white/80
                group w-full"
            >
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3
                  shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
                  group-hover:bg-blue-200 transition-colors duration-200 flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
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
          <div className="w-full mx-auto mt-6 sm:mt-8">
            <div className="text-center p-5 sm:p-8 rounded-2xl
              bg-white/60 backdrop-blur-lg border border-gray-200/50
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5
                shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                <span className="text-gray-400 text-xl sm:text-2xl">📝</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">
                Create Your First Custom List
              </h3>
              <p className="text-gray-600 text-sm mb-4 sm:mb-5 break-words">
                Organize your favorites into custom lists
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
                  shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] text-sm sm:text-base"
              >
                Create New List
              </button>
            </div>
          </div>
        )}

        {/* Modals - SIMPLIFIED */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm mx-auto
              shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]">
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold mb-4 break-words">Edit List</h3>
                <input
                  type="text"
                  value={editModal.newName}
                  onChange={(e) => setEditModal(prev => ({ ...prev, newName: e.target.value }))}
                  className="w-full p-3 border rounded-lg mb-4"
                  placeholder="Enter list name..."
                />
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleEditList}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditModal({ isOpen: false, list: null, newName: '' })}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm mx-auto
              shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]">
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold mb-4 break-words">Delete List</h3>
                <p className="mb-6 break-words">Are you sure you want to delete this list?</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleDeleteList}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: false, list: null })}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
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