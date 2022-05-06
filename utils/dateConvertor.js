function getEpochTime(date) {
  console.log('Date : ', date);
  let currentTime;
  if (date) {
    let newDate = date.split('-').reverse().join('-') + 'T00:00:00.000+05:30';
    console.log('New Date : ', newDate);
    currentTime = new Date(newDate);
  } else {
    return '';
  }
  let epochTimestamp = currentTime.getTime();
  return parseInt(epochTimestamp);
}

module.exports = {
  getEpochTime,
};
