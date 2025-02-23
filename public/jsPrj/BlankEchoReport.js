let sampleDivVisible = true;
let finalResultDivVisible = true;
let nextOn=true;
let currentIndex = -1; // برای پیگیری اندیس آکوردیون فعلی

const FormSearchDate = document.getElementById("FormSearchDate");
const SelectedDateMil = document.getElementById("SelectedDateMil");
const SelectedDate = document.getElementById("SelectedDate");
//* Submit the form when the input field is changed!!
SelectedDate.addEventListener("change", () => {
    if (SelectedDate.value != "") {
        FormSearchDate.submit();
    }
})


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




const previewPdf = document.getElementById('previewPdf');
document.getElementById("generateButton").addEventListener("click", fetchReport(idSick));

function saveCurrEcho(sickinf) {
    const contentEditor = quill.root.innerHTML; // دریافت محتوای HTML
    //* change to javaScript data
    const jsSick = JSON.parse(sickinf)
    const { sickcodemilli, fullnamesick, mobilesick } = jsSick;
    const userSelectedData = collectData();
    const FinalResult = JSON.stringify({ FinalResult: contentEditor })
    // //* sending data to nodjs server....
    if ((contentEditor == '<p><br></p>') & (userSelectedData.length == 0)) {
        Swal.fire({
            title: "کاربر محترم",
            text: 'اطلاعات اکو تکمیل نشده است',
            icon: "error",
            confirmButtonText: "تایید"
        })
        return
    }

    axios
        .post(
            "/dashboard/saveCreatedEcho",
            {
                data: userSelectedData, // Send the JSON data in the request body
                sickcodemilli,
                fullnamesick,
                mobilesick,
                FinalResult,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            if (response.status == 200) {
                Swal.fire({
                    title: "پزشک محترم",
                    text: "اکو ذخیره شد",
                    icon: "success",
                    confirmButtonText: "تایید"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        })
        .catch((error) => {
            Swal.fire({
                title: "کاربر محترم",
                text: error,
                icon: "success",
                confirmButtonText: "تایید"
            })
        });
}
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
            const category = previousElement && previousElement.dataset.type === 'category' ? previousElement.textContent.trim() : null;
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
// script.js
async function fetchReport(idSick) {
    const idlab = idSick;
    const param = { idlab };

    try {
        const response = await axios.post('/dashboard/generate-report-echo', param, { responseType: 'blob' });

        // بررسی وضعیت پاسخ
        if (response.status === 200) {
            // ایجاد URL برای Blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.pdf'; // نام فایل PDF
            document.body.appendChild(a);
            a.click(); // کلیک بر روی لینک برای دانلود
            a.remove(); // حذف لینک از DOM
            window.URL.revokeObjectURL(url); // آزادسازی URL
        } else {
            // اگر وضعیت پاسخ 202 یا 203 باشد
            const text = await response.data.text();
            const errorData = JSON.parse(text);
            Swal.fire({
                title: "کاربر محترم",
                text: errorData.message,
                icon: "warning",
                confirmButtonText: "تایید"
            });
        }
    } catch (error) {
        console.error("Error fetching report:", error);
        Swal.fire({
            title: "پزشک محترم",
            text: "خطایی در هنگام دریافت گزارش پیش آمد.",
            icon: "error",
            confirmButtonText: "تایید"
        });
    }
}

function confirmAndSubmit() {
    Swal.fire({
        title: "پزشک محترم",
        text: "آیا مطمئن هستید که می‌خواهید اکو را حذف کنید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله، حذف کن",
        cancelButtonText: "خیر، انصراف"
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("ِDeleteEcho").submit();
        }
    });
}

function convertHtmlToText(html) {
    // استفاده از DOMParser برای تبدیل HTML به متن ساده
    const tempDiv = document.createElement('div');
    // tempDiv.innerHTML = html;
    tempDiv.innerHTML = "<p>جمله ۱ </p><p><br></p><p>جمله ۲ </p><p>جمله ۳ </p>"
    return tempDiv.innerText || tempDiv.textContent;
}

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
//* function for ticking normal checkboxes in page
function tickAllNormals() {
    Swal.fire({
        title: "پزشک محترم",
        text: "انتخاب همه ی پارمترها بصورت نرمال",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله",
        cancelButtonText: "خیر"
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
function setPreText(pretext){
    // const safeText = preText.replace(/'/g, "\\'").replace(/"/g, '\\"');
    // quill.setText(pretext);
    
    document.getElementById('samplesContent').innerHTML = pretext;


}

function setPreTextInEditor(pretext){
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
        item.addEventListener('click', function() {
            toggleSelect(this); // افزودن رویداد کلیک
        });
    });
}


// function setPreTextInSample()
function setPreTextDefaultSample (){
 const htmlContent=` <div id="sampleSentences" class="text-black">
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


function toggleSampleDiv(curr){
    let nextDiv=''
    let currDiv=document.getElementById(curr);
    curr=='sampleDiv'? nextDiv=document.getElementById('finalResultDiv') :
                       nextDiv=document.getElementById('sampleDiv')     ;

    if (!nextOn){
        nextDiv.classList.remove('hidden2');
        nextOn=true;
        currDiv.classList.remove('fullscreen');
    } else{
        nextDiv.classList.add('hidden2');
        nextOn=false;
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



