const AjaxCreateThisNobat= async()=>{
  const sendStatus = document.getElementById("sendStatus");
  const progressBar=document.getElementById("progressBar");
  const progressDiv=document.getElementById("progressDiv");
  //* the datas is sended by Ajax!
  const aztarekh = document.getElementById("aztarekh").value;
  const tatarekh = document.getElementById("tatarekh").value;
  const monday = document.getElementById("monday").checked;
  const afternon = document.getElementById("afternon").checked;
  const NobatHozori = document.getElementById("NobatHozori").checked;
  const NobatInterneti = document.getElementById("NobatInterneti").checked;
  const azsaat = document.getElementById("azsaat").value;
  const tasaat = document.getElementById("tasaat").value;
  const interval = document.getElementById("interval").value;
  const data={aztarekh,tatarekh,monday,afternon,NobatHozori,NobatInterneti,azsaat,tasaat,interval};
  //*
  let xhttp = new XMLHttpRequest(); //create Ajax request

  xhttp.responseType = "json";
  xhttp.onreadystatechange = function () {
    if (xhttp.status==200){
      sendStatus.innerHTML = this.response.message;
      sendStatus.classList.add("text-success");
      sendStatus.classList.remove("text-danger");
    } else {
      if (this.response.done=="false") {
        sendStatus.classList.remove("text-success");
        sendStatus.classList.add("text-danger");
      }
     
      sendStatus.innerHTML=this.response.message;
     
    }
      
  };

  
  
  
  xhttp.upload.onprogress = function (e) {
    if(e.lengthComputable){
      let result= Math.floor((e.loaded/e.total)*100)
      console.log(result);
      if (result!==100){
        progressBar.innerHTML = result + "%";
        progressBar.style="width:" + result + "%";
      } else {
         progressDiv.style="display:none";
      }
      
    }
  }
  

xhttp.open("POST", "/dashboard/createNobat");   
let formData = new FormData();

  if (true){
      progressDiv.style="display:block"
      //*(change js to json data & append in formdata)
      formData.append("nobat",JSON.stringify(data)) ;
      formData.append("infodata", sendStatus.innerText);
      sendStatus.innerHTML="درحال انجام عملیات لطفا صبر کنید...."
      xhttp.send(formData);
    
  } else {
    sendStatus.innerHTML=" اشکال در ارسال اطلاعات به سرور!"
  }

}

const mondyAfter =(input)=>{
  if( input.id =="monday"){
    document.getElementById("afternon").checked=false
    
  }else{
    document.getElementById("monday").checked=false;
  }
}

const NobatHozeriClk =(input)=>{
  if( input.id =="NobatHozori"){
    document.getElementById("NobatInterneti").checked=false
    
  }else{
    document.getElementById("NobatHozori").checked=false;
  }
}

const azsaat = document.getElementById("azsaat");
azsaat.addEventListener("input", function () {
  const value = this.value.replace(/[^0-9]/g, "");
  if (value.length > 2) {
    this.value = value.slice(0, 2) + ":" + value.slice(2);
  }
});
const tasaat = document.getElementById("tasaat");
tasaat.addEventListener("input", function () {
  const value = this.value.replace(/[^0-9]/g, "");
  if (value.length > 2) {
    this.value = value.slice(0, 2) + ":" + value.slice(2);
  }
});




var vueApp = new Vue({
  el: "#vueAppOptions",
  data: {
    persianNumber: "0",
    disabled: "0",
    isGregorian: "0",
    inLine: "0",
    modalMode: "0",
    enableTimePicker: "0",
    toDateFromDate: "0",
    groupId: "group1",
    rangeSelector: "0",
    rangeSelectorMonthsToShowStart: 0,
    rangeSelectorMonthsToShowEnd: 0,
    textFormat: "yyyy/MM/dd",
    dateFormat: "yyyy/MM/dd",
    yearOffset: 15,
    placement: "bottom",
    holidays: [],
    specialDates: [],
    disabledDates: [],
    disabledDays: [],
  },
  methods: {
    fromDateToDateChange: function (value) {
      if (value) {
        dtp1.updateOptions({
          rangeSelector: false,
        });
        dtp2.updateOptions({
          rangeSelector: false,
        });
        inLineDtp1.updateOptions({
          rangeSelector: false,
        });
        inLineDtp2.updateOptions({
          rangeSelector: false,
        });
      }
      dtp1.updateOptions({
        fromDate: value,
        toDate: false,
        groupId: this.groupId,
      });
      dtp2.updateOptions({
        fromDate: false,
        toDate: value,
        groupId: this.groupId,
      });
      inLineDtp1.updateOptions({
        fromDate: value,
        toDate: false,
        groupId: this.groupId + "_",
      });
      inLineDtp2.updateOptions({
        fromDate: false,
        toDate: value,
        groupId: this.groupId + "_",
      });
    },
    optionChange: function (optionName, value) {
      console.log(`${optionName} => ${value}`);
      switch (optionName) {
        case "inLine":
          this.modalMode = "0";
          dtp1.updateOptions({
            modalMode: false,
          });
          dtp2.updateOptions({
            modalMode: false,
          });
          inLineDtp1.updateOptions({
            modalMode: false,
          });
          inLineDtp2.updateOptions({
            modalMode: false,
          });
          return;
        case "modalMode":
          this.inLine = "0";
          dtp1.updateOptions({
            inLine: false,
          });
          dtp2.updateOptions({
            inLine: false,
          });
          inLineDtp1.updateOptions({
            inLine: false,
          });
          inLineDtp2.updateOptions({
            inLine: false,
          });
          break;
        case "rangeSelector":
          this.toDateFromDate = "0";
          this.fromDateToDateChange(false);
          break;
        case "toDateFromDate":
          this.rangeSelector = "0";
          this.fromDateToDateChange(value);
          return;
        case "groupId":
          dtp1.updateOptions({
            groupId: this.groupId,
          });
          dtp2.updateOptions({
            groupId: this.groupId,
          });
          inLineDtp1.updateOptions({
            groupId: this.groupId + "_",
          });
          inLineDtp2.updateOptions({
            groupId: this.groupId + "_",
          });
          return;
      }
      dtp1.updateOption(optionName, value);
      inLineDtp1.updateOption(optionName, value);
    },
    dateChange: function (optionName) {
      switch (optionName) {
        case "holidays":
          dtp1.updateOption("holidays", [...this.holidays]);
          dtp2.updateOption("holidays", [...this.holidays]);
          inLineDtp1.updateOption("holidays", [...this.holidays]);
          inLineDtp2.updateOption("holidays", [...this.holidays]);
          break;
        case "specialDates":
          dtp1.updateOption("specialDates", [...this.specialDates]);
          dtp2.updateOption("specialDates", [...this.specialDates]);
          inLineDtp1.updateOption("specialDates", [...this.specialDates]);
          inLineDtp2.updateOption("specialDates", [...this.specialDates]);
          break;
        case "disabledDates":
          dtp1.updateOption("disabledDates", [...this.disabledDates]);
          dtp2.updateOption("disabledDates", [...this.disabledDates]);
          inLineDtp1.updateOption("disabledDates", [...this.disabledDates]);
          inLineDtp2.updateOption("disabledDates", [...this.disabledDates]);
          break;
        case "disabledDays":
          dtp1.updateOption("disabledDays", [...this.disabledDays]);
          dtp2.updateOption("disabledDays", [...this.disabledDays]);
          inLineDtp1.updateOption("disabledDays", [...this.disabledDays]);
          inLineDtp2.updateOption("disabledDays", [...this.disabledDays]);
          break;
      }
    },
    addDateItem: function (optionName) {
      switch (optionName) {
        case "holidays":
          this.holidays.push(
            mds.MdsPersianDateTimePicker.convertDateToString(
              new Date(),
              true,
              "yyyy/MM/dd"
            )
          );
          break;
        case "specialDates":
          this.specialDates.push(
            mds.MdsPersianDateTimePicker.convertDateToString(
              new Date(),
              true,
              "yyyy/MM/dd"
            )
          );
          break;
        case "disabledDates":
          this.disabledDates.push(
            mds.MdsPersianDateTimePicker.convertDateToString(
              new Date(),
              true,
              "yyyy/MM/dd"
            )
          );
          break;
        case "disabledDays":
          this.disabledDays.push(1);
          break;
      }
      this.dateChange(optionName);
    },
    removeDateItem: function (optionName) {
      switch (optionName) {
        case "holidays":
          this.holidays.pop();
          break;
        case "specialDates":
          this.specialDates.pop();
          break;
        case "disabledDates":
          this.disabledDates.pop();
          break;
        case "disabledDays":
          this.disabledDays.pop();
          break;
      }
      this.dateChange(optionName);
    },
  },
}); //* end of vew

const setMyDisableDay = () => {
  const myAray = [1, 2, 3];
  vueApp.disabledDays = myAray;
  vueApp.dateChange("disabledDays");
};

const dtp1 = new mds.MdsPersianDateTimePicker(document.getElementById("dtp1"), {
  targetTextSelector: '[data-name="dtp1text"]',
  targetDateSelector: '[data-name="dtp1-date"]',
});
const dtp2 = new mds.MdsPersianDateTimePicker(document.getElementById("dtp2"), {
  targetTextSelector: '[data-name="dtp2text"]',
  targetDateSelector: '[data-name="dtp2-date"]',
});
const inLineDtp1 = new mds.MdsPersianDateTimePicker(
  document.querySelector('[data-name="in-line-dtp1"]'),
  {
    inLine: true,
    targetTextSelector: '[data-name="in-line-dtp1text"]',
    targetDateSelector: '[data-name="in-line-dtp1-date"]',
  }
);
const inLineDtp2 = new mds.MdsPersianDateTimePicker(
  document.querySelector('[data-name="in-line-dtp2"]'),
  {
    inLine: true,
    targetTextSelector: '[data-name="in-line-dtp2text"]',
    targetDateSelector: '[data-name="in-line-dtp2-date"]',
  }
);

function optionOnChange(optionName, value) {
  if (value == "true") value = true;
  else if (value == "false") value = false;

  switch (optionName) {
    case "inLine": {
      switch (value) {
        case true:
          normalDtpContainer.hidden = true;
          inLineDtpContainer.hidden = false;
          inLine = true;
          modalModeRadioOptions.forEach(
            (e) => (e.checked = e.value == "false")
          );
          break;
        case false:
          normalDtpContainer.hidden = false;
          inLineDtpContainer.hidden = true;
          inLine = false;
          break;
      }
      break;
    }

    case "modalMode": {
      normalDtpContainer.hidden = false;
      inLineDtpContainer.hidden = true;
      inLineRadioOptions.forEach((e) => (e.checked = e.value == "false"));
      inLine = false;
      break;
    }

    case "rangeSelector": {
      switch (value) {
        case true:
          // from/to date
          dtp2ContainerElement.hidden = true;
          inLineDtp2ContainerElement.hidden = true;
          groupIdTextBoxElement.setAttribute("readonly", "");
          fromToDateTitleElements.forEach((e) => (e.hidden = true));
          // ----------
          rangeSelectorMonthsToShowInputElements.forEach((e) =>
            e.removeAttribute("readonly")
          );
          toDateFromDateRadioOptions.forEach(
            (e) => (e.checked = e.value == "false")
          );
          groupIdTextBoxElement.setAttribute("readonly", "");
          break;
        case false:
          rangeSelectorMonthsToShowStartInputElements.value = 0;
          rangeSelectorMonthsToShowEndInputElements.value = 0;
          rangeSelectorMonthsToShowInputElements.forEach((e) =>
            e.setAttribute("readonly", "")
          );
          rangeSelectorMonthsToShowOnChange();
          break;
      }
      break;
    }

    case "fromDate":
    case "toDate": {
      switch (value) {
        case true:
          // rangeSelector
          rangeSelectorMonthsToShowStartInputElements.value = 0;
          rangeSelectorMonthsToShowEndInputElements.value = 0;
          rangeSelectorMonthsToShowInputElements.forEach((e) =>
            e.setAttribute("readonly", "")
          );
          rangeSelectorRadioOptions.forEach(
            (e) => (e.checked = e.value == "false")
          );
          // ----------
          dtp2ContainerElement.hidden = false;
          inLineDtp2ContainerElement.hidden = false;
          groupIdTextBoxElement.removeAttribute("readonly");
          fromToDateTitleElements.forEach((e) => (e.hidden = false));
          break;
        case false:
          dtp2ContainerElement.hidden = true;
          inLineDtp2ContainerElement.hidden = true;
          groupIdTextBoxElement.setAttribute("readonly", "");
          fromToDateTitleElements.forEach((e) => (e.hidden = true));
          break;
      }
      rangeSelectorMonthsToShowOnChange();
      break;
    }
  }

  console.log(`${optionName} => ${value}`);

  switch (optionName) {
    case "rangeSelector":
      dtp1.updateOptions({
        toDate: false,
        fromDate: false,
        rangeSelector: value,
      });
      dtp2.updateOptions({
        toDate: false,
        fromDate: false,
        rangeSelector: value,
      });
      inLineDtp1.updateOptions({
        toDate: false,
        fromDate: false,
        rangeSelector: value,
      });
      inLineDtp2.updateOptions({
        toDate: false,
        fromDate: false,
        rangeSelector: value,
      });
      break;

    case "toDate":
    case "fromDate":
      dtp1.updateOptions({
        groupId: groupIdTextBoxElement.value,
        fromDate: value,
        rangeSelector: false,
      });
      dtp2.updateOptions({
        groupId: groupIdTextBoxElement.value,
        toDate: value,
        rangeSelector: false,
      });
      inLineDtp1.updateOptions({
        groupId: "_" + groupIdTextBoxElement.value,
        fromDate: value,
        rangeSelector: false,
      });
      inLineDtp2.updateOptions({
        groupId: "_" + groupIdTextBoxElement.value,
        toDate: value,
        rangeSelector: false,
      });
      break;

    case "textFormat":
    case "dateFormat":
      dtp1.updateOption(optionName, value);
      dtp1.updateSelectedDateText();
      dtp2.updateOption(optionName, value);
      dtp2.updateSelectedDateText();
      inLineDtp1.updateOption(optionName, value);
      inLineDtp1.updateSelectedDateText();
      inLineDtp2.updateOption(optionName, value);
      inLineDtp2.updateSelectedDateText();
      break;

    case "inLine":
      dtp1.updateOptions({
        modalMode: false,
      });
      dtp2.updateOptions({
        modalMode: false,
      });
      break;

    case "modalMode":
      dtp1.updateOption(optionName, value);
      dtp2.updateOption(optionName, value);
      break;

    case "disabled":
      dtp1.updateOption(optionName, value);
      dtp2.updateOption(optionName, value);
      inLineDtp1.updateOption(optionName, value);
      inLineDtp2.updateOption(optionName, value);
      break;

    case "isGregorian":
      dtp1.updateOption(optionName, value);
      dtp2.updateOption(optionName, value);
      dtp1.updateSelectedDateText();
      dtp2.updateSelectedDateText();
      inLineDtp1.updateOption(optionName, value);
      inLineDtp2.updateOption(optionName, value);
      inLineDtp1.updateSelectedDateText();
      inLineDtp2.updateSelectedDateText();
      break;

    case "enableTimePicker":
      dtp1.updateOption(optionName, value);
      dtp1.updateSelectedDateText();
      inLineDtp1.updateOption(optionName, value);
      inLineDtp1.updateSelectedDateText();
      break;

    default:
      dtp1.updateOption(optionName, value);
      inLineDtp1.updateOption(optionName, value);
      break;
  }
}

function rangeSelectorMonthsToShowOnChange() {
  const start = Number(rangeSelectorMonthsToShowStartInputElements.value);
  const end = Number(rangeSelectorMonthsToShowEndInputElements.value);
  if (start == 0 && end == 0)
    inLineDtp1ColumnElement.setAttribute("class", "col-5");
  else inLineDtp1ColumnElement.setAttribute("class", "col-12");
  inLineDtp1Element.style.width = "";
  dtp1.updateOption("rangeSelectorMonthsToShow", [start, end]);
  inLineDtp1.updateOption("rangeSelectorMonthsToShow", [start, end]);
}
// my functions for nobat calender
function sayDayofWeek(numberDay) {
  switch (numberDay) {
    case 1:
      return "دوشنبه";
      break;
    case 2:
      return "سه‌شنبه";
      break;
    case 3:
      return "چهارشنبه";
      break;
    case 4:
      return "پنج‌شنبه";
      break;
    case 5:
      return "جمعه";
      break;
    case 6:
      return "شنبه";
      break;
    case 0:
      return "یکشنبه";
      break;

    default:
      return 0;
      break;
  }
}

function saytoDay() {
  const d = new Date();
  const Inputdtp1 = document.getElementById("Inputdtp1");
  const weeklabel = document.getElementById("weeklabel");
  const amroz = new Intl.DateTimeFormat("fa-IR").format(d);
  const e2p = (s) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  Inputdtp1.value = e2p(amroz);
  weeklabel.innerHTML = sayDayofWeek(moment(p2e(amroz)).day());
}
function sayNextDay() {
  const Inputdtp1 = document.getElementById("Inputdtp1");
  const weeklabel = document.getElementById("weeklabel");
  // convert parsian number to english
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  var m = moment(p2e(Inputdtp1.value), "jYYYY/jM/jDD")
    .add(1, "day")
    .format("YYYY/MM/DD");
  // convert english number to parsian
  const e2p = (s) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  Inputdtp1.value = e2p(m);
  weeklabel.innerHTML = sayDayofWeek(moment(p2e(m)).day());
}

function sayPreDay() {
  const d = new Date();
  const today = new Intl.DateTimeFormat("fa-IR").format(d);
  const Inputdtp1 = document.getElementById("Inputdtp1");
  const weeklabel = document.getElementById("weeklabel");
  // convert parsian number to english
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  var m = moment(p2e(Inputdtp1.value), "jYYYY/jMM/jDD")
    .add(-1, "day")
    .format("YYYY/MM/DD");
  // convert english number to parsian
  const e2p = (s) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  if (moment(m, "jYYYY/jMM/jDD") < moment(p2e(today), "jYYYY/jMM/jDD")) {
    Inputdtp1.value = e2p(today);
    weeklabel.innerHTML = sayDayofWeek(moment(p2e(today)).day());
  } else {
    Inputdtp1.value = e2p(m);
    weeklabel.innerHTML = sayDayofWeek(moment(p2e(m)).day());
  }
}
function sayNextweek() {
  const Inputdtp1 = document.getElementById("Inputdtp1");
  const weeklabel = document.getElementById("weeklabel");
  // convert parsian number to english
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  var m = moment(p2e(Inputdtp1.value.toString().slice(-10)), "jYYYY/jMM/jDD")
    .add(7, "day")
    .format("YYYY/MM/DD");
  // convert english number to parsian
  const e2p = (s) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  //Inputdtp1.value = e2p(m);
  Inputdtp1.value = e2p(m);
  weeklabel.innerHTML = sayDayofWeek(moment(p2e(m)).day());
}
function sayPreweek() {
  // find today
  const d = new Date();
  const today = new Intl.DateTimeFormat("fa-IR").format(d);
  //
  const Inputdtp1 = document.getElementById("Inputdtp1");
  const weeklabel = document.getElementById("weeklabel");
  // convert parsian number to english
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  var m = moment(p2e(Inputdtp1.value.toString().slice(-10)), "jYYYY/jMM/jDD")
    .add(-7, "day")
    .format("YYYY/MM/DD");
  // convert english number to parsian
  const e2p = (s) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  if (moment(m, "jYYYY/jMM/jDD") < moment(p2e(today), "jYYYY/jMM/jDD")) {
    Inputdtp1.value = e2p(today);
    weeklabel.innerHTML = sayDayofWeek(moment(p2e(today)).day());
  } else {
    Inputdtp1.value = e2p(m);
    weeklabel.innerHTML = sayDayofWeek(moment(p2e(m)).day());
  }
}

