

-- procedure para listar albums de usuario

delimiter $$
CREATE PROCEDURE listarAlbums(
    IN idUser INT
)
proclistar: BEGIN

SELECT idALBUM, nombre, fecha_creacion, cant_canciones, imglink FROM ALBUM WHERE USER_id = idUser;

END $$
delimiter ;


-- procedure para listar canciones de album
delimiter $$
CREATE PROCEDURE getCanciones()
procget: BEGIN
SELECT idCANCION, nombre_cancion
FROM CANCION
WHERE ALBUM_idALBUM IS NULL;
END $$
delimiter ;
