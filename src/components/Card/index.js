const Card = ({ dado }) => {
  return (
    <div className="viagem">
      <hr></hr>
      <div>{"Motorista: " + dado.motorista}</div>
      <div>{"Veículo: " + dado.veiculo}</div>
      <div>{"Data: " + dado.data}</div>
      <div>{"Distancia percorrida: " + dado.distanciaPercorrida}</div>
      <div>{"Número de viagens: " + dado.numeroDeViagens}</div>
    </div>
  );
};

const CardLista = ({ dados }) => {
  return (
    <div className="viagens">
      {dados.length > 0 ? (
        dados.map((item, index) => <Card key={index} dado={item} />)
      ) : (
        <h4>Não há viagens no período selecionado</h4>
      )}
    </div>
  );
};
export default CardLista;
