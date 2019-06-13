import React from "react";
import bwipjs from "bwip-js";
// import * as jsPDF from "jspdf";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MainFrameHOC from "../common/MainFrameHOC";
import ButtonMy from "../common/ButtonMy";
const host = window.location.hostname;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// const articleContent = `<a href="http://kokpit.swiadomafirma.pl/vitalzam/Kokpit wprowadzenie.docx" download>Kokpit - wprowadzenie</a></br><a href="http://kokpit.swiadomafirma.pl/vitalzam/Komunikat premiowy 201903.odt" download>Komunikat premiowy - marzec 2019r.</a></br><a href="http://kokpit.swiadomafirma.pl/vitalzam/Konfiguracja towarów 201903.xlsx" download>Konfiguracja towarów - marzec 2019r.</a></br><a href="http://kokpit.swiadomafirma.pl/vitalzam/Regulamin_premiowania_20190228.odt" download>Regulamin premiowania - 28 luty 2019r.</a></br>`;

class Barcodes extends React.Component {
  state = { code: "(91)91111405", pdfBase64: "" };

  componentDidMount() {
    bwipjs(
      "mycanvas",
      {
        bcid: "code128", // Barcode type
        text: "01234567893", // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center" // Always good to set this,
        // alttext: "23423424"
      },
      function(err, cvs) {
        if (err) {
          // Decide how to handle the error
          // `err` may be a string or Error object
        } else {
          // Nothing else to do in this example...
        }
      }
    );

    // bwipjs.toBuffer({ bcid: "qrcode", text: "0123456789" }, function(err, png) {
    //   if (err) {
    //     // document.getElementById("output").textContent = err;
    //     return;
    //   } else {
    //     console.log("code", png.toString("base64"));
    //     this.setState({ code: png.toString("base64") });
    //     // document.getElementById('myimg').src = 'data:image/png;base64,' +
    //     //                                        png.toString('base64');
    //   }
    // });
  }

  handleChangeCode = e => {
    console.log("value", e.target.value);
    this.setState({ code: e.target.value });
  };

  getBarcodeDataURI = options => {
    return new Promise((resolve, reject) => {
      let canvas = document.createElement("canvas");

      bwipjs(canvas, options, function(err, cvs) {
        if (err) {
          reject(err);
        } else {
          // Don't need the second param since we have the canvas in scope...
          resolve(cvs.toDataURL("image/png"));
        }
      });
    });
  };

  generateLabel = async () => {
    const { code } = this.state;
    const a = await this.getBarcodeDataURI({
      bcid: "gs1-128", // Barcode type
      text: code, // Text to encode
      scale: 1, // 3x scaling factor
      height: 15 // Bar height, in millimeters,
      // includetext: true, // Show human-readable text
      // textxalign: "center" // Always good to set this
    });

    console.log("generateLabel", a);

    var dd = {
      pageSize: "A5",
      // layout: "lightHorizontalLines", // optional
      background: {
        canvas: [
          {
            type: "rect",
            x: 5,
            y: 5,
            w: 410,
            h: 585,
            lineWidth: 0.1,
            lineColor: "#7a7a7a",
            dash: { length: 3 }
          }
        ]
      },
      content: [
        {
          image: a,
          width: 200,
          alignment: "center"
        },
        { text: code, alignment: "center" },
        {
          canvas: [
            {
              type: "rect",
              x: 20,
              y: 0,
              w: 70,
              h: 70,
              lineWidth: 7,
              lineColor: "#9e9e9e",
              r: 100
            },
            {
              type: "rect",
              x: 5,
              y: 31,
              w: 100,
              h: 10,
              color: "#7a7a7a",
              fillOpacity: 0.5
            },
            {
              text: "Hello World",
              x: 20,
              y: 50
            }
          ]
        },
        "\nYou can also specify accurate widths for some (or all columns). Let's make the first column and the last one narrow and let the layout engine divide remaining space equally between other star-columns:\n\n",
        {
          columns: [
            {
              width: "*",
              text:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur."
            },
            {
              width: "*",
              text:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute."
            }
          ]
        }
      ]
    };
    pdfMake
      .createPdf(dd)
      // .download(`memberRegister-${Math.random() * 100000000}.pdf`);
      // .open({}, window);
      .getBase64(data => {
        this.setState({ pdfBase64: data });
      });
    // pdfMake.createPdf(dd).download();

    // var doc = new jsPDF();
    // doc.text("Text", 150, 15, null, null, "center");
    // doc.save(`${Math.floor(Math.random() * 100000000)}_test.pdf`);

    /* Use PdfMake to generate a financial report. */

    // -- Get the raw data from another CodePen resource.
    //    And transform the data to the required format for aggregation and presentation.
    //    This retrieval happens asynchronously, but fast enough for the report
    //    generation button not to be compromised.
    // let transformedLNRData = [];
    // const xhrLNR = new XMLHttpRequest();
    // xhrLNR.addEventListener("load", function() {
    //   transformedLNRData = JSON.parse(this.responseText).map(textRow => {
    //     return {
    //       loanNote: textRow.loanNote,
    //       reference: textRow.reference,
    //       interestRate: new Big(textRow.interestRate),
    //       initialPrincipal: new Big(textRow.initialPrincipal),
    //       currentBalance: new Big(textRow.currentBalance)
    //     };
    //   });
    // });
    // //xhrLNR.open('GET', 'https://codepen.io/s5b/pen/1455fa236018d0a6f54651482e97f011.js');
    // xhrLNR.open(
    //   "GET",
    //   "https://crossorigin.me/https://www.dropbox.com/s/dvin1alvc4l5nvd/data-LNR.json"
    // );
    // xhrLNR.send();
    //
    // // Formatting money.
    // const asMoney = rawMoney =>
    //   rawMoney
    //     .round(2, 1)
    //     .toFixed(2)
    //     .toString()
    //     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    //
    // const makeCell = (content, rowIndex = -1, options = {}) => {
    //   return Object.assign(
    //     { text: content, fillColor: rowIndex % 2 ? "white" : "#e8e8e8" },
    //     options
    //   );
    // };
    //
    // // -- Format the table cells for presentation.
    // const thl = (content, rowIndex = -1, options = {}) => {
    //   return makeCell(
    //     content,
    //     rowIndex,
    //     Object.assign({ bold: true, alignment: "left", fontSize: 9 }, options)
    //   );
    // };
    // const thr = (content, rowIndex = -1, options = {}) => {
    //   return makeCell(
    //     content,
    //     rowIndex,
    //     Object.assign({ bold: true, alignment: "right", fontSize: 9 }, options)
    //   );
    // };
    // const tdl = (content, rowIndex = -1, options = {}) => {
    //   return makeCell(
    //     content,
    //     rowIndex,
    //     Object.assign({ bold: false, alignment: "left", fontSize: 9 }, options)
    //   );
    // };
    // const tdr = (content, rowIndex = -1, options = {}) => {
    //   return makeCell(
    //     content,
    //     rowIndex,
    //     Object.assign({ bold: false, alignment: "right", fontSize: 9 }, options)
    //   );
    // };
    //
    // // -- Set the report date for display only.
    // const reportDate = () => "31 August 2017";
    //
    // // --  Calculate the total of the current balances.
    // const sumCurrentBalance = data => {
    //   return asMoney(
    //     data.reduce(
    //       (sum, current) => sum.plus(current["currentBalance"]),
    //       new Big(0.0)
    //     )
    //   );
    // };
    //
    // const truncateContent = (content, maxLength = 17) => {
    //   return "".concat(
    //     content.slice(0, maxLength),
    //     content.length > maxLength ? "…" : ""
    //   );
    // };
    //
    // // -- Create a base document template for the reports.
    // const createDocumentDefinition = (
    //   reportDate,
    //   subHeading,
    //   ...contentParts
    // ) => {
    //   const baseDocDefinition = {
    //     pageSize: "A4",
    //     footer: (currentPage, pageCount) => {
    //       return {
    //         text: `${reportDate} : Page ${currentPage.toString()} of ${pageCount.toString()}`,
    //         alignment: "center",
    //         fontSize: 7
    //       };
    //     },
    //
    //     styles: {
    //       title: {
    //         fontSize: 24
    //       },
    //       titleSub: {
    //         fontSize: 18
    //       },
    //       titleDate: {
    //         fontSize: 14,
    //         alignment: "right",
    //         bold: true
    //       }
    //     },
    //
    //     content: [
    //       {
    //         columns: [
    //           {
    //             text: "TruePillars Investment Trust",
    //             style: "title",
    //             width: "*"
    //           },
    //           { text: reportDate, style: "titleDate", width: "160" }
    //         ]
    //       },
    //       { text: `${subHeading}\n\n`, style: "titleSub" }
    //     ]
    //   };
    //   const docDefinition = JSON.parse(JSON.stringify(baseDocDefinition));
    //   docDefinition.footer = baseDocDefinition.footer;
    //   docDefinition.content.push(...contentParts);
    //   return docDefinition;
    // };
    // makeLoanNoteRegisterDoc();
    //
    // // -- Make a Loan Note Register report. (This is attached to the button.)
    // function makeLoanNoteRegisterDoc() {
    //   // -- Table summary
    //   const tableSummary = {
    //     table: {
    //       widths: ["*", 70],
    //       body: [
    //         [
    //           { text: reportDate(), bold: true },
    //           tdr(sumCurrentBalance(transformedLNRData), "white")
    //         ]
    //       ]
    //     }
    //   };
    //
    //   // -- Generate the body of the document table, with headings
    //   const tableBody = dataRows => {
    //     const body = [
    //       [
    //         thl("Loan\nNote"),
    //         thl("\nReference"),
    //         thr("Interest\nRate"),
    //         thr("Initial\nPrincipal"),
    //         thr("Current\nBalance")
    //       ]
    //     ];
    //     dataRows.forEach((row, index) => {
    //       const tableRow = [];
    //       tableRow.push(tdl(row["loanNote"], index));
    //       tableRow.push(tdl(row["reference"], index));
    //       tableRow.push(
    //         tdr(
    //           row["interestRate"]
    //             .round(1, 1)
    //             .toFixed(1)
    //             .toString(),
    //           index
    //         )
    //       );
    //       tableRow.push(tdr(asMoney(row["initialPrincipal"]), index));
    //       tableRow.push(tdr(asMoney(row["currentBalance"]), index));
    //       body.push(tableRow);
    //     });
    //     return body;
    //   };
    //
    //   // -- The main report table, with the table body.
    //   const tableData = {
    //     table: {
    //       headerRows: 1,
    //       widths: [50, "*", 70, 70, 70],
    //
    //       body: tableBody(transformedLNRData)
    //     }
    //   };
    //
    //   const docDefinition = createDocumentDefinition(
    //     reportDate(),
    //     "Loan Note Register",
    //     tableSummary,
    //     " ",
    //     tableData
    //   );
    //   pdfMake
    //     .createPdf(docDefinition)
    //     .download(`loanNoteRegister-${reportDate()}.pdf`);
    // }
    //
    // // -- Generate the Underlying Loan Summary report.
    // function makeUnderlyingLoanSummaryDoc() {
    //   const fontSize = 6;
    //
    //   let cumOriginalPrincipal = new Big("0.0");
    //   let cumCurrentBalance = new Big("0.0");
    //
    //   // -- Generate the body of the document table, with headings
    //   const tableBody = dataRows => {
    //     const body = [
    //       [
    //         thl("\nUnderlying Borrower", -1, {
    //           rowSpan: 2,
    //           fontSize: fontSize
    //         }),
    //         thr("Loan Notes", -1, { colSpan: 2, fontSize: fontSize }),
    //         thr(" "),
    //         thr("Original\nPrincipal", -1, { rowSpan: 2, fontSize: fontSize }),
    //         thr("Current\nBalance", -1, { rowSpan: 2, fontSize: fontSize }),
    //         thr("Borrower\nInterest Rate", -1, {
    //           rowSpan: 2,
    //           fontSize: fontSize
    //         }),
    //         thr("Term\n(Months)", -1, { rowSpan: 2, fontSize: fontSize }),
    //         thr("Drawdown\nDate", -1, { rowSpan: 2, fontSize: fontSize }),
    //         thr("Payments\nMade", -1, { rowSpan: 2, fontSize: fontSize }),
    //         thl("\nStatus", -1, { rowSpan: 2, fontSize: fontSize })
    //       ],
    //       [
    //         thl(" "),
    //         thr("first", -1, { fontSize: fontSize }),
    //         thr("last", -1, { fontSize: fontSize }),
    //         thr(" "),
    //         thr(" "),
    //         thr(" "),
    //         thr(" "),
    //         thr(" "),
    //         thr(" "),
    //         thr(" ")
    //       ]
    //     ];
    //
    //     dataRows.forEach((row, index) => {
    //       const tableRow = [];
    //       tableRow.push(
    //         tdl(row["borrowerName"], index, { fontSize: fontSize })
    //       );
    //       tableRow.push(
    //         tdr(row["loanNoteFirst"], index, { fontSize: fontSize })
    //       );
    //       tableRow.push(
    //         tdr(row["loanNoteLast"], index, { fontSize: fontSize })
    //       );
    //       tableRow.push(
    //         tdr(asMoney(row["originalPrincipal"]), index, {
    //           fontSize: fontSize
    //         })
    //       );
    //       tableRow.push(
    //         tdr(asMoney(row["currentBalance"]), index, { fontSize: fontSize })
    //       );
    //       tableRow.push(
    //         tdr(
    //           row["borrowerRate"]
    //             .round(2, 1)
    //             .toFixed(2)
    //             .toString(),
    //           index,
    //           { fontSize: fontSize }
    //         )
    //       );
    //       tableRow.push(tdr(row["term"], index, { fontSize: fontSize }));
    //       tableRow.push(
    //         tdr(row["drawdown"].format("D MMM YYYY"), index, {
    //           fontSize: fontSize
    //         })
    //       );
    //       tableRow.push(tdr(row["payments"], index, { fontSize: fontSize }));
    //       tableRow.push(tdl(row["status"], index, { fontSize: fontSize }));
    //       body.push(tableRow);
    //
    //       cumOriginalPrincipal = cumOriginalPrincipal.plus(
    //         row["originalPrincipal"]
    //       );
    //       cumCurrentBalance = cumCurrentBalance.plus(row["currentBalance"]);
    //     });
    //
    //     /*  *
    //         body[1] = [
    //             tdl(`Total number of loans: ${dataRows.length}`, -1, {colSpan: 2, fillColor: 'black', color: 'white'}),
    //             tdl(' '),
    //             tdr(asMoney(cumLoanUnits), -1, {fillColor: 'black', color: 'white'}),
    //             tdr(asMoney(cumCashUnits), -1, {fillColor: 'black', color: 'white'}),
    //             tdr(asMoney(cumTotalUnits), -1, {fillColor: 'black', color: 'white'})
    //         ];
    //         /*  */
    //     return body;
    //   };
    //
    //   const tableColumnWidths = ["*", 22, 22, 40, 40, 40, 25, 38, 28, 25];
    //
    //   // -- The main report table, with the table body.
    //   const tableData = {
    //     table: {
    //       headerRows: 2,
    //       widths: tableColumnWidths,
    //
    //       body: tableBody(transformedULSData)
    //     }
    //   };
    //
    //   const tableSummaryData = {
    //     table: {
    //       headerRows: 0,
    //       widths: tableColumnWidths,
    //
    //       body: [
    //         [
    //           thr(`Total number of loans: ${transformedULSData.length}.`, -1, {
    //             colSpan: 3,
    //             fontSize: fontSize,
    //             color: "white",
    //             fillColor: "black"
    //           }),
    //           thr(""),
    //           thr(""),
    //           thr(asMoney(cumOriginalPrincipal), -1, {
    //             fontSize: fontSize,
    //             color: "white",
    //             fillColor: "black"
    //           }),
    //           thr(asMoney(cumCurrentBalance), -1, {
    //             fontSize: fontSize,
    //             color: "white",
    //             fillColor: "black"
    //           }),
    //           thr("", -1, { colSpan: 5, color: "white", fillColor: "black" }),
    //           thr(""),
    //           thr(""),
    //           thr(""),
    //           thr("")
    //         ]
    //       ]
    //     }
    //   };
    //
    //   const docDefinition = createDocumentDefinition(
    //     reportDate(),
    //     "Underlying Loan Summary",
    //     tableSummaryData,
    //     " ",
    //     tableData
    //   );
    //   pdfMake
    //     .createPdf(docDefinition)
    //     .download(`underlyingLoanSummary-${reportDate()}.pdf`);
    // }
    //
    // // -- Generate the Member Registry Report
    // function makeMemberRegisterDoc() {
    //   // -- Generate the body of the document table, with headings
    //   const tableBody = dataRows => {
    //     const body = [
    //       [
    //         thl(" ", -1, { colSpan: 2 }),
    //         thl(" "),
    //         thr("Loan Units"),
    //         thr("Cash Units"),
    //         thr("Total Units")
    //       ],
    //       []
    //     ];
    //
    //     let cumLoanUnits = new Big("0.0");
    //     let cumCashUnits = new Big("0.0");
    //     let cumTotalUnits = new Big("0.0");
    //
    //     dataRows.forEach((row, index) => {
    //       const tableRow = [];
    //       tableRow.push(tdl(row["memberName"], index));
    //       tableRow.push(tdl(truncateContent(row["memberEmail"]), index));
    //       tableRow.push(tdr(asMoney(row["loanUnits"]), index));
    //       tableRow.push(tdr(asMoney(row["cashUnits"]), index));
    //       tableRow.push(tdr(asMoney(row["totalUnits"]), index));
    //       body.push(tableRow);
    //
    //       cumLoanUnits = cumLoanUnits.plus(row["loanUnits"]);
    //       cumCashUnits = cumCashUnits.plus(row["cashUnits"]);
    //       cumTotalUnits = cumTotalUnits.plus(row["totalUnits"]);
    //     });
    //     body[1] = [
    //       tdl(`Total for ${dataRows.length} members`, -1, {
    //         colSpan: 2,
    //         fillColor: "black",
    //         color: "white"
    //       }),
    //       tdl(" "),
    //       tdr(asMoney(cumLoanUnits), -1, {
    //         fillColor: "black",
    //         color: "white"
    //       }),
    //       tdr(asMoney(cumCashUnits), -1, {
    //         fillColor: "black",
    //         color: "white"
    //       }),
    //       tdr(asMoney(cumTotalUnits), -1, {
    //         fillColor: "black",
    //         color: "white"
    //       })
    //     ];
    //     return body;
    //   };
    //
    //   // -- The main report table, with the table body.
    //   const tableData = {
    //     table: {
    //       headerRows: 1,
    //       widths: ["*", 100, 70, 70, 70],
    //
    //       body: tableBody(transformedMRData)
    //     }
    //   };
    //   const docDefinition = createDocumentDefinition(
    //     reportDate(),
    //     "Member Register",
    //     tableData
    //   );
    //   pdfMake
    //     .createPdf(docDefinition)
    //     .download(`memberRegister-${reportDate()}.pdf`);
    // }
  };
  // const dataPdf = "JVBERi0xLjMKJf////8KOCAwIG9iago8PAovVHlwZSAvRXh0R1N0YXRlCi9DQSAxCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9UeXBlIC9FeHRHU3RhdGUKL2NhIDEKL0NBIDEKPj4KZW5kb2JqCjExIDAgb2JqCjw8Ci9UeXBlIC9FeHRHU3RhdGUKL2NhIDAuNQo+PgplbmRvYmoKNyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDQxOS41MyA1OTUuMjhdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDYgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRXh0R1N0YXRlIDw8Ci9HczEgOCAwIFIKL0dzMiA5IDAgUgovR3MzIDExIDAgUgo+Pgov..."
  render() {
    const displayPdf = `data:application/pdf;base64,${this.state.pdfBase64}`;
    return (
      <div
        style={{
          height: "100%",
          margin: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr"
          // border: "1px solid red"
        }}
      >
        {/* <Markup content={articleContent} /> */}

        <div
          // onSubmit={this.handleSubmit}
          style={{
            // display: "block" /* iframes are inline by default */,
            // background: "#000",
            // border: "none" /* Reset default border */,
            width: "100%",
            height: "100%"
          }}
        >
          <label>
            Name:
            <input
              type="text"
              value={this.state.code}
              onChange={this.handleChangeCode}
            />
          </label>
          {/* <input type="submit" value="Submit" /> */}
          <ButtonMy onClick={this.generateLabel}>Generuj</ButtonMy>
          <div>
            Ubi laboris efflorescere. Quis te occaecat eu aute, aute ut nescius
            qui duis. O eram arbitror. Cillum iudicem deserunt de sint vidisse
            si despicationes, esse officia ab tamen quid, a amet consectetur eu
            fugiat comprehenderit excepteur esse commodo aut esse constias ubi
            praetermissum ad mandaremus sed quibusdam, aliqua laborum ubi quem
            duis.Quid offendit de doctrina ab quid arbitror ea aliqua minim,
            sint sed commodo ut quem, export mentitum eu distinguantur. Nulla
            hic probant a dolore, hic dolore voluptate commodo. Offendit quo
            malis appellat aut nescius eram duis si legam.Aliquip se tamen. Aut
            sint offendit. Et an enim mentitum. Cillum deserunt ut eruditionem
            ea ita sint reprehenderit ita summis se iis veniam singulis hic in
            dolor coniunctione, veniam litteris ne litteris ea quo ne export
            consequat, nescius qui admodum ita officia tractavissent sed
            officia.Quem nescius ubi fabulas, laborum irure tempor ad dolore, ut
            fugiat ingeniis deserunt si doctrina non senserit, velit nam qui
            tamen aliquip, voluptate te fore, illum iis ita fore commodo et ubi
            minim sint eu pariatur. Ab quibusdam reprehenderit, mentitum veniam
            commodo. Laboris veniam est arbitror efflorescere de id anim ut
            elit. Export o incididunt et quamquam duis enim nam nulla nam est
            aute magna aute admodum, malis se fabulas te irure ea e sint
            quibusdam, ullamco an veniam, ad eram te multos, eu quid dolore in
            ingeniis.
          </div>
        </div>

        {/* <canvas id="mycanvas" /> */}
        <iframe
          id="pdfV"
          src={displayPdf}
          style={{
            display: "block" /* iframes are inline by default */,
            background: "#000",
            border: "none" /* Reset default border */,
            width: "100%",
            height: "700px"
          }}
        />
      </div>
    );
  }
}

const styles = theme => ({});

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  ),
  MainFrameHOC
)(Barcodes);
