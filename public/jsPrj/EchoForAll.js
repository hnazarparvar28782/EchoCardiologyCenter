let sampleDivVisible = true;
let finalResultDivVisible = true;
let nextOn = true;
function collectData() {

    const accordions = document.querySelectorAll('.accordion-item');
    const data = [];

    accordions.forEach(accordion => {
        const title = accordion.querySelector('.accordion-button').textContent.trim();
        const bodyContent = accordion.querySelector('.accordion-body');
        const tables = bodyContent.querySelectorAll('table');
        const accordionData = { title, categories: [] };

        tables.forEach(table => {
            const previousElement = table.previousElementSibling;
            // const category = previousElement && previousElement.dataset.type === 'category' ? previousElement.textContent.trim() : null;
            const category = previousElement && previousElement.tagName === 'H5' ? previousElement.textContent.trim() : null;
            const tableRows = table.querySelectorAll('tbody tr');
            const parameters = [];

            // شناسایی ستون "Select"
            const selectColumnIndex = Array.from(table.querySelectorAll('th')).findIndex(th => th.textContent.trim() === 'Select');

            tableRows.forEach(row => {

                const userValueInput = row.querySelector('input[name="userValue"]') || row.querySelector('input[name="uservalue"]');

                const normalCheckbox = row.querySelector('input[type="checkbox"][name="Normal"]');
                const moderateCheckbox = row.querySelector('input[type="checkbox"][name="Moderate"]');
                const abnormalCheckbox = row.querySelector('input[type="checkbox"][name="Abnormal"]');
                const isUserValuePresent = userValueInput ? userValueInput.value.trim() !== '' : false;
                let result = "";

                if (normalCheckbox && normalCheckbox.checked) {
                    result = 'Normal';
                } else if (moderateCheckbox && moderateCheckbox.checked) {
                    result = 'Moderate';
                } else if (abnormalCheckbox && abnormalCheckbox.checked) {
                    result = 'Abnormal';
                }

                const isResultChecked = result.length > 0;

                // منطق جمع‌آوری داده‌های ستون "Details"
                const details = [];
                const detailItems = row.querySelectorAll('td[data-label="Details"] ul li');

                detailItems.forEach(item => {
                    const checkboxes = item.querySelectorAll('input[type="checkbox"]');
                    const input = item.querySelector('input[type="text"]');

                    // بررسی وضعیت چک باکس‌ها
                    let checkedValues = [];

                    checkboxes.forEach(checkbox => {
                        if (checkbox.checked) {
                            checkedValues.push(checkbox.value); // جمع‌آوری مقادیر چک باکس‌های انتخاب شده
                        }
                    });

                    // اضافه کردن وضعیت چک باکس‌ها به details
                    if (checkedValues.length > 0) {
                        details.push(`${item.childNodes[0].textContent.trim()}: ${checkedValues.join(', ')}`);
                    }

                    // بررسی ورودی متنی
                    if (input && input.value.trim() !== '') {
                        details.push(`${item.childNodes[0].textContent.trim()}: ${input.value}`);
                    }
                });

                // جمع‌آوری داده‌های سطر
                if (isUserValuePresent || isResultChecked || details.length > 0) {
                    const rowData = {};
                    const cells = row.cells;

                    for (let i = 0; i < cells.length; i++) {
                        const cell = cells[i];
                        // نادیده گرفتن ستون "Select"
                        if (i === selectColumnIndex) {
                            continue; // به سادگی از جمع‌آوری داده‌های این ستون صرف‌نظر کنید
                        }
                        const header = table.querySelector(`thead th:nth-child(${i + 1})`).textContent.trim();
                        rowData[header] = cell.querySelector('input[type="text"]') ? cell.querySelector('input[type="text"]').value.trim() : cell.textContent.trim();
                    }
                    rowData['Result'] = result;
                    if (details.length > 0) rowData['Details'] = details.join('\n'); // استفاده از '\n' برای جدا کردن خطوط

                    parameters.push(rowData);
                }
            });

            if (parameters.length > 0) {
                accordionData.categories.push({
                    category,
                    parameters
                });
            }
        });

        if (accordionData.categories.length > 0) {
            data.push(accordionData);
        }
    });

    console.log('end of collecting data.....');
    return data;
}

function downloadJSON(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accordionData.json';
    a.click();
    URL.revokeObjectURL(url);
}


function getSelectedRows() {
    const selectedRows = []; // آرایه‌ای برای ذخیره ردیف‌های انتخاب شده

    // انتخاب تمامی آکوردیون‌ها
    const accordions = document.querySelectorAll('.accordion-item');

    // پیمایش هر آکوردیون
    accordions.forEach((accordion, accordionIndex) => {
        const title = accordion.querySelector('.accordion-button').innerText; // عنوان آکوردیون

        // انتخاب تمامی ردیف‌های جدول در این آکوردیون
        const rows = accordion.querySelectorAll('tbody tr');

        const selectedInAccordion = []; // آرایه‌ای برای ذخیره ردیف‌های انتخاب شده در این آکوردیون

        rows.forEach((row, rowIndex) => {
            const checkbox = row.querySelector('input[type="checkbox"][name="select"]'); // چک باکس انتخاب

            // اگر چک باکس تیک خورده باشد
            if (checkbox && checkbox.checked) {
                // ذخیره شماره ردیف (1-indexed) در آرایه مربوط به این آکوردیون
                selectedInAccordion.push(rowIndex + 1); // شماره ردیف (1-indexed)
            }
        });

        // اگر ردیف‌های انتخاب شده‌ای در این آکوردیون وجود داشته باشد
        if (selectedInAccordion.length > 0) {
            selectedRows.push({
                disc: title,
                echoNumber: accordionIndex + 1, // شماره آکوردیون (1-indexed)
                selectedRows: selectedInAccordion // ردیف‌های انتخاب شده
            });
        }
    });

    return selectedRows; // بازگرداندن ردیف‌های انتخاب شده
}
function DisplayEchoRep() {
    const contentEditor = quill.root.innerHTML; // دریافت محتوای HTML
    const sickcodemilli = "1111111111"
    const fullnamesick = document.getElementById('patientName').value;
    const doctorName = document.getElementById('doctorName').value;
    //* change to javaScript data to json
    const FinalResult = JSON.stringify({ FinalResult: contentEditor })
    const userSelectedData = collectData();

    // //* sending data to nodjs server....
    if ((contentEditor == '<p><br></p>') & (userSelectedData.length == 0)) {
        Swal.fire({
            title: "Dear User",
            text: 'The echo information is incomplete',
            icon: "error",
            confirmButtonText: "Confirm"
        })
        return
    }

    genEchoRep(userSelectedData, fullnamesick, doctorName, FinalResult, sickcodemilli);

}

async function genEchoRep(userSelectedData, fullnamesick, DoctorFullname, FinalResult, sickcodemilli) {
    const data = userSelectedData;

    let reportTitle = "Echo Cardiography Report";
    let reportFooter = DoctorFullname;
    let bodyFont = "َArial";
    let bodyFontSize = 10;
    let finalFont = "Arial";
    let finalFontSize = 10;

    if (!data || !Array.isArray(data) || !data[0]) {
        console.error("Invalid data.", data);
        alert("Invalid data provided.");
        return;
    }

    const now = new Date();
    const EchoDate = now.toLocaleDateString();
    const echolabData = userSelectedData;
    const finalResult = JSON.parse(FinalResult).FinalResult || "No final result provided.";
    const echolabDataString = echolabData;

    if (!echolabDataString) {
        console.error("Missing echolabData.");
        alert("Missing echolabData.");
        return;
    }

    const htmlContent = `
    <html lang="en">
    <head dir="ltr">
        <title>Echocardiographic Report</title>
        <style>
            body {
                font-family: '${bodyFont}', sans-serif;
                margin: 20px;
                padding: 0;
            }
            .reportTitle {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin: 10px 0;
                border-bottom: 2px solid black;
            }
            .finalResult {
                font-family: ${finalFont};
                font-size: ${finalFontSize}px;
                color: #333;
                margin-top: 20px;
            }
            .finalResultContainer {
                border: 2px solid #4CAF50;
                border-radius: 10px;
                padding: 6px;
                margin-top: 20px;
                background-color: #f9f9f9;
                page-break-inside: avoid;
            }

            .title {
                font-size: 11px;
                font-weight: bold;
                margin: 10px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
                font-size: ${bodyFontSize}px;
            }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
            td {border: 1px solid #ddd;padding: 8px;
            white-space: pre-line;  }/*for control charactor*/
            #report-container {
                background: white;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                direction: ltr; 
            }
        </style>
    </head>
    <body>
        <div id="report-container">
            <h1 class="reportTitle">${reportTitle}</h1>
            <p>Patient’s Name :Mr/Ms ${fullnamesick}</p>
            <p>Doctor’s Name:Dr. ${DoctorFullname}</p>
            <p>Date: ${EchoDate}</p>
            ${echolabData.map(report => `
                <h2 class="title">${report.title}</h2>
                ${report.categories.map(category => `
                    ${category.category ? `<div class="category">${category.category}</div>` : ''}
                    <table>
                        <thead>
                            <tr>${Object.keys(category.parameters[0]).filter(header => header !== "Result").map(header => `<th>${header}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${category.parameters.map(parameter => `
                                <tr>${Object.keys(parameter).map(key => `<td>${parameter[key]}</td>`).join('')}</tr>
                            `).join('')}
                        </tbody>
                    </table>
                `).join('')}
            `).join('')}
           <div style="margin:0;"  class="finalResultContainer">
             <div><h5 style="margin:0;;padding:0;">Result And Comment :</h5></div>
             <div class="finalResult">${finalResult}</div>
             <div class=" container text-center">Dr. ${reportFooter}</div>
           </div>
           <div class="footer">
            &copy; 2025 <a href="http://doctorpesheto.ir" target="_blank">doctorpesheto.ir</a>
           </div>

        </div>
    </body>
    </html>
    `;

    // ایجاد یک پنجره جدید یا بخش در همان صفحه
    const reportWindow = window.open('', '_blank', 'width=800,height=600');
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();

    // اضافه کردن دکمه چاپ
    const printButton = reportWindow.document.createElement('button');
    printButton.textContent = 'Print';
    printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    printButton.onclick = () => reportWindow.print();
    reportWindow.document.body.appendChild(printButton);
}

let currentIndex = -1; // برای پیگیری اندیس آکوردیون فعلی

document.getElementById('searchButton').addEventListener('click', function () {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const accordionItems = document.querySelectorAll('.accordion-item');
    let firstMatchFound = false;

    accordionItems.forEach((item, index) => {
        const title = item.querySelector('.accordion-button').innerText.toLowerCase();
        const collapse = item.querySelector('.accordion-collapse');

        if (title.includes(searchTerm)) {
            collapse.classList.add('show'); // باز کردن آکوردیون
            item.querySelector('.accordion-button').classList.remove('collapsed');

            if (!firstMatchFound) {
                firstMatchFound = true;
                currentIndex = index; // ذخیره اندیس اولین مورد پیدا شده
                // اسکرول به آکوردیون باز شده
                item.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // اگر مورد بعدی پیدا شد، آکوردیون را به حالت بسته برگردانید
                collapse.classList.remove('show');
                item.querySelector('.accordion-button').classList.add('collapsed');
            }
        } else {
            collapse.classList.remove('show');
            item.querySelector('.accordion-button').classList.add('collapsed');
        }
    });

    // نمایش دکمه‌های "قبلی"، "بعدی" و "به بالا برو" اگر حداقل یک مورد پیدا شده باشد
    document.getElementById('navigationButtons').style.display = firstMatchFound ? 'block' : 'none';
});

document.getElementById('nextButton').addEventListener('click', function () {
    const accordionItems = document.querySelectorAll('.accordion-item');
    let nextIndex = currentIndex + 1; // اندیس بعدی

    // جستجوی آکوردیون بعدی
    while (nextIndex < accordionItems.length) {
        const title = accordionItems[nextIndex].querySelector('.accordion-button').innerText.toLowerCase();
        if (title.includes(document.getElementById('searchInput').value.toLowerCase())) {
            // اگر عنوان شامل نام جستجو شده باشد
            accordionItems[currentIndex].querySelector('.accordion-collapse').classList.remove('show'); // بستن آکوردیون قبلی
            accordionItems[currentIndex].querySelector('.accordion-button').classList.add('collapsed');

            accordionItems[nextIndex].querySelector('.accordion-collapse').classList.add('show'); // باز کردن آکوردیون بعدی
            accordionItems[nextIndex].querySelector('.accordion-button').classList.remove('collapsed');

            currentIndex = nextIndex; // به روز رسانی اندیس فعلی
            // اسکرول به آکوردیون باز شده
            accordionItems[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
        }
        nextIndex++;
    }
});

document.getElementById('prevButton').addEventListener('click', function () {
    const accordionItems = document.querySelectorAll('.accordion-item');
    let prevIndex = currentIndex - 1; // اندیس قبلی

    // جستجوی آکوردیون قبلی
    while (prevIndex >= 0) {
        const title = accordionItems[prevIndex].querySelector('.accordion-button').innerText.toLowerCase();
        if (title.includes(document.getElementById('searchInput').value.toLowerCase())) {
            // اگر عنوان شامل نام جستجو شده باشد
            accordionItems[currentIndex].querySelector('.accordion-collapse').classList.remove('show'); // بستن آکوردیون فعلی
            accordionItems[currentIndex].querySelector('.accordion-button').classList.add('collapsed');

            accordionItems[prevIndex].querySelector('.accordion-collapse').classList.add('show'); // باز کردن آکوردیون قبلی
            accordionItems[prevIndex].querySelector('.accordion-button').classList.remove('collapsed');

            currentIndex = prevIndex; // به روز رسانی اندیس فعلی
            // اسکرول به آکوردیون باز شده
            accordionItems[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
        }
        prevIndex--;
    }
});

// تابع برای دکمه "به بالا برو"
document.getElementById('backToTopButton').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // اسکرول به بالای صفحه
});




//* AI Section****************
async function ReporterAI() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block'; // نمایش spinner

    const dataEcho = collectData() // دریافت داده‌ها از textarea
    const finalResult = quill.getText(); // دریافت متن از ویرایشگر Quill
    var genderSelect = document.getElementById("genderSelect");
    var Gender = genderSelect.value;
    try {
        const response = await axios.post('/dashboard/AIapireport', {
            dataEcho,
            finalResult,
            Gender,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // بررسی وضعیت پاسخ
        if (response.status === 200) {
            spinner.style.display = 'none';
            const result = response.data.report; // استخراج گزارش از پاسخ
            // quill.clipboard.dangerouslyPasteHTML(0, result);//* if result be  in html code
            quill.setText(result); // نمایش گزارش در ویرایشگر Quill
        } else {
            console.error('Error in response:', response);
            alert('خطا در دریافت پاسخ از سرور');
            quill.setText('Error in response');
        }
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        alert('خطا در ارتباط با OpenAI');
    }
}

//* function for ticking normal checkboxes in page
function tickAllNormals() {
    Swal.fire({
        title: "Dear Doctor",
        text: "Select all parameters in a normal",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            // دریافت تمام چک باکس‌های مورد نظر
            const checkboxes = document.querySelectorAll('input[type="checkbox"][name="normal"], input[type="checkbox"][name="Normal"]');
            // اضافه کردن event listener به هر چک باکس
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
        }
    });






}

//* function for set uservlue by clicking column
function setUserValue(cell) {
    // پیدا کردن input مربوط به user value در همان ردیف
    const userInput = cell.closest('tr').querySelector('input[name="uservalue"]') || cell.closest('tr').querySelector('input[name="userValue"]');

    // پیدا کردن عنوان ستون (header) با استفاده از index
    const headerIndex = cell.cellIndex; // index سلول کلیک شده
    const headerText = cell.closest('table').querySelector('thead tr').cells[headerIndex].innerText; // عنوان ستون

    if (userInput) {
        userInput.value = headerText; // قرار دادن عنوان ستون در input
    }
}
//* function for  saveing  pre  final's sentences
async function savePreSentence() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block'; // نمایش spinner
    // const PreFinalSentences = quill.getText(); // دریافت متن از ویرایشگر Quill
    const PreFinalSentences = quill.root.innerHTML;
    try {
        const response = await axios.post(
            '/dashboard/savePreFinalSentences',
            { PreFinalSentences },
            { headers: { 'Content-Type': 'application/json' } })

        if (response.status === 200) {
            Swal.fire({
                title: "Dear Doctor",
                text: response.data.msg,
                icon: "success",
                confirmButtonText: "OK"
            })
            spinner.style.display = 'none';
        } else {
            spinner.style.display = 'none';
            Swal.fire({
                title: "Dear Doctor",
                text: response.data.msg,
                icon: "error",
                confirmButtonText: "Ok"
            })
        }
    } catch (error) {
        spinner.style.display = 'none';
        Swal.fire({
            title: "Dear Doctor",
            text: "Error saving data",
            icon: "error",
            confirmButtonText: "تایید"
        })
    }
}

//* load pre sentencs
function setPreText(pretext) {
    // const safeText = preText.replace(/'/g, "\\'").replace(/"/g, '\\"');
    // quill.setText(pretext);

    document.getElementById('samplesContent').innerHTML = pretext;


}

function setPreTextInEditor(pretext) {
    quill.root.innerHTML = pretext;
}
function setPreTextInSamples(pretext) {
    const sampleSentencesDiv = document.getElementById('sampleSentences');
    // پاک کردن محتوای قبلی
    sampleSentencesDiv.innerHTML = '';
    // اضافه کردن محتوای جدید
    sampleSentencesDiv.innerHTML = pretext;
    // اضافه کردن خاصیت draggable و رویدادها به هر p داخل sampleSentences
    const paragraphs = sampleSentencesDiv.querySelectorAll('p'); // انتخاب تمام پاراگراف‌ها
    paragraphs.forEach(item => {
        item.classList.add('draggable'); // اضافه کردن کلاس draggable
        item.setAttribute('draggable', 'true');
        item.addEventListener('click', function () {
            toggleSelect(this); // افزودن رویداد کلیک
        });
    });
}


// function setPreTextInSample()
function setPreTextDefaultSample() {
    const htmlContent = ` <div id="sampleSentences" class="text-black">
                <div class="draggable text-decoration-underline" draggable="true" ondragstart="drag(event)"
                    onclick="toggleSelect(this)">LEFT VENTRICLE</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV
                    Size-end systole........mm 23-24mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV Size
                    end diastole.......mm 35-52mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    Fractional shortening......% 30-45mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">E point
                    septal separation......mm 0-34mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV post.
                    Wall thickness.....mm 5.5-11mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV post.
                    Wall excursion.....mm 5.5-11mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV
                    septal. Wall thickness.....mm 6-11mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV
                    septal. Wall excursion.....mm 6-11mm</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Quality
                    of motion.....EF %</div>
                <div class="draggable  text-decoration-underline" draggable="true" ondragstart="drag(event)"
                    onclick="toggleSelect(this)">MITRAL VALVE</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Mitral
                    valve excursion.....mm </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Mitral
                    valve E - F slope.....mm/sac </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Mitral
                    valve quality.............. </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Pattern
                    of motion.............. </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    Others.............. </div>
                <div class="draggable  text-decoration-underline" draggable="true" ondragstart="drag(event)"
                    onclick="toggleSelect(this)">LEFT ATRIAL DIAMETER</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    Others.............. mm </div>
                <div class="draggable  text-decoration-underline" draggable="true" ondragstart="drag(event)"
                    onclick="toggleSelect(this)">AORTA</div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Aortic
                    root dimension............mm 12-40mm </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Aortic
                    valve opening............mm 12-50mm </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Quality
                    of leaflets............................. </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    Others.......................................... </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">RIGHT
                    VENTRICULAR Dimension..........mm </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    TRICUSPID VALVE................ </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">PULMONIC
                    VALVE................ </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    PERICARDIUM................... </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    Others................... </div>
                <div class="draggable " draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">RESULT
                    AND COMMENT.................... </div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The left
                    ventricular size is within normal limits</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is
                    evidence of left ventricular hypertrophy</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The
                    ejection fraction is estimated to be XX%.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The
                    mitral valve demonstrates normal morphology and function.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is
                    moderate mitral regurgitation.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The
                    aortic valve is trileaflet with no significant stenosis.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is
                    mild aortic regurgitation.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The right
                    ventricle appears dilated</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">
                    Interventricular septum is intact.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The
                    pericardium is free of effusion</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The left
                    atrium is mildly enlarged.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">No
                    thrombus is identified in the left atrial appendage.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Doppler
                    studies reveal normal diastolic function.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is
                    evidence of pulmonary hypertension.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The
                    inferior vena cava is collapsible with respiration.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The wall
                    motion is normal in all segments.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is
                    a small pericardial effusion noted.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The
                    cardiac chambers are well-defined.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">No
                    significant valvular abnormalities were detected.</div>
                <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The
                    findings are consistent with dilated cardiomyopathy.</div>
            </div>`
    document.getElementById('samplesContent').innerHTML = htmlContent;

}


function toggleSampleDiv(curr) {
    let nextDiv = ''
    let currDiv = document.getElementById(curr);
    curr == 'sampleDiv' ? nextDiv = document.getElementById('finalResultDiv') :
        nextDiv = document.getElementById('sampleDiv');
    if (!nextOn) {
        nextDiv.classList.remove('hidden2');
        nextOn = true;
        currDiv.classList.remove('fullscreen');
    } else {
        nextDiv.classList.add('hidden2');
        nextOn = false;
        currDiv.classList.add('fullscreen')
    }
}

function updateSampleSentences() {
    // انتخاب دیو با شناسه sampleSentences
    const sampleSentencesDiv = document.getElementById('sampleSentences');

    // خالی کردن محتوای دیو
    sampleSentencesDiv.innerHTML = '';

    // اطلاعات جدیدی که باید به دیو اضافه شود
    const newContent = `
        <div class="draggable text-decoration-underline" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LEFT VENTRICLE</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV Size-end systole........mm 23-24mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV Size end diastole.......mm 35-52mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Fractional shortening......% 30-45mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">E point septal separation......mm 0-34mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV post. Wall thickness.....mm 5.5-11mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV post. Wall excursion.....mm 5.5-11mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV septal. Wall thickness.....mm 6-11mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LV septal. Wall excursion.....mm 6-11mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Quality of motion.....EF %</div>
        <div class="draggable text-decoration-underline" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">MITRAL VALVE</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Mitral valve excursion.....mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Mitral valve E - F slope.....mm/sac</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Mitral valve quality..............</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Pattern of motion..............</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Others..............</div>
        <div class="draggable text-decoration-underline" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">LEFT ATRIAL DIAMETER</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Others.............. mm</div>
        <div class="draggable text-decoration-underline" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">AORTA</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Aortic root dimension............mm 12-40mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Aortic valve opening............mm 12-50mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Quality of leaflets.............................</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Others..........................................</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">RIGHT VENTRICULAR Dimension..........mm</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">TRICUSPID VALVE................</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">PULMONIC VALVE................</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">PERICARDIUM...................</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Others...................</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">RESULT AND COMMENT....................</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The left ventricular size is within normal limits</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is evidence of left ventricular hypertrophy</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The ejection fraction is estimated to be XX%.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The mitral valve demonstrates normal morphology and function.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is moderate mitral regurgitation.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The aortic valve is trileaflet with no significant stenosis.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is mild aortic regurgitation.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The right ventricle appears dilated</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Interventricular septum is intact.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The pericardium is free of effusion</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The left atrium is mildly enlarged.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">No thrombus is identified in the left atrial appendage.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">Doppler studies reveal normal diastolic function.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is evidence of pulmonary hypertension.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The inferior vena cava is collapsible with respiration.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The wall motion is normal in all segments.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">There is a small pericardial effusion noted.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The cardiac chambers are well-defined.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">No significant valvular abnormalities were detected.</div>
        <div class="draggable" draggable="true" ondragstart="drag(event)" onclick="toggleSelect(this)">The findings are consistent with dilated cardiomyopathy.</div>
    `;

    // اضافه کردن محتوای جدید به دیو
    sampleSentencesDiv.innerHTML = newContent;
}

