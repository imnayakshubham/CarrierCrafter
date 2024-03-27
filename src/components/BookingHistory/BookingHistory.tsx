import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import "./BookingHistory.css"
import { CustomTable } from '../CustomTable/CustomTable'
import { RootState } from '../../store/reducer/reducer'

export const BookingHistory = () => {
    const bookingHistory = useSelector((state: RootState) => state.booking.booking_history?.data)

    const columnsData = useMemo(() => {
        return [
            { title: 'Name', dataIndex: 'name' },
            { title: 'Available', dataIndex: 'availability', render: (text: boolean) => text ? "Yes" : "No" },
            { title: 'Delivery Rate', dataIndex: 'onTimeDeliveryPercentage', },
            { title: 'Rating', dataIndex: 'rating' },
            { title: 'Special Requirements', dataIndex: 'specialRequirements' },
        ];
    }, []);
    return (
        <div className='booking__history__container'>
            <CustomTable
                columns={columnsData}
                dataSource={bookingHistory}
                rowId="id"
            />
        </div>
    )
}
