import sqlite3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from datetime import datetime
from fhir_standardization import patient_to_fhir
from anonymization import differential_privacy_advanced, k_anonymity_advanced
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

def connect_db():
    db_path = os.getenv('DATABASE_PATH', 'data_catalog.db')
    return sqlite3.connect(db_path)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def is_strong_password(password: str) -> bool:
    if not isinstance(password, str):
        return False
    if len(password) < 8:
        return False
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)
    common_weak = {"password", "Password123", "12345678", "qwerty123", "admin123", "welcome1"}
    if password in common_weak:
        return False
    return has_lower and has_upper and has_digit and has_special

def query_db(query, args=(), one=False):
    conn = connect_db()
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchone() if one else cur.fetchall()
    # basic QA: if a SELECT fails due to schema, raise for visibility
    conn.commit()
    conn.close()
    return rv

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("Signup data received:", data)
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'provider')  # default role provider
    if not username or not password:
        return jsonify({'error': 'Username and password required.'}), 400
    if not is_strong_password(password):
        return jsonify({'error': 'Password too weak. Use 8+ chars with upper, lower, number, special.'}), 400

    pw_hash = hash_password(password)
    try:
        query_db("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", (username, pw_hash, role))
        return jsonify({'status': 'User registered successfully.'})
    except sqlite3.IntegrityError as e:
        print("Signup error:", e)
        return jsonify({'error': 'Username already exists or invalid data.'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Login data received:", data)
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required.'}), 400

    pw_hash = hash_password(password)
    user = query_db("SELECT id, role FROM users WHERE username=? AND password_hash=?", (username, pw_hash), one=True)
    if user:
        return jsonify({'status': 'Login successful', 'user_id': user[0], 'role': user[1]})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/datasets', methods=['GET'])
def list_datasets():
    q = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()
    provider = request.args.get('provider', '').strip()
    sql = "SELECT id, title, description, provider, price, category, format, listing_date FROM datasets WHERE 1=1"
    params = []
    if q:
        sql += " AND (title LIKE ? OR description LIKE ? OR provider LIKE ?)"
        like = f"%{q}%"
        params.extend([like, like, like])
    if category:
        sql += " AND category LIKE ?"
        params.append(f"%{category}%")
    if provider:
        sql += " AND provider LIKE ?"
        params.append(f"%{provider}%")
    sql += " ORDER BY datetime(listing_date) DESC"
    rows = query_db(sql, params, one=False)
    datasets = [
        {
            'id': r[0],
            'title': r[1],
            'description': r[2],
            'provider': r[3],
            'price': r[4],
            'category': r[5],
            'format': r[6],
            'listing_date': r[7],
        }
        for r in rows
    ]
    return jsonify({'datasets': datasets})

@app.route('/upload', methods=['POST'])
def upload_dataset():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    provider = data.get('provider')
    price = data.get('price')
    category = data.get('category', '')
    fmt = data.get('format', 'FHIR')
    sample_records = data.get('sample_records')  # optional array of dicts
    if not title or not description or not provider or price is None:
        return jsonify({'error': 'title, description, provider, price are required'}), 400
    # Privacy layer (placeholders): apply k-anonymity and DP if sample provided
    if isinstance(sample_records, list) and sample_records:
        anon = k_anonymity_advanced(sample_records, k=3)
        dp = differential_privacy_advanced(anon, epsilon=1.0)
        # In real system, persist anonymized preview; here we ignore result
    query_db(
        "INSERT INTO datasets (title, description, provider, price, category, format) VALUES (?, ?, ?, ?, ?, ?)",
        (title, description, provider, float(price), category, fmt)
    )
    return jsonify({'status': 'dataset listed'})

# Consent endpoints (simplified)
@app.route('/consents', methods=['POST'])
def create_consent():
    data = request.get_json()
    user_id = data.get('user_id')
    dataset_id = data.get('dataset_id')
    status = data.get('status', 'granted')  # granted | revoked
    if not user_id or not dataset_id:
        return jsonify({'error': 'user_id and dataset_id required'}), 400
    query_db('''
        CREATE TABLE IF NOT EXISTS consents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            dataset_id INTEGER NOT NULL,
            status TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    query_db('INSERT INTO consents (user_id, dataset_id, status) VALUES (?, ?, ?)', (user_id, dataset_id, status))
    return jsonify({'status': 'consent recorded'})

@app.route('/consents/<int:user_id>', methods=['GET'])
def list_consents(user_id):
    rows = query_db('SELECT id, dataset_id, status, updated_at FROM consents WHERE user_id=? ORDER BY datetime(updated_at) DESC', (user_id,))
    consents = [
        {'id': r[0], 'dataset_id': r[1], 'status': r[2], 'updated_at': r[3]}
        for r in rows
    ]
    return jsonify({'consents': consents})

@app.route('/consents/<int:consent_id>', methods=['PATCH'])
def update_consent(consent_id):
    data = request.get_json()
    status = data.get('status')
    if status not in ('granted', 'revoked'):
        return jsonify({'error': 'status must be granted or revoked'}), 400
    query_db('UPDATE consents SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', (status, consent_id))
    return jsonify({'status': 'consent updated'})

# Revenue analytics (simplified placeholder)
@app.route('/analytics/revenue/<provider>', methods=['GET'])
def revenue_analytics(provider):
    rows = query_db('SELECT price FROM datasets WHERE provider=?', (provider,))
    total = sum(r[0] for r in rows)
    return jsonify({'provider': provider, 'total_revenue': total, 'currency': 'INR'})

@app.route('/analytics/by_category', methods=['GET'])
def analytics_by_category():
    rows = query_db('SELECT category, COUNT(*), SUM(price) FROM datasets GROUP BY category')
    breakdown = [
        { 'category': r[0] or 'Uncategorized', 'count': r[1], 'revenue': r[2] or 0 }
        for r in rows
    ]
    return jsonify({ 'breakdown': breakdown })

@app.route('/dashboard/<provider>', methods=['GET'])
def provider_dashboard(provider):
    count_row = query_db('SELECT COUNT(*) FROM datasets WHERE provider=?', (provider,), one=True)
    revenue_row = query_db('SELECT SUM(price) FROM datasets WHERE provider=?', (provider,), one=True)
    return jsonify({
        'provider': provider,
        'datasets_listed': count_row[0] if count_row else 0,
        'total_revenue': revenue_row[0] or 0,
        'compliance': 98  # placeholder KPI
    })

@app.route('/providers', methods=['GET'])
def list_providers():
    q = request.args.get('q', '').strip()
    sql = "SELECT id, name, type, location FROM providers WHERE 1=1"
    params = []
    if q:
        like = f"%{q}%"
        sql += " AND (name LIKE ? OR type LIKE ? OR location LIKE ?)"
        params.extend([like, like, like])
    sql += " ORDER BY name ASC"
    rows = query_db(sql, params)
    providers = [{ 'id': r[0], 'name': r[1], 'type': r[2], 'location': r[3] } for r in rows]
    return jsonify({ 'providers': providers })

@app.route('/standardize', methods=['POST'])
def standardize():
    data = request.get_json()
    # Example expects { patient_id, first_name, last_name, gender, birth_date }
    try:
        fhir = patient_to_fhir(data)
        return jsonify({ 'fhir': fhir })
    except Exception as e:
        return jsonify({ 'error': str(e) }), 400

if __name__ == "__main__":
    app.run(debug=True)
