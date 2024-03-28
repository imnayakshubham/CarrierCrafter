import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import "./BookCarriers.css"
import { useDispatch, useSelector } from "react-redux";
import { updateCarrierCart } from "../../store/reducer/carriersReducer";
import { bookCarrierRequest } from "../../store/actions/bookingActions";
import { addToBookingHistory } from "../../store/reducer/bookingReducer";
import { CustomTable } from "../CustomTable/CustomTable";
import { RootState } from "../../store/reducer/reducer";
import { AppDispatch } from "../../store/store";


const BookCarriers = () => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = useToast()
    const navigateTo = useNavigate()

    const [selectedCarriers, setSelectedCarriers] = useState<string[]>([])

    const carriersCart = useSelector((state: RootState) => state.carriers.carrier_cart)

    const columnsData = useMemo(() => {
        return [
            { title: 'Name', dataIndex: 'name' },
            { title: 'Available', dataIndex: 'availability', render: (text: boolean) => <>{text ? "Yes" : "No"}</> },
            { title: 'Delivery Rate', dataIndex: 'onTimeDeliveryPercentage', },
            { title: 'Rating', dataIndex: 'rating' },
            { title: 'Special Requirements', dataIndex: 'specialRequirements' },
            { title: '', dataIndex: 'action' },
        ];
    }, []);

    const handleDelete = () => {
        dispatch(updateCarrierCart(selectedCarriers))
        setSelectedCarriers([])
    }



    const handleConfirmBooking = () => {
        dispatch(bookCarrierRequest())
        toast({
            title: 'Booking Confirmed',
            status: 'success',
            position: 'top-right',
            isClosable: true,
        })
        navigateTo("/my-bookings")
        dispatch(addToBookingHistory(carriersCart)) // Passing Whole data since we are not storing the booking data in the backend
    }

    return (
        <div className="book__carrier__container">
            {
                carriersCart.length ? <>
                    <div className="book__carrier__container__table__action">
                        <Button className="delete__btn"
                            isDisabled={!selectedCarriers.length}
                            onClick={() => {
                                handleDelete()
                            }}>
                            Delete
                        </Button>
                    </div>

                    <CustomTable
                        columns={columnsData}
                        dataSource={carriersCart}
                        rowId="id"
                        rowSelection={{
                            type: "checkbox",
                            onChange: (selectedRowKeys) => {
                                setSelectedCarriers(selectedRowKeys)
                            },
                        }} />
                    <div className="confirm__booking__action">
                        <Button onClick={() => {
                            handleConfirmBooking()

                        }}>
                            Confirm Booking
                        </Button>
                    </div>
                </> :
                    <div className="empty__cart">
                        <div>
                            <h2 className="empty__cart__info">No Carriers Selected</h2>
                        </div>
                        <div className="empty__cart__suggestion">
                            <Button onClick={() => navigateTo("/")}>
                                View Carriers
                            </Button>

                            <Button onClick={() => navigateTo("/my-bookings")}>
                                View Bookings
                            </Button>
                        </div>

                    </div>
            }
        </div>
    )
}


export default BookCarriers