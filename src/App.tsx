import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar/Navbar'
import React, { Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData } from './store/actions/userActions'
import { RootState } from './store/reducer/reducer'
import { AppDispatch } from './store/store'
import { NoPageFound } from './components/404/NoPageFound'
import { Spinner } from '@chakra-ui/react'

const BookingHistory = React.lazy(() => import('./components/BookingHistory/BookingHistory'));
const CarriersList = React.lazy(() => import('./components/CarriersList/CarriersList'));
const BookCarriers = React.lazy(() => import('./components/BookCarriers/BookCarriers'));


export const DefaultLoader = () => {
  return <div className='default__loader__container'>
    <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />
  </div>
}



function App() {
  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    if (!userInfo.data) {
      dispatch(fetchUserData());
    }
  }, [dispatch, userInfo.data]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<DefaultLoader />}>
            <CarriersList />
          </Suspense>
        } />
        <Route path="/book-carriers" element={
          <Suspense fallback={<DefaultLoader />}>
            <BookCarriers />
          </Suspense>
        } />
        <Route path="/my-bookings" element={
          <Suspense fallback={<DefaultLoader />}>
            <BookingHistory />
          </Suspense>
        } />

        <Route path="*" element={<NoPageFound />} />

      </Routes>
    </>
  )
}

export default App
