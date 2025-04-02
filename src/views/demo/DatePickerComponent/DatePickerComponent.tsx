import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePickerComponent.css' // Asegúrate de importar tu archivo CSS
import { useEffect, useState } from 'react'

interface DatePickerComponentProps {
    startDate: Date | null
    endDate: Date | null
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}) => {
    const [isResponsive, setIsResponsive] = useState(false)
    const [openStart, setOpenStart] = useState(false)
    const [openEnd, setOpenEnd] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsResponsive(window.innerWidth <= 768) // Define el tamaño responsive
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (isResponsive && startDate && endDate) {
            setOpenStart(false)
            setOpenEnd(false)
        }
    }, [startDate, endDate, isResponsive])

    return (
        <div className="datepicker-container">
            <div className="date-range">
                <DatePicker
                    dateFormat="MMMM yyyy"
                    endDate={endDate}
                    onChange={(date) => {
                        setStartDate(date)
                        if (isResponsive) setOpenStart(false) // Cierra el calendario en responsive
                    }}
                    onClickOutside={() => setOpenStart(false)}
                    onFocus={() => setOpenStart(true)}
                    open={openStart}
                    placeholderText="Desde"
                    selected={startDate}
                    selectsStart
                    showMonthYearPicker
                    startDate={startDate}
                />
                <DatePicker
                    dateFormat="MMMM yyyy"
                    endDate={endDate}
                    minDate={startDate || undefined}
                    onChange={(date) => {
                        setEndDate(date)
                        if (isResponsive) setOpenEnd(false) // Cierra el calendario en responsive
                    }}
                    onClickOutside={() => setOpenEnd(false)}
                    onFocus={() => setOpenEnd(true)}
                    open={openEnd}
                    placeholderText="Hasta"
                    selected={endDate}
                    selectsEnd
                    showMonthYearPicker
                    startDate={startDate}
                />
            </div>
        </div>
    )
}

DatePickerComponent.propTypes = {
    endDate: PropTypes.instanceOf(Date),
    setEndDate: PropTypes.func.isRequired,
    setStartDate: PropTypes.func.isRequired,
    startDate: PropTypes.instanceOf(Date),
}

export default DatePickerComponent
