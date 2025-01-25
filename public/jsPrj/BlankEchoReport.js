const FormSearchDate = document.getElementById("FormSearchDate");
const SelectedDateMil = document.getElementById("SelectedDateMil");
const SelectedDate = document.getElementById("SelectedDate");
//* Submit the form when the input field is changed!!
SelectedDate.addEventListener("change",()=>{
    if ( SelectedDate.value!="" ) {
      FormSearchDate.submit();
    }
  })


const previewPdf = document.getElementById('previewPdf');
document.getElementById("generateButton").addEventListener("click", fetchReport(idSick));

function saveCurrEcho(sickinf) {
    const contentEditor = quill.root.innerHTML; // دریافت محتوای HTML
    //* change to javaScript data
    const jsSick = JSON.parse(sickinf)
    const { sickcodemilli, fullnamesick, mobilesick } = jsSick;
    const FinalResult = JSON.stringify({ FinalResult: contentEditor })
    const userSelectedData = collectData();

    // //* sending data to nodjs server....
    if ((contentEditor=='<p><br></p>')&(userSelectedData.length==0)) {
        Swal.fire({
            title: "کاربر محترم",
            text:'اطلاعات اکو تکمیل نشده است' ,
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
                const userValueInput = row.querySelector('input[name="userValue"]');
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








