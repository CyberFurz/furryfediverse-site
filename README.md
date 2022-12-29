# Welcome to [FurryFediverse](https://furryfediverse.org)

This is the official repository of the site that is used to help promote the FurryFediverse.
Please feel free to fork, and add your instance or help me clean up the site.
It is tied into Cloudflare Pages so it will automatically build once you contribution is merged.

# Contribution

If you want to quickly start to contribute you can start the project with the
following set of commands:

```
npm install
DATABASE_URL=file://`pwd`/db.sqlite3 npx prisma migrate dev
DATABASE_URL=file://`pwd`/db.sqlite3 npm run dev
```

And then just go on http://localhost:3000 with your webbrowser.

## Env file

It's possible to use an `.env` file instead for setup all the env vars.

```
DATABASE_URL=file:/${PWD}/db.sqlite3 # This is an example please check prisma documentation for what you need https://www.prisma.io/docs/reference/database-reference/connection-urls
# ACCESS_TOKEN = # Add here your mastodon token for being able to receive send verification toots
```