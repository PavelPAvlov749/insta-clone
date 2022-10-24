import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppContainer } from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';
import { Navbar } from './Components/Navbar/Navbar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const reg = async function () {
  if(navigator.serviceWorker){
    try{
      const reg = await navigator.serviceWorker.register("./sw.js",)
      console.log("sw reg succes",reg)
    }catch(e){
      console.log("sw reg fail",e)
    }
  }else{
    console.log("Not suppoertd")
  }
}
reg()
try {
  root.render(

    <React.StrictMode>
      <Provider store={store}>
    
        <AppContainer />
       
      </Provider>
    </React.StrictMode>
  );
}catch(ex){
  console.log(ex)
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
