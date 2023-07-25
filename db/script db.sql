-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`USER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`USER` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  `nickname` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `nacimiento` DATE NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  `tipo_usuario` INT NOT NULL,
  `t_reproduccion` INT NULL DEFAULT NULL,
  `estado` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`ALBUM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ALBUM` (
  `idALBUM` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `fecha_creacion` DATE NOT NULL,
  `cant_canciones` INT NOT NULL,
  `imglink` VARCHAR(200) NULL DEFAULT NULL,
  `USER_id` INT NOT NULL,
  PRIMARY KEY (`idALBUM`),
  INDEX `fk_ALBUM_USER1_idx` (`USER_id` ASC) VISIBLE,
  CONSTRAINT `fk_ALBUM_USER1`
    FOREIGN KEY (`USER_id`)
    REFERENCES `mydb`.`USER` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 30
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`CANCION`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`CANCION` (
  `idCANCION` INT NOT NULL AUTO_INCREMENT,
  `nombre_cancion` VARCHAR(45) NOT NULL,
  `link` VARCHAR(200) NOT NULL,
  `extension` VARCHAR(45) NOT NULL,
  `fecha` DATETIME NOT NULL,
  `no_reproducciones` INT NULL DEFAULT NULL,
  `ALBUM_idALBUM` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idCANCION`),
  INDEX `fk_CANCION_ALBUM1_idx` (`ALBUM_idALBUM` ASC) VISIBLE,
  CONSTRAINT `fk_CANCION_ALBUM1`
    FOREIGN KEY (`ALBUM_idALBUM`)
    REFERENCES `mydb`.`ALBUM` (`idALBUM`))
ENGINE = InnoDB
AUTO_INCREMENT = 25
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`Logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `metodo` VARCHAR(45) NOT NULL,
  `entrada` VARCHAR(45) NOT NULL,
  `salida` VARCHAR(45) NOT NULL,
  `esError` VARCHAR(2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`SEGUIDOS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`SEGUIDOS` (
  `idSEGUIDOS` INT NOT NULL AUTO_INCREMENT,
  `USER_seguidor` INT NOT NULL,
  `USER_seguido` INT NOT NULL,
  PRIMARY KEY (`idSEGUIDOS`),
  INDEX `fk_SEGUIDOS_USER1_idx` (`USER_seguidor` ASC) VISIBLE,
  INDEX `fk_SEGUIDOS_USER2_idx` (`USER_seguido` ASC) VISIBLE,
  CONSTRAINT `fk_SEGUIDOS_USER1`
    FOREIGN KEY (`USER_seguidor`)
    REFERENCES `mydb`.`USER` (`id`),
  CONSTRAINT `fk_SEGUIDOS_USER2`
    FOREIGN KEY (`USER_seguido`)
    REFERENCES `mydb`.`USER` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;

USE `mydb` ;

-- -----------------------------------------------------
-- procedure Cancion
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
CREATE DEFINER=`root`@`%` PROCEDURE `Cancion`(usuario INT, albm INT, can INT)
BEGIN
        IF (SELECT 1 = 1 FROM USER WHERE id = usuario) THEN
            BEGIN
                IF (SELECT 1 = 1 FROM ALBUM WHERE albm = idALBUM) THEN
                    BEGIN
                        IF (SELECT 1 = 1 FROM CANCION WHERE can = idCANCION) THEN
                            BEGIN
                                IF (SELECT 1 = 1 FROM ALBUM INNER JOIN USER on ALBUM.USER_id = USER.id WHERE id = usuario and idALBUM = albm) THEN
                                    BEGIN
                                        IF (SELECT 1 = 1 FROM ALBUM INNER JOIN CANCION on idALBUM = ALBUM_idALBUM WHERE idCANCION = can and idALBUM = albm) THEN
                                            BEGIN
                                                SELECT idCANCION as id, nombre_cancion as nombre, link, fecha, no_reproducciones FROM USER INNER JOIN ALBUM on USER.id = ALBUM.USER_id INNER JOIN CANCION on CANCION.ALBUM_idALBUM = ALBUM.idALBUM WHERE id = usuario and idALBUM = albm and idCANCION = can;
                                            END;
                                        ELSE
                                            BEGIN
                                                SELECT CONCAT('El álbum ', albm, ' no posee la canción ', can) as error;
                                            END;
                                        END IF;
                                    END;
                                ELSE
                                    BEGIN
                                        SELECT CONCAT('El usuario ', usuario, ' no posee el álbum ',albm) as error;
                                    END;
                                END IF;
                            END;
                        ELSE
                            BEGIN
                                SELECT CONCAT('No se encontró la canción con ID = ',can) as error;
                            END;
                        END IF;
                    END;
                ELSE
                    BEGIN
                        SELECT CONCAT('No se encontró el álbum con ID = ',albm) as error;
                    END;
                END IF;
            END;
        ELSE
            BEGIN
                SELECT CONCAT('No se encontró el usuario con ID = ',usuario) as error;
            END;
        END IF;
    END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure Canciones_Album
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
CREATE DEFINER=`root`@`%` PROCEDURE `Canciones_Album`(usuario INT, albm INT)
BEGIN
        IF (SELECT 1 = 1 FROM USER WHERE id = usuario) THEN
            BEGIN
                IF (SELECT 1 = 1 FROM ALBUM WHERE albm = idALBUM) THEN
                    BEGIN
                        IF (SELECT 1 = 1 FROM ALBUM INNER JOIN USER on USER.id = ALBUM.USER_id WHERE id = usuario and idALBUM = albm) THEN
                            BEGIN
                                SELECT idCANCION as id, nombre_cancion as nombre, link, fecha, no_reproducciones FROM USER INNER JOIN ALBUM on USER.id = ALBUM.USER_id INNER JOIN CANCION on CANCION.ALBUM_idALBUM = ALBUM.idALBUM WHERE id = usuario and idALBUM = albm;
                            END;
                        ELSE
                            BEGIN
                                SELECT CONCAT('El usuario ', usuario, ' no posee el álbum ',albm) as error;
                            END;
                        END IF;
                    END;
                ELSE
                    BEGIN
                        SELECT CONCAT('No se encontró el álbum con ID = ',albm) as error;
                    END;
                END IF;
            END;
        ELSE
            BEGIN
                SELECT CONCAT('No se encontró el usuario con ID = ',usuario) as error;
            END;
        END IF;
    END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetUserWithFollowers
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
CREATE DEFINER=`root`@`%` PROCEDURE `GetUserWithFollowers`(IN userId INT)
BEGIN
  DECLARE followersCount INT;

  -- Obtener los datos del usuario
  SELECT *
  FROM USER
  WHERE id = userId;

  -- Obtener la cantidad de seguidores del usuario
  SELECT COUNT(*) INTO followersCount
  FROM SEGUIDOS
  WHERE USER_seguido = userId;

  -- Retornar los datos del usuario y la cantidad de seguidores
  SELECT *, followersCount AS totalFollowers
  FROM USER
  WHERE id = userId;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure crearAlbum
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
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
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure eliminarAlbum
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
CREATE DEFINER=`root`@`%` PROCEDURE `eliminarAlbum`(
    IN id INT
)
BEGIN
	SET FOREIGN_KEY_CHECKS = 0;
    DELETE FROM `mydb`.`ALBUM` WHERE (`idALBUM` = id);
    SET FOREIGN_KEY_CHECKS = 1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure eliminarReferenciasAlbum
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
CREATE DEFINER=`root`@`%` PROCEDURE `eliminarReferenciasAlbum`(
    IN idAlbum INT
)
procrelacionar: BEGIN
SET FOREIGN_KEY_CHECKS = 0;
UPDATE CANCION SET ALBUM_idALBUM = NULL WHERE ALBUM_idALBUM = idAlbum;
SET FOREIGN_KEY_CHECKS = 1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure listarAlbums
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
CREATE DEFINER=`root`@`%` PROCEDURE `listarAlbums`(
    IN idUser INT
)
proclistar: BEGIN

SELECT idALBUM, nombre, fecha_creacion, cant_canciones, imglink FROM ALBUM WHERE USER_id = idUser;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure relacionarCancionesAlbum
-- -----------------------------------------------------

DELIMITER $$
USE `mydb`$$
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
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
