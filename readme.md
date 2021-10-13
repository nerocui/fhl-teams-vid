# FHL project

## Local setup

1. add `localhost fhl.local` to your hosts file
2. add `HTTPS true` to your environment variables
3. modified the code, change `src/index.js` initialization function to use local url https://fhl.local:3000
4. `yarn build`
5. `yarn package-dev`
6. `yarn dev`
7. upload `package-dev.zip` to teams
8. start using it in meeting

## Deployment (admin only)

1. `yarn build`
2. `yarn deploy`
3. `yarn package`
4. upload `package.zip` to teams
5. start using it in meeting