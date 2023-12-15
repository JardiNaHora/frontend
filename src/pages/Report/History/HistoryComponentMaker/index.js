import gerarPDFReports from "../../PdfMake";

const ComponentMaker = ({ dado, index }) => {
  const gerarPDF = (e) => {
    e.preventDefault();

    gerarPDFReports(dado.formulario, dado.reports);
  };
  return (
    <div className="relatorio">
      <hr></hr>
      <div className="relatorio-header">
        <h3>{"Relatorio " + (index + 1)}</h3>
        <h4>{"Data de criação: " + dado.formulario.dataCriacao}</h4>
      </div>

      <div className="relatorio-config">
        <div className="coluna1">
          <h3>{"Autor: " + dado.formulario.autor.nome}</h3>
          <h5>
            {"Data das viagens no relatório: " +
              `de ${dado.formulario.dataInicial} à ${dado.formulario.dataFinal}`}
          </h5>
          <h5>{"Número de viagens do relatório: " + dado.reports.length}</h5>
        </div>
        <div className="btn-visualizar">
          <input type="button" value="Visualizar PDF" onClick={gerarPDF} />
        </div>
      </div>
    </div>
  );
};

const HistoryComponentMaker = ({ dados }) => {
  return (
    <div className="relatorios">
      {dados.length > 0 ? (
        dados.map((item, index) => (
          <ComponentMaker key={index} dado={item} index={index} />
        ))
      ) : (
        <h4>Não há viagens no período selecionado</h4>
      )}
    </div>
  );
};
export default HistoryComponentMaker;
