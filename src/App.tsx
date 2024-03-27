import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar/Navbar'
import CarriersList from './components/CarriersList/CarriersList'
import { BookCarriers } from './components/BookCarriers/BookCarriers'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData } from './store/actions/userActions'
import { BookingHistory } from './components/BookingHistory/BookingHistory'
import { RootState } from './store/reducer/reducer'
import { AppDispatch } from './store/store'
import { NoPageFound } from './components/404/NoPageFound'

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
        <Route path="/" element={<CarriersList />} />
        <Route path="/book-carriers" element={<BookCarriers />} />
        <Route path="/my-bookings" element={<BookingHistory />} />

        <Route path="*" element={<NoPageFound />} />

      </Routes>
    </>
  )
}

export default App
