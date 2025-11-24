import React, { useState } from 'react';

function Fav() {
  const [lists, setLists] = useState([
    { id: 1, name: 'My Bedroom', itemCount: 10 },
    { id: 2, name: 'My Favourite', itemCount: 10 }
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
        hover:border-blue-200/60 hover:scale-[1.02]"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{list.name}</h3>
        <p className="text-gray-600 text-sm">{list.itemCount} items</p>
      </div>
      <div className="flex items-center space-x-3">
        {/* Share Button */}
        <button className="p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
          hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
        </button>

        {/* Edit Button */}
        <button 
          onClick={() => openEditModal(list)}
          className="p-2 rounded-xl text-gray-600 hover:text-green-500 transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>

        {/* Delete Button */}
        <button 
          onClick={() => openDeleteModal(list)}
          className="p-2 rounded-xl text-gray-600 hover:text-red-500 transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
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
      shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]">
      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-4">Create New List</h3>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name..."
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200/60 bg-white/50
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)] focus:outline-none focus:border-blue-300
            placeholder-gray-400"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleCreateList();
          }}
        />
        <button
          onClick={handleCreateList}
          disabled={!newListName.trim()}
          className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Create
        </button>
        <button
          onClick={() => {
            setIsCreating(false);
            setNewListName('');
          }}
          className="px-4 py-2 rounded-xl text-gray-600 hover:text-red-500 transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Favourite Lists</h1>
      
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Existing Lists */}
        {lists.map(renderListCard)}

        {/* Create List Form or Button */}
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
              group"
          >
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3
                shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
                group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <span className="text-blue-500 font-semibold text-lg">Create a List</span>
            </div>
          </button>
        )}
      </div>

      {/* Empty state when no lists exist */}
      {lists.length === 0 && !isCreating && (
        <div className="max-w-2xl mx-auto mt-8">
          <div className="text-center p-8 rounded-2xl
            bg-white/60 backdrop-blur-lg border border-gray-200/50
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
              <span className="text-gray-400 text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lists Created</h3>
            <p className="text-gray-600 text-sm mb-4">Create your first list to get started</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
                shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]"
            >
              Create Your First List
            </button>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md
            shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rename List</h3>
            <input
              type="text"
              value={editModal.newName}
              onChange={(e) => setEditModal(prev => ({ ...prev, newName: e.target.value }))}
              placeholder="Enter new list name..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200/60 bg-white/50
                shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)] focus:outline-none focus:border-blue-300
                placeholder-gray-400 mb-4"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleEditList();
              }}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleEditList}
                disabled={!editModal.newName.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
                  shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Save
              </button>
              <button
                onClick={() => setEditModal({ isOpen: false, list: null, newName: '' })}
                className="flex-1 px-4 py-2 rounded-xl text-gray-600 hover:text-red-500 transition-all duration-200
                  bg-white/80 backdrop-blur-lg border border-gray-200/60
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete List Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md
            shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete List</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<span className="font-semibold">{deleteModal.list?.name}</span>"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteList}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200
                  shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: false, list: null })}
                className="flex-1 px-4 py-2 rounded-xl text-gray-600 hover:text-gray-700 transition-all duration-200
                  bg-white/80 backdrop-blur-lg border border-gray-200/60
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fav;