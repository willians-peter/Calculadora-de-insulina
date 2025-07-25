function atualizarDataHora() {
  const agora = new Date();
  const opcoesHora = { hour: '2-digit', minute: '2-digit', hour12: false };
  const diaDaSemana = agora.toLocaleDateString('pt-BR', { weekday: 'long' });
  const horaFormatada = agora.toLocaleTimeString('pt-BR', opcoesHora);
  const diaDaSemanaMaiuscula = `${diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1)}`;
  document.getElementById("data-hora").innerText = `${diaDaSemanaMaiuscula} ${horaFormatada}`;
}

setInterval(atualizarDataHora, 1000); // atualiza a cada segundo
atualizarDataHora(); // chama a função uma vez para inicializar a data e hora

// Chama a função imediatamente para exibir a data e hora iniciais
atualizarDataHora();

// Atualiza a data e hora a cada segundo (1000 milissegundos)
setInterval(atualizarDataHora, 1000);
// --- Funções para calcular os valores de Delta com base na Vazão Atual ---

const mensagemElement = document.getElementById("saudacao");
const dataHoraElement = document.getElementById("data-hora");

function mostrarMensagem() {
  const dataAtual = new Date();
  const hora = dataAtual.getHours();

  let mensagem = "";
  if (hora < 12) {
    mensagem = "Bom dia!";
  } else if (hora < 18) {
    mensagem = "Boa tarde!";
  } else {
    mensagem = "Boa noite!";
  }

  mensagemElement.innerText = mensagem;
  dataHoraElement.innerText = `Data: ${dataAtual.toLocaleDateString()} Hora: ${dataAtual.toLocaleTimeString()}`;
}

mostrarMensagem();
setInterval(mostrarMensagem, 1000 * 60); // atualiza a cada minuto


function calcularUmDelta(vazaoAtual) {
    if (vazaoAtual < 3) {
        return 0.5;
    } else if (vazaoAtual >= 3 && vazaoAtual <= 6.9) {
        return 1.0;
    } else if (vazaoAtual >= 7 && vazaoAtual <= 10.9) {
        return 1.5;
    } else if (vazaoAtual >= 11 && vazaoAtual <= 15.9) {
        return 2.0;
    } else if (vazaoAtual >= 16 && vazaoAtual <= 20.9) {
        return 3.0;
    } else if (vazaoAtual >= 21 && vazaoAtual <= 25.9) {
        return 4.0;
    } else if (vazaoAtual > 25) {
        return 'avisar o médico'; // Retorna string quando a vazão for alta para 1 Delta
    }
    return 0; // Valor padrão caso não se encaixe em nenhuma condição
}

function calcularDoisDelta(vazaoAtual) {
    if (vazaoAtual < 3) {
        return 1.0;
    } else if (vazaoAtual >= 3 && vazaoAtual <= 6) {
        return 2.0;
    } else if (vazaoAtual >= 7 && vazaoAtual <= 10) {
        return 3.0;
    } else if (vazaoAtual >= 11 && vazaoAtual <= 15) {
        return 4.0;
    } else if (vazaoAtual >= 16 && vazaoAtual <= 20) {
        return 6.0;
    } else if (vazaoAtual >= 21 && vazaoAtual <= 25) {
        return 8.0;
    } else if (vazaoAtual > 25) {
        return 'avisar o médico'; // Retorna string quando a vazão for alta para 2 Deltas
    }
    return 0; // Valor padrão
}

// --- FIM DAS FUNÇÕES DE DELTA ---

function parseDecimal(value) {
  return parseFloat(value.replace(",", "."));
}
// --- MÓDULO INÍCIO ---
const calcularInicioButton = document.getElementById("calcular-inicio");
if (calcularInicioButton) {
  calcularInicioButton.addEventListener("click", function() {
    const valorHGT = parseFloat(document.getElementById("valorHGTinicio").value);
    const mensagemDiv = document.getElementById("mensagem");

    if (isNaN(valorHGT) || valorHGT < 0) {
      if (mensagemDiv) {
        mensagemDiv.innerHTML = "<span style='color: red;'>Por favor, insira um valor válido para o HGT.</span>";
      }
      return;
    }

    if (valorHGT < 70) {
      if (mensagemDiv) {
        mensagemDiv.innerHTML = "<span style='color: red;'>Atenção: HGT abaixo de 70 mg/dl. Pode ser  necessario adminstrar glicose ao paciente, avise o médico e ou enfermeiro.</span>";
      }
      return;
    }

    let vazao;
    let bolus = 0;
    if (valorHGT > 300) {
      vazao = Math.floor((valorHGT / 100) * 2) / 2;
      bolus = vazao;
    } else if (valorHGT > 180) {
      vazao = Math.floor((valorHGT / 100) * 2) / 2;
    } else {
      if (mensagemDiv) {
        mensagemDiv.innerHTML = "Não é necessário iniciar o protocolo.";
      }
      return;
    }

    if (mensagemDiv) {
      mensagemDiv.innerHTML = `Iniciar protocolo com vazão de ${vazao} ml/hr. ${bolus > 0 ? `E realizar um bolus de ${bolus} ml.` : ''}`;
    }
  });
}

    const valorHGTInicioInput = document.getElementById("valorHGTinicio");
    if (valorHGTInicioInput) {
        valorHGTInicioInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                calcularInicioButton.click();
            }
        });
    }



// --- MÓDULO RELIGAR ---
const calcularReligarButton = document.getElementById("calcular-religar");
if (calcularReligarButton) {
  calcularReligarButton.addEventListener("click", function() {
    const ultimaVazao = parseFloat(document.getElementById("ultimaVazao").value);
    const hgtAtualReligar = parseFloat(document.getElementById("HGTReligar").value);
    const mensagemReligarDiv = document.getElementById("mensagem-religar");

    if (isNaN(ultimaVazao) || isNaN(hgtAtualReligar)) {
      if (mensagemReligarDiv) {
        mensagemReligarDiv.innerHTML = "<span style='color: red;'>Por favor, insira valores válidos para Última Vazão e HGT.</span>";
      }
      return;
    }

    if (hgtAtualReligar < 70) {
      if (mensagemReligarDiv) {
        mensagemReligarDiv.innerHTML = "<span style='color: red;'>Atenção: HGT abaixo de 70 mg/dl. Pode ser  necessario adminstrar glicose ao paciente, avise o médico e ou enfermeiro.</span>";
      }
    } else if (hgtAtualReligar > 180) {
      const novaVazao = Math.floor((ultimaVazao * 0.75) * 2) / 2;
      if (mensagemReligarDiv) {
        mensagemReligarDiv.innerHTML = `Religar protocolo com vazão de ${novaVazao} ml/hr`;
      }
    } else {
      if (mensagemReligarDiv) {
        mensagemReligarDiv.innerHTML = "Não é necessário religar o protocolo.";
      }
    }
  });
}


// --- MÓDULO MANUTENÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    const hgtAtualInput = document.getElementById('HgtAtual');
    const hgtAnteriorInput = document.getElementById('HgtAnterior');
    const vazaoAtualInput = document.getElementById('VazaoAtual');
    // Mantenha 'DiferencaHgt' se o seu HTML ainda usa esse ID para o botão de cálculo da manutenção
    const calcularManutencaoButton = document.getElementById('DiferencaHgt');
    const mensagemManutencaoDiv = document.getElementById('mensagem-manutencao');

    if (calcularManutencaoButton) {
        calcularManutencaoButton.addEventListener('click', () => {
            const hgtAtual = parseFloat(hgtAtualInput.value);
            const hgtAnterior = parseFloat(hgtAnteriorInput.value);
            const vazaoAtual = parseDecimal(vazaoAtualInput.value);

            // Validação de inputs
            if (isNaN(hgtAtual) || isNaN(hgtAnterior) || isNaN(vazaoAtual) || vazaoAtual < 0) {
                mensagemManutencaoDiv.innerHTML = '<span style="color: red;">Por favor, insira valores numéricos válidos e positivos para todos os campos.</span>';
                return;
            }

            const diferencaHgt = hgtAtual - hgtAnterior;
            let mensagemAjuste = '';
            let valorDelta = 0;
            let acaoDelta = '';

            // --- Novas regras para HGT Atual < 140 ---
            if (hgtAtual < 70) {
                mensagemAjuste = `<span style='color: red;'>HGT Atual: ${hgtAtual} mg/dL. É necessário **avisar o médico. Pode ser necessário administrar glicose. Checar prescrição médica e comunicar o enfermeiro. DESLIGAR A INSULINA!`;
            } else if (hgtAtual < 140) {
                mensagemAjuste = `**HGT Atual: ${hgtAtual} mg/dL.DESLIGAR A INSULINA!`;
            } else if (hgtAtual >= 140 && hgtAtual <= 180) {
                // Regras para HGT Atual entre 140 e 180 mg/dL
                if (diferencaHgt >= -20 && diferencaHgt <= 0) {
                    mensagemAjuste = `Manter o valor atual de insulina (vazão ${vazaoAtual.toFixed(1)} ml/hr).`;
                } else if (diferencaHgt < -20 && diferencaHgt >= -40) {
                    valorDelta = calcularUmDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Diminuir a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Um Delta)`;
                        acaoDelta = 'Diminuir';
                    } else {
                        mensagemAjuste = `Diminuir a Infusão em Um Delta: ${valorDelta}.`;
                        acaoDelta = 'Diminuir';
                    }
                } else if (diferencaHgt < -40) {
                    valorDelta = calcularDoisDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Diminuir a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Dois Delta)`;
                        acaoDelta = 'Diminuir';
                    } else {
                        mensagemAjuste = `Diminuir a Infusão em Dois Delta: ${valorDelta}.`;
                        acaoDelta = 'Diminuir';
                    }
                } else { // Se aumentou nesta faixa (HGT Atual entre 140 e 180, e diferencaHgt > 0)
                    mensagemAjuste = `Manter o valor atual de insulina (vazão ${vazaoAtual.toFixed(1)} ml/hr).`;
                }
            } else if (hgtAtual >= 181 && hgtAtual <= 250) {
                // Regras para HGT Atual entre 181 e 250 mg/dL
                if (diferencaHgt > 40) {
                    valorDelta = calcularDoisDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Aumentar a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Dois Delta)`;
                        acaoDelta = 'Aumentar';
                    } else {
                        mensagemAjuste = `Aumentar a Infusão em Dois Delta: ${valorDelta}.`;
                        acaoDelta = 'Aumentar';
                    }
                } else if (diferencaHgt >= 1 && diferencaHgt <= 40) {
                    valorDelta = calcularUmDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Aumentar a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Um Delta)`;
                        acaoDelta = 'Aumentar';
                    } else {
                        mensagemAjuste = `Aumentar a Infusão em Um Delta: ${valorDelta}.`;
                        acaoDelta = 'Aumentar';
                    }
                } else if (diferencaHgt >= -40 && diferencaHgt <= 0) {
                    mensagemAjuste = `Manter o valor atual de insulina (vazão ${vazaoAtual.toFixed(1)} ml/hr).`;
                } else if (diferencaHgt < -40 && diferencaHgt >= -80) {
                    valorDelta = calcularUmDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Diminuir a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Um Delta)`;
                        acaoDelta = 'Diminuir';
                    } else {
                        mensagemAjuste = `Diminuir a Infusão em Um Delta: ${valorDelta}.`;
                        acaoDelta = 'Diminuir';
                    }
                } else if (diferencaHgt < -80) {
                    valorDelta = calcularDoisDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Diminuir a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Dois Delta)`;
                        acaoDelta = 'Diminuir';
                    } else {
                        mensagemAjuste = `Diminuir a Infusão em Dois Delta: ${valorDelta}.`;
                        acaoDelta = 'Diminuir';
                    }
                }
            } else if (hgtAtual > 250) {
                // Regras para HGT Atual acima de 250 mg/dL
                if (diferencaHgt > 40) {
                    valorDelta = calcularDoisDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Aumentar a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Dois Delta)`;
                        acaoDelta = 'Aumentar';
                    } else {
                        mensagemAjuste = `Aumentar a Infusão em Dois Delta: ${valorDelta}.`;
                        acaoDelta = 'Aumentar';
                    }
                } else if (diferencaHgt >= 1 && diferencaHgt <= 40) {
                    valorDelta = calcularUmDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Aumentar a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Um Delta)`;
                        acaoDelta = 'Aumentar';
                    } else {
                        mensagemAjuste = `Aumentar a Infusão em Um Delta: ${valorDelta}.`;
                        acaoDelta = 'Aumentar';
                    }
                } else if (diferencaHgt >= -80 && diferencaHgt <= 0) {
                    mensagemAjuste = `Manter o valor atual de insulina (vazão ${vazaoAtual.toFixed(1)} ml/hr).`;
                } else if (diferencaHgt < -80 && diferencaHgt >= -120) {
                    valorDelta = calcularUmDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Diminuir a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Um Delta)`;
                        acaoDelta = 'Diminuir';
                    } else {
                        mensagemAjuste = `Diminuir a Infusão em Um Delta: ${valorDelta}.`;
                        acaoDelta = 'Diminuir';
                    }
                } else if (diferencaHgt < -120) {
                    valorDelta = calcularDoisDelta(vazaoAtual);
                    if (typeof valorDelta === 'number') {
                        mensagemAjuste = `Diminuir a Infusão em ${valorDelta.toFixed(1)} ml/hr. (Dois Delta)`;
                        acaoDelta = 'Diminuir';
                    } else {
                        mensagemAjuste = `Diminuir a Infusão em Dois Delta: ${valorDelta}.`;
                        acaoDelta = 'Diminuir';
                    }
                }
            }

            // --- Construção da mensagem final ---
            let valorAjustado = vazaoAtual;
            if (acaoDelta === 'Aumentar' && typeof valorDelta === 'number') {
                valorAjustado += valorDelta;
            } else if (acaoDelta === 'Diminuir' && typeof valorDelta === 'number') {
                valorAjustado -= valorDelta;
            }

            let mensagemFinal = '';
            if (hgtAtual < 140) { // Para os casos de "desligar" ou "avisar médico"
                mensagemFinal = mensagemAjuste;
            } else if (mensagemAjuste.includes('Manter')) {
                mensagemFinal = `Manter o valor atual de insulina (vazão ${vazaoAtual.toFixed(1)} ml/hr).`;
            } else if (typeof valorDelta === 'number') {
                mensagemFinal = `Ajustar o valor de insulina para: ${valorAjustado.toFixed(1)} ml/hr (${mensagemAjuste.replace(' ml/hr.', '').replace('Aumentar a Infusão em ', 'Aumentar ').replace('Diminuir a Infusão em ', 'Diminuir ')}).`;
            } else { // Caso o delta seja "avisar o médico"
                mensagemFinal = `Ajustar o valor de insulina para: ${mensagemAjuste}`;
            }

            mensagemManutencaoDiv.innerHTML = mensagemFinal;
        });
    }
});