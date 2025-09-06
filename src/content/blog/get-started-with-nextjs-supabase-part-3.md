---
title: Get started with Next.js and Supabase - Part 3
pubDate: "2021-12-07"
lastmod: "2021-12-08"
tags: ["supabase", "next-js"]
draft: false
description: "Learn how to utilize row level security in a Next.js and Supabase app"
heroImage: "/images/blog/get-started-nextjs-supabase-3/cover-image.png"
---

This is the third blog post in a series of blog posts about getting started with Next.js and Supabase. It is recommended to read [the first](/blog/get-started-with-nextjs-supabase-part-1) and [second post](/blog/get-started-with-nextjs-supabase-part-2) before reading this post.

## What is Next.js?

Next.js is an open source React framework that makes statically and server-side rendered pages possible in your app. Where traditional React apps are rendered entirely in the browser, Next.js makes it possible to render pages server-side. This improves page speed and reduces bundle size significantly. You can read more about this powerful framework [here](https://nextjs.org).

## What is Supabase?

Supabase is an open source Firebase alternative. With a PostgreSQL database, various authentication options, object storage, and cloud functions (coming soon) it is the easiest "backend-as-a-service" to get started with when building a SaaS. You can read more about this popular platform [here](https://supabase.io/).

## What is row level security?

Row level security is a feature in PostgreSQL that allows row security policies on a per-user basis. This enables more control over what data can be queried and modified by each user. By default, PostgreSQL tables don't have any security policies configured and access privileges is determined by the SQL privilege system. By using row level security you can easily add an extra layer of data security in your database. Think of a row level security policy as an additional `WHERE` clause added to all your queries that first ensures the user trying to execute the query has access to the rows in question. Only if the user has access their query will be executed. You can read more about this powerful PostgreSQL feature in the official [PostgreSQL docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).

## How to enable and utilize row level security in Supabase

For this blog post, the same [demo project](https://github.com/Ngineer101/nextjs-supabase-crud) used in the previous two posts will be used.

To enable row level security for the `bikes` table in your database navigate to the SQL editor page of your Supabase project and run this query:

```sql
alter table bikes enable row level security;
```

Once row level security is enabled you can create the necessary policies to ensure that your data can only be accessed and updated by authorized users. We are going to add policies for the `bikes` table so that an authenticated user can only view and update their own bikes.

Before we can do that it is necessary to add an extra column, called `user_id`, to the `bikes` table. This is the ID of the user that created the bike. Only that user will be allowed to edit, read, or delete the bike.

Run this query to add the `user_id` column to the `bikes` table:

```sql
alter table bikes add column user_id uuid references auth.users null;
```

_Note: since the `bikes` table is an existing table, the `user_id` column needs to be either nullable or have a default value. For this demo we make it nullable, but ideally it should always default to the current user ID._

To create the row level security policies for the `bikes` table run the following SQL script:

```sql
create policy "Bikes can only viewed by owner"
  on bikes for select
  using ( user_id = auth.uid() );

create policy "Owner can create their own bikes"
  on bikes for insert
  with check ( auth.uid() = user_id );

create policy "Owner can update their own bikes"
  on bikes for update
  using ( auth.uid() = user_id );
```

The above script creates 3 RLS policies:

- Bikes can only be viewed/queried by the user that created it
- A user can only create their own bikes
- Bikes can only be updated by the user that created it

Now, if you run the app and sign in, you won't see any bikes (because there are no bikes for your user ID yet).

Update the `new.js` page to save the `user_id` of the current user when creating a new bike:

```js
await supabase.from("bikes").insert({
  make: bikeMake,
  model: bikeModel,
  production_year: bikeYear,
  user_id: session.user.id, // add this line
});
```

When fetching the bikes for a user in the `index.js` page it is necessary to set the auth token before the request is made:

```js
// Query all bikes
supabase.auth.setAuth(context.req.cookies["sb:token"]); // add this line
const { data: bikes, error } = await supabase.from("bikes").select();
```

Then, create a bike by clicking on the "Create bike" button and completing the form. Now you will see the one bike you created on the home page. To test whether row level security works, create another account with a different email address. When you sign in with the second email, you won't be able to see the bike you just created with the previous account.

Since an RLS policy is basically another `WHERE` clause applied to each SQL query it is an extremely powerful feature to enforce security in your Supabase (PostgreSQL) database. You can modify the policies to take into account any value in your database.

**Note - be mindful of what data you query in your RLS policy. If you don't have the right indexes or make expensive queries in the RLS policy, your overall database query performance will decline because the policy is executed before each database query.**

---

To view the code of the entire demo app check out [this repository](https://github.com/Ngineer101/nextjs-supabase-crud). If you want to learn more about Supabase you can check out the official [Supabase docs](https://supabase.io/docs).
