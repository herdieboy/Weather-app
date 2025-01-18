export function getDate() {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() )
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + 6)

    const formatDate = (date: Date) => {
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const day = date.getDate()
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }

    return {
        start: formatDate(startDate),
        end: formatDate(endDate)
    }
}

export function splitTime(time: string) {
    const [datePart, timePart] = time.split("T")
    const [year, month, day] = datePart.split("-")
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const [hour] = timePart.split(":")

    return {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        weekday: weekdays[new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)).getDay()],
        hour: parseInt(hour, 10)
    }
}