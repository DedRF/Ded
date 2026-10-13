

USE SchoolDBb;
GO




CREATE VIEW v_TeacherSchedule
AS
SELECT r.ScheduleID, c.ClassNumber, t.FullName AS TeacherName, t.Subject, r.StartTime
FROM raspisanie_Grades2 r
JOIN classi_1 c ON r.ClassID = c.ClassID
JOIN ychitelya_2 t ON r.TeacherID = t.TeacherID;
GO





CREATE PROCEDURE usp_TeacherInsertGrade
    @TeacherID INT,
    @StudentID INT,
    @Grade INT
AS
BEGIN
    SET NOCOUNT ON;
    IF @Grade NOT BETWEEN 1 AND 5
        RAISERROR('������ ������ ���� �� 1 �� 5', 16, 1);
    ELSE
        INSERT INTO zapis_v_dnev_Grades1 (Grade, StudentID, TeacherID)
        VALUES (@Grade, @StudentID, @TeacherID);
END;
GO





CREATE PROCEDURE usp_TeacherUpdateGrade
    @RecordID INT,
    @TeacherID INT,
    @NewGrade INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM zapis_v_dnev_Grades1 WHERE RecordID = @RecordID AND TeacherID = @TeacherID)
        RAISERROR('����� ������������� ������ ���� ������', 16, 1);
    ELSE IF @NewGrade NOT BETWEEN 1 AND 5
        RAISERROR('������ ������ ���� �� 1 �� 5', 16, 1);
    ELSE
        UPDATE zapis_v_dnev_Grades1
        SET Grade = @NewGrade
        WHERE RecordID = @RecordID AND TeacherID = @TeacherID;
END;
GO




CREATE PROCEDURE usp_ParentViewGrades
    @StudentID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT g.Grade, s.FullName AS StudentName, t.FullName AS TeacherName, t.Subject
    FROM zapis_v_dnev_Grades1 g
    JOIN ychenik_0 s ON g.StudentID = s.StudentID
    JOIN ychitelya_2 t ON g.TeacherID = t.TeacherID
    WHERE g.StudentID = @StudentID;
END;
GO





CREATE PROCEDURE usp_ParentViewAttendance
    @StudentID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT r.StartTime, c.ClassNumber, t.FullName AS TeacherName, t.Subject
    FROM ychenik_0 s
    JOIN classi_1 c ON s.ClassID = c.ClassID
    JOIN raspisanie_Grades2 r ON c.ClassID = r.ClassID
    JOIN ychitelya_2 t ON r.TeacherID = t.TeacherID
    WHERE s.StudentID = @StudentID;
END;
GO




CREATE PROCEDURE usp_ClassTeacherUpdateStudentClass
    @StudentID INT,
    @NewClassID INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM classi_1 WHERE ClassID = @NewClassID)
        RAISERROR('����� �� ������', 16, 1);
    ELSE
        UPDATE ychenik_0
        SET ClassID = @NewClassID
        WHERE StudentID = @StudentID;
END;
GO




CREATE PROCEDURE usp_ClassTeacherInsertRemark
    @StudentID INT,
    @RemarkText VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM ychenik_0 WHERE StudentID = @StudentID)
        RAISERROR('������ �� ������', 16, 1);
    ELSE
        SELECT '��������� ��� ������� ID=' + CAST(@StudentID AS VARCHAR) + ': ' + @RemarkText AS RemarkLog;
END;
GO