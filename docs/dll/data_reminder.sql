--
-- Dumping data for table `reminder`
--
LOCK TABLES `reminder` WRITE;

/*!40000 ALTER TABLE `reminder` DISABLE KEYS */
;

INSERT INTO
    `reminder`
VALUES
    (
        5,
        'http://localhost:3000/notification/',
        'Meeting ',
        1,
        1,
        '2020-12-31 17:00:00',
        'Play Game',
        'Play Game with friend',
        '/todo',
        '5;Nguyễn Thị Kim Thoa,2;Lê Tấn Nghĩa',
        15,
        1,
        '2020-12-02 00:00:00',
        'monthly',
        '25'
    ),
(
        6,
        'http://localhost:3000/notification/',
        'Meeting ',
        1,
        1,
        '2020-11-20 11:00:00',
        'Play Game',
        'Play Game with friend',
        '/todo',
        '5;Nguyễn Thị Kim Thoa,2;Lê Tấn Nghĩa',
        20,
        1,
        '2020-12-02 00:00:00',
        'monthly',
        '25'
    ),
(
        7,
        'http://localhost:3000/notification/',
        'Meeting',
        1,
        1,
        '2020-11-20 18:00:00',
        'Hello',
        'Play Game with friend',
        '/todo',
        '5;Nguyễn Thị Kim Thoa,2;Lê Tấn Nghĩa',
        30,
        1,
        '2020-12-02 00:00:00',
        'monthly',
        '25'
    ),
(
        8,
        'http://localhost:3000/notification/',
        'Meeting',
        1,
        1,
        '2020-11-30 00:00:00',
        'Meeting Project',
        'Project Schedule',
        '/todo',
        '1;Đặng Văn Hiền 1,2;Đặng Văn Hiền 2,3;Đặng Văn Hiền 5,4;Đặng Văn Hiền 6',
        60,
        1,
        '2020-12-02 00:00:00',
        'weekly',
        '3'
    ),
(
        9,
        'http://localhost:3000/notification/',
        'Meeting',
        1,
        1,
        '2020-11-30 00:00:00',
        'Meeting Project',
        'Project Schedule',
        '/todo',
        '1;Đặng Văn Hiền 1,2;Đặng Văn Hiền 2,3;Đặng Văn Hiền 5,4;Đặng Văn Hiền 6',
        60,
        1,
        '2020-12-02 00:00:00',
        'weekly',
        '3'
    ),
(
        10,
        'http://localhost:3000/notification/',
        'Meeting',
        1,
        1,
        '2020-11-07 13:00:00',
        'Meeting Project',
        'Project Schedule',
        '/todo',
        '1;Đặng Văn Hiền 1,2;Đặng Văn Hiền 2,3;Đặng Văn Hiền 5,4;Đặng Văn Hiền 6',
        60,
        1,
        '2021-12-02 00:00:00',
        'weekly',
        '3'
    ),
(
        11,
        'http://localhost:3000/notification/',
        'Meeting',
        1,
        1,
        '2020-11-07 13:00:00',
        'Meeting Project',
        'Project Schedule',
        '/todo',
        '1;Đặng Văn Hiền 1,2;Đặng Văn Hiền 2,3;Đặng Văn Hiền 5,4;Đặng Văn Hiền 6',
        60,
        1,
        '2021-12-02 00:00:00',
        'weekly',
        '3'
    ),
(
        12,
        'http://localhost:3000/todo/',
        'Meeting',
        1,
        1,
        '2020-11-30 00:00:00',
        'Meeting Project',
        'Project Schedule',
        '/todo',
        '1;Đặng Văn Hiền 1,2;Đặng Văn Hiền 2,3;Đặng Văn Hiền 5,4;Đặng Văn Hiền 6',
        60,
        1,
        '2020-12-02 00:00:00',
        'weekly',
        '3'
    );

/*!40000 ALTER TABLE `reminder` ENABLE KEYS */
;

UNLOCK TABLES;
