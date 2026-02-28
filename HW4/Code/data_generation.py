import pandas as pd
from sqlalchemy import create_engine
import numpy as np

# --- CONFIGURATION ---
DB_USER = "postgres"
DB_PASS = "postgres"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "hw4_db"
CSV_FILE = "EAFC26.csv"

def populate_db():
    print("Loading CSV...")
    try:
        df = pd.read_csv(CSV_FILE)
    except FileNotFoundError:
        print(f"Error: Could not find {CSV_FILE}")
        return

    # 1. Map CSV columns to 'players' table
    players_df = pd.DataFrame()
    players_df['player_id'] = df['ID']
    players_df['rank'] = df['Rank']
    players_df['name'] = df['Name']
    players_df['gender'] = df['GENDER']
    players_df['position'] = df['Position']
    players_df['weak_foot'] = df['Weak foot']
    players_df['skill_moves'] = df['Skill moves']
    players_df['preferred_foot'] = df['Preferred foot']
    players_df['height_raw'] = df['Height']
    players_df['weight_raw'] = df['Weight']
    players_df['age'] = df['Age']
    players_df['nation'] = df['Nation']
    players_df['league'] = df['League']
    players_df['team'] = df['Team']
    players_df['play_style'] = df['play style']
    players_df['profile_url'] = df['url']
    players_df['card_type'] = df['card']

    # 2. Map CSV columns to 'player_stats' table
    stats_df = pd.DataFrame()
    stats_df['player_id'] = df['ID']
    
    # Map stat columns 
    stat_mapping = {
        'ovr': 'OVR', 'pac': 'PAC', 'sho': 'SHO', 'pas': 'PAS', 
        'dri': 'DRI', 'def': 'DEF', 'phy': 'PHY',
        'acceleration': 'Acceleration', 'sprint_speed': 'Sprint Speed',
        'positioning': 'Positioning', 'finishing': 'Finishing',
        'shot_power': 'Shot Power', 'long_shots': 'Long Shots',
        'volleys': 'Volleys', 'penalties': 'Penalties',
        'vision': 'Vision', 'crossing': 'Crossing',
        'free_kick_accuracy': 'Free Kick Accuracy',
        'short_passing': 'Short Passing', 'long_passing': 'Long Passing',
        'curve': 'Curve', 'dribbling': 'Dribbling',
        'agility': 'Agility', 'balance': 'Balance',
        'reactions': 'Reactions', 'ball_control': 'Ball Control',
        'composure': 'Composure', 'interceptions': 'Interceptions',
        'heading_accuracy': 'Heading Accuracy', 'def_awareness': 'Def Awareness',
        'standing_tackle': 'Standing Tackle', 'sliding_tackle': 'Sliding Tackle',
        'jumping': 'Jumping', 'stamina': 'Stamina',
        'strength': 'Strength', 'aggression': 'Aggression',
        'gk_diving': 'GK Diving', 'gk_handling': 'GK Handling',
        'gk_kicking': 'GK Kicking', 'gk_positioning': 'GK Positioning',
        'gk_reflexes': 'GK Reflexes'
    }

    for sql_col, csv_col in stat_mapping.items():
        stats_df[sql_col] = pd.to_numeric(df[csv_col], errors='coerce').fillna(0).astype(int)

    # 3. Connection and Insert
    engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    
    print("Inserting Players...")
    players_df.to_sql('players', engine, if_exists='append', index=False, chunksize=1000)
    
    print("Inserting Stats...")
    stats_df.to_sql('player_stats', engine, if_exists='append', index=False, chunksize=1000)
    
    print("Success! Data populated.")

if __name__ == "__main__":
    populate_db()