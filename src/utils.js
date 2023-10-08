import jsPDF from "jspdf";
import { Chart } from "chart.js";
import logo from "./logoMark.png";
const chartToImage = (chartData) => {
  return new Promise(async (resolve, reject) => {
    var ctx = document.getElementById("myChart");
    ctx.width = 600;
    ctx.height = 200;

    const canvas = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        animation: {
          onComplete: () => {
            const data = canvas.toBase64Image("image/png");
            canvas.destroy();
            resolve(data);
          },
        },
      },
    });
  });
};
export const generatePDF = async (data, setLoadingMessage) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const dateStr = `${month} ${day}, ${year}`;
  const doc = new jsPDF();
  const totalPages = Math.ceil(data.length / 4);
  setLoadingMessage("Generating PDF with " + totalPages + " pages .....");

  for (
    let page = 1;
    page <=
    // 1;
    totalPages;
    page++
  ) {
    if (page !== 1) doc.addPage();
    // Add header
    setLoadingMessage(
      "Generating PDF for page " + page + " of " + totalPages + " ....."
    );

    doc.setDrawColor(0, 0, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.setLineWidth(0.5);
    doc.line(10, 15, 200, 15);
    doc.addImage(logo, "PNG", 10, 6, 4, 4);
    doc.text(`RealAssist.AI`, 15, 10);
    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);
    doc.text("123 Main Street, Dover, NH 03820-4667", 200, 10, {
      align: "right",
    });

    //  footer

    doc.setLineWidth(0.5);
    doc.line(10, 284, 200, 284);
    doc.setTextColor(0, 0, 255);
    doc.text(`Report Generated on ${dateStr}`, 10, 290);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `RealAssist Property Report | Page: ${page} of ${totalPages}`,
      200,
      290,
      {
        align: "right",
      }
    );

    // Add graphs
    for (let i = (page - 1) * 4; i < page * 4; i++) {
      if (data[i]) {
        const chartData = data[i];
        const image = await chartToImage(chartData);
        console.log("Printing graph: " + i);
        doc.addImage(image, "PNG", 40, 30 + (i % 4) * 60, 140, 50);
      }
    }
  }
  setLoadingMessage("Finishing up .....");
  doc.save("graphs.pdf");
};

export function generateNormalizedGraphDataArray(data, setLoadingMessage) {
  if (data) {
    setLoadingMessage("Nomalizing data .....");

    const charts = data.keys;
    let labels = [];
    let yearData = {};
    data.data.forEach((d) => {
      const { data_year, ...rest } = d;
      labels.push(data_year);
      yearData[data_year] = rest;
    });
    let normaziedData = {};
    let lineChartDataArray = [];
    charts.forEach((crime) => {
      let lineChartData = {
        labels: labels,

        datasets: [
          {
            label: `Crime: ${crime}`,
            data: [],
            borderColor: "#2d6aef",
            backgroundColor: "#2d6aef",
          },
        ],
      };

      labels.forEach((eachYear) => {
        if (!normaziedData[crime]) {
          normaziedData[crime] = {};
        }

        normaziedData[crime][eachYear] = yearData[eachYear][crime];
        lineChartData.datasets[0].data.push(yearData[eachYear][crime]);
      });
      lineChartDataArray.push(lineChartData);
    });

    return lineChartDataArray;
  } else {
    return [];
  }
}
