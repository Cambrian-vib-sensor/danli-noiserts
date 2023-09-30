import * as React from 'react';
//import { Navigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import img1 from '../images/about.jpg';
import img2 from '../images/lab1.jpg';
import img3 from '../images/lab2.jpg';
import img4 from '../images/site1.jpg';
import img5 from '../images/site2.jpeg';
import { login }  from '../actions/auth';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
//import Dashboard from './Dashboard';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://cambrian.com.sg/">
      danli pte Ltd
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

function SignInSide(props) {
  /*const { isLoggedIn } = props;
  if (isLoggedIn) {
    console.log("Navigating to Dashboard");
    //return <Navigate replace to="/dashboard" />;
    return <Dashboard />
  }*/

  console.log("Navigating to SignInSide");

  const validationSchema = Yup.object().shape({
    /*username: Yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),*/
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [img, setImage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate()
  const images = [img1, img2, img3, img4, img5];

  var intervalRef = React.useRef(null);

  React.useEffect(() => {
    // Anything in here is fired on component mount.
    let interval = intervalRef.current;
    interval = setInterval(()=>{
      setImage(img => (img+1)%5);
    },10000);
    return () => {
        // Anything in here is fired on component unmount.
        if (interval !== undefined) {
          console.log("Clearing interval");
          clearTimeout(interval);
        }
    }
  }, [])

  const onSubmit = (event) => {
    console.log(event);
    //event.preventDefault();

    setLoading(true);

    /*const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });*/

    const { dispatch } = props;

    dispatch(login(event.username, event.password)).then(() => {
      //history.push("/dashboard");
      //window.location.reload();
      navigate('/dashboard')
    })
    .catch(() => {
      setLoading(false);
      //setError('loginerror', {message: props.message}) //props.message is not updated here, hence show it directly in the component
    });

  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          key= {img}
          sx={{
            backgroundImage: `url(${images[img]})`, //https://source.unsplash.com/random
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            //animation: 'slide 60s linear infinite'
            animation: 'fadeIn 10s'
          }}
          onClick={() => setImage((img + 1)%5)}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'red' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                {...register('username')}
                error={errors.username ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.username?.message}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register('password')}
                error={errors.password ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.password?.message}
              </Typography>
              {/*<FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />*/}
              <Typography variant="inherit" color="red">
                {/*{errors.loginerror?.message}*/}
                {props.message ? props.message : ""}
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}{" "}
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                {/*<Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>*/}
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

function mapStateToProps(state) {
  const { /*isLoggedIn,*/ message } = state.auth;
  //const { message } = state.message;
  return {
    /*isLoggedIn,*/
    message
  };
}

export default connect(mapStateToProps)(SignInSide);