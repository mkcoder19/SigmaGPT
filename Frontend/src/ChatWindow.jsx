import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { AuthContext } from "./AuthContext";
import { useContext , useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {ScaleLoader} from 'react-spinners';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
export default function ChatWindow(){
    const {prompt , setPrompt , reply , setReply , currThreadId , prevChats , setPrevChats , setNewChat} = useContext(MyContext);
    const [loading , setLoading] = useState(false);
    const [isOpen , setIsOpen] = useState(false);
    const {userData , handleLogout} = useContext(AuthContext);

    let routeTo = useNavigate();

    const getReply = async ()=>{
        setLoading(true);
        setNewChat(false);

        const options = {
            method: 'POST',
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body : JSON.stringify({
                message : prompt,
                threadId : currThreadId
            })
        };

        try{
            const response = await fetch('http://localhost:8080/api/chat', options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        }catch(err){
            console.log(err);
        }
        setLoading(false);
    }

    useEffect((e)=>{
        if(prompt && reply){
            setPrevChats(prevChats => ([...prevChats , {
                role : "user",
                content : prompt
            },{
                role : "assistant",
                content : reply
            }
        ]));
        }
        setPrompt("");
    } , [reply])

    const handleProfileClick = ()=>{
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT &nbsp;<i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">

                        { userData ? (

                            <IconButton onClick={()=>{ 
                                    handleLogout();
                                    routeTo('/auth');
                                }
                            }>
                                <LogoutIcon/>
                                <p>Log Out</p>
                            </IconButton>
                            ) : (
                                <IconButton onClick={()=>routeTo('/auth')}>
                                    <LoginIcon/>
                                    <p>Log in</p>
                                </IconButton>
                            )
                        }
                </div>
            }
            <Chat/>

            <ScaleLoader color="#fff" loading={loading}/>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything" className="" value={prompt}  onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" ? getReply() : null}/>
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                    <p className="info">
                        SigmaGPT can make mistakes. Check important info . See cookies Preferences.
                    </p>
                </div>
            </div>
        </div>
    )
}