# TheDailyGrindClub

## Prerequisites

  * Docker
  * docker-compose
  * Ansible

## Development

To start your Phoenix server:

  * Start Phoenix endpoint with `docker-compose up`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Deployment

  * Create `./server/inventory`
  * Create `./Caddyfile`
  * Run `cd server && ansible-galaxy install -r requirements.yml && ansible-playbook main.yml; cd -`
  * Run `ssh -A deploy@[ip] "cd ~/apps/the_daily_grind_club && docker-compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.prod.caddy.yml up -d"`

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
