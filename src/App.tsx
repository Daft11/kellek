import React, { Fragment } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import logo from '@assets/logo-kellek.svg';
import logoMini from '@assets/logo-kellek-light-mini.svg';
import SeparatorLine from './components/UI/SeparatorLine';
import Gallery from './components/UI/Gallery';
import '@styles/App.css';
import { useProductsService } from './services/products.service';
import ProductComponent from './components/UI/Product';
import { useObservable } from './services/observable/useObservable';
import { useMediaQuery } from 'react-responsive';

function App() {
  const service = useProductsService();
  const isProductSelected = !!useObservable(service.currentProduct)
  const isViewboxExpanded = useObservable(service.isViewboxExpanded)
  const isMobile = useMediaQuery({
    query: '(hover: none) and (pointer: coarse)'
  })

  return (
    <div className="app">
      <header className={"app-header " + (isProductSelected && isMobile ? 'white' : '')}>
        <a className='header-logo-link' href='/'>
          <img alt='Kellek home page' src={logo} className={isViewboxExpanded && !isMobile || isProductSelected && isMobile ? 'dark-logo': 'light-logo'}></img>
        </a>
        {isProductSelected && isMobile ? null : <SeparatorLine/>}
      </header>
      <section className='content-wrapper'>
        <BrowserRouter>
          <Routes>
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/product' element={<ProductComponent />} />
            <Route path="*" element={<Navigate replace to="/gallery" />} />
          </Routes>
        </BrowserRouter>
      </section>
      {
        isProductSelected && isMobile && isViewboxExpanded 
          ? null
          : <footer className='app-footer'>
              <SeparatorLine/>
              <div className='footer-content'>
                <p>Kellek 2022</p>
                <a className='footer-logo-link' href='https://kellek.com/'>
                  <img alt='Kellek home page' src={logoMini}></img>
                </a>
              </div>
            </footer>
      }
    </div>
  );
}

export default App;
