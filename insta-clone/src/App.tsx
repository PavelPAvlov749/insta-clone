import React, { useEffect } from 'react';
import logo from './logo.svg';
import styles from "../src/App.module.css"
import { connect } from 'react-redux';
import { Global_state_type } from './Redux/Store';
import { InitializeThunk } from './Redux/AppReducer';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router/Router';
import { Navbar } from './Components/Navbar/Navbar';
import { NewPostModalWindow } from './Components/Posts/NewPostModal';
import { postActions } from './Redux/PostReducer';


type AppPropsType = {
  isInit : boolean,
  isFetch : boolean,
  init : () => void,
  currentUserID : string | null,
  isNewPost : boolean,
  setIsOnNewPost : (isPost : boolean) => void
}

const App :React.FC<AppPropsType> = React.memo((props : AppPropsType) =>{

  useEffect(() => {
    props.init()
  },[])
  console.log("RENDER")

  if(props.isInit){
    return (
      <div className={styles.app}>
  
        <BrowserRouter>  
        {props.isNewPost ? <NewPostModalWindow/> : null}
        <Navbar/>
        <Router actualUser={props.currentUserID as string} isAuth={true} />
        </BrowserRouter>
      </div>
    )
  }else{
    return (
      <div> 
        <BrowserRouter>
        <Navbar/>
        <h1>NOT INIT</h1>
        </BrowserRouter>
      </div>
    )
  }

})

let MapStateToProps = (state : Global_state_type) => {
  return {
      isInit : state.app.is_initialize,
      isFetch : state.app.is_fetch,
      currentUserID : state.app.currentUserID,
      userPage : state.userPage,
      isNewPost : state.userPosts.isOnNewPost
  }
}
let MapDispatchToProps = (dispatch : any) => {
  return {
    init : () => {
      dispatch(InitializeThunk())
    },
    setIsOnNewPost : (isPost : boolean) => {
      dispatch(postActions.setIsOnnewPost(isPost))
    }
  }
}

export const AppContainer = connect(MapStateToProps,MapDispatchToProps)(App)