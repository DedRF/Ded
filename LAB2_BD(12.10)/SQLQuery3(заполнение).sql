USE SchoolDBb;
GO

INSERT INTO classi_1 (ClassNumber, Capacity) VALUES
('1A', 25),
('1B', 28),
('2A', 25),
('2B', 28),
('3A', 25),
('3B', 28),
('4A', 25),
('4B', 28),
('5A', 25),
('5B', 28),
('6A', 24),
('6B', 30),
('7A', 26),
('7B', 22),
('8A', 29),
('8B', 27),
('9A', 25),
('9B', 23);

GO

INSERT INTO ychenik_0 (FullName, BirthDate, Gender, ClassID) VALUES
('Ivan Ivanov',        '20130514', 'M', 1),
('Maria Petrova',      '20130822', 'F', 1),
('Dmitry Sidorov',     '20130130', 'M', 2),
('Anna Kuznetsova',    '20131105', 'F', 2),
('Sergey Smirnov',     '20120318', 'M', 3),
('Elena Morozova',     '20120709', 'F', 3),
('Andrey Volkov',      '20121225', 'M', 4),
('Olga Fedorova',      '20120411', 'F', 4),
('Nikolay Pavlov',     '20110602', 'M', 5),
('Tatiana Orlova',     '20110917', 'F', 5),
('Mikhail Smirnov',      '20190124', 'M', 1),
('Ekaterina Kuznetsova', '20190405', 'F', 1),
('Evgeny Smirnov',       '20191124', 'M', 1),
('Vera Lebedeva',        '20190219', 'F', 1),
('Oleg Kuznetsov',       '20190103', 'M', 1),
('Ivan Morozov',         '20180920', 'M', 2),
('Anna Lebedeva',        '20180423', 'F', 2),
('Mikhail Golubev',      '20180914', 'M', 2),
('Svetlana Zaitseva',    '20181009', 'F', 2),
('Stanislav Mikhailov',  '20170125', 'M', 3),
('Valentina Smirnova',   '20171214', 'F', 3),
('Kirill Pavlov',        '20170307', 'M', 3),
('Raisa Sidorova',       '20170203', 'F', 3),
('Denis Smirnov',        '20170628', 'M', 3),
('Igor Zaitsev',         '20160526', 'M', 4),
('Maria Tarasova',       '20160818', 'F', 4),
('Sergey Tarasov',       '20160703', 'M', 4),
('Varvara Orlova',       '20161120', 'F', 4),
('Yuri Mikhailov',       '20150619', 'M', 5),
('Irina Belova',         '20150202', 'F', 5),
('Konstantin Morozov',   '20150503', 'M', 5),
('Alla Kuznetsova',      '20150213', 'F', 5),
('Roman Lebedev',        '20151127', 'M', 5),
('Igor Petrov',          '20140612', 'M', 6),
('Irina Novikova',       '20140523', 'F', 6),
('Victor Semenov',       '20141103', 'M', 6),
('Alina Kozlova',        '20140318', 'F', 6),
('Evgeny Morozov',       '20130315', 'M', 7),
('Daria Pavlova',        '20131123', 'F', 7),
('Ilya Morozov',         '20131111', 'M', 7),
('Lyudmila Gusheva',     '20130108', 'F', 7),
('Egor Kuznetsov',       '20130613', 'M', 7),
('Roman Volkov',         '20120419', 'M', 8),
('Vera Belova',          '20120607', 'F', 8),
('Mikhail Kozlov',       '20120721', 'M', 8),
('Polina Volkova',       '20120505', 'F', 8),
('Pavel Vinogradov',     '20110918', 'M', 9),
('Ekaterina Tarasova',   '20111014', 'F', 9),
('Yuri Egorov',          '20110712', 'M', 9),
('Svetlana Volkova',     '20110916', 'F', 9),
('Maxim Bogdanov',       '20110128', 'M', 9),
('Sergey Ivanov',        '20101106', 'M', 1),
('Valentina Novikova',   '20100720', 'F', 8),
('Maxim Volkov',         '20100720', 'M', 6),
('Polina Bobyleva',      '20100518', 'F', 9),
('Vadim Popov',          '20091124', 'M', 3),
('Natalia Novikova',     '20090925', 'F', 2),
('Roman Bogdanov',       '20091111', 'M', 6),
('Natalia Orlova',       '20090706', 'F', 5),
('Nikita Popov',         '20091224', 'M', 4);
GO

INSERT INTO ychitelya_2 (FullName, Gender, Subject) VALUES
('Alexander Popov',     'M', 'Mathematics'),
('Irina Sokolova',      'F', 'Physics'),
('Vladimir Nikolaev',   'M', 'Chemistry and Biology'),
('Natalia Andreeva',    'F', 'History'),
('Oleg Borisov',        'M', 'English and Literature'),
('Svetlana Mikhailova', 'F', 'Geography'),
('Pavel Grigoriev',     'M', 'Computer Science'),
('Yulia Fedotova',      'F', 'Art'),
('Maxim Ulyanov',       'M', 'Music'),
('Kristina Yakovleva',  'F', 'Physical Education');
GO

INSERT INTO raspisanie_Grades2 (ClassID, TeacherID, StartTime) VALUES
(1, 1, '20240902 08:30:00'),
(1, 3, '20240902 09:25:00'),
(2, 2, '20240902 08:30:00'),
(2, 5, '20240902 09:25:00'),
(3, 4, '20240902 10:20:00'),
(3, 6, '20240902 11:15:00'),
(4, 7, '20240902 08:30:00'),
(4, 8, '20240902 09:25:00'),
(5, 9, '20240902 10:20:00'),
(5, 10, '20240902 11:15:00');
GO

INSERT INTO zapis_v_dnev_Grades1 (Grade, StudentID, TeacherID) VALUES
(5, 1, 1),
(4, 2, 3),
(5, 3, 2),
(3, 4, 5),
(4, 5, 4),
(5, 6, 6),
(2, 7, 7),
(5, 8, 8),
(4, 9, 9),
(5, 10, 10);
GO

SELECT * FROM ychenik_0;
SELECT * FROM ychitelya_2;