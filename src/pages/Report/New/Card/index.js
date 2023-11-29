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
      {dados.map((item, index) => (
        <Card key={index} dado={item} />
      ))}
    </div>
  );
};
export default CardLista;
