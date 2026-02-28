DROP TABLE IF EXISTS player_stats;
DROP TABLE IF EXISTS players;

CREATE TABLE players (
    player_id       INTEGER PRIMARY KEY,   
    rank            INTEGER,               
    name            TEXT NOT NULL,         
    gender          VARCHAR(10),           
    position        VARCHAR(10),           
    weak_foot       SMALLINT,              
    skill_moves     SMALLINT,              
    preferred_foot  VARCHAR(10),           
    height_raw      VARCHAR(50),           
    weight_raw      VARCHAR(50),           
    age             SMALLINT,              
    nation          VARCHAR(100),          
    league          VARCHAR(100),          
    team            VARCHAR(100),          
    play_style      TEXT,           
    profile_url     TEXT,                  
    card_type       TEXT            
);

CREATE TABLE player_stats (
    player_id       INTEGER PRIMARY KEY
                    REFERENCES players(player_id)
                    ON DELETE CASCADE,

    -- Overall outfield stats
    ovr             SMALLINT,  
    pac             SMALLINT,  
    sho             SMALLINT,  
    pas             SMALLINT,  
    dri             SMALLINT,  
    def             SMALLINT,  
    phy             SMALLINT,  

    -- Detailed attributes
    acceleration        SMALLINT,  
    sprint_speed        SMALLINT,  
    positioning         SMALLINT,  
    finishing           SMALLINT,  
    shot_power          SMALLINT,  
    long_shots          SMALLINT,  
    volleys             SMALLINT,  
    penalties           SMALLINT,  
    vision              SMALLINT,  
    crossing            SMALLINT,  
    free_kick_accuracy  SMALLINT,  
    short_passing       SMALLINT,  
    long_passing        SMALLINT,  
    curve               SMALLINT,  
    dribbling           SMALLINT,  
    agility             SMALLINT,  
    balance             SMALLINT,  
    reactions           SMALLINT,  
    ball_control        SMALLINT,  
    composure           SMALLINT,  
    interceptions       SMALLINT,  
    heading_accuracy    SMALLINT,  
    def_awareness       SMALLINT,  
    standing_tackle     SMALLINT,  
    sliding_tackle      SMALLINT,  
    jumping             SMALLINT,  
    stamina             SMALLINT,  
    strength            SMALLINT,  
    aggression          SMALLINT,  

    -- Goalkeeper stats
    gk_diving           SMALLINT,  
    gk_handling         SMALLINT,  
    gk_kicking          SMALLINT,  
    gk_positioning      SMALLINT,  
    gk_reflexes         SMALLINT  
);