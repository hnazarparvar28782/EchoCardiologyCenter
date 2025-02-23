document.getElementById("saveButton").addEventListener("click", function () {
    const userSelectedData = collectData();

    //* sending data to nodjs server....
    axios
        .post(
            "/dashboard/saveUserValueselected",
            {
                data: userSelectedData, // Send the JSON data in the request body
                userEchoSelectWithRow: getSelectedRows(),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            Swal.fire({
                title: "پزشک محترم",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "تایید"
            })
            // alert(response.data.message)
            // alert(response.status)

        })
        .catch((error) => {
            Swal.fire({
                title: "کاربر محترم",
                text: error,
                icon: "success",
                confirmButtonText: "تایید"
            })
        });
});

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
            const category = previousElement && previousElement.tagName === 'H5' ? previousElement.textContent.trim() : null;
            const tableRows = table.querySelectorAll('tbody tr');
            const parameters = [];

            tableRows.forEach(row => {
                const isSelected = row.querySelector('td input[type="checkbox"][name="select"]').checked;

                if (isSelected) {
                    const rowData = {};
                    const cells = row.cells;

                    for (let i = 1; i < cells.length; i++) {
                        const cell = cells[i];
                        const header = cell.closest('table').querySelector(`thead th:nth-child(${i + 1})`).textContent.trim();

                        const selectCheckbox = cell.querySelector('input[type="checkbox"][name="uservalue-select"]');
                        const resultCheckbox = cell.querySelector('input[type="checkbox"][name="selectResult"]');

                        if (selectCheckbox && selectCheckbox.checked) {
                            const inputValue = cell.querySelector('input[type="text"]');
                            rowData[header] = inputValue ? (inputValue.value.trim() || null) : cell.textContent.trim();
                        } else if (resultCheckbox && resultCheckbox.checked) {
                            rowData[header] = { "Normal": false, "Moderate": false, "Abnormal": false };
                        } else if (!selectCheckbox && !resultCheckbox) {
                            rowData[header] = cell.textContent.trim();
                        }
                    }

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
//* function for ticking normal checkboxes in page
function tickAllTables() {
    Swal.fire({
        title: "پزشک محترم",
        text: "انتخاب همه ی جدول ها",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله",
        cancelButtonText: "خیر"
    }).then((result) => {
        if (result.isConfirmed) {
            // دریافت تمام چک باکس‌های مورد نظر
            const checkboxes = document.querySelectorAll('input[type="checkbox"][name="Select"], input[type="checkbox"][name="select"],input[type="checkbox"][name="selectResult"] ,input[type="checkbox"][name="uservalue-select"]');
            // اضافه کردن event listener به هر چک باکس
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
        }
    });






}