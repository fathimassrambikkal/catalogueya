const fs = require('fs');
const file = '/Volumes/tridelMac/Projects/Ganapathi/cataloguyea/web_v1/catalogueya/src/dashboard/ChatWindow.jsx';
let content = fs.readFileSync(file, 'utf8');

// Import getContacts
content = content.replace('import LinkPreview from "../components/LinkPreview";', 'import LinkPreview from "../components/LinkPreview";\nimport { getContacts } from "../companyDashboardApi";');

// Add contacts state
const stateHook = `const [isAdded, setIsAdded] = useState(false);\n  const [contacts, setContacts] = useState([]);\n  \n  useEffect(() => {\n    getContacts().then(res => {\n      const list = res.data?.data || res.data || [];\n      setContacts(list);\n    }).catch(console.error);\n  }, []);\n\n  useEffect(() => {\n    if (selectedChat && contacts.length > 0) {\n      const participantId = selectedChat.other_participant?.id;\n      if (participantId) {\n        const found = contacts.some(c => String(c.contact_user_id) === String(participantId));\n        setIsAdded(found);\n      }\n    }\n  }, [selectedChat, contacts]);\n`;
content = content.replace('const [isAdded, setIsAdded] = useState(false);', stateHook);

// Replace Add button with checkmark
const buttonHook = `{isAdded ? (
          <div className="flex items-center text-green-500 bg-green-50 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium">
            <CheckCheck size={16} className="mr-1" />
            <span>Added</span>
          </div>
        ) : (
          <button
            onClick={handleAddContact}
            className="flex items-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all text-xs sm:text-sm shadow whitespace-nowrap"
          >
            <FaUserPlus size={14} />
            <span className="inline ml-1">Add</span>
          </button>
        )}`;
content = content.replace(/<button[\s\S]*?onClick=\{handleAddContact\}[\s\S]*?<\/button>/, buttonHook);

// add handleAddContact wrapper to set isAdded
content = content.replace(/handleAddContact\}/g, `(e) => { handleAddContact(e); setIsAdded(true); }}`);

fs.writeFileSync(file, content);
