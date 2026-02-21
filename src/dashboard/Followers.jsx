import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaCalendar, FaTrash, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { getFollowers, getImageUrl, getContacts, addContact, deleteContact } from "../companyDashboardApi";
import { showToast } from "../utils/showToast";

export default function Followers() {
  const [followers, setFollowers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchFollowers(), fetchContacts()]);
    setLoading(false);
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      if (res.data?.data) {
        setContacts(res.data.data);
      } else if (Array.isArray(res.data)) {
        setContacts(res.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      // setLoading(true); // Handled in fetchData
      const res = await getFollowers();
      // Expecting res.data.data or res.data as array
      let list = [];
      if (res.data?.data) {
        list = Array.isArray(res.data.data) ? res.data.data : (res.data.data.followers || []);
      } else if (Array.isArray(res.data)) {
        list = res.data;
      }
      setFollowers(list);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      // setLoading(false); // Handled in fetchData
    }
  };

  const getFollowersCount = () => followers.length;

  const handleRemoveFollower = (customerId) => {
    // Current API doesn't seem to have "unfollow/remove follower" for company side specifically 
    // unless defined elsewhere. Usually followers manage their own following.
    // If needed we can implement based on and specific endpoint.
    alert("Functionality to remove followers is not currently implemented in the API.");
  };

  const handleToggleContact = async (user, isContact, contactId) => {
    try {
      if (isContact) {
        // Optional: Remove from contacts
        // await deleteContact(contactId);
        // setContacts(prev => prev.filter(c => c.id !== contactId));
        showToast("Already in contacts", { type: 'info' });
      } else {
        // Add to contacts
        const userId = user.id;
        if (!userId) {
          showToast("Cannot add user: ID missing", { type: 'error' });
          return;
        }
        await addContact(userId);
        showToast("Added to contacts", { type: 'success' });
        fetchContacts(); // Refresh list to get the new contact ID and structure
      }
    } catch (e) {
      console.error("Error toggling contact", e);
      showToast("Failed to update contact", { type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

 if (loading) {
  return (
    <div className="w-full">
      <div className="bg-white border overflow-hidden">

        {/* Header Skeleton */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mt-20 md:mt-4"></div>
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mt-2"></div>
        </div>

        {/* Skeleton Rows */}
        <div className="divide-y divide-gray-100">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-5"
            >
              <div className="flex items-center gap-4">

                {/* Avatar Skeleton */}
                <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse"></div>

                {/* Text Skeleton */}
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-2 w-24 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-2 w-20 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Button Skeleton */}
              <div className="h-7 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

  /* EMPTY STATE */
  if (!followers || followers.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 min-w-0 overflow-x-hidden text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <FaUser className="text-3xl text-gray-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">No Followers Yet</h2>
        <p className="text-gray-500 mt-2">When customers follow your company, they will appear here.</p>
      </div>
    );
  }

  /* MAIN UI */
 return (
  <div className="w-full ">

    {/* Main White Surface */}
    <div className="bg-white border overflow-hidden">

      {/* Header INSIDE container */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mt-20 md:mt-4 ">
          Followers
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {getFollowersCount()} follower{getFollowersCount() === 1 ? "" : "s"}
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">

        {followers.map((follower) => {

          const name =
            follower.user?.name_en ||
            follower.customer?.name ||
            follower.name ||
            "Customer";

          const email =
            follower.user?.email ||
            follower.customer?.email ||
            follower.email ||
            "";

          const avatar =
            follower.user?.image ||
            follower.customer?.image ||
            follower.avatar ||
            null;

          const date =
            follower.created_at ||
            follower.followed_at ||
            follower.followedAt;

          const followerUserId =
            follower.user?.id ||
            follower.customer?.id ||
            follower.id;

          const existingContact = contacts.find((c) => {
            const cId =
              c.user_id ||
              c.contact_user_id ||
              c.id ||
              c.user?.id;
            return String(cId) === String(followerUserId);
          });

          const isContact = !!existingContact;

          return (
            <div
              key={follower.id}
              className="flex items-center justify-between px-6 py-5 hover:bg-gray-50/60 transition-colors"
            >
              {/* Left */}
              <div className="flex items-center gap-4 min-w-0">

                {/* Avatar */}
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm shrink-0">
                  {avatar ? (
                    <img
                      src={getImageUrl(avatar)}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {name}
                  </h3>

                  {email && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {email}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-0.5">
                    Followed {formatDate(date)}
                  </p>
                </div>
              </div>

              {/* Right Button */}
              <button
                onClick={() =>
                  handleToggleContact(
                    follower.user || follower.customer || follower,
                    isContact,
                    existingContact?.id
                  )
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isContact
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                {isContact ? "Added" : "Add"}
              </button>
            </div>
          );
        })}

      </div>
    </div>
  </div>
);
}
