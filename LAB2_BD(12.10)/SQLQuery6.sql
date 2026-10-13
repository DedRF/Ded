EXECUTE AS USER = 'AdminUser'
SELECT TeacherID FROM ychitelya_2;

SELECT * FROM ychenik_0;


USE SchoolDBb

EXECUTE AS USER = 'TeacherUser'
SELECT  Subject FROM ychitelya_2;

REVERT

UPDATE ychitelya_2
SET Subject = 'dota2'



USE master;
GO

ALTER DATABASE SchoolDBb
SET OFFLINE WITH ROLLBACK IMMEDIATE;

EXEC sp_detach_db 
    @dbname = N'SchoolDBb';