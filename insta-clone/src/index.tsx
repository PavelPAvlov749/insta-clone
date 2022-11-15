import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppContainer } from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


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
