import React from "react";

function Viagens(props) {
  const { viagens, mes, ano } = props;

  const viagensFiltradas = viagens.filter((viagem) => {
    const dataViagem = new Date(viagem.data);
    const anoViagem = dataViagem.getFullYear();
    const mesViagem = dataViagem.getMonth() + 1;
    return anoViagem.toString() === ano && mesViagem.toString() === mes;
  });
  console.log(viagensFiltradas);
  return (
    <>
      {viagensFiltradas.length > 0 ? (
        viagensFiltradas.map((viagem) => (
          <p key={viagem.id}>
            🚐 Viagem de número: {viagem.id} - 🗓️{viagem.data}
          </p>
        ))
      ) : (
        <p>Não há viagens no período</p>
      )}
    </>
  );
}

export default Viagens;
