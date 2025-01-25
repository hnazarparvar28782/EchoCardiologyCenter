
 const seaveEchoConfig =async()=>{
    const bodyFont =document.getElementById('bodyFont').value;
    const bodyFontSize =document.getElementById('bodyFontSize').value;
    const reportTitle =document.getElementById('reportTitle').value;
    const finalFont =document.getElementById('finalFont').value;
    const finalFontSize =document.getElementById('finalFontSize').value;
    const reportFooter =document.getElementById('reportFooter').value;
    
    try {
        const response = await axios.post(
            "/dashboard/saveEchoConfig",
             {bodyFont,bodyFontSize,reportTitle,reportFooter,finalFont,finalFontSize,},
             {headers:{"Content-Type":"application/json"}
             });
        if (response.status == 200) {
           Swal.fire({
               title: "پزشک محترم",
               text: response.data.message,
               icon: "success",
               confirmButtonText: "تایید"
           })
        }                  
    } catch (error) {
        Swal.fire({
                   title: "کاربر محترم",
                   text: error,
                   icon: "success",
                   confirmButtonText: "تایید"
                    })
    }
}

function updateSampleText(elementId, font) {
    document.getElementById(elementId).style.fontFamily = font;
}
function updateSampleTextFontSize(elementId, size) {
    document.getElementById(elementId).style.fontSize =size + 'px'; ;
}
function initializeSampleText() {
    const bodyFontSize = document.getElementById('bodyFontSize').value;
    const bodyFont = document.getElementById('bodyFont').value;
    const sampleElement = document.getElementById('sampleMain');
    
    const finalFontSize = document.getElementById('finalFontSize').value;
    const finalFont = document.getElementById('finalFont').value;
    const sampleFinal = document.getElementById('sampleFinal');

    
    // به‌روزرسانی اندازه فونت
    if (bodyFontSize) {
        sampleElement.style.fontSize = bodyFontSize + 'px';
    }

    if (bodyFont) {
        sampleElement.style.fontFamily = bodyFont;
    }

    if (finalFontSize) {
        sampleFinal.style.fontSize = finalFontSize + 'px';
    }

    if (finalFont) {
        sampleFinal.style.fontFamily = finalFont;
    }
}
// اجرای تابع پس از بارگذاری صفحه
window.addEventListener('load', initializeSampleText);
 
