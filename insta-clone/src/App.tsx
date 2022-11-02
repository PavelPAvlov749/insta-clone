//Styles module import
import styles from "../src/App.module.css"
//React and readt hooks imports
import React, { useEffect, useState } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
//TSXComponent imports
import { Router } from './Router/Router';
import { Navbar } from './Components/Navbar/Navbar';
import { Preloader } from './Components/Preloader/Preloader';
//Redux,Actions and Thnunks imports
import { postActions } from './Redux/PostReducer';
import { connect } from 'react-redux';
import { Global_state_type } from './Redux/Store';
import { InitializeThunk } from './Redux/AppReducer';
//Types imports
import { AppPropsType } from './Redux/Types';
//Firebase imports
import { ref,getDatabase, onChildAdded, onChildChanged } from "firebase/database";
//Media and assets
const sound = require("../src/Media/MessageTone.mp3")



//Main component
//This component renders the entire main layout of the application and calls the application initialization function in useEffect hook.
//The App passes the props.isAuth key to the Router component to check the user's authorization status if the key is false, 
//the Router will redirect the user to the login page.
//<props> : 
//isAuth :  userAutorization status
//isInit : is Application initialized (if false App function will render Preloader component untill props.isInit becomes true value )
//currentUserID : ID of current authorizated user
//isFech : URL request flag indicator of the absence of current network requests aslo if false App will render Preloader
//props.init() : function initializer using InitializeThunk function witch comes from ../Redux/AppReducer.ts

const App: React.FC<AppPropsType> = React.memo((props: AppPropsType) => {
  //Intialize App
  useEffect( () => {
    props.init()
  }, [])
  const [onMessage,setOnMessage] = useState(false)

  const db = getDatabase();
  const messageRef = ref(db,("Chat/"))
  onChildChanged(messageRef,(message) => {
    setOnMessage(true)
    console.log("Message recieved")
  })
  //If one of them fasle return Preloader anotherwise return router
  if (props.isInit || !props.isFetch) {
    return (
      <div className={styles.app}>
          <HashRouter >
          {onMessage ? <audio src={sound} autoPlay={true}></audio> : null}
            <Router actualUser={props.currentUserID as string} isAuth={props.isAuth} />
            <Navbar />
          </HashRouter  >

      </div>
    )
  } else {
    return (
      <div>
          <HashRouter >
            <Preloader />
            <Navbar />
          </HashRouter>
      </div>
    )
  }

})


let MapStateToProps = (state: Global_state_type) => {
  return {
    isInit: state.app.is_initialize,
    isFetch: state.app.is_fetch,
    currentUserID: state.app.currentUserID,
    userPage: state.userPage,
    isNewPost: state.userPosts.isOnNewPost,
    isAuth: state.auth.is_auth
  }
}
let MapDispatchToProps = (dispatch: any) => {
  return {
    init: () => {
      dispatch(InitializeThunk())
    },
    setIsOnNewPost: (isPost: boolean) => {
      dispatch(postActions.setIsOnnewPost(isPost))
    }
  }
}

export const AppContainer = connect(MapStateToProps, MapDispatchToProps)(App)