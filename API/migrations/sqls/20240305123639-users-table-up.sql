create table Users(id serial primary key,
fullName varchar(100),
phone varchar(20),
email varchar(60)  unique ,
user_password varchar(100),
-- team text,
img_path text);


-- insert into Users(phone,email,img_path) values('dummy','dummy','dummy')


