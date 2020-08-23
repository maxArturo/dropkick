--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE links
(
    id             TEXT PRIMARY KEY,
    title          TEXT NOT NULL,
    source         TEXT NOT NULL,
    url            TEXT NOT NULL UNIQUE,
    comments_url   TEXT NOT NULL,
    comments_count INTEGER NOT NULL,
    created_at     DATE NOT NULL
);

CREATE TABLE link_text
(
    id             TEXT PRIMARY KEY,
    link_id        TEXT NOT NULL,
    link_text      TEXT NOT NULL,
    comments_count TEXT NOT NULL,
    created_at     DATE NOT NULL,
    FOREIGN KEY (link_id) REFERENCES links(id)
);


--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE link_text;
DROP TABLE links;

