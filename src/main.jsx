import React, { useContext, createContext, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Route, Routes, BrowserRouter, Outlet } from 'react-router-dom';
import Sql from '../Sql.jsx';
import { SampleRoutes } from '../SampleRoutes.jsx';
import CustomOutlet from '../CustomOutlet.jsx';
import Er from '../Er.jsx';
import { RefProvider } from '../refContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RefProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />}>
            {/* <Route path="/*" element={<SampleRoutes />} /> */}
            {/* <Route path="/*" element={<CustomOutlet/>}> */}
            {/* <Route path="path1" element={<CustomOutlet label="first" />}>
              <Route index element={<Er />}></Route>
              <Route path="path2" element={<CustomOutlet label="second" />}>
                <Route index element={<Sql />}></Route>
              </Route>
            </Route> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </RefProvider>
  </React.StrictMode>
);
