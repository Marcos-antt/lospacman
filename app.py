from flask import Flask, render_template, request, jsonify, send_from_directory
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid

app = Flask(__name__, static_folder="static", template_folder="templates")

PASSWORD = "851216"
 
def send_email(to_email, order_number, name, fighter, amount):
    sender_email = "gurpsbrasil41@gmail.com"  
    sender_password = "imyt lyjd rkma awls"  
    subject = "Comprovante de Aposta - LosPacmans"

    body = f"""
    Olá {name},

    Obrigado por sua aposta no LosPacmans!
    Aqui está o comprovante da sua aposta:

    - Número do Pedido: {order_number}
    - Lutador Escolhido: {fighter}
    - Valor Apostado: R$ {amount:.2f}

    Boa sorte!

    Equipe LosPacmans
    """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, msg.as_string())
        print(f"Email enviado para {to_email}")
    except Exception as e:
        print(f"Erro ao enviar o email: {e}")

# Banco de dados
def init_db():
    conn = sqlite3.connect('banco.sqlite')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            fighter TEXT NOT NULL,
            amount REAL NOT NULL,
            order_number TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route("/")
def serve_frontend():
    return render_template("index.html")

@app.route("/bet", methods=["POST"])
def place_bet():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    fighter = data.get("fighter")
    amount = float(data.get("amount"))

    if not name or not email or not fighter or not amount:
        return jsonify({"message": "Todos os campos são obrigatórios!"}), 400

    order_number = str(uuid.uuid4())[:8]

    try:
        conn = sqlite3.connect("banco.sqlite")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO bets (name, email, fighter, amount, order_number) VALUES (?, ?, ?, ?, ?)",
            (name, email, fighter, amount, order_number)
        )
        conn.commit()
        conn.close()

        send_email(email, order_number, name, fighter, amount)

        return jsonify({"message": "Aposta registrada com sucesso! Comprovante enviado por email.", "order_number": order_number})
    except sqlite3.IntegrityError:
        return jsonify({"message": "Este e-mail já foi usado para uma aposta."}), 400
    except Exception as e:
        return jsonify({"message": f"Erro ao registrar a aposta: {str(e)}"}), 500

@app.route("/dashboard")
def dashboard():
    password = request.args.get("password")
    if password != PASSWORD:
        return "<h1>Acesso negado. Senha incorreta.</h1>", 403

    conn = sqlite3.connect("banco.sqlite")
    cursor = conn.cursor()

    # Buscar todas as apostas detalhadas
    cursor.execute("SELECT name, email, fighter, amount, order_number FROM bets")
    results = cursor.fetchall()
    cursor.execute("SELECT fighter, SUM(amount) as total FROM bets GROUP BY fighter")
    total_by_fighter = cursor.fetchall()
    cursor.execute("SELECT SUM(amount) FROM bets")
    total_all = cursor.fetchone()[0] or 0
    odds = []
    for row in total_by_fighter:
        fighter = row[0]
        total_for_fighter = row[1]
        odds_value = total_all / total_for_fighter if total_for_fighter > 0 else 0
        odds.append((fighter, total_for_fighter, odds_value))

    conn.close()

    return render_template("dashboard.html", results=results, total_by_fighter=total_by_fighter, odds=odds)




@app.route("/delete_bet", methods=["POST"])
def delete_bet():
    data = request.json
    order_number = data.get("order_number")

    if not order_number:
        return jsonify({"message": "Número do pedido é obrigatório!"}), 400

    try:
        conn = sqlite3.connect('banco.sqlite')
        cursor = conn.cursor()
        cursor.execute("DELETE FROM bets WHERE order_number = ?", (order_number,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Aposta apagada com sucesso!"}), 200
    except Exception as e:
        return jsonify({"message": f"Erro ao apagar a aposta: {str(e)}"}), 500


@app.route("/<fighter>")
def fighter_metrics(fighter):
    valid_fighters = ["Marcos", "Tristan"]
    if fighter not in valid_fighters:
        return "<h1>Lutador não encontrado.</h1>", 404

    conn = sqlite3.connect("banco.sqlite")
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(amount) FROM bets WHERE fighter = ?", (fighter,))
    total_for_fighter = cursor.fetchone()[0] or 0

    cursor.execute("SELECT SUM(amount) FROM bets")
    total_all = cursor.fetchone()[0] or 0

    conn.close()

    odds = total_all / total_for_fighter if total_for_fighter > 0 else 0

    return render_template(
        "fighter.html",
        fighter=fighter,
        total_for_fighter=total_for_fighter,
        total_all=total_all,
        odds=odds
    )



def init_db():
    conn = sqlite3.connect('banco.sqlite')
    cursor = conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL;")
    conn.commit()
    conn.close()
    
if __name__ == "__main__":
    init_db()
    app.run(debug=True)