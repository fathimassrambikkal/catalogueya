import React, { useState, useEffect } from 'react';

import { getContacts, deleteContact, getImageUrl } from '../companyDashboardApi';
import { toast } from 'react-hot-toast';
 import { IconDelete  } from "./SvgIcons";
function Contacts({ onBack }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      // res.data.data -> array of contacts
      setContacts(res.data?.data || res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await deleteContact(id);
      toast.success("Contact deleted");
      fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete contact");
    }
  };
return (
  <div >
    <div className="w-full">

      {loading ? (
  <div className="bg-white backdrop-blur-xl">
    {/* Header Skeleton */}
    <div className="px-5 py-4 border-b border-gray-100">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mt-16 md:mt-4" />
    </div>

    {/* Contact Row Skeletons */}
    <div className="divide-y divide-gray-100">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />

            <div className="space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
) : contacts.length === 0 ? (
  <div className="text-center py-16 text-gray-400">
    No contacts found.
  </div>
) : (
  <div className="bg-white backdrop-blur-xl">
       

          {/* Section Header INSIDE card */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 ">
            <h2 className="text-2xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mt-16 md:mt-4  p-4">
              Contacts
            </h2>
           
          </div>

          {/* Contact Rows */}
          <div className=' '>
             <div className="divide-y divide-gray-100 ">
            {contacts.map((contact) => (
              <div
                key={contact.contact_user_id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm flex-shrink-0">
                    {contact.avatar ? (
                      <img
                        src={getImageUrl(contact.avatar)}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      contact.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>

                    {contact.phone && (
                      <p className="text-xs text-gray-500 truncate">
                        {contact.phone}
                      </p>
                    )}

                    {contact.email && (
                      <p className="text-xs text-gray-400 truncate">
                        {contact.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() =>
                    handleDelete(contact.contact_user_id)
                  }
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <IconDelete className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          </div>
       

        </div>
      )}
    </div>
  </div>
);
}

export default Contacts;
