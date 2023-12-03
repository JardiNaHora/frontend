import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

function gerarPDFReports(formulario, reports) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const dados = reports.map((report, index) => {
    index += 1;
    return [
      {
        text: [
          "Viagem número: ",
          index + "\n",
          { text: "Motorista: ", bold: true },
          `${report.motorista}\n`,
          { text: "Veiculo: ", bold: true },
          `${report.veiculo}\n`,
          { text: "Data: ", bold: true },
          `${report.data}\n`,
          { text: "Distancia percorrida: ", bold: true },
          `${report.distanciaPercorrida}\n`,
          { text: "Número de viagens: ", bold: true },
          `${report.numeroDeViagens}\n`,
        ],
        fontSize: 12,
        margin: [0, 10, 0, 10],
      },
    ];
  });

  const reportTitle = [
    {
      text: `Relatorio do dia: ${formulario.dataCriacao}`,
      fontSize: 16,
      bold: true,
      margin: [15, 20, 0, 45],
    },
  ];

  const details = [
    {
      text: "Autor: ",
      fontSize: 14,
      bold: true,
      margin: [0, 10, 0, 3],
    },
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: [
                { text: "Nome: ", bold: true },
                `${formulario.autor.nome}\n`,
                { text: "Email: ", bold: true },
                `${formulario.autor.email}\n`,
                { text: "Data selecionada: ", bold: true },
                `de ${formulario.dataInicial} a ${formulario.dataFinal}\n`,
                { text: "Obervação: ", bold: true },
                `${formulario.obs}\n`,
              ],

              fontSize: 12,
              margin: [0, 0, 0, 8],
            },
          ],
          ...dados,
        ],
      },
      layout: "lightHorizontalLines",
    },
  ];

  function Rodape(currentPage, pageCount) {
    return [
      {
        text: currentPage + " de " + pageCount,
        alignment: "right",
        fontSize: 9,
        margin: [0, 10, 20, 0],
      },
    ];
  }

  const docDefinitions = {
    pageSize: "A4",
    pageMargin: [15, 50, 15, 40],

    header: [reportTitle],
    content: [details],
    footer: Rodape,
  };

  pdfMake.createPdf(docDefinitions).open();
}
export default gerarPDFReports;
