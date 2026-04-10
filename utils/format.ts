export function getRelativeTimeFormat(date: Date) {
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime(); // Difference in milliseconds
    const diffInSecs = Math.floor(diffInMs / 1000);

    const minutes = Math.floor(diffInSecs / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate
    const years = Math.floor(days / 365); // Approximate

    const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' });

    // Determine the appropriate unit
    if (Math.abs(diffInSecs) < 60) {
        return rtf.format(diffInSecs, 'second');
    } else if (Math.abs(minutes) < 60) {
        return rtf.format(minutes, 'minute');
    } else if (Math.abs(hours) < 24) {
        return rtf.format(hours, 'hour');
    } else if (Math.abs(days) < 30) {
        return rtf.format(days, 'day');
    } else if (Math.abs(months) < 12) {
        return rtf.format(months, 'month');
    } else {
        return rtf.format(years, 'year');
    }
}