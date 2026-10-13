CREATE LOGIN SchoolAdmin WITH PASSWORD = 'P@ssword';
CREATE USER SchoolAdmin FOR LOGIN SchoolAdmin;
ALTER ROLE AdminRole ADD MEMBER SchoolAdmin;

EXECUTE AS LOGIN = 'SchoolAdmin';
UPDATE dbo.zapis_v_dnev_Grades1 SET Grade = '1' WHERE RecordID = 1;
REVERT;         -- Don't forget!!!!!!!

SELECT * FROM dbo.Audit WHERE UserName = 'SchoolAdmin';