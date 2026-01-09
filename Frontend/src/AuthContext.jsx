import { createContext, useState , useContext , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import server from "./environment";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: server
});



export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [userData, setUserData] = useState();

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserData({ token });
    }
  }, []);


    const handleRegister = async (name, username, password) => {
        try {
            const res = await client.post("/register", {
                name,
                username,
                password
            });

            localStorage.setItem("token" , res.data.token);
            return res.data.user;

        } catch (err) {
            throw err.res?.data || err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await client.post("/login", {
                username,
                password
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                setUserData(response.data.user || username);
                return "Login Successful";
            }

        } catch (err) {
            throw err.response?.data || err;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ userData , handleLogin, handleRegister , handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
