IF DB_ID('Taskeem') IS NULL
BEGIN
    CREATE DATABASE Taskeem;
END
GO

USE Taskeem;
GO

DECLARE @UserId UNIQUEIDENTIFIER = '168ae654-c046-4435-b2aa-b2709124424b';

IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
BEGIN
    INSERT INTO Users (Id, FirstName, LastName, Email, PhoneNumber)
    VALUES (
        @UserId,
        'Demo',
        'User',
        'demo@company.com',
        '+972500000000'
    );

    INSERT INTO UserTasks (Id, Title, Description, DueDate, Priority, IdAssignee)
    VALUES
    (NEWID(), 'First task', 'Demo task 1', DATEADD(day, 2, GETUTCDATE()), 1, @UserId),
    (NEWID(), 'Second task', 'Demo task 2', DATEADD(day, 5, GETUTCDATE()), 2, @UserId);
END
