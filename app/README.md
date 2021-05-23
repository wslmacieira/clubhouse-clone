# ClubHouse Clone Template - Semana JS Expert 4.0

Seja bem vindo(a) à quarta Semana Javascript Expert.Este é o código inicial para iniciar nossa jornada.

Marque esse projeto com uma estrela 🌟

## Preview

### Página de Login

<img src="./assets/printscreen/clubhouse-login.PNG" width="300" alt="Login" />

### Página de Salas

<img src="./assets/printscreen/clubhouse-home.PNG" width="300" alt="Home" />

### Página de Sala

<img src="./assets/printscreen/clubhouse-room.PNG" width="300" alt="Room" />

## Checklist Features

- [ ] O app deve funcionar na Web, Android e IOS
- Login
  - [X] Deve ter login com GitHub
    - [X] Se houver dados do usuario em localStorage deve ir para lobby direto

- Lobby
  - [X] Se não houver dados do usuario em localStorage deve voltar para login
  - [X] Mostra todas as salas ativas
  - [X] Atualiza salas em realtime
  - [X] Pode criar uma sala sem topico
  - [X] Pode criar uma sala com topico
  - [X] Pode acessar salas ativas
- Room
  - [ ] Se não houver dados do usuario em localStorage deve voltar para login
  - [X] Cria uma sala com um usuário dono
  - [X] Todos usuários futuros entram com perfil de attendees
  - [X] Notifica Lobby sobre atualizações na sala
  - [X] Lista usuarios com perfis de speakers e attendees
  - [X] Se o dono da sala desconectar, será removida
  - Users
    - Speaker
      - [X] Recebe notificação de attendees para se tornarem speakers
      - [X] Atualizam a tela o upgrade de attendee para speaker
      - [X] Poderá deixar seu microfone mudo
      - Se dono da sala
        - [X] Pode aprovar attendees a virarem speakers
        - Ao se desconectar
          - [X] Promove o speaker mais velho da sala
          - [X] Se não houver speaker promove o attendee mais velho da sala
    - Attendee
      - [X] Pode ouvir speakers ativos
      - [X] Pode pedir upgrade de perfil ao dono da sala
        - Ao ser aprovado
          - [X] Reinicia todas as suas chamas ativas com os usuarios da sala
          - [X] Recebe as permissões do perfil speaker
