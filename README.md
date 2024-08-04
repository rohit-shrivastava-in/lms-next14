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


replace keys in .env
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=###########################################
CLERK_SECRET_KEY=###########################################

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/


DATABASE_URL="mongodb+srv://[username]:[password]@lms-next14.ysullnx.mongodb.net/lms-next14-app?retryWrites=true&w=majority&appName=lms-next14"

UPLOADTHING_SECRET=###########################################
UPLOADTHING_APP_ID=###########################################

MUX_TOKEN_ID=###########################################
MUX_TOKEN_SECRET=###########################################

STRIPE_API_KEY=###########################################
STRIPE_WEBHOOK_SECRET=###########################################
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Demo [https://lms-next14-rohit-shrivastava.vercel.app/](deployed on vercel)

