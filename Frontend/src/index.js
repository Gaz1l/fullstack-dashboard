
//Default Index to launch app 

//React components 
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//Components
import App from './App';

//Router imports 
import { BrowserRouter} from 'react-router-dom';

//Production mode 
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
if(process.env.NODE_ENV==="production") disableReactDevTools()


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <BrowserRouter>
   
        <App />
      
    </BrowserRouter>
  </React.StrictMode>
);


