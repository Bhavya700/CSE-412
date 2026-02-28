from flask import Flask, jsonify, request, render_template  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingModuleSource]
import psycopg2  # pyright: ignore[reportMissingModuleSource]
import time
from psycopg2.extras import RealDictCursor  # pyright: ignore[reportMissingModuleSource]

app = Flask(__name__)
# Enable CORS for all routes to allow frontend connections
CORS(app, resources={r"/*": {"origins": "*"}})

# Database configuration
DB_CONFIG = {
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432',
    'database': 'hw4_db'
}

def get_db_connection():
    """Create and return a database connection"""
    return psycopg2.connect(**DB_CONFIG)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

# Helper function to transform player data to frontend format
def transform_player(row):
    """Transform database row to frontend Player format"""
    return {
        'id': row.get('player_id', row.get('id')),
        'name': row.get('name', ''),
        'nation': row.get('nation', ''),
        'club': row.get('team', row.get('club', '')),
        'position': row.get('position', ''),
        'overall': row.get('ovr', row.get('overall', 0)),
        'pace': row.get('pac', row.get('pace', 0))
    }

# --- ROUTES ---

# 1. SEARCH SINGLE TABLE (Without Index)
@app.route('/api/no-index/search', methods=['GET'])
def api_no_index_search():
    search_name = request.args.get('name', '')
    if not search_name:
        return jsonify({'error': 'Missing "name" parameter'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # TASK REQUIREMENT: Disable Index to force slow scan
        cursor.execute("SET LOCAL enable_indexscan = OFF;")
        
        start_time = time.time()
        
        # Query matches assignment: Single table search
        query = """
            SELECT p.player_id, p.name, p.nation, p.team, p.position, ps.ovr, ps.pac 
            FROM players p 
            LEFT JOIN player_stats ps ON p.player_id = ps.player_id 
            WHERE p.name ILIKE %s 
            LIMIT 5;
        """
        cursor.execute(query, (f'%{search_name}%',))
        results = cursor.fetchall()
        
        duration = time.time() - start_time
        
        results_list = [transform_player(dict(row)) for row in results]
        
        return jsonify({
            'execution_time': round(duration, 6),
            'results': results_list,
            'count': len(results_list)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 2. SEARCH SINGLE TABLE (With Index)
@app.route('/api/with-index/search', methods=['GET'])
def api_with_index_search():
    search_name = request.args.get('name', '')
    if not search_name:
        return jsonify({'error': 'Missing "name" parameter'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Standard behavior (Postgres will use Index if available)
        start_time = time.time()
        
        query = """
            SELECT p.player_id, p.name, p.nation, p.team, p.position, ps.ovr, ps.pac 
            FROM players p 
            LEFT JOIN player_stats ps ON p.player_id = ps.player_id 
            WHERE p.name ILIKE %s 
            LIMIT 5;
        """
        cursor.execute(query, (f'%{search_name}%',))
        results = cursor.fetchall()
        
        duration = time.time() - start_time
        
        results_list = [transform_player(dict(row)) for row in results]
        
        return jsonify({
            'execution_time': round(duration, 6),
            'results': results_list,
            'count': len(results_list)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 3. SEARCH JOIN (Without Index)
@app.route('/api/no-index/join', methods=['GET'])
def api_no_index_join():
    nation = request.args.get('nation', '')
    position = request.args.get('position', '')
    
    if not nation or not position:
        return jsonify({'error': 'Missing parameters'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # TASK REQUIREMENT: Disable optimization to force slow JOIN
        cursor.execute("SET LOCAL enable_indexscan = OFF;")
        cursor.execute("SET LOCAL enable_hashjoin = OFF;")
        cursor.execute("SET LOCAL enable_mergejoin = OFF;") # Added for extra measure
        
        start_time = time.time()
        
        # Updated query to use POSITION instead of sprint_speed
        query = """
            SELECT p.player_id, p.name, p.nation, p.team, p.position, ps.ovr, ps.pac
            FROM players p
            JOIN player_stats ps ON p.player_id = ps.player_id
            WHERE p.nation = %s AND p.position = %s
            LIMIT 5;
        """
        cursor.execute(query, (nation, position))
        results = cursor.fetchall()
        
        duration = time.time() - start_time
        
        results_list = [transform_player(dict(row)) for row in results]
        
        return jsonify({
            'execution_time': round(duration, 6),
            'results': results_list,
            'count': len(results_list)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 4. SEARCH JOIN (With Index)
@app.route('/api/with-index/join', methods=['GET'])
def api_with_index_join():
    nation = request.args.get('nation', '')
    position = request.args.get('position', '')
    
    if not nation or not position:
        return jsonify({'error': 'Missing parameters'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Standard behavior
        start_time = time.time()
        
        query = """
            SELECT p.player_id, p.name, p.nation, p.team, p.position, ps.ovr, ps.pac
            FROM players p
            JOIN player_stats ps ON p.player_id = ps.player_id
            WHERE p.nation = %s AND p.position = %s
            LIMIT 5;
        """
        cursor.execute(query, (nation, position))
        results = cursor.fetchall()
        
        duration = time.time() - start_time
        
        results_list = [transform_player(dict(row)) for row in results]
        
        return jsonify({
            'execution_time': round(duration, 6),
            'results': results_list,
            'count': len(results_list)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)