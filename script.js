const API_URL = "https://barbearia-api-v36t.onrender.com/api";

const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");
    carregarDashboard();
  } else {
    loginPage.classList.remove("hidden");
    app.classList.add("hidden");
  }
});

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro na requisicao: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/* LOGIN */

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const loginError = document.getElementById("loginError");

  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    localStorage.setItem("token", data.token);

    loginPage.classList.add("hidden");
    app.classList.remove("hidden");

    carregarDashboard();
  } catch (error) {
    loginError.textContent = "E-mail ou senha inválidos.";
    loginError.classList.remove("hidden");
  }
});

function sair() {
  localStorage.removeItem("token");
  location.reload();
}

/* NAVEGAÇÃO */

function mostrarTela(telaId) {
  const telas = document.querySelectorAll(".page");

  telas.forEach((tela) => {
    tela.classList.add("hidden");
  });

  document.getElementById(telaId).classList.remove("hidden");

  if (telaId === "dashboard") carregarDashboard();
  if (telaId === "clientes") carregarClientes();
  if (telaId === "servicos") carregarServicos();
  if (telaId === "barbeiros") carregarBarbeiros();
  if (telaId === "agendamentos") carregarAgendamentos();
}

/* DASHBOARD */

async function carregarDashboard() {
  try {
    const clientes = await request("/clientes");
    const servicos = await request("/servicos");
    const barbeiros = await request("/barbeiros");
    const agendamentos = await request("/agendamentos");

    document.getElementById("totalClientes").textContent = clientes.length;
    document.getElementById("totalServicos").textContent = servicos.length;
    document.getElementById("totalBarbeiros").textContent = barbeiros.length;
    document.getElementById("totalAgendamentos").textContent = agendamentos.length;
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}

/* CLIENTES */

async function carregarClientes() {
  try {
    const clientes = await request("/clientes");
    const tabela = document.getElementById("clientesTabela");

    tabela.innerHTML = "";

    if (clientes.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4">Nenhum cliente cadastrado.</td>
        </tr>
      `;
      return;
    }

    clientes.forEach((cliente) => {
      tabela.innerHTML += `
        <tr>
          <td>${cliente.nome}</td>
          <td>${cliente.telefone}</td>
          <td>${cliente.email || "-"}</td>
          <td>
            <button class="btn-danger" onclick="excluirCliente('${cliente.id}')">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
}

document.getElementById("clienteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("clienteNome").value;
  const telefone = document.getElementById("clienteTelefone").value;
  const email = document.getElementById("clienteEmail").value;

  try {
    await request("/clientes", {
      method: "POST",
      body: JSON.stringify({
        nome,
        telefone,
        email,
      }),
    });

    e.target.reset();
    carregarClientes();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    alert("Erro ao cadastrar cliente.");
  }
});

async function excluirCliente(id) {
  const confirmar = confirm("Deseja excluir este cliente?");

  if (!confirmar) return;

  try {
    await request(`/clientes/${id}`, {
      method: "DELETE",
    });

    carregarClientes();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    alert("Erro ao excluir cliente.");
  }
}

/* SERVIÇOS */

async function carregarServicos() {
  try {
    const servicos = await request("/servicos");
    const tabela = document.getElementById("servicosTabela");

    tabela.innerHTML = "";

    if (servicos.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4">Nenhum serviço cadastrado.</td>
        </tr>
      `;
      return;
    }

    servicos.forEach((servico) => {
      tabela.innerHTML += `
        <tr>
          <td>${servico.nome}</td>
          <td>R$ ${Number(servico.preco).toFixed(2)}</td>
          <td>${servico.duracao} min</td>
          <td>
            <button class="btn-danger" onclick="excluirServico('${servico.id}')">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  }
}

document.getElementById("servicoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("servicoNome").value;
  const preco = document.getElementById("servicoPreco").value;
  const duracao = document.getElementById("servicoDuracao").value;

  try {
    await request("/servicos", {
      method: "POST",
      body: JSON.stringify({
        nome,
        preco: Number(preco),
        duracao: Number(duracao),
      }),
    });

    e.target.reset();
    carregarServicos();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao cadastrar serviço:", error);
    alert("Erro ao cadastrar serviço.");
  }
});

async function excluirServico(id) {
  const confirmar = confirm("Deseja excluir este serviço?");

  if (!confirmar) return;

  try {
    await request(`/servicos/${id}`, {
      method: "DELETE",
    });

    carregarServicos();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    alert("Erro ao excluir serviço.");
  }
}

/* BARBEIROS */

async function carregarBarbeiros() {
  try {
    const barbeiros = await request("/barbeiros");
    const tabela = document.getElementById("barbeirosTabela");

    tabela.innerHTML = "";

    if (barbeiros.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4">Nenhum barbeiro cadastrado.</td>
        </tr>
      `;
      return;
    }

    barbeiros.forEach((barbeiro) => {
      tabela.innerHTML += `
        <tr>
          <td>${barbeiro.nome}</td>
          <td>${barbeiro.telefone}</td>
          <td>${barbeiro.especialidade || "-"}</td>
          <td>
            <button class="btn-danger" onclick="excluirBarbeiro('${barbeiro.id}')">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar barbeiros:", error);
  }
}

document.getElementById("barbeiroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("barbeiroNome").value;
  const telefone = document.getElementById("barbeiroTelefone").value;
  const especialidade = document.getElementById("barbeiroEspecialidade").value;

  try {
    await request("/barbeiros", {
      method: "POST",
      body: JSON.stringify({
        nome,
        telefone,
        especialidade,
      }),
    });

    e.target.reset();
    carregarBarbeiros();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao cadastrar barbeiro:", error);
    alert("Erro ao cadastrar barbeiro.");
  }
});

async function excluirBarbeiro(id) {
  const confirmar = confirm("Deseja excluir este barbeiro?");

  if (!confirmar) return;

  try {
    await request(`/barbeiros/${id}`, {
      method: "DELETE",
    });

    carregarBarbeiros();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao excluir barbeiro:", error);
    alert("Erro ao excluir barbeiro.");
  }
}

/* AGENDAMENTOS */

async function carregarAgendamentos() {
  try {
    const clientes = await request("/clientes");
    const barbeiros = await request("/barbeiros");
    const servicos = await request("/servicos");
    const agendamentos = await request("/agendamentos");

    preencherSelect("agendamentoCliente", clientes, "nome");
    preencherSelect("agendamentoBarbeiro", barbeiros, "nome");
    preencherSelect("agendamentoServico", servicos, "nome");

    const tabela = document.getElementById("agendamentosTabela");
    tabela.innerHTML = "";

    if (agendamentos.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="6">Nenhum agendamento cadastrado.</td>
        </tr>
      `;
      return;
    }

    agendamentos.forEach((agendamento) => {
      tabela.innerHTML += `
        <tr>
          <td>${agendamento.cliente?.nome || agendamento.clienteNome || agendamento.clienteId}</td>
          <td>${agendamento.barbeiro?.nome || agendamento.barbeiroNome || agendamento.barbeiroId}</td>
          <td>${agendamento.servico?.nome || agendamento.servicoNome || agendamento.servicoId}</td>
          <td>${agendamento.data}</td>
          <td>${agendamento.hora}</td>
          <td>
            <button class="btn-danger" onclick="excluirAgendamento('${agendamento.id}')">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
  }
}

function preencherSelect(selectId, dados, campoTexto) {
  const select = document.getElementById(selectId);
  const primeiraOpcao = select.querySelector("option").outerHTML;

  select.innerHTML = primeiraOpcao;

  dados.forEach((item) => {
    select.innerHTML += `
      <option value="${item.id}">
        ${item[campoTexto]}
      </option>
    `;
  });
}

document.getElementById("agendamentoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const clienteId = document.getElementById("agendamentoCliente").value;
  const barbeiroId = document.getElementById("agendamentoBarbeiro").value;
  const servicoId = document.getElementById("agendamentoServico").value;
  const data = document.getElementById("agendamentoData").value;
  const hora = document.getElementById("agendamentoHora").value;

  try {
    await request("/agendamentos", {
      method: "POST",
      body: JSON.stringify({
        clienteId,
        barbeiroId,
        servicoId,
        data,
        hora,
      }),
    });

    e.target.reset();
    carregarAgendamentos();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao cadastrar agendamento:", error);
    alert("Erro ao cadastrar agendamento.");
  }
});

async function excluirAgendamento(id) {
  const confirmar = confirm("Deseja excluir este agendamento?");

  if (!confirmar) return;

  try {
    await request(`/agendamentos/${id}`, {
      method: "DELETE",
    });

    carregarAgendamentos();
    carregarDashboard();
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    alert("Erro ao excluir agendamento.");
  }
}
