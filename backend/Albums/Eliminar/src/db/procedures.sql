CREATE DEFINER=`root`@`%` PROCEDURE `eliminarAlbums`(
    IN idAlbum INT
)
proclistar: BEGIN
DELETE FROM ALBUM WHERE idALBUM = idAlbum;
END


DELIMITER $$
CREATE PROCEDURE eliminarReferenciasAlbum(
    IN idAlbum INT
)
procrelacionar: BEGIN
UPDATE CANCION SET ALBUM_idALBUM = NULL WHERE ALBUM_idALBUM = idAlbum;
END $$
DELIMITER ;



