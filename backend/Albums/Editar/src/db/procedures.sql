DELIMITER $$
CREATE PROCEDURE editarAlbum(
    IN id INT,
    IN nombre VARCHAR(45),
    IN nocanciones INT,
    IN linkimg VARCHAR(200)
)
BEGIN
    UPDATE ALBUM SET
        nombre = nombre,
        cant_canciones = nocanciones
    WHERE
        idALBUM = id;

    IF linkimg <> '' THEN
        UPDATE ALBUM SET
            imglink = linkimg
        WHERE
        idALBUM = id;
    END IF;
END $$
DELIMITER ;

--proc para eliminar referencia de album en cancion
DELIMITER $$
CREATE PROCEDURE eliminarReferenciaAlbum(
    IN idcanc INT
)
BEGIN
    SET FOREIGN_KEY_CHECKS = 0;

    UPDATE CANCION SET
        ALBUM_idALBUM = NULL
    WHERE
        idCANCION = idcanc;

    SET FOREIGN_KEY_CHECKS = 1;
END $$
DELIMITER ;

-- proc para agregar referencia de album en cancion
DELIMITER $$
CREATE PROCEDURE agregarReferenciaAlbum(
    IN idcanc INT,
    IN idalb INT
)
BEGIN
    SET FOREIGN_KEY_CHECKS = 0;

    UPDATE CANCION SET
        ALBUM_idALBUM = idalb
    WHERE
        idCANCION = idcanc;

    SET FOREIGN_KEY_CHECKS = 1;
END $$
DELIMITER ;



DELIMITER $$
CREATE TRIGGER asociarCancion AFTER UPDATE ON CANCION
FOR EACH ROW
BEGIN
    IF NEW.ALBUM_idALBUM IS NOT NULL AND OLD.ALBUM_idALBUM IS NULL THEN
        UPDATE ALBUM
        SET cant_canciones = cant_canciones + 1
        WHERE idALBUM = NEW.ALBUM_idALBUM;
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER decremento AFTER UPDATE ON CANCION
FOR EACH ROW
BEGIN
    IF NEW.ALBUM_idALBUM IS NULL AND OLD.ALBUM_idALBUM IS NOT NULL THEN
        UPDATE ALBUM
        SET cant_canciones = cant_canciones - 1
        WHERE idALBUM = OLD.ALBUM_idALBUM;
    END IF;
END $$
DELIMITER ;
