-- Перевод базы в offline
ALTER DATABASE SchoolDB SET OFFLINE WITH ROLLBACK IMMEDIATE;

EXEC xp_cmdshell 'copy C:\SchoolDB destination C:\SCHOOLDB_1';

ALTER DATABASE SchoolDB SET ONLINE;
