# Histórias do Usuário

| # | Como... | Eu quero... | Para... | Critérios de aceite |
|---|---------|-------------|---------|---------------------|
| US01 | visitante | me cadastrar e fazer login com usuário e senha | acessar o sistema | Sistema bloqueia acesso sem login (401); senha armazenada com BCrypt |
| US02 | cliente | cadastrar meus dados (RG, CPF, nome, endereço, profissão, até 3 rendimentos) | poder solicitar aluguéis | CPF único; máximo 3 rendimentos |
| US03 | cliente | consultar, editar e excluir meu cadastro | manter meus dados atualizados | Exclusão bloqueada se houver pedidos |
| US04 | cliente | criar um pedido de aluguel escolhendo automóvel e período | alugar um carro | Pedido nasce com status PENDENTE; data final ≥ inicial |
| US05 | cliente | consultar o status dos meus pedidos | acompanhar a análise | Lista mostra status e parecer |
| US06 | cliente | modificar um pedido pendente | corrigir datas/automóvel | Só permitido em PENDENTE |
| US07 | cliente | cancelar um pedido | desistir do aluguel | Permitido em PENDENTE/APROVADO |
| US08 | agente | avaliar pedidos financeiramente (aprovar/reprovar com parecer) | decidir sobre o contrato | Só pedidos PENDENTES |
| US09 | agente (banco) | registrar um crédito associado ao pedido aprovado | financiar o aluguel | Valor de crédito guardado em ContratoCredito |
| US10 | agente | executar o contrato de pedidos aprovados | formalizar o aluguel | Status → CONTRATADO |
| US11 | usuário | cadastrar e consultar automóveis (matrícula, ano, marca, modelo, placa) | disponibilizar veículos | Placa e matrícula únicas; proprietário: cliente/empresa/banco |
