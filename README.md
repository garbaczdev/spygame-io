#  SpyGame.io

**The game is available under [spygame.garbacz.dev](https://spygame.garbacz.dev/)**

**SpyGame.io** is a web-based social party game where players are secretly assigned roles. Most players get a specific location and role, while a few are spies who must figure out the location and avoid detection during discussion. At the end of the round, players vote — if a spy is ejected, the non-spies win; otherwise, the spies prevail.

##  Gameplay Summary

- Players join a game room and are assigned secret roles.
- All players except the spies know the shared location.
- Spies do not know the location and must deduce it from conversation.
- After a discussion phase, all players vote on who they think the spy is.
- The game ends with a win for the spies or non-spies based on the voting outcome.

### Development Setup

To start the game locally using Docker:

```bash
docker-compose up --build
```
This setup includes:
- NodeJS Backend API
- React frontend
- NGINX reverse proxy


### Production Setup

To start the in a production environment, run:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

This setup includes:
- NodeJS Backend API
- React frontend
- NGINX reverse proxy
- SSL proxy

The SSL proxy automatically obtains the certificate for the domain specified in docker-compose,
if the DNS system points to the production server.
