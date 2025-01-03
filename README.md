LosPacmans - Plataforma de Apostas Interativas 🥊
LosPacmans é uma plataforma web interativa desenvolvida para gerenciamento de apostas em competições fictícias de lutadores. O projeto implementa funcionalidades completas para registro de apostas, cálculo dinâmico de odds, e visualização de métricas detalhadas para cada lutador.

Funcionalidades principais
Registro de apostas: Os usuários podem cadastrar suas apostas com nome, e-mail, lutador escolhido e valor apostado.
Cálculo dinâmico de odds: As odds são ajustadas dinamicamente com base no total apostado e no histórico de vitórias dos lutadores.
Retorno personalizado por aposta: Cada apostador pode visualizar o retorno potencial de sua aposta caso seu lutador vença.
Painel administrativo: Acesso protegido por senha para visualizar e gerenciar todas as apostas.
Envio de comprovantes: Envio automático de e-mails com o comprovante de aposta para cada usuário.
Banco de dados SQLite: Persistência de dados com tabelas para lutadores e apostas.
Tecnologias utilizadas
Backend: Flask
Frontend: HTML, CSS e Jinja2
Banco de dados: SQLite
Outros recursos: Envio de e-mails com SMTP, deploy na Railway
Deploy
A aplicação está online e disponível em: LosPacmans - Railway


Como executar localmente
Clone o repositório:

bash
Copiar código
git clone https://github.com/seu-usuario/lospacmans.git
cd lospacmans
Crie um ambiente virtual e instale as dependências:

bash
Copiar código
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
Inicie o banco de dados:

bash
Copiar código
python app.py
Execute o servidor:

bash
Copiar código
flask run
Acesse a aplicação localmente em http://localhost:5000.

Contribuições
Contribuições são bem-vindas! Fique à vontade para abrir issues ou enviar pull requests.
