import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
//Dashboard
import {useState} from 'react'
import firebaseApp from '../firebase'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../Contexts/AuthContext'
import Events from './Events'
import Dashboard from './Dashboard'
import Profile from './Profile';
import Loader from './Loader'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
      padding:0
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color:'#fff',
    backgroundColor:'#1A8BDB',
    borderRadius:'0 0 5px 5px',
    position:'absolute',
    top:'0',
    right: '0',
    padding:'20px',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    border:0
  },
  content: {
    flexGrow: 1,
  },
}));

function useWindowWidth(){
  const [width, setwidth] = useState(window.innerWidth);
  useEffect(()=>{
    const handleResize=()=>{
      setwidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize)
    return ()=>{
      window.removeEventListener("resize", handleResize)
    }
  },[])
  return width;
}

function Home(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const width = useWindowWidth()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  //Dashboard
  const history=useHistory()
  const {currentUser} =useAuth()
  const [option, setoption] = useState("dashboard")
  const [loading, setloading] = useState(true)
  const [profile, setprofile] = useState(false)
  const [photo, setphoto] = useState("")

  const handleLogout=(e)=>{
      firebaseApp.auth().signOut().then(() => {
          history.push("/login")
        }).catch((error) => {
          console.log(error.message);
        });
    }
  const toDashboard=(e)=>{
      e.preventDefault();
      setoption("dashboard");
      Array.from(document.getElementsByClassName("icon")).forEach(ic=>ic.classList.remove("active-icon"))
      document.getElementById("dashboard").classList.add("active-icon");
        if(width<760){
          handleDrawerToggle()
        }
    }
    const toEvents=(e)=>{
      e.preventDefault();
      setoption("events");
      Array.from(document.getElementsByClassName("icon")).forEach(ic=>ic.classList.remove("active-icon"))
      document.getElementById("events").classList.add("active-icon");
        if(width<760){
          handleDrawerToggle()
        }
      }
    const toProfile=(e)=>{
      e.preventDefault();
      setoption("profile");
      Array.from(document.getElementsByClassName("icon")).forEach(ic=>ic.classList.remove("active-icon"))
      document.getElementById("profile").classList.add("active-icon");
        if(width<760){
          handleDrawerToggle()
        }
    }

    useEffect(()=>{
      setTimeout(() => {
        firebaseApp.firestore().collection("Users").doc(currentUser.email).get().then(doc=>{
          setphoto(doc.data().photoURL)
          if(doc.data().completed){
            setprofile(true);
          }else{
            setoption("profile")
          }
          setloading(false)
        })
      }, 3000);
    },[currentUser])
  
  //Dashboard
  
    const drawer = (
      <div>
        <div style={{'backgroundColor':'#f9f9fb'}} className="min-vh-100 py-5 shadow-lg dashboard-nav position-relative"> 
            <div className="profile-icon d-flex justify-content-center pb-3">
                <img className="rounded-circle my-border shadow-lg" src={photo?photo:"man.png"} alt="profile-icon" height="100px" width="100px" />
            </div>
            <h5 className="text-center mb-2">{currentUser.displayName}</h5>
            <p style={{'fontSize':'0.7rem'}} className="text-center mb-5 px-1">{currentUser.email}</p>
            <button onClick={toProfile} className="btn d-block text-start w-100 rounded-0 my-3 p-0"><i id="profile" class="fal fa-user-circle icon"></i> Profile</button>
            {profile?<button onClick={toDashboard} className="btn d-block text-start w-100 rounded-0 my-3 p-0"><i id="dashboard" class="fas fa-th-large icon active-icon"></i> Dashboard</button>:null}
            {profile?<button onClick={toEvents} className="btn d-block text-start w-100 rounded-0 my-3 p-0"><i id="events" class="fal fa-broadcast-tower icon"></i> Quizzes</button>:null}
            <button className="accent btn d-block w-100 rounded-0 my-3 text-start p-0" onClick={handleLogout}><i class="icon far fa-sign-out"></i> Logout</button>
        </div>
      </div>
    );
  
    const container = window !== undefined ? () => window().document.body : undefined;
  
  return (loading?
      <Loader />
      :
      <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
      <div className="min-vh-100" style={{'backgroundColor':'#eff4fb', 'padding':'5%'}}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
                >
                <MenuIcon />
            </IconButton>
            {option==="dashboard"?<Dashboard user={currentUser} />:option==="events"?<Events />:option==="profile"?<Profile />:null}
        </div>
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

export default Home;
