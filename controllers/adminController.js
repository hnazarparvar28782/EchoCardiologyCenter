import moment from "moment-jalaali";
import pdf from 'html-pdf'
import PdfPrinter from 'pdfmake'
import OpenAI from "openai";

import { rootPrj } from "../utils/path.js";
import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const getEchoForAll = (req, res) => {
  const user = req.user == undefined ? [] : req.user;
  let dataPath = path.join(`${rootPrj}/data/`, '1NormalRange.json');
  let data1 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '2NormalRange.json');
  let data2 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '3NormalRange.json');
  let data3 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '4NormalRange.json');
  let data4 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '5NormalRange.json');
  let data5 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '6NormalRange.json');
  let data6 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '7NormalRange.json');
  let data7 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '8NormalRange.json');
  let data8 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '9NormalRange.json');
  let data9 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '10NormalRange.json');
  let data10 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '11NormalRange.json');
  let data11 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '12NormalRange.json');
  let data12 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '13NormalRange.json');
  let data13 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '14NormalRange.json');
  let data14 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '15NormalRange.json');
  let data15 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '16NormalRange.json');
  let data16 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '17NormalRange.json');
  let data17 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  dataPath = path.join(`${rootPrj}/data/`, '18NormalRange.json');
  let data18 = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let userEchoSelectWithRow = [];
  return res.render("../views/private/EchoForAll.ejs", {
    pageTitle: "مطب پزشک",
    layout: "../views/layouts/EchoForAllLayout.ejs",
    path: "EchoForAll",
    errorCaptcha: "",
    errorlogin: "",
    data1, data2, data3, data4, data5, data6, data7, data8,
    data9, data10, data11, data12, data13, data14, data15,
    data16, data17, data18,
    userEchoSelectWithRow,
    user
  });
}

const generateOpenAiReport = async (req, res) => {
  const { dataEcho, finalResult, Gender } = req.body;
  const jsonDataEcho = JSON.stringify(dataEcho);
  console.log("********************")
  // بررسی داده‌های ورودی
  if (!jsonDataEcho || !finalResult) {
    return res.status(400).json({ error: 'Both dataEcho and finalResult are required.' });
  }

  try {
    //* sending request to OpenAi....
    const baseURL = "https://api.avalapis.ir/v1";

    const openai = new OpenAI({
      // apiKey: `aa-Exsz4qyYtGHpePcYrXdWdbFLqNqW29qMmJkiLizTq42k1buv`, // کلید API خود را اینجا قرار دهید,
      apiKey: process.env.openAIapiKey, // کلید API خود را اینجا قرار دهید,
      baseURL: baseURL
    });

    const question = [`Please analyze the following data: ${jsonDataEcho}
                      and provide a final medical report based on this information.
                      The report should be well-organized and neatly formatted,
                      resembling an echocardiography report from hospitals and 
                      cardiac care centers. Importantly, do not include the names of 
                      the doctor or patient, or the date of the report.
                      The patient’s gender is ${Gender}.
                      Additionally, ensure that the standards of echocardiography 
                      reporting in the United States are taken into account: ${finalResult}`,

    `Please analyze the following data: ${jsonDataEcho} and provide a
                      final and highly specialized medical report based on this information.
                       The report must fully adhere to the standards set by the U.S. Department
                       of Health and Human Services and the American Society of Echocardiography.
                       Avoid using general recommendations or common phrases.
                       The patient’s gender is ${Gender}.
                       The final report should not include the input data itself; 
                       it should solely contain the report and the final opinion. 
                       Additionally, do not include the name of the physician or the name 
                       of the facility at the end. Only the final opinion is important.`,

    `Please analyze the following data: ${jsonDataEcho} and provide a 
                       final, highly specialized medical report based on this information. 
                       The report must fully adhere to the standards set by the U.S. Department
                       of Health and Human Services and the American Society of Echocardiography.
                       The patient’s gender is ${Gender}.
                       Avoid using general recommendations or common phrases. The final report
                       should not include the input data itself; it should solely contain the
                       report and the final opinion. Additionally, do not include the name of 
                       the physician or the name of the facility at the end. Only the final 
                       opinion is important. Please ensure that the output is presented in a 
                       well-formatted and visually appealing HTML format.`,

    ]

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: question[1] }],
      model: "gpt-3.5-turbo",
    });
    // const response = await axios.post('https://api.avalapis.ir/v1', {
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //         { role: 'user', content: `Please analyze the following data: ${jsonDataEcho} and provide a medical report based on this: ${finalResult}` }
    //     ]
    // }, {
    //     headers: {
    //         'Authorization': `aa-Exsz4qyYtGHpePcYrXdWdbFLqNqW29qMmJkiLizTq42k1buv`, // کلید API خود را اینجا قرار دهید
    //         'Content-Type': 'application/json'
    //     }
    // });
    console.log(response)

    const report = response.choices[0].message.content; // استخراج گزارش
    console.log(report)
    res.json({ report }); // ارسال گزارش به کلاینت
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }

}


const generateAIreport = (data, res) => {
  const fonts = {
    Roboto: {
      normal: path.join(`${rootPrj}/public/fonts`, 'Roboto-Regular.ttf'),
      bold: path.join(`${rootPrj}/public/fonts`, 'Roboto-Bold.ttf'),
      italics: path.join(`${rootPrj}/public/fonts`, 'Roboto-BlackItalic.ttf'),
      bolditalics: path.join(`${rootPrj}/public/fonts`, 'Roboto-BoldItalic.ttf')
    }
  };

  const printer = new PdfPrinter(fonts);

  const tableBody = [
    [{ text: 'Parameter', style: 'tableHeader' }, { text: 'Value', style: 'tableHeader' }]
  ];

  let echolabData;
  try {
    echolabData = JSON.parse(data.echolabData);
  } catch (error) {
    echolabData = [];
  }

  echolabData.forEach(report => {
    report.categories.forEach(category => {
      category.parameters.forEach(param => {
        const record = [];
        for (const [key, value] of Object.entries(param)) {
          record.push([
            { text: key, style: 'tableCell' },
            { text: value || 'N/A', style: 'tableCell' }
          ]);
        }
        tableBody.push(...record);
        tableBody.push([{ text: '', colSpan: 2, border: [false, false, false, false] }]);
      });
    });
  });

  const docDefinition = {
    content: [
      { text: 'Echocardiogram Report', style: 'header' },
      { text: `Patient ID: ${data.sickcodemilli || 'N/A'}`, style: 'subheader' },
      { text: `Patient Name: ${data.fullnamesick || 'N/A'}`, style: 'subheader' },
      { text: `Doctor Name: ${data.DoctorFullname || 'N/A'}`, style: 'subheader' },
      { text: 'Echocardiogram Details', style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: tableBody
        },
        layout: {
          fillColor: (rowIndex) => {
            return rowIndex % 2 === 0 ? '#f3f3f3' : null;
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#aaa',
          vLineColor: () => '#aaa'
        },
        dontBreakRows: true
      },
      { text: 'Final Result:', style: 'subheader' },
      { text: data.FinalResult || 'No final result provided.', margin: [0, 0, 0, 20] }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black'
      },
      tableCell: {
        margin: [0, 5, 0, 5],
        fontSize: 10
      }
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  res.setHeader('Content-disposition', 'attachment; filename=echocardiogram_report.pdf');
  res.setHeader('Content-type', 'application/pdf');
  pdfDoc.pipe(res);
  pdfDoc.end();
};

// تابعی برای تبدیل اعداد به فارسی
const toPersianNumbers = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
};


async function genEchoRep(data, req, res) {
  let bodyFont, bodyFontSize, reportTitle, reportFooter, finalFont, finalFontSize;

  if (req.user.userEchoConfig && req.user.userEchoConfig != null) {
    const config = JSON.parse(req.user.userEchoConfig);
    config.bodyFont !== "" ? bodyFont = config.bodyFont : bodyFont = "BYekan";
    config.bodyFontSize !== "" ? bodyFontSize = config.bodyFontSize : bodyFontSize = 10;
    config.reportTitle !== "" ? reportTitle = config.reportTitle : reportTitle = "Echo Cardiography Report";
    config.reportFooter !== "" ? reportFooter = config.reportFooter : reportFooter = "Dr................";
    config.finalFont !== "" ? finalFont = config.finalFont : finalFont = "BYekan";
    config.finalFontSize !== "" ? finalFontSize = config.finalFontSize : finalFontSize = 10;
  } else {
    bodyFont = "BYekan";
    bodyFontSize = 10;
    reportTitle = "Echo Cardiography Report";
    reportFooter = "DR.............................";
    finalFont = "BYekan";
    finalFontSize = 10;
  }
  try {
    if (!data || !Array.isArray(data) || !data[0]) {
      console.error("Invalid data.", data);
      res.status(500).send("Invalid data provided.");
      return;
    }

    const data0 = data[0];
    const fullnamesick = data0.fullnamesick || "Unknown Patient";
    const sickcodemilli = data0.sickcodemilli || "Unknown Doctor";
    const DoctorFullname = data0.DoctorFullname || "Unknown Doctor";
    const EchoDate = moment(data0.createDate).format('jYYYY/jMM/jDD');
    const echolabDataString = data0.echolabData;

    const address = req.user.address;
    const tellphone = req.user.tellphone;
    const mondayWork = req.user.mondayWork ? `صبها:${req.user.mondayWork}` : "";
    const afternonWork = req.user.afternonWork ? `عصرها:${req.user.afternonWork}` : "";

    if (!echolabDataString) {
      console.error("Missing echolabData.", data0);
      res.status(500).send("Missing echolabData.");
      return;
    }

    const echolabData = JSON.parse(echolabDataString);
    const finalResult = JSON.parse(data0.FinalResult).FinalResult || "No final result provided.";

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const fontPath = path.join(__dirname, '../public/fonts/Satisfy-Regular.ttf');
    const fontData = fs.readFileSync(fontPath);
    const base64FontSatisfy = fontData.toString('base64');

    const fontPathBYekanwebfont = path.join(__dirname, '../public/fonts/BYekan-webfont.ttf');
    const fontDataBYekan = fs.readFileSync(fontPathBYekanwebfont);
    const base64FontBYekan = fontDataBYekan.toString('base64');

    const fontPathparastoo = path.join(__dirname, '../public/fonts/Parastoo.ttf');
    const fontDataparasto = fs.readFileSync(fontPathparastoo);
    const base64Fontparastoo = fontDataparasto.toString('base64');

    const fontPathTomatoes = path.join(__dirname, '../public/fonts/Tomatoes-O8L8.ttf');
    const fontDataTomatoes = fs.readFileSync(fontPathTomatoes);
    const base64FontTomatoes = fontDataTomatoes.toString('base64');

    const fontPathReenieBeanie = path.join(__dirname, '../public/fonts/ReenieBeanieRegular.ttf');
    const fontDataReenieBeanie = fs.readFileSync(fontPathReenieBeanie);
    const base64FontReenieBeanie = fontDataReenieBeanie.toString('base64');

    const fontPathRoboto = path.join(__dirname, '../public/fonts/Roboto-Bold.ttf');
    const fontDataroboto = fs.readFileSync(fontPathRoboto);
    const base64Fontroboto = fontDataroboto.toString('base64');

    let selectedfontresult = "";
    finalFont == "" ? selectedfontresult = "Satisfy" : selectedfontresult = finalFont;

    const htmlContent = `
    <html>
    <head>
        <title>Echocardiographic Report</title>
        <style>
            @font-face {
                font-family: 'Satisfy';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontSatisfy}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'Tomatoes-O8L8';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontTomatoes}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'ReenieBeanie';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontReenieBeanie}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'parastoo';
                src: url('data:font/truetype;charset=utf-8;base64,${base64Fontparastoo}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'Roboto';
                src: url('data:font/truetype;charset=utf-8;base64,${base64Fontroboto}');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'BYekan';
                src: url('data:font/truetype;charset=utf-8;base64,${base64FontBYekan}');
                font-weight: normal;
                font-style: normal;
            }

            body {
                font-family: '${bodyFont}', sans-serif;
                margin: 0;
                padding: 0;
            }

            h1 {
                text-align: center;
            }

            .title {
                font-size: 11px;
                font-weight: bold;
                margin: 10px 0;
                font-style: normal;
            }

            .reportTitle {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin: 10px 0;
                font-style: normal;
                border-bottom: 2px solid black;
            }

            .reportDoctorTitle {
                font-size: 20px;
                font-weight: bold;
                margin: 0;
                font-style: normal;
                font-family: 'BYekan';
            }
            .reportDoctorTakhasos {
                font-size: 12px;
                font-weight: bold;
                margin: 0;
                font-style: normal;
                font-family: 'BYekan';
            }

            .category {
                font-size: 10px;
                font-weight: bold;
                margin: 5px 0;
            }

            .tableHeader {
                font-weight: bold;
                text-align: center;
                font-size:${bodyFontSize}px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
                font-size:${bodyFontSize}px;
            }
            th, td { border: 1px solid #ddd; padding: 8px;font-size:${bodyFontSize}px; }
            th { background-color: #f2f2f2; }    

            .hidentable th, .hidentable td {
                border: none;
                padding: 8px;
                font-size: 9px;
                vertical-align: top;
            }
            .hidentable tr {
                border-bottom: 2px solid #000;
            }    

            .finalResultContainer {
                border: 2px solid #4CAF50;
                border-radius: 10px;
                padding: 6px;
                margin-top: 20px;
                background-color: #f9f9f9;
                page-break-inside: avoid;
            }

            .persian-font {
                font-family: 'BYekan';
            }

            .finalResult {
                font-family: ${selectedfontresult};
                font-size:${finalFontSize}px;
                font-weight: normal;
                color: #333;
            }

            .report-container {
                margin-top: 10px;
            }
          .details-cell {
            white-space: pre-wrap; /* این باعث می‌شود که متن به درستی در خطوط جدید نمایش داده شود */
          }    
        </style>
    </head>
    <body>
        <pre class="reportTitle">${reportTitle}</pre>
        <table class="report-container hidentable">
            <tr>
                <td class="patient-info" style="text-align:center;padding:0;margin:0; width: 50%;">
                    <p class="title persian-font">نام بیمار: ${translateName(fullnamesick)}</p>
                    <p class="title persian-font">کد ملی: ${toPersianNumbers(sickcodemilli)}</p>
                    <p class="title persian-font">تاریخ: ${toPersianNumbers(EchoDate)}</p>
                </td>
                <td class="doctor-info" style="text-align: center; width: 50%;">
                    <pre class="reportDoctorTitle">دکتر ${req.user.FullName}</pre>
                    <pre class="reportDoctorTakhasos">${req.user.takhasos}</pre>
                </td>
            </tr>
        </table>
        ${echolabData.map(report => `
            <h2 class="title">${report.title}</h2>
            ${report.categories.map(category => `
                ${category.category ? `<div class="category">${category.category}</div>` : ''}
                <table>
                    <thead>
                        <tr>${Object.keys(category.parameters[0]).filter(header => header !== "Result").map(header => `<th class="tableHeader">${header}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${category.parameters.map(parameter => `
                            <tr>${Object.keys(parameter).map(key => `<td class="details-cell">${parameter[key]}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
            `).join('')}
        `).join('')}
        <div style="margin:0;"  class="finalResultContainer">
        <div><h5 style="margin:0;;padding:0;">Result And Comment :</h5></div>
            <div class="finalResult">${finalResult}</div>
            <div class=" container text-center">${reportFooter}</div>
        </div>
    </body>
    </html>
    `;

    const persianMondayWork = toPersianNumbers(mondayWork);
    const persianAfternonWork = toPersianNumbers(afternonWork);
    const persiantellphone = toPersianNumbers(tellphone);
    const persianaddress = toPersianNumbers(address);

    const options = {
      format: 'A4',
      border: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      footer: {
        height: "10mm",
        contents: {
          default:
            `<div class="persian-font" style="border: 1px solid black;border-radius: 5px; padding: 5px; text-align: right; padding:0;font-size:10px; direction: rtl;">
                ${persianaddress} ${persianMondayWork} ${persianAfternonWork} - تلفن: ${persiantellphone}
            </div>`
        }
      }
    };

    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        console.error("Error creating PDF:", err);
        res.status(500).send("Error creating PDF");
        return;
      }
      res.setHeader('Content-Disposition', 'attachment; filename=echocardiogram_report.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    });

  } catch (error) {
    console.error("Error generating report:", error);
    req.flash("errormsg", "اشکال در داده های اکو");
    res.status(500).send("Error generating report");
  }
}
// تابع تبدیل HTML به متن ساده
function convertHtmlToText(html) {
  // استفاده از DOMParser برای تبدیل HTML به متن ساده
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.innerText || tempDiv.textContent;
}

// Utility function to translate Persian names to English
function translateName(persianName) {
  return persianName;
}
//* search in date,create an expretion  for searching date 


const saveEchoConfig = async (req, res) => {
  const { bodyFont, bodyFontSize, reportTitle, reportFooter, finalFont, finalFontSize } = req.body;
  console.log(bodyFont, bodyFontSize, reportTitle, reportFooter, finalFont, finalFontSize)
  const mobileId = req.user.mobileId;

  const userEchoConfig = JSON.stringify({ bodyFont, bodyFontSize, reportTitle, reportFooter, finalFont, finalFontSize }, null, 2);
  try {
    const echoConfig = await updateUserEchoConfig(mobileId, userEchoConfig);
    console.log(echoConfig)
    res.status(200).json({ message: "تنطیمات گزارش اکو ثبت شد" })
  } catch (error) {
    res.status(500).json({ error })
  }
}


export {
  getEchoForAll,
  generateOpenAiReport,
  saveEchoConfig,
}
