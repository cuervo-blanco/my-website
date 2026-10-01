create extension if not exists pgcrypto;

create table if not exists licenses (
    id uuid primary key default gen_random_uuid(),
    license_code text not null unique,
    product_id text not null,
    customer_email text not null,
    customer_name text not null,
    status text not null default 'active' check (status in ('active', 'revoked', 'disabled')),
    max_activations integer not null default 1,
    lease_duration_days integer not null default 14,
    expires_at timestamptz,
    bound_machine_id text,
    features jsonb not null default '[]'::jsonb,
    notes text not null default '',
    metadata jsonb not null default '{}'::jsonb,
    revoked_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists activations (
    id uuid primary key default gen_random_uuid(),
    license_id uuid not null references licenses(id) on delete cascade,
    machine_id text not null,
    machine_label text not null default '',
    app_version text not null default '',
    status text not null default 'active' check (status in ('active', 'released', 'revoked')),
    lease_expires_at timestamptz not null,
    metadata jsonb not null default '{}'::jsonb,
    revoked_at timestamptz,
    first_seen_at timestamptz not null default now(),
    last_seen_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (license_id, machine_id)
);

create index if not exists licenses_product_id_idx on licenses (product_id);
create index if not exists licenses_status_idx on licenses (status);
create index if not exists activations_license_id_idx on activations (license_id);
create index if not exists activations_machine_id_idx on activations (machine_id);
create index if not exists activations_status_idx on activations (status);

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists licenses_touch_updated_at on licenses;
create trigger licenses_touch_updated_at
before update on licenses
for each row
execute function touch_updated_at();

drop trigger if exists activations_touch_updated_at on activations;
create trigger activations_touch_updated_at
before update on activations
for each row
execute function touch_updated_at();
