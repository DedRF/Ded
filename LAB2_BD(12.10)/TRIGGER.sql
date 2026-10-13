DROP TRIGGER trg_zapis_v_dnev_Grades1_Audit


CREATE TRIGGER trg_zapis_v_dnev_Grades1_Audit
ON dbo.zapis_v_dnev_Grades1
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- INSERT logged
    INSERT INTO dbo.Audit (TableName, OperationType, RecordID, NewValue, UserName)
    SELECT 'zapis_v_dnev_Grades1', 'INSERT', RecordID, CAST(Grade AS NVARCHAR(MAX)), SYSTEM_USER
    FROM inserted
    WHERE NOT EXISTS (SELECT 1 FROM deleted WHERE deleted.RecordID = inserted.RecordID);

    -- UPDATE logged
    INSERT INTO dbo.Audit (TableName, OperationType, RecordID, OldValue, NewValue, UserName)
    SELECT 'zapis_v_dnev_Grades1', 'UPDATE', i.RecordID,
           CAST(d.Grade AS NVARCHAR(MAX)),
           CAST(i.Grade AS NVARCHAR(MAX)),
           SYSTEM_USER
    FROM inserted i
    JOIN deleted d ON i.RecordID = d.RecordID;
END;