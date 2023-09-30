const formatDateTime = (d) => {
    return d.getFullYear() + "-" + (d.getMonth()+1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2,'0') + " " + d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0') + ":" + d.getSeconds().toString().padStart(2,'0');
}

const formatDate = (d) => {
    return d.getFullYear() + "-" + (d.getMonth()+1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2,'0'); 
}

const formatDateTimeLocal = (d) => {
    return d.getDate().toString().padStart(2,'0') + "/" + (d.getMonth()+1).toString().padStart(2, '0') + "/" + d.getFullYear() + " " + d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0');
}

const formatDateLocal = (d) => {
    return d.getDate().toString().padStart(2,'0') + "/" + (d.getMonth()+1).toString().padStart(2, '0') + "/" + d.getFullYear();
}

const getDatesInRange = (startDate, endDate) => {
    const date = new Date(startDate);
  
    const dates = [];
  
    while (date <= new Date(endDate)) {
      dates.push(formatDate(new Date(date)));
      date.setDate(date.getDate() + 1);
    }
  
    return dates;
}

const checkSameDate = (d1, d2) => {
    if (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()) {
        return true;
    }

    return false;
}

export {formatDate, formatDateTime, formatDateLocal, formatDateTimeLocal, getDatesInRange, checkSameDate};