# Invoice App
Welcome to project Invoice! An invoice full-stack application that allows users register/login, add invoices based on billing information, view and sort through invoices, and edit, delete, and mark invoices as paid or pending. The application contains light and dark mode options, a mobile first responsive design, and user account details that can be updated at any time.

## Application Structure

The application consists of a frontend and backend, both of which are created through Next.js, meanwhile the database is created through using Postgres configured through Vercel. The application makes use of API routes to hit various data fetching endpoints to make CRUD operations from the frontend, backend, and database.

## Previews

**Dashboard Page / Dark Mode / View Invoices:**<br><br>
![Dashboard dark mode](public/dashboard_dark.png)

**Dashboard Page / Light Mode / View Invoices:**<br><br>
![Dashboard light mode](public/dashboard_light.png)

**Dashboard Page / Mobile Version**<br><br>
![Dashboard mobile version](public/mobile_version.png)

**Dashboard Page / Select Invoice Type [All, Paid, or Pending]**<br><br>
![Invoice type selector](public/invoice_type_select.png)

**Individual Invoice Page**<br><br>
![Invoice page](public/view_invoice_details.png)

**Individual Invoice Page / Items Display**<br><br>
![Invoice items display](public/items_display.png)

**Edit invoices:**<br><br>
![Edit invoices](public/edit_invoice_panel.png)

**Delete invoices:**<br><br>
![Delete invoices](public/delete_invoice.png)

**Account Page:**<br><br>
![Account page](public/account_page.png)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## View Application

Link: 

## Technologies Utilized
- HTML
- Tailwind CSS
- Typescript
- Next.js
- Vercel / PostgreSQL
- shadcn-UI [UI components]
- React Icons

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
