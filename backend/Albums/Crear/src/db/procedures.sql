-- proc para crear nuevo album
delimiter $$
CREATE PROCEDURE crearAlbum(
    IN nom VARCHAR(45),
    IN fecha DATE,
    IN cant INT,
    IN linkimg VARCHAR(200),
    IN idUser INT
)
proccrear: BEGIN

DECLARE existe INT;
DECLARE idAlbum INT;

SELECT COUNT(*) INTO existe FROM ALBUM WHERE nombre = nom;
IF existe > 0 THEN
    SELECT 'El album ya existe' AS mensaje;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El album ya existe';
END IF;

INSERT INTO album(nombre, fecha_creacion, cant_canciones, imglink, USER_id) VALUES(nom, fecha, cant, linkimg, idUser);
-- si se inserto correctamente devolver el ultimo id ingresado
SELECT LAST_INSERT_ID() INTO idAlbum;
SELECT idAlbum AS idAlbum;

END $$
delimiter ;

CREATE PROCEDURE relacionarCancionesAlbum(
    IN idAlbum INT,
    IN idCancion INT
)
procrelacionar: BEGIN

DECLARE existe INT;

SELECT COUNT(*) INTO existe FROM CANCION WHERE idCANCION = idCancion AND ALBUM_idALBUM = idAlbum;
IF existe > 0 THEN
    SELECT 'La cancion ya existe en el album' AS mensaje;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cancion ya existe en el album';
END IF;

UPDATE CANCION SET ALBUM_idALBUM = idAlbum WHERE idCANCION = idCancion;

END $$
delimiter ;














CREATE DEFINER=`root`@`%` PROCEDURE `crearAlbum`(
    IN nom VARCHAR(45),
    IN fecha DATE,
    IN cant INT,
    IN linkimg VARCHAR(200),
    IN idUser INT
)
proccrear: BEGIN

DECLARE existe INT;
DECLARE idAlbum INT;

SELECT COUNT(*) INTO existe FROM ALBUM WHERE nombre = nom;
IF existe > 0 THEN
    SELECT 'El album ya existe' AS mensaje;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El album ya existe';
END IF;

INSERT INTO ALBUM(nombre, fecha_creacion, cant_canciones, imglink, USER_id) VALUES(nom, fecha, cant, linkimg, idUser);
SELECT LAST_INSERT_ID() INTO idAlbum;
SELECT idAlbum AS idAlbum;
END





CREATE DEFINER=`root`@`%` PROCEDURE `relacionarCancionesAlbum`(
    IN idAlbum INT,
    IN cancionesTexto TEXT
)
BEGIN
    -- Comprobar si las canciones ya existen en el álbum
    DECLARE cancionesExisten INT DEFAULT 0;
    SET @query = CONCAT('SELECT COUNT(*) INTO @cancionesExisten FROM CANCION WHERE idCANCION IN (', cancionesTexto, ') AND ALBUM_idALBUM = ', idAlbum);
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    IF @cancionesExisten > 0 THEN
        -- Al menos una canción ya existe en el álbum, lanzar una excepción
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Una o más canciones ya existen en el álbum';
    ELSE
        -- Actualizar el ID del álbum en las canciones existentes
        SET @query = CONCAT('UPDATE CANCION SET ALBUM_idALBUM = ', idAlbum, ' WHERE idCANCION IN (', cancionesTexto, ')');
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

        SELECT 'Las canciones han sido relacionadas con el álbum' AS mensaje;
    END IF;
END