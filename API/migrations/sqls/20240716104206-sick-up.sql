/* Replace with your SQL commands */
create table sick(
id bigint PRIMARY KEY NOT NULL ,
reading varchar(10) NOT NULL,
sick_call varchar(200) NOT NULL,

FOREIGN KEY(id) REFERENCES Users(id)

)

--  insert into Users(id,fullname,phone,email,user_password,img_path) values(1,'test','dummy','dummy','dummy','dummy')
-- company_system-# ;