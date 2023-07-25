ALTER TABLE USER
    ADD telefono  VARCHAR(12) NOT NULL DEFAULT '',
    ADD auth      BOOLEAN     NOT NULL DEFAULT 0,
    ADD tokenAuth VARCHAR(50) NOT NULL DEFAULT '',
    ADD lastToken TIMESTAMP    NULL,
    ADD tipoAuth  INT         NOT NULL DEFAULT 0;

-- telefono -> numero de telefono
-- auth -> tiene activa la autenticacion en dos pasos
-- tokenAut -> secreto del token del usuario usuario
-- lastToken -> tiempo donde fue enviado el ultimo token
-- tipoAuth -> tipo de autenticacion. 1 para correo y 2 para telefono