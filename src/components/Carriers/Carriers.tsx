import { useMemo } from "react";
import "./Carriers.css";
import { CustomTable } from "../CustomTable/CustomTable";
import { CarrierType } from "../../store/reducer/carriersReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer/reducer";

type CarriersProps = {
    carriersData: CarrierType[];
    setSelectedCarriers: any
}

export const Carriers = ({ carriersData, setSelectedCarriers }: CarriersProps) => {

    const isCarriersLoading = useSelector((state: RootState) => state.carriers.carriersList?.loading)

    const columnsData = useMemo(() => {
        return [
            { title: 'Name', dataIndex: 'name', className: "hello" },
            { title: 'Available', dataIndex: 'availability', className: "hello", render: (text: boolean) => text ? "Yes" : "No" },
            { title: 'Delivery Rate', dataIndex: 'onTimeDeliveryPercentage', className: "hello", },
            { title: 'Rating', dataIndex: 'rating', className: "hello" },
            { title: 'Special Requirements', dataIndex: 'specialRequirements', className: "hello" },
        ];
    }, []);

    return (
        <div>
            <CustomTable
                columns={columnsData}
                dataSource={carriersData}
                rowId="id"
                loading={isCarriersLoading}
                rowClassName="row"
                rowSelection={{
                    type: 'checkbox',
                    onChange: (_, selectedRows) => {
                        setSelectedCarriers((prev: CarrierType[]) => {
                            const prevIds = prev.map((carrier: CarrierType) => carrier.id);
                            if (prevIds.includes(selectedRows.id)) {
                                return prev.filter((carrier: CarrierType) => carrier.id !== selectedRows.id);
                            } else {
                                return [...prev, selectedRows];
                            }
                        })
                    },
                    rowSelectionDisabled: (record) => {
                        return record.availability === false
                    }
                }} />
        </div>
    )
}

