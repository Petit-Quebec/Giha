![2 - Copy](https://user-images.githubusercontent.com/25495643/113677862-e2c60b00-9672-11eb-9a50-a2332a10a72c.png)

# Giha

This is the source code for the Giha discord bot

## uses

- discordjs
- mongodb
- jest

- eslint
- prettier

## Getting started

```
npm install
```

copy `.env.example` and remove .example. Replace Sample passwords and tokens with valid ones. Reach out to the devs for valid tokens.

Run with

```
npm run dev
```

## Commands

The commands are located in the `/cmds/` directory. Commands are prefixed with `!`

To get started you have to create a character

```
!rise Dilbert
```

## Development

### To add a new command:

1. create a new file in the cmds directory and add `permissions` and `help` objects as well as a `run` function.
2. Add your command to `/cmds/index.js`
3. Add a test file for your command in `/cmds/__test__`. The test file should have the same name as the command file followed by `.spec.js`. We use [Jest](https://jestjs.io/docs/en/getting-started) for testing

### Before submitting a pull request:

1. make sure your command is fully tested and all tests pass. Run tests with

```
npm run test
```

2. Run the linters and resolve any errors

```
npm run lint-fix
```
