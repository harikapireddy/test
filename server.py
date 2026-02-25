import http.server
import socketserver
import json
import sqlite3
import datetime
import urllib.parse

PORT = 3000
DB_FILE = 'rentals.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_info TEXT,
            employment_info TEXT,
            residential_history TEXT,
            credit_history TEXT,
            authorization TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

class RentalAppAPIHandler(http.server.BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/applications':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Extract sections (stored as JSON strings in the DB for flexibility)
                tenant_info = json.dumps(data.get('tenant_info', {}))
                employment_info = json.dumps(data.get('employment_info', {}))
                residential_history = json.dumps(data.get('residential_history', []))
                credit_history = json.dumps(data.get('credit_history', {}))
                authorization = json.dumps(data.get('authorization', {}))
                
                conn = sqlite3.connect(DB_FILE)
                c = conn.cursor()
                c.execute('''
                    INSERT INTO applications (tenant_info, employment_info, residential_history, credit_history, authorization)
                    VALUES (?, ?, ?, ?, ?)
                ''', (tenant_info, employment_info, residential_history, credit_history, authorization))
                conn.commit()
                conn.close()
                
                self.send_response(201)
                self.send_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'success', 'message': 'Application saved successfully.'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                print(f"Error processing request: {e}")
                self.send_response(500)
                self.send_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'error', 'message': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.send_cors_headers()
            self.end_headers()

if __name__ == '__main__':
    init_db()
    with socketserver.TCPServer(("", PORT), RentalAppAPIHandler) as httpd:
        print(f"Rental Application API Server running on port {PORT}")
        httpd.serve_forever()
