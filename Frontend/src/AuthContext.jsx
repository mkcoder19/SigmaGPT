import { createContext, useState , useContext , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:8080"
});



export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [userData, setUserData] = useState(authContext);

    useEffect(() => {
        if (userData) navigate("/");
    }, [userData]);


    const handleRegister = async (name, username, password) => {
        try {
            const res = await client.post("/register", {
                name,
                username,
                password
            });

            localStorage.setItem("token" , res.data.token);
            setUserData(res.data.user);
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
                setUserData({ username });
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
        <AuthContext.Provider value={{ userData , setUserData , handleLogin, handleRegister , handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
