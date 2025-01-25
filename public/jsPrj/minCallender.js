
const dtp1Instance = new mds.MdsPersianDateTimePicker(document.getElementById('dtp1'), {
  targetTextSelector: '[data-name="dtp1text"]',//*inputText for showing Date
  targetDateSelector: '[data-name="dtp1date"]',//inputText for  showing milady
  placement: "right",
  // selectedDateToShow:new Date( "2024-5-21"),
  disabledDays:[...DisabledDays],
  disableBeforeDate:disableBeforeDate,
  });
  