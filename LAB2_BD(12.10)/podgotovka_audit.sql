SELECT name, recovery_model_desc
FROM sys.databases
WHERE name = 'SchoolDBb';

ALTER DATABASE SchoolDBb SET RECOVERY FULL;