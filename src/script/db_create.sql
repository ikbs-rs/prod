/*==============================================================*/
/* DBMS name:      PostgreSQL 8                                 */
/* Created on:     4/29/2023 5:08:03 PM                         */
/*==============================================================*/


/*==============================================================*/
/* Table: adm_action                                            */
/*==============================================================*/
create table adm_action (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(200)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null,
   constraint pk_adm_rolaakcija primary key (id)
);

comment on table adm_action is
'Veza izmedju rola, objekata doyvoljenih  i akcija';

/*==============================================================*/
/* Index: adm_action_ux1                                        */
/*==============================================================*/
create unique index adm_action_ux1 on adm_action (
code
);

/*==============================================================*/
/* Table: adm_blacklist_token                                   */
/*==============================================================*/
create table adm_blacklist_token (
   id                   numeric(20)          not null,
   token                varchar(2000)        not null,
   expiration           varchar(20)          not null,
   constraint pk_adm_blacklist_token primary key (id)
);

/*==============================================================*/
/* Table: adm_dbmserr                                           */
/*==============================================================*/
create table adm_dbmserr (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(500)         not null,
   text                 varchar(500)         not null,
   constraint pk_adm_dbmsgreska primary key (id)
);

comment on table adm_dbmserr is
'Ispis greški';

/*==============================================================*/
/* Table: adm_dbparameter                                       */
/*==============================================================*/
create table adm_dbparameter (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(100)         not null,
   text                 varchar(4000)        not null,
   comment              varchar(4000)        null,
   version              varchar(20)          not null,
   constraint pk_adm_dbparametar primary key (id)
);

comment on table adm_dbparameter is
'Parametri sistem,';

/*==============================================================*/
/* Table: adm_message                                           */
/*==============================================================*/
create table adm_message (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(20)          not null,
   text                 varchar(500)         not null,
   constraint pk_adm_poruka primary key (id)
);

comment on table adm_message is
'Poruke - aplikativnih procesa';

/*==============================================================*/
/* Table: adm_paruser                                           */
/*==============================================================*/
create table adm_paruser (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   par                  numeric(20)          not null,
   usr                  numeric(20)          not null,
   begda                varchar(10)          not null,
   endda                varchar(10)          not null,
   constraint pk_adm_paruser primary key (id)
);

comment on table adm_paruser is
'Partneri korisnika,
Ova tabela mora imati dodatnu programsku logiku';

/*==============================================================*/
/* Table: adm_roll                                              */
/*==============================================================*/
create table adm_roll (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(250)         not null,
   name                 varchar(500)         not null,
   strukturna           varchar(1)           not null default 'N' 
      constraint ckc_strukturna_adm_rola check (strukturna in ('N','D')),
   valid                numeric(1)           not null default 1 
      constraint ckc_adm_roll1 check (valid in (1,0)),
   constraint pk_adm_rola primary key (id)
);

comment on table adm_roll is
'Korisnicka rola, profil ..';

/*==============================================================*/
/* Index: adm_roll_ux1                                          */
/*==============================================================*/
create unique index adm_roll_ux1 on adm_roll (
code
);

/*==============================================================*/
/* Table: adm_rollact                                           */
/*==============================================================*/
create table adm_rollact (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   roll                 numeric(20)          not null,
   action               numeric(20)          not null,
   cre_action           numeric(1)           null,
   upd_action           numeric(1)           null,
   del_action           numeric(1)           null,
   exe_action           numeric(1)           null,
   all_action           numeric(1)           null,
   constraint pk_adm_rollact primary key (id)
);

/*==============================================================*/
/* Table: adm_rolllink                                          */
/*==============================================================*/
create table adm_rolllink (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   roll1                numeric(20)          not null,
   roll2                numeric(20)          not null,
   link                 varchar(100)         not null,
   constraint pk_adm_rolllink primary key (id)
);

comment on table adm_rolllink is
'Nasledjivanje rola - hijerarhija rola
Ne sme se dozvoliti ciklicna prava pristupas';

/*==============================================================*/
/* Table: adm_rollstr                                           */
/*==============================================================*/
create table adm_rollstr (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   roll                 numeric(20)          not null,
   onoff                numeric(1)           not null default 1 
      constraint ckc_iskljucuje_adm_strr check (onoff in (1,0)),
   hijerarhija          numeric(1)           not null default 0 
      constraint ckc_kumulativ_adm_strr check (hijerarhija in (0,1)),
   objtp                varchar(100)         not null,
   obj                  varchar(100)         not null,
   constraint pk_adm_strrole primary key (id)
);

comment on table adm_rollstr is
'Izvedene strukturne role po objektu
- org. jedinici, 
-lokaciji, 
-logickoj lokaciji, 
-dokumentu, 
-zaposlenom ... 

*Može se objekat uklucuivati ili iskljucivati pojedinacno ili hijerarhijski';

/*==============================================================*/
/* Table: adm_user                                              */
/*==============================================================*/
create table adm_user (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   username             varchar(250)         not null,
   password             varchar(100)         not null,
   firstname            varchar(255)         null,
   lastname             varchar(255)         null,
   sapuser              varchar(255)         null,
   aduser               varchar(255)         null,
   tip                  varchar(10)          null,
   admin                numeric(1)           not null default 0 
      constraint ckc_admin_adm_kor check (admin in (1,0)),
   mail                 varchar(250)         not null,
   usergrp              numeric(20)          not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_user check (valid in (1,0)),
   created_at           varchar(20)          not null,
   updated_at           varchar(20)          not null,
   constraint pk_adm_korisnik primary key (id),
   constraint ak_adm_korisnik unique (username)
);

comment on table adm_user is
'Osnovni podaci korisnika sistema';

/*==============================================================*/
/* Index: adm_user_ux1                                          */
/*==============================================================*/
create unique index adm_user_ux1 on adm_user (
username
);

/*==============================================================*/
/* Index: adm_user_ux2                                          */
/*==============================================================*/
create unique index adm_user_ux2 on adm_user (
mail
);

/*==============================================================*/
/* Table: adm_usergrp                                           */
/*==============================================================*/
create table adm_usergrp (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   code                 varchar(150)         not null,
   text                 varchar(500)         not null,
   valid                numeric(1)           not null default 1 
      constraint ckc_usergrp1 check (valid in (1,0)),
   constraint pk_adm_usergrp primary key (id)
);

/*==============================================================*/
/* Index: adm_usergrp_ux1                                       */
/*==============================================================*/
create unique index adm_usergrp_ux1 on adm_usergrp (
code
);

/*==============================================================*/
/* Table: adm_userlink                                          */
/*==============================================================*/
create table adm_userlink (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   user1                numeric(20)          not null,
   user2                varchar(150)         not null,
   begda                varchar(10)          not null,
   endda                varchar(10)          not null,
   "all"                numeric(1)           not null,
   constraint pk_adm_userlink primary key (id)
);

comment on table adm_userlink is
'Mapiranje sa korisnicima iz drugih sistema';

/*==============================================================*/
/* Table: adm_userlinkpremiss                                   */
/*==============================================================*/
create table adm_userlinkpremiss (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   userlink             numeric(20)          null,
   userpermiss          numeric(20)          null,
   constraint pk_adm_userlinkpremiss primary key (id)
);

/*==============================================================*/
/* Table: adm_userloc                                           */
/*==============================================================*/
create table adm_userloc (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   usr                  numeric(20)          not null,
   loc                  numeric(20)          not null,
   begda                varchar(10)          not null,
   endda                varchar(10)          not null,
   constraint pk_adm_userloc primary key (id)
);

/*==============================================================*/
/* Table: adm_userpermiss                                       */
/*==============================================================*/
create table adm_userpermiss (
   id                   numeric(20)          not null,
   site                 numeric(20)          null,
   usr                  numeric(20)          not null,
   roll                 numeric(20)          not null,
   constraint pk_adm_korisnikrola primary key (id),
   constraint ak_adm_korisnikrola unique (usr, roll)
);

comment on table adm_userpermiss is
'Dodeljene role korisniku.';

alter table adm_paruser
   add constraint fk_adm_paruser1 foreign key (usr)
      references adm_user (id)
      on delete restrict on update restrict;

alter table adm_rollact
   add constraint fk_rollact1 foreign key (roll)
      references adm_roll (id)
      on delete restrict on update restrict;

alter table adm_rollact
   add constraint fk_rollact2 foreign key (action)
      references adm_action (id)
      on delete restrict on update restrict;

alter table adm_rolllink
   add constraint fk_rolllink1 foreign key (roll1)
      references adm_roll (id)
      on delete restrict on update restrict;

alter table adm_rolllink
   add constraint fk_rolllink2 foreign key (roll2)
      references adm_roll (id)
      on delete restrict on update restrict;

alter table adm_rollstr
   add constraint fk_rolestr1 foreign key (roll)
      references adm_roll (id)
      on update restrict;

alter table adm_user
   add constraint fk_user1 foreign key (usergrp)
      references adm_usergrp (id)
      on delete restrict on update restrict;

alter table adm_userlink
   add constraint fk_userlink1 foreign key (user1)
      references adm_user (id)
      on update restrict;

alter table adm_userlinkpremiss
   add constraint fk_userlinkpremiss1 foreign key (userlink)
      references adm_userlink (id)
      on delete restrict on update restrict;

alter table adm_userlinkpremiss
   add constraint fk_userlinkpremiss2 foreign key (userpermiss)
      references adm_userpermiss (id)
      on delete restrict on update restrict;

alter table adm_userloc
   add constraint fk_adm_userloc1 foreign key (loc)
      references adm_user (id)
      on delete restrict on update restrict;

alter table adm_userpermiss
   add constraint fk_userrole1 foreign key (usr)
      references adm_user (id)
      on update restrict;

alter table adm_userpermiss
   add constraint fk_userrole2 foreign key (roll)
      references adm_roll (id)
      on update restrict;
 
-- Triger za kreiranje zapisa --
CREATE OR REPLACE FUNCTION set_created_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = to_char(now(), 'YYYYMMDDHH24MISS');
  NEW.updated_at = to_char(now(), 'YYYYMMDDHH24MISS');  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = to_char(now(), 'YYYYMMDDHH24MISS');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_created_at_trigger
  BEFORE INSERT ON adm_user
  FOR EACH ROW
  EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_updated_at_trigger
  BEFORE UPDATE ON adm_user
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
 
 -- Kreiranje podataka za JSON-a entiteta za ispitivanje tipa podataka --

SELECT
  '"'||table_name||'": { "attributes":'||
  json_object_agg(column_name, 
    CASE data_type
      WHEN 'numeric' THEN 'number'
      ELSE 'string'
    END
  )||'},' AS attributes
FROM
  (
select *
 FROM
  information_schema.columns
 WHERE
  table_schema LIKE 'iis'
 order by
  table_name, ordinal_position  
  ) a
WHERE
  table_schema LIKE 'iis'
  and table_name like 'adm_%'
GROUP BY
  table_name;