import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from "./AuthContext";
import Snackbar from '@mui/material/Snackbar';

const defaultTheme = createTheme();

export default function Authentication(){
    const [name , setName] = useState();
    const [username , setUsername] = useState();
    const [password , setPassword] = useState();
    const [error , setError] = useState();
    const [message , setMessage] = useState();
    const [open , setOpen] = useState(false);

    const [formState , setFormState] = useState(0);

    const {handleRegister , handleLogin} = useContext(AuthContext);

    let routeTo = useNavigate();

    let handleAuth = async()=>{
        try{

            if(formState === 0){
                let result = await handleLogin(username , password);
                setMessage(result);
                setOpen(true);
            }

            if(formState === 1){
                let result = await handleRegister(name , username , password);
                setMessage(result);
                setOpen(true);
                setUsername("");
                setPassword("");
                setError("");
                setFormState(0);
                routeTo('/');
            }

            if (formState === 0) {
                await handleLogin(username, password);
                routeTo("/");
            }

        }catch(e){
            setError(
                e?.response?.data?.message ||
                e?.message ||
                "Something went wrong"
            );
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{margin : "auto"}}>
            <Box
                sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
                </Avatar>
                <div>
                    <Button variant={formState === 0 ? "contained" : "" } onClick={() => setFormState(0)} style={{color : "black"}}>Sign In</Button>
                    <Button variant={formState === 1 ? "contained" : ""} onClick={() => setFormState(1)} style={{color : "black"}}>Sign Up</Button>
                </div>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                {formState === 1 ? 
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Full Name"
                        name="username"
                        value={name}
                        autoFocus
                        onChange = {(e)=>setName(e.target.value)}
                    /> : <></> }
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Email"
                    name="username"
                    value={username || ""}
                    autoFocus
                    onChange={(e)=>setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <p style={{color : "red"}}>{error}</p>
            
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    //sx={{ mt: 3, mb: 2 }}
                    onClick={handleAuth}
                >
                    {formState === 0 ? "Sign In" : "Sign Up"}
                </Button>
                </Box>
            </Box>
            </Grid>
        </Grid>
                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    message={message}
                />
    </ThemeProvider>
    )
}