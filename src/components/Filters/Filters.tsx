import { Flex, FormControl, FormLabel, Input, Radio, RadioGroup, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Stack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import ReactSelect from 'react-select';
import './Filters.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer/reducer';
import { CarrierType } from '../../store/reducer/carriersReducer';

type typeFiltersProp = {
    formData: any,
    setFormData: any
}

const Filters = ({ formData, setFormData }: typeFiltersProp) => {

    const carriersListData = useSelector((state: RootState) => state.carriers.carriersList?.data)

    const rangeCalculator = (data: CarrierType[]) => {
        const onTimeDeliveryPercentageRange = data.reduce((range: number[], item) => {
            range[0] = Math.min(range[0], item.onTimeDeliveryPercentage);
            range[1] = Math.max(range[1], item.onTimeDeliveryPercentage);
            return range;
        }, [Number.MAX_VALUE, Number.MIN_VALUE]);

        const ratingRange = data.reduce((range: number[], item) => {
            range[0] = Math.min(range[0], item.rating);
            range[1] = Math.max(range[1], item.rating);
            return range;
        }, [Number.MAX_VALUE, Number.MIN_VALUE]);

        return {
            onTimeDeliveryPercentage: onTimeDeliveryPercentageRange,
            rating: ratingRange
        };
    };

    const rangeData = useMemo(() => rangeCalculator(carriersListData), [carriersListData])

    const specialRequirementsOptions = useMemo(() => {
        const options = carriersListData.reduce((acc: string[], curr) => {
            acc.push(...(curr?.specialRequirements ?? []))
            return [...new Set(acc)]
        }, [])
        return options.map((option) => ({ value: option, label: option }))
    }, [carriersListData])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setFormData({ ...formData, [type]: event.target.value });
    };

    const handleRadioChange = (value: number | string) => {
        setFormData({ ...formData, availability: value });
    };

    const handleRangeChange = (value: number[], name: string) => {
        setFormData({ ...formData, [name]: value });
    }

    const handleSelectChange = (options) => {
        setFormData({ ...formData, specialRequirements: options });
    };

    return (
        <div className='filter__form__items__container'>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input type='text' name='name' value={formData.name} onChange={(e) => {
                    handleInputChange(e, 'name')
                }} />
            </FormControl>

            <FormControl>
                <FormLabel>Available</FormLabel>
                <RadioGroup name='availability' value={formData.availability} onChange={(e) => handleRadioChange(e)}>
                    <Stack direction='row'>
                        <Radio value={"1"}>Yes</Radio>
                        <Radio value='0'>No</Radio>
                    </Stack>
                </RadioGroup>
            </FormControl>

            <FormControl>
                <FormLabel>Delivery Rate</FormLabel>
                <RangeSlider min={rangeData.onTimeDeliveryPercentage[0]} max={rangeData.onTimeDeliveryPercentage[1]} aria-label={['min', 'max']} name={["min, max"]} onChangeEnd={(val) => handleRangeChange(val, "onTimeDeliveryPercentage")}
                    step={0.1}
                    defaultValue={[rangeData.onTimeDeliveryPercentage[0], rangeData.onTimeDeliveryPercentage[1]]}
                >
                    <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                </RangeSlider>
                <Flex justify="space-between" w="full">
                    <Text>{rangeData.onTimeDeliveryPercentage[0]}</Text>
                    <Text>{rangeData.onTimeDeliveryPercentage[1]}</Text>
                </Flex>
            </FormControl>

            <FormControl>
                <FormLabel>Rating</FormLabel>
                <RangeSlider min={rangeData.rating[0]} max={rangeData.rating[1]} aria-label={['min', 'max']} defaultValue={[rangeData.rating[0], rangeData.rating[1]]} name={"rating"} onChangeEnd={(val) => handleRangeChange(val, "rating")} step={0.2}>
                    <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} color={"red"} />
                    <RangeSliderThumb index={1} />
                </RangeSlider>
                <Flex justify="space-between" w="full">
                    <Text>{rangeData.rating[0]}</Text>
                    <Text>{rangeData.rating[1]}</Text>
                </Flex>
            </FormControl>

            <FormControl>
                <FormLabel>Special Requirements</FormLabel>
                <ReactSelect isSearchable value={formData.specialRequirements} options={specialRequirementsOptions} isMulti name='specialRequirements' onChange={(val) => handleSelectChange(val)} />
            </FormControl>
        </div >
    )
}

export default Filters