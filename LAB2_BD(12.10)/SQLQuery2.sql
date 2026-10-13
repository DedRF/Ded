DROP TABLE raspisanie_Grades2;
GO
DROP TABLE zapis_v_dnev_Grades1;
GO
DROP TABLE ychenik_0;
GO
DROP TABLE classi_1;
GO
DROP TABLE ychitelya_2;
GO



USE SchoolDBb;
GO







CREATE TABLE classi_1 (
    ClassID INT PRIMARY KEY IDENTITY(1, 1),  
    ClassNumber VARCHAR(10)  CHECK (ClassNumber LIKE '1[0-1][A-B]' AND LEN(ClassNumber) = 3 OR ClassNumber LIKE '[1-9][A-B]' AND LEN(ClassNumber) = 2)  NOT NULL,  
    Capacity INT CHECK (Capacity <= 30 AND Capacity > 0) NOT NULL                    
) ON main;
GO

CREATE TABLE ychenik_0 (
    StudentID INT PRIMARY KEY IDENTITY(1, 1), 
    FullName VARCHAR(100) NOT NULL,           
    BirthDate DATETIME NOT NULL,              
    Gender CHAR(1) CHECK (Gender IN ('M', 'F')) NOT NULL,           --ISPRAVILI CHECK
    ClassID INT NOT NULL,                     
    FOREIGN KEY (ClassID) REFERENCES classi_1(ClassID)
);
GO

CREATE TABLE ychitelya_2 (
    TeacherID INT PRIMARY KEY IDENTITY(1, 1), 
    FullName VARCHAR(100) NOT NULL,           
    Gender CHAR(1) CHECK (Gender IN ('M', 'F')) NOT NULL,           --ISPRAVILI CHECK              
    Subject VARCHAR(100) NOT NULL             
) ON main;
GO

CREATE TABLE raspisanie_Grades2 (
    ScheduleID INT PRIMARY KEY IDENTITY(1, 1),
    ClassID INT NOT NULL,                      
    TeacherID INT NOT NULL,                    
    StartTime DATETIME NOT NULL,               
    FOREIGN KEY (ClassID) REFERENCES classi_1(ClassID),
    FOREIGN KEY (TeacherID) REFERENCES ychitelya_2(TeacherID)
) ON FG_Grades;
GO

CREATE TABLE zapis_v_dnev_Grades1 (
    RecordID INT PRIMARY KEY IDENTITY(1, 1),   
    Grade INT NOT NULL,                        
    StudentID INT NOT NULL,                    
    TeacherID INT NOT NULL,                    
    FOREIGN KEY (StudentID) REFERENCES ychenik_0(StudentID),
    FOREIGN KEY (TeacherID) REFERENCES ychitelya_2(TeacherID)
) ON FG_Grades;
GO


CREATE TABLE dbo.Audit (
    AuditID INT IDENTITY(1,1) PRIMARY KEY,
    TableName NVARCHAR(128) NOT NULL,
    OperationType CHAR(6) NOT NULL,     -- INSERT / UPDATE / DELETE
    RecordID INT NOT NULL,              -- PK of changed record
    OldValue NVARCHAR(MAX) NULL,
    NewValue NVARCHAR(MAX) NULL,
    UserName NVARCHAR(128) NOT NULL,
    EventTime DATETIME2 NOT NULL DEFAULT GETDATE()
) ON FG_Audit;