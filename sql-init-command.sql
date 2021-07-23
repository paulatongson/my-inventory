IF OBJECT_ID(N'admin', N'U') IS NULL  
	BEGIN
    CREATE TABLE [Admin] (    
        AdminID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        UserName NVARCHAR(128) DEFAULT NULL,
        Password NVARCHAR(128) DEFAULT NULL
    )
    
    CREATE TABLE [Categories] (
        CategoryID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        CategoryName NVARCHAR(128) DEFAULT NULL
    )
    
    CREATE TABLE [Products] (
        ProductID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        CategoryID INT DEFAULT NULL,
        Name NVARCHAR(128) DEFAULT NULL,
        Description NVARCHAR(MAX),
        Price INT DEFAULT 0,
        Quantity INT DEFAULT 0,
        ImgName NVARCHAR(128) DEFAULT NULL
    )
    
    CREATE TABLE [Contacts] (
        ContactID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        ContactName NVARCHAR(128) DEFAULT NULL,
        MobileNumber NVARCHAR(128) DEFAULT NULL,
        EmailAdd NVARCHAR(128) DEFAULT NULL,
        Address NVARCHAR(128) DEFAULT NULL,
        Comments NVARCHAR(128) DEFAULT NULL
    )
    
    CREATE TABLE [Orders] (
        OrderID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        ContactID INT DEFAULT NULL,
        AddedDate datetime DEFAULT CURRENT_TIMESTAMP,
        ModifiedDate datetime DEFAULT CURRENT_TIMESTAMP, 
        TotalPrice INT DEFAULT 0 NOT NULL 
    )
    
    CREATE TABLE [OrderDetails] (
        OrderDetailID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        OrderID INT DEFAULT NULL,
        ProductName NVARCHAR(128) DEFAULT NULL,
        Price INT DEFAULT 0,
        Quantity INT DEFAULT 0
    )

    CREATE TABLE [ContactUs] (
        ID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(128) DEFAULT NULL,
        Subject NVARCHAR(128) DEFAULT NULL,
        MobileNumber NVARCHAR(128) DEFAULT NULL,
        EmailAdd NVARCHAR(128) DEFAULT NULL,
        Comments TEXT DEFAULT NULL
    )

    ALTER TABLE [Products]
		ADD FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)

    ALTER TABLE [Orders]
		ADD FOREIGN KEY (ContactID) REFERENCES Contacts(ContactID) 

    ALTER TABLE [OrderDetails]
		ADD FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) 


    --order trigger
    DECLARE @trg_ModifiedDate NVARCHAR(1000)

    SET @trg_ModifiedDate = '
      CREATE TRIGGER trg_UPDATE_OrderDetails_Orders_ModifiedDate
        ON [OrderDetails]
        AFTER UPDATE
        AS
        BEGIN
          SET NOCOUNT ON;
          UPDATE [Orders]
          SET [ModifiedDate] = CURRENT_TIMESTAMP
          WHERE [OrderID] IN (SELECT DISTINCT [OrderID] FROM inserted);
        END
		'
    
    EXEC(@trg_ModifiedDate)


    --Products Trigger
    DECLARE @trg_INSERT_Products_imgName NVARCHAR(1000)
    SET @trg_INSERT_Products_imgName = '
    CREATE TRIGGER trg_INSERT_Products_imgName 
      ON  [Products]
      AFTER INSERT
      AS 
      BEGIN
        SET NOCOUNT ON;
        UPDATE [Products]
        SET ImgName = CAST((SELECT [ProductID] FROM inserted) AS nvarchar(128)) +''.webp''
        WHERE ProductID = (SELECT [ProductID] FROM inserted)
      END
    '
    EXEC(@trg_INSERT_Products_imgName)

    DECLARE @trg_Orders_Customer_Delete NVARCHAR(1000)
    SET @trg_Orders_Customer_Delete = '
    CREATE TRIGGER trg_Orders_Customer_Delete
    ON  Orders 
    AFTER DELETE
    AS 
    BEGIN
      -- SET NOCOUNT ON added to prevent extra result sets from
      -- interfering with SELECT statements.
      SET NOCOUNT ON;
      DELETE Contacts
      WHERE ContactID = (SELECT ContactID FROM DELETED)
    END
    '
    EXEC(@trg_Orders_Customer_Delete)

    --populate categories with initial values
    INSERT INTO [Categories]([CategoryName])
      VALUES('Pens & Pencils'),('Markers'),('Drawing Pads'),('Coloring'),('Brushes'),('Others'),('Artworks')

    --insert default admin
    INSERT INTO [Admin]([UserName],[Password])VALUES('Admin','pw')
	END
