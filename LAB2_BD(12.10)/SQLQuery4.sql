


USE SchoolDBb;
GO

DROP LOGIN TeacherUser
DROP ROLE TeacherRole;
DROP USER TeacherUser 

CREATE LOGIN AdminUser WITH PASSWORD = '111!';
CREATE USER AdminUser  FOR LOGIN AdminUser;
CREATE ROLE AdminRole;
GRANT SELECT, INSERT, UPDATE ON SCHEMA :: dbo TO AdminRole;
ALTER ROLE AdminRole ADD MEMBER AdminUser;
GO




CREATE LOGIN TeacherUser WITH PASSWORD = '222!';
CREATE ROLE TeacherRole;
CREATE USER TeacherUser  FOR LOGIN TeacherUser;
GRANT EXECUTE ON OBJECT::usp_TeacherInsertGrade TO TeacherUser;
GRANT SELECT TO TeacherUser;

GO




CREATE LOGIN ParentUser  WITH PASSWORD = '333!';
CREATE ROLE ParentRole;
CREATE USER ParentUser       FOR LOGIN ParentUser;
GRANT EXECUTE ON OBJECT::usp_ParentViewGrades TO ParentUser;
GRANT EXECUTE ON OBJECT::usp_ParentViewAttendance TO ParentUser;
GO



CREATE LOGIN ClassTeacherUser WITH PASSWORD = '444!';
CREATE ROLE ClassTeacherRole;
CREATE USER ClassTeacherUser FOR LOGIN ClassTeacherUser;
GRANT EXECUTE ON OBJECT::usp_ClassTeacherUpdateStudentClass TO ClassTeacherUser;
GRANT EXECUTE ON OBJECT::usp_ClassTeacherInsertRemark TO ClassTeacherUser;

GO