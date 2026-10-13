CREATE DATABASE SchoolDBb

ON PRIMARY (

    NAME = 'ychenik_0',
    FILENAME = 'C:\SchoolDB\DATA\SERVER1\ychenik_0.mdf',
    SIZE = 8MB,
    MAXSIZE = 30MB,
    FILEGROWTH = 5MB
),
FILEGROUP main (
    NAME = 'classi_1',
    FILENAME = 'C:\SchoolDB\DATA\SERVER1\classi_1.ndf',
    SIZE = 5MB,
    MAXSIZE = 15MB,
    FILEGROWTH = 2MB
),
(
    NAME = 'ychitelya_2',
    FILENAME = 'C:\SchoolDB\DATA\SERVER1\ychitelya_2.ndf',
    SIZE = 5MB,
    MAXSIZE = 15MB,
    FILEGROWTH = 2MB
),
FILEGROUP FG_Grades (
    NAME = 'zapis_v_dnev_Grades1',
    FILENAME = 'C:\SchoolDB\DATA\FG_Grades\zapis_v_dnev_Grades1.ndf',
    SIZE = 6MB,
    MAXSIZE = 20MB,
    FILEGROWTH = 3MB
),
(
    NAME = 'raspisanie_Grades2',
    FILENAME = 'C:\SchoolDB\DATA\FG_Grades\raspisanie_Grades2.ndf',
    SIZE = 6MB,
    MAXSIZE = 20MB,
    FILEGROWTH = 3MB
),

FILEGROUP FG_Audit (
    NAME = 'AUDIT',
    FILENAME = 'C:\SchoolDB\DATA\FG_Audit\AUDIT.ndf',
    SIZE = 5MB,
    MAXSIZE = 15MB,
    FILEGROWTH = 2MB
)


LOG ON (
    NAME = 'SchoolDB_Log',
    FILENAME = 'C:\SchoolDB\DATA\FG_Grades\SchoolDB_Log.ldf',
    SIZE = 8MB,
    MAXSIZE = 50MB,
    FILEGROWTH = 2MB
);
GO