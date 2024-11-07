export const getTimeDifference = (startTime: string, endTime: string): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // ایجاد تاریخ برای امروز با زمان مشخص
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    // محاسبه اختلاف به میلی‌ثانیه و تبدیل به دقیقه
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const totalMinutes = differenceInMilliseconds / (1000 * 60);

    // تبدیل دقیقه‌ها به ساعت و دقیقه
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    // اضافه کردن صفر به دقیقه در صورت نیاز برای فرمت `H:i`
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

export const minutesToHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`; // Return in HH:MM format
}
