create database Dusk;
use Dusk;

create table usuario(
	id_user int(100) primary  key,
    tratamento VARCHAR(10) NOT NULL DEFAULT 'Sr',
	nome_user varchar(40),
    email_user varchar(100),
    senha_user varchar(100),
    data_nasc_user date not null,
    tel_user varchar(20)
);

select * from usuario;