USE master;
GO

ALTER DATABASE SchoolDB
SET OFFLINE WITH ROLLBACK IMMEDIATE;

EXEC sp_detach_db 
    @dbname = N'SchoolDBb';


	CREATE DATABASE SchoolDB 
				ON		(FILENAME = 'C:\SchoolDB\DATA\SERVER1\ychenik_0.mdf'),
		(FILENAME = 'C:\SchoolDB\DATA\FG_Grades\raspisanie_Grades2.ndf'),
				(FILENAME = 'C:\SchoolDB\DATA\FG_Grades\zapis_v_dnev_Grades1.ndf'),
						(FILENAME = 'C:\SchoolDB\DATA\SERVER1\classi_1.ndf'),		
						(FILENAME = 'C:\SchoolDB\DATA\SERVER1\ychitelya_2.ndf'),
			(FILENAME = 'C:\SchoolDB\DATA\FG_Grades\SchoolDB_Log.ldf')
		FOR ATTACH;




		ALTER DATABASE SchoolDB SET MULTI_USER;


		



