USE SchoolDBb;
GO

-- ”бираем DENY INSERT, если он был (в вашем коде его нет, но на вс€кий случай)
REVOKE INSERT ON dbo.Audit TO TeacherRole;
REVOKE INSERT ON dbo.Audit TO ParentRole;
REVOKE INSERT ON dbo.Audit TO ClassTeacherRole;

-- ƒаЄм INSERT на уровне таблицы
GRANT INSERT ON dbo.Audit TO TeacherRole;
GRANT INSERT ON dbo.Audit TO ParentRole;
GRANT INSERT ON dbo.Audit TO ClassTeacherRole;

-- SELECT, UPDATE, DELETE запрещаем (DENY всегда сильнее GRANT)
DENY SELECT, UPDATE, DELETE ON dbo.Audit TO TeacherRole;
DENY SELECT, UPDATE, DELETE ON dbo.Audit TO ParentRole;
DENY SELECT, UPDATE, DELETE ON dbo.Audit TO ClassTeacherRole;

-- Admin: только чтение
DENY INSERT, UPDATE, DELETE ON dbo.Audit TO AdminRole;
GRANT SELECT ON dbo.Audit TO AdminRole;
GO