import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import './App.css'
import {AuthProvider} from "./AuthContext";
import { MyContext } from "./MyContext";
import { useState , useContext} from "react";
import { v4 as uuidv4 } from 'uuid';
import Authentication from "./Authentication";
import {Route , BrowserRouter as Router, Routes} from 'react-router-dom';


function App() {
  const [prompt , setPrompt] = useState("");
  const [reply , setReply] = useState(null);
  const [currThreadId , setCurrThreadId] = useState(uuidv4()); 
  const [prevChats , setPrevChats] = useState([]); //Stores all previous chats of current thread
  const [newChat , setNewChat] = useState(true);
  const [allThreads , setAllThreads] = useState([]);
  const providerValues = {
    prompt, setPrompt,
    reply,  setReply,
    currThreadId , setCurrThreadId,
    newChat , setNewChat,
    prevChats , setPrevChats,
    allThreads , setAllThreads
  };

  return (
    <Router>
      <AuthProvider>
        <MyContext.Provider value={providerValues}>
          <Routes>

            <Route path="/auth" element={<Authentication />} />

            <Route
              path="/"
              element={
                <div className="app">
                  <Sidebar />
                  <ChatWindow />
                </div>
              }
            />

          </Routes>
        </MyContext.Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;
