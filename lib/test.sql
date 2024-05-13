CREATE TABLE public.calendars (
	id VARCHAR(36) PRIMARY KEY not null, --a81bc81b-dead-4e5d-abff-90865d1e13b1
  	created_at TIMESTAMPTZ not null default NOW(),
  	owner VARCHAR(30) not null, --john
  	start_date DATE not null, --1999-01-20
  	end_date DATE not null, --1999-01-20
  	CONSTRAINT check_dates CHECK (start_date <= end_date)
);

insert into public.calendars(id, owner, start_date, end_date) values('9999', 'sally', '1999-01-20', '1999-01-20');

CREATE TABLE public.participants (
    id VARCHAR(36) PRIMARY KEY not null, --a81bc81b-dead-4e5d-abff-90865d1e13b1
    created_at TIMESTAMPTZ not null default NOW(),
    calendar_id VARCHAR(36) not null, --a81bc81b-dead-4e5d-abff-90865d1e13b1
    name VARCHAR(30) not null, --john
    is_owner BOOLEAN not null default FALSE,
    FOREIGN KEY (calendar_id) REFERENCES public.calendars(id)
);
