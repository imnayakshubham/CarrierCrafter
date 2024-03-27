import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Carriers } from "../Carriers/Carriers"
import "./CarriersList.css"
import Filters from "../Filters/Filters"
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchCarriersList } from "../../store/actions/carriersActions"
import { addToCarrierCart } from "../../store/reducer/carriersReducer"
import { RootState } from "../../store/reducer/reducer"
import { AppDispatch } from "../../store/store"

export type FilterData = {
    name: string | null;
    availability: boolean | null | string;
    onTimeDeliveryPercentage: number[];
    rating: number[];
    specialRequirements: { label: string, value: string }[] | null;
}


const CarriersList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const carriersList = useSelector((state: RootState) => state.carriers.carriersList)
    const [selectedCarriers, setSelectedCarriers] = useState([])

    const [isOpen, setIsOpen] = useState(false)

    const [filterData, setFilterData] = useState<FilterData>({
        name: null,
        availability: null,
        onTimeDeliveryPercentage: [],
        rating: [],
        specialRequirements: null
    })

    const fetchCarriers = useCallback(async () => {
        dispatch(fetchCarriersList());
    }, [dispatch])

    const isSpecialRequirementsIncluded = (input1: string[] = [], input2: string[] = []): boolean => {
        const smallerArray = input1.length < input2.length ? input1 : input2;
        const largerArray = input1.length < input2.length ? input2 : input1;

        return smallerArray.some(item => largerArray.includes(item));
    };

    const filteredCarriersData = useMemo(() => {
        return carriersList.data?.filter(item => {
            if (filterData.name && !item.name?.trim().toLowerCase().includes(filterData.name?.trim().toLowerCase())) {
                return false;
            }

            if (filterData.availability !== null && item.availability !== Boolean(filterData.availability)) {
                return false;
            }

            if (filterData.onTimeDeliveryPercentage.length !== 0 &&
                (item.onTimeDeliveryPercentage <= filterData.onTimeDeliveryPercentage[0] ||
                    item.onTimeDeliveryPercentage >= filterData.onTimeDeliveryPercentage[1])) {
                return false;
            }

            if (filterData.rating.length !== 0 &&
                (item.rating <= filterData.rating[0] || item.rating >= filterData.rating[1])) {
                return false;
            }

            const specialRequirements = filterData.specialRequirements?.map((item) => item.value)
            const included = isSpecialRequirementsIncluded(specialRequirements, item.specialRequirements)

            if (filterData.specialRequirements && !included) {
                return false;
            }
            return true;
        });
    }, [carriersList.data, filterData]);

    useEffect(() => {
        fetchCarriers()
    }, [fetchCarriers])

    const handleCarrierBooking = () => {
        dispatch(addToCarrierCart(selectedCarriers))
        navigate("/book-carriers")
    }


    return (
        <div className="carriers__container">
            <div className="carriers__list__container">
                <div className="filter__container">
                    <div>
                        <Input type="text" placeholder="Search by name" onChange={(e) => {
                            setFilterData((prev) => {
                                return {
                                    ...prev,
                                    name: e.target.value
                                }
                            })
                        }} />
                    </div>
                    <div className="table__action">
                        <CarriersFilterDrawer setFilterData={setFilterData} isOpen={isOpen} setIsOpen={setIsOpen} filterData={filterData} />
                        <Button onClick={handleCarrierBooking} isDisabled={!selectedCarriers.length} >
                            Book <div className="hide">Carrier</div>
                        </Button>
                    </div>
                </div>
                <Carriers carriersData={filteredCarriersData} setSelectedCarriers={setSelectedCarriers} />
            </div>

        </div>
    )
}

export default CarriersList

type CarriersFilterDrawerProps = {
    filterData: FilterData;
    setFilterData: (data: FilterData) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

function CarriersFilterDrawer({ filterData, setFilterData, isOpen, setIsOpen }: CarriersFilterDrawerProps) {
    const btnRef = React.useRef<HTMLButtonElement>(null)

    const [formData, setFormData] = React.useState({ ...filterData })

    const onClose = () => setIsOpen(false)
    const onOpen = () => {
        setFormData((prev) => {
            return {
                ...filterData,
                ...prev,
            }
        })
        setIsOpen(true)
    }

    const reset = () => {
        setFormData({
            name: null,
            availability: null,
            onTimeDeliveryPercentage: [],
            rating: [],
            specialRequirements: null
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFilterData({
            ...formData,
            availability: formData.availability === null ? null : formData.availability === "1" ? true : false
        })
        setIsOpen(false)
    }

    return (
        <>
            <Button ref={btnRef} onClick={onOpen}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <i className="fa-solid fa-filter filter__icon"></i> <div className="filter__text">Filters</div>
                </div>
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
                size={"md"}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Filter</DrawerHeader>

                    <form id="filter-form" onSubmit={handleSubmit} className="filter__form__container">
                        <DrawerBody >
                            <Filters setFormData={setFormData} formData={formData} />
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='danger' mr={3} onClick={reset}>
                                Reset
                            </Button>
                            <Button type="submit" form="filter-form" colorScheme='blue'>Apply</Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </>
    )
}