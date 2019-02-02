# TheDailyGrindClub

## Prerequisites

  * Docker
  * docker-compose
  * Ansible

## Development

To start your Phoenix server:

  * Start Phoenix endpoint with `docker-compose up`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

  * Optional: Pull data from production
    * Run `pg_dump -Ft the_daily_grind_club_prod > migrate.tar` on old server
    * Scp `migrate.tar` on old server to `./backups/migrate.tar`
    * Run `docker-compose up -d db`
    * Run `docker-compose exec db pg_restore -Ft -c -U postgres -d the_daily_grind_club_dev backups/migrate.tar`
    * Run `docker-compose down`

## Deployment

  * Create `./server/inventory`
  * Create `./Caddyfile`
  * Run `cd server && ansible-galaxy install -r requirements.yml && ansible-playbook main.yml; cd -`
  * Optional: Migrate data
    * Run `pg_dump -Ft the_daily_grind_club_prod > migrate.tar` on old server
    * Scp `migrate.tar` on old server to `./backups/migrate.tar`
    * Run `cd server && ansible-playbook migrate-data.yml; cd -`
  * Run `ssh -A deploy@[ip] "cd ~/apps/the_daily_grind_club && docker-compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.prod.caddy.yml up -d"`

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
