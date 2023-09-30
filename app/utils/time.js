function formatDateTime(d) {
    const timezoneOffset = 8 * 60; // +8 hours in minutes
  
    const utcTimestamp = d.getTime() + d.getTimezoneOffset() * 60 * 1000;
    const localTimestamp = utcTimestamp + timezoneOffset * 60 * 1000;
  
    const localDate = new Date(localTimestamp);
  
    return (
      localDate.getFullYear() + "-" +
      (localDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
      localDate.getDate().toString().padStart(2, '0') + " " +
      localDate.getHours().toString().padStart(2, '0') + ":" +
      localDate.getMinutes().toString().padStart(2, '0') + ":" +
      localDate.getSeconds().toString().padStart(2, '0')
    );
  };

module.exports = {
    formatDateTime
};